"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { UserCircle, Info, Briefcase, FolderKanban, Share2, X } from "lucide-react";
import { ComprehensiveForm } from "./comprehensive-form";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

// Draggable item component for the drag-and-drop area
function DraggableItem({
  id,
  label,
  content,
  onRemove,
}: {
  id: string;
  label: string;
  content: React.ReactNode;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative border rounded-lg p-4 bg-white shadow cursor-move w-full"
    >
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
      >
        <X className="w-5 h-5" />
      </button>
      <h3 className="text-lg font-bold mb-2">{label}</h3>
      <div>{content}</div>
    </div>
  );
}

export default function Builder() {
  const [components, setComponents] = useState<any[]>([]);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    profile: {
      name: "",
      title: "",
      location: "",
      image_url: "",
      email: "",
      phone: "",
      website: "",
    },
    aboutMe: "",
    jobScope: {
      title: "",
      description: "",
    },
    projects: [],
    social: [],
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditing = searchParams.get("edit") === "true";

  // Fetch data from Supabase if we have a profile ID
  const fetchData = async () => {
    if (!profileId) return; // If no profileId yet, skip

    const { data: profileData, error } = await supabase
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
        projects(title, description, status, categories),
        social_links(platform, url)
      `
      )
      .eq("id", profileId)
      .single();

    if (error) {
      console.error("Error fetching data from Supabase:", error);
      return;
    }

    // Merge into local state
    setFormData({
      profile: {
        name: profileData?.name || "",
        title: profileData?.title || "",
        location: profileData?.location || "",
        image_url: profileData?.image_url || "",
        email: profileData?.email || "",
        phone: profileData?.phone || "",
        website: profileData?.website || "",
      },
      aboutMe: profileData?.about_me?.content || "",
      jobScope: {
        title: profileData?.job_scope?.title || "",
        description: profileData?.job_scope?.description || "",
      },
      projects: profileData?.projects || [],
      social: profileData?.social_links || [],
    });
  };

  // Load from localStorage or DB on mount
  useEffect(() => {
    const storedProfileId = localStorage.getItem("profileId");
    if (storedProfileId) {
      setProfileId(storedProfileId);
    }
  }, []);

  // Whenever profileId changes, fetch data
  useEffect(() => {
    fetchData();
  }, [profileId]);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    })
  );

  // Reorder components in the drop area
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setComponents((prev) => {
        const oldIndex = prev.findIndex((comp) => comp.id === active.id);
        const newIndex = prev.findIndex((comp) => comp.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  // Add a new component to the drop area (profile, about, etc.)
  const addComponent = (type: string) => {
    const id = `${type}-${crypto.randomUUID()}`; // using crypto.randomUUID() for unique keys
    let content: React.ReactNode;
    switch (type) {
      case "Profile":
        content = (
          <div className="flex items-center gap-4">
            <Image
              src={formData.profile?.image_url || "/placeholder.png"}
              alt="Profile"
              height={64}
              width={64}
              className="rounded-full"
            />
            <div>
              <h4 className="text-xl font-semibold">
                {formData.profile?.name || "John Doe"}
              </h4>
              <p className="text-gray-600">
                {formData.profile?.location || "Location not set"}
              </p>
            </div>
          </div>
        );
        break;
      case "About Me":
        content = (
          <p className="text-gray-800">
            {formData.aboutMe || "No About Me content provided."}
          </p>
        );
        break;
      case "Job Scope":
        content = (
          <ul className="list-disc pl-5">
            <li>Job Title: {formData.jobScope?.title || "N/A"}</li>
            <li>Responsibilities: {formData.jobScope?.description || "N/A"}</li>
          </ul>
        );
        break;
      case "Projects":
        content = (
          <div>
            {formData.projects.map((project: any) => (
              <div key={project.id} className="mb-4 border-b pb-2">
                <h4 className="text-lg font-semibold flex items-center justify-between">
                  {project.title || "Untitled Project"}
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      project.status === "on-going"
                        ? "bg-green-100 text-green-600"
                        : project.status === "completed"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {project.status}
                  </span>
                </h4>
                <p className="text-gray-600">
                  {project.description || "No description"}
                </p>
                <p className="text-xs text-gray-500 italic">
                  Categories: {project.categories || "None"}
                </p>
              </div>
            ))}
          </div>
        );
        break;
      case "Social Links":
        content = (
          <div className="flex flex-col gap-2">
            {formData.social.map((link: any) => (
              <div key={link.id}>
                <strong>{link.platform}: </strong>
                <a href={link.url} className="text-blue-500" target="_blank">
                  {link.url}
                </a>
              </div>
            ))}
          </div>
        );
        break;
      default:
        content = <p>{type} content here</p>;
    }
    const newComponent = { id, label: type, content };
    setComponents((prev) => [...prev, newComponent]);
  };

  // Remove a component from the drop area
  const removeComponent = (id: string) => {
    setComponents((prev) => prev.filter((comp) => comp.id !== id));
  };

  // If no profile ID yet, create a new row in `profiles`
  const createProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .insert({})
      .select("id")
      .single();
    if (error) {
      console.error("Error creating profile:", error);
      alert("Failed to create a new profile.");
      return;
    }
    localStorage.setItem("profileId", data.id);
    setProfileId(data.id);
  };

  // Called when ComprehensiveForm finishes saving
  const handleSave = async (updatedData: any) => {
    if (!profileId) {
      await createProfile();
    }
    setFormData(updatedData);
    await fetchData();
    // Remove the edit query parameter to return to builder view
    router.push("/user/builder");
  };

  // If in edit mode, render the comprehensive form
  if (isEditing) {
    return (
      <ComprehensiveForm
        initialData={formData}
        onSave={(data) => {
          handleSave(data);
        }}
      />
    );
  }

  // Otherwise, render the builder view
  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between bg-white p-4 shadow">
        <h1 className="text-3xl font-bold">E-Card Builder</h1>
        <div className="flex space-x-2">
          {/* Update Edit Information button to push the edit query param */}
          <Button variant="outline" onClick={() => router.push("/user/builder?edit=true")}>
            Edit Information
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              localStorage.setItem("formData", JSON.stringify(formData));
              localStorage.setItem("components", JSON.stringify(components));
              router.push("/user/preview");
            }}
          >
            Preview
          </Button>
        </div>
      </div>
      <div className="flex flex-1">
        {/* Sidebar with "Add" buttons */}
        <div className="w-64 border-r bg-white p-4">
          <Button
            variant="outline"
            className="w-full mb-4"
            onClick={() => addComponent("Profile")}
          >
            <UserCircle className="mr-2 h-4 w-4" />
            Add Profile
          </Button>
          <Button
            variant="outline"
            className="w-full mb-4"
            onClick={() => addComponent("About Me")}
          >
            <Info className="mr-2 h-4 w-4" />
            Add About Me
          </Button>
          <Button
            variant="outline"
            className="w-full mb-4"
            onClick={() => addComponent("Job Scope")}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Add Job Scope
          </Button>
          <Button
            variant="outline"
            className="w-full mb-4"
            onClick={() => addComponent("Projects")}
          >
            <FolderKanban className="mr-2 h-4 w-4" />
            Add Projects
          </Button>
          <Button
            variant="outline"
            className="w-full mb-4"
            onClick={() => addComponent("Social Links")}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Add Social Links
          </Button>
        </div>
        {/* Drop area */}
        <div className="flex-1 bg-gray-100 p-4 overflow-auto">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={components.map((c) => c.id)} strategy={verticalListSortingStrategy}>
              <div className="bg-white rounded border-2 border-dashed space-y-4 p-4 min-h-[80vh]">
                {components.map((component) => (
                  <DraggableItem
                    key={component.id}
                    id={component.id}
                    label={component.label}
                    content={component.content}
                    onRemove={() => removeComponent(component.id)}
                  />
                ))}
                {components.length === 0 && (
                  <p className="text-gray-500 text-center pt-8">
                    Drag and drop components here!
                  </p>
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
