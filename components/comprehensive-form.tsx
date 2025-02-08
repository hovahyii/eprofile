// components/comprehensive-form.tsx

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Child sections
import ProfileSection from "./sections/ProfileSection";
import AboutMeSection from "./sections/AboutMeSection";
import ProjectsSection from "./sections/ProjectsSection";
import SocialLinksSection from "./sections/SocialLinksSection";

interface Project {
  id: string;
  title: string;
  description: string;
  status: "on-going" | "completed" | "on-hold";
  // Because your DB shows categories is text, we'll store it as ONE string
  categories?: string;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface AppFormData {
  profile: {
    name: string;
    title: string;
    location: string;
    image_url: string;
    email: string;
    phone: string;
    website: string;
  };
  aboutMe: string;
  jobScope: {
    title: string;
    description: string;
  };
  projects: Project[];
  social: SocialLink[];
}

interface ComprehensiveFormProps {
  initialData: AppFormData;
  onSave: (data: AppFormData) => void;
}

export function ComprehensiveForm({
  initialData,
  onSave,
}: ComprehensiveFormProps) {
  const [formData, setFormData] = useState<AppFormData>(initialData);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);
  const router = useRouter();

  // Load profileId from localStorage
  useEffect(() => {
    const storedProfileId = localStorage.getItem("profileId");
    if (storedProfileId) {
      setProfileId(storedProfileId);
      fetchProfileData(storedProfileId);
    } else {
      router.push("/login");
    }
  }, [router]);

