// pages/user/edit-profile.page.tsx

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // Assuming you are still using Supabase as a backend
import { ComprehensiveForm } from "@/components/comprehensive-form"; // Ensure correct import path
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Check if profileId is in localStorage
        const profileId = localStorage.getItem("profileId");
        if (!profileId) {
          alert("You must be logged in to edit your profile.");
          router.push("/login");
          return;
        }

        // Query the profiles table using the profileId stored in localStorage
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", profileId)
          .single();

        if (error || !profile) {
          alert("Profile not found. Redirecting to login...");
          router.push("/login");
          return;
        }

        // If profile found, populate form data
        setFormData({
          profile: {
            name: profile.name || "",
            title: profile.title || "",
            location: profile.location || "",
            image_url: profile.image_url || "",
            email: profile.email || "",
            phone: profile.phone || "",
            website: profile.website || "",
          },
          aboutMe: "",
          jobScope: {
            title: "",
            description: "",
          },
          projects: [],
          social: [],
        });
      } catch (error) {
        console.error("Error fetching profile:", error.message);
        alert("Error fetching profile. Please try again.");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleSave = async (updatedFormData) => {
    try {
      // Check if profileId is in localStorage
      const profileId = localStorage.getItem("profileId");
      if (!profileId) {
        alert("Unable to save profile. Please log in again.");
        router.push("/login");
        return;
      }

      // Update the profile in the database
      const { error } = await supabase
        .from("profiles")
        .update({
          ...updatedFormData.profile,
        })
        .eq("id", profileId);  // Use profileId from localStorage

      if (error) throw error;

      alert("Profile updated successfully!");
      router.push("/user/profile");
    } catch (error) {
      console.error("Error saving profile:", error.message);
      alert("Failed to save profile. Please try again.");
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {formData && <ComprehensiveForm initialData={formData} onSave={handleSave} onViewProfile={() => router.push("/user/profile")} />}
    </div>
  );
}
