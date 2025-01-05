// app/components/builder.tsx

"use client";

import { useState } from "react";
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
import { useRouter } from "next/navigation";

interface DraggableItemProps {
  id: string;
  label: string;
  content: React.ReactNode;
  onRemove: () => void; // Function to remove the component
}

function DraggableItem({ id, label, content, onRemove }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

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
      id={id}
    >
      {/* Remove Button */}
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
  const [formData, setFormData] = useState({
    profile: {
      name: "",
      title: "",
      location: "",
      imageUrl: "",
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
    const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  // Sensors for drag-and-drop functionality
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  // Handle drag-and-drop logic
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setComponents((prevComponents) => {
        const oldIndex = prevComponents.findIndex((comp) => comp.id === active.id);
        const newIndex = prevComponents.findIndex((comp) => comp.id === over.id);
        return arrayMove(prevComponents, oldIndex, newIndex);
      });
    }
  };

  // Add a new component to the canvas
  const addComponent = (type: string) => {
    const id = `${type}-${new Date().getTime()}`;
    let content;

    if (formData) {
        switch (type) {
          case "Profile":
            content = (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                <div>
                  <h4 className="text-xl font-semibold">{formData.profile?.name || "John Doe"}</h4>
                  <p className="text-gray-600">{formData.profile?.location || "Location"}</p>
                </div>
              </div>
            );
            break;
          case "About Me":
            content = <p className="text-gray-800">{formData.aboutMe || "A brief description about the user."}</p>;
            break;
          case "Job Scope":
            content = (
              <ul className="list-disc pl-5">
                <li>Job Title: {formData.jobScope?.title || "Job Title"}</li>
                <li>Responsibilities: {formData.jobScope?.description || "Responsibilities"}</li>
              </ul>
            );
            break;
          case "Projects":
            content = (
              <div>
                {formData.projects?.map(
                  (
                    project: { title: string; description: string; status: "on-going" | "completed" | "on-hold" },
                    index: number
                  ) => (
                    <div key={index} className="mb-4 border-b pb-2">
                      <h4 className="text-lg font-semibold flex items-center justify-between">
                        {project.title || "Project Title"}
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${
                            project.status === "on-going"
                              ? "bg-green-100 text-green-600"
                              : project.status === "on-hold"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {project.status === "on-going"
                            ? "On-going"
                            : project.status === "on-hold"
                            ? "On Hold"
                            : "Completed"}
                        </span>
                      </h4>
                      <p className="text-gray-600">{project.description || "Project Description"}</p>
                    </div>
                  )
                )}
              </div>
            );
            break;
          case "Social Links":
            content = (
              <div className="flex gap-4">
                {formData.social?.map(
                  (link: { platform: string; url: string }, index: number) => (
                    <a key={index} href={link.url || "#"} className="text-blue-500">
                      {link.platform || "Platform"}
                    </a>
                  )
                )}
              </div>
            );
            break;
          default:
            content = <p>{type} content here</p>;
        }
        

      const newComponent = {
        id,
        label: type,
        content,
      };
      setComponents((prev) => [...prev, newComponent]);
    }
  };

  // Remove a component from the canvas
  const removeComponent = (id: string) => {
    setComponents((prevComponents) => prevComponents.filter((comp) => comp.id !== id));
  };

  if (!formData || !formData.profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No profile data available. Please add some information.</p>
      </div>
    );
  }

  // Handle edit mode for comprehensive form
  if (isEditing) {
    return (
      <ComprehensiveForm
        initialData={formData}
        onSave={(data) => {
          setFormData(data);
          setIsEditing(false);
        }}
        onViewProfile={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 shadow">
        <h1 className="text-3xl font-bold">E-Card Builder</h1>
        <div className="flex space-x-2">
        <Button
          variant="outline"
          className="w-full mb-8"
          onClick={() => {
            console.log("formData:", formData);
            console.log("components:", components);

            const query = new URLSearchParams({
              formData: JSON.stringify(formData || {}),
              components: JSON.stringify(components || []),
            }).toString();

            router.push(`/preview?${query}`);
          }}
        >
          Preview
        </Button>

          <Button variant="outline">Save</Button>
          <Button variant="outline">Publish</Button>
        </div>
      </div>

      {/* Sidebar and Canvas */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 border-r bg-white p-4">
          <Button
            variant="outline"
            className="w-full mb-8"
            onClick={() => setIsEditing(true)}
          >
            Edit Information
          </Button>
          <Button
            variant="outline"
            className="w-full mb-4"
            onClick={() => addComponent("Profile")}
          >
            <UserCircle className="mr-2 h-4 w-4" /> Add Profile
          </Button>
          <Button
            variant="outline"
            className="w-full mb-4"
            onClick={() => addComponent("About Me")}
          >
            <Info className="mr-2 h-4 w-4" /> Add About Me
          </Button>
          <Button
            variant="outline"
            className="w-full mb-4"
            onClick={() => addComponent("Job Scope")}
          >
            <Briefcase className="mr-2 h-4 w-4" /> Add Job Scope
          </Button>
          <Button
            variant="outline"
            className="w-full mb-4"
            onClick={() => addComponent("Projects")}
          >
            <FolderKanban className="mr-2 h-4 w-4" /> Add Projects
          </Button>
          <Button
            variant="outline"
            className="w-full mb-4"
            onClick={() => addComponent("Social Links")}
          >
            <Share2 className="mr-2 h-4 w-4" /> Add Social Links
          </Button>
        </div>

        {/* Drag-and-Drop Canvas */}
        <div className="flex-1 grid-bg p-4 overflow-hidden">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={components.map((c) => c.id)} strategy={verticalListSortingStrategy}>
              <div
                className="bg-gray-100 h-full rounded border-2 border-dashed space-y-4 p-4"
                style={{
                  backgroundImage: `linear-gradient(to right, transparent 95%, rgba(0,0,0,0.05) 5%), linear-gradient(to bottom, transparent 95%, rgba(0,0,0,0.05) 5%)`,
                  backgroundSize: "20px 20px",
                }}
              >
                {components.map((component) => (
                  <DraggableItem
                    key={component.id}
                    id={component.id}
                    label={component.label}
                    content={component.content}
                    onRemove={() => removeComponent(component.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