  // Fetch existing data from Supabase
  async function fetchProfileData(id: string) {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select(
          `
          name,
          title,
          location,
          image_url,
          email,
          phone,
          website,
          about_me(content),
          job_scope(title, description),
          projects(id, title, description, status, categories),
          social_links(id, platform, url)
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      const updatedData: AppFormData = {
        profile: {
          name: profile?.name || "",
          title: profile?.title || "",
          location: profile?.location || "",
          image_url: profile?.image_url || "",
          email: profile?.email || "",
          phone: profile?.phone || "",
          website: profile?.website || "",
        },
        aboutMe: profile?.about_me?.content || "",
        jobScope: {
          title: profile?.job_scope?.title || "",
          description: profile?.job_scope?.description || "",
        },
        projects: profile?.projects || [],
        social: profile?.social_links || [],
      };
      setFormData(updatedData);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  }

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      await saveProfileData(profileId, formData);
      onSave(formData); // Parent's onSave will show one alert and do the redirect.
    } catch (error) {
      // error already alerted above
    } finally {
      setIsLoading(false);
    }
  };

// Upsert logic
 // Inside components/comprehensive-form.tsx

 async function saveProfileData(id: string | null, data: AppFormData) {
  try {
    if (!id) {
      throw new Error("Profile ID is missing.");
    }

    // 1) Upsert the main profile
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(
        {
          id,
          name: data.profile.name.trim(),
          title: data.profile.title,
          location: data.profile.location,
          image_url: data.profile.image_url,
          email: data.profile.email,
          phone: data.profile.phone,
          website: data.profile.website,
        },
        { onConflict: ["id"] }
      );
    if (profileError) {
      throw new Error("Error updating profile data: " + profileError.message);
    }

    // 2) Upsert About Me (with conflict resolution)
    const { error: aboutMeError } = await supabase
      .from("about_me")
      .upsert(
        {
          profile_id: id,
          content: data.aboutMe,
        },
        { onConflict: "profile_id" }
      );
    if (aboutMeError) {
      throw new Error("Error saving About Me: " + aboutMeError.message);
    }

    // 3) Upsert Job Scope (with conflict resolution)
    const { error: jobScopeError } = await supabase
      .from("job_scope")
      .upsert(
        {
          profile_id: id,
          title: data.jobScope.title,
          description: data.jobScope.description,
        },
        { onConflict: "profile_id" }
      );
    if (jobScopeError) {
      throw new Error("Error saving Job Scope: " + jobScopeError.message);
    }

    // 4) Upsert each project (with categories as an array)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    for (const project of data.projects) {
      const projectId =
        project.id && uuidRegex.test(project.id)
          ? project.id
          : crypto.randomUUID();

      let categoriesArray: string[] = [];
      if (typeof project.categories === "string") {
        categoriesArray = project.categories
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== "");
      } else if (Array.isArray(project.categories)) {
        categoriesArray = project.categories;
      }

      const { error: projectError } = await supabase
        .from("projects")
        .upsert({
          id: projectId,
          profile_id: id,
          title: project.title,
          description: project.description,
          status: project.status,
          categories: categoriesArray,
        });
      if (projectError) {
        throw new Error("Error saving project: " + projectError.message);
      }
    }

    // 5) Delete projects that exist in the database but are not in the local state.
    // Get an array of local project IDs (only those that exist, as strings).
    const localProjectIds = data.projects
      .map((p) => p.id)
      .filter((id): id is string => Boolean(id));
    if (localProjectIds.length > 0) {
      // To be safe, quote the IDs so they match UUID format in SQL.
      const quotedProjectIds = localProjectIds.map((id) => `"${id}"`).join(",");
      const { error: deleteProjectError } = await supabase
        .from("projects")
        .delete()
        .match({ profile_id: id })
        .not("id", "in", `(${quotedProjectIds})`);
      if (deleteProjectError) {
        throw new Error(
          "Error deleting removed projects: " + deleteProjectError.message
        );
      }
    } else {
      // If no projects remain in the local state, delete all projects for this profile.
      const { error: deleteAllProjectsError } = await supabase
        .from("projects")
        .delete()
        .match({ profile_id: id });
      if (deleteAllProjectsError) {
        throw new Error(
          "Error deleting all projects: " + deleteAllProjectsError.message
        );
      }
    }

    // 6) Upsert each social link (ensuring valid UUIDs)
    for (const link of data.social) {
      // If the URL is empty, skip this link (or you can choose to alert the user)
      if (!link.url || !link.url.trim()) {
        continue;
      }
      
      const linkId =
        link.id && uuidRegex.test(link.id)
          ? link.id
          : crypto.randomUUID();
    
      const { error: socialError } = await supabase
        .from("social_links")
        .upsert({
          id: linkId,
          profile_id: id,
          platform: link.platform,
          url: link.url,
        });
      if (socialError) {
        throw new Error("Error saving social link: " + socialError.message);
      }
    }

    // 7) Delete social links that exist in the database but are not in the local state.
    const localSocialIds = data.social
      .map((link) => link.id)
      .filter((id): id is string => Boolean(id));
    if (localSocialIds.length > 0) {
      const quotedSocialIds = localSocialIds.map((id) => `"${id}"`).join(",");
      const { error: deleteSocialError } = await supabase
        .from("social_links")
        .delete()
        .match({ profile_id: id })
        .not("id", "in", `(${quotedSocialIds})`);
      if (deleteSocialError) {
        throw new Error(
          "Error deleting removed social links: " + deleteSocialError.message
        );
      }
    } else {
      // If no social links remain in the local state, delete all social links for this profile.
      const { error: deleteAllSocialError } = await supabase
        .from("social_links")
        .delete()
        .match({ profile_id: id });
      if (deleteAllSocialError) {
        throw new Error(
          "Error deleting all social links: " + deleteAllSocialError.message
        );
      }
    }
  } catch (err: any) {
    console.error("Error saving profile data:", err);
    alert("Failed to save data. Please try again.");
    throw err;
  }
}

// Update the handler to go to the builder:
const handleBuilderButton = () => {
  localStorage.setItem("formData", JSON.stringify(formData));
  // Also save an empty components array so the builder page does not redirect:
  localStorage.setItem("components", JSON.stringify([]));
  router.push("/user/builder");
};

  
  if (!profileId) {
    return <p>Loading...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-4"> 
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Edit Your Profile Information</h1>
        <Button type="button" variant="outline" onClick={handleBuilderButton}>
          Go to Builder
        </Button>
      </div>

      <ProfileSection formData={formData} setFormData={setFormData} />
      <AboutMeSection formData={formData} setFormData={setFormData} />
      <ProjectsSection formData={formData} setFormData={setFormData} />
      <SocialLinksSection formData={formData} setFormData={setFormData} />

      <Button
        type="submit"
        className="w-full mt-6 bg-blue-600 text-white py-3 text-lg hover:bg-blue-700"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save All Information"}
      </Button>
    </form>
  );
}
