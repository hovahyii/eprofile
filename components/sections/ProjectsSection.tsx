"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  status: "on-going" | "completed" | "on-hold";
  categories?: string;
}

interface FormData {
  projects: Project[];
}

interface ProjectsSectionProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export default function ProjectsSection({
  formData,
  setFormData,
}: ProjectsSectionProps) {
  const handleDeleteProject = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const projectStatusOptions = ["on-going", "completed", "on-hold"];

  return (
    <div className="border p-4 rounded space-y-4 w-full">
      <h3 className="text-lg font-semibold">Projects</h3>

      {formData.projects.map((project) => (
        <div key={project.id} className="flex flex-col md:flex-row gap-2 mb-2">
          {/* Title */}
          <input
            type="text"
            className="border p-2 rounded w-full md:w-1/5"
            placeholder="Project Title"
            value={project.title}
            onChange={(e) =>
              setFormData((prev) => {
                const updated = prev.projects.map((p) =>
                  p.id === project.id ? { ...p, title: e.target.value } : p
                );
                return { ...prev, projects: updated };
              })
            }
          />

          {/* Description */}
          <textarea
            className="border p-2 rounded w-full md:w-2/5"
            placeholder="Project Description"
            value={project.description}
            onChange={(e) =>
              setFormData((prev) => {
                const updated = prev.projects.map((p) =>
                  p.id === project.id ? { ...p, description: e.target.value } : p
                );
                return { ...prev, projects: updated };
              })
            }
          />

          {/* Status */}
          <select
            className="border p-2 rounded w-full md:w-1/6"
            value={project.status}
            onChange={(e) =>
              setFormData((prev) => {
                const updated = prev.projects.map((p) =>
                  p.id === project.id ? { ...p, status: e.target.value as Project["status"] } : p
                );
                return { ...prev, projects: updated };
              })
            }
          >
            {projectStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          {/* Categories */}
          <input
            type="text"
            className="border p-2 rounded w-full md:w-1/6"
            placeholder="Comma-separated categories"
            value={project.categories || ""}
            onChange={(e) =>
              setFormData((prev) => {
                const updated = prev.projects.map((p) =>
                  p.id === project.id ? { ...p, categories: e.target.value } : p
                );
                return { ...prev, projects: updated };
              })
            }
          />

          {/* Delete Button */}
          <Button
            variant="destructive"
            type="button"
            onClick={() => handleDeleteProject(project.id)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}

      {/* Add New Project Button */}
      <Button
        type="button"
        onClick={() =>
          setFormData((prev) => ({
            ...prev,
            projects: [
              ...prev.projects,
              {
                id: crypto.randomUUID(), // ensures each project gets a unique ID
                title: "",
                description: "",
                status: "on-hold",
                categories: "",
              },
            ],
          }))
        }
      >
        Add Project
      </Button>
    </div>
  );
}
