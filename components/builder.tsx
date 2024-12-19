"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ProfileSection } from "./profile-section";
import { ProjectsSection } from "./projects-section";
import { SocialSection } from "./social-section";
import { JobScopeSection } from "./job-scope-section";
import { AboutMeSection } from "./about-me-section";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import type { ComponentData } from "../types/builder";

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export default function Builder() {
  const [components, setComponents] = useState<ComponentData[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addComponent = (type: ComponentData["type"]) => {
    const newComponent: ComponentData = {
      id: `${type}-${Date.now()}`,
      type,
      props: getDefaultProps(type),
    };
    setComponents([...components, newComponent]);
  };

  const getDefaultProps = (type: ComponentData["type"]): ComponentData["props"] => {
    switch (type) {
      case "profile":
        return {
            name: "Your Name",
            title: "Your Title",
            location: "Your Location",
            imageUrl: "",
            status: true,
        };
      case "projects":
        return {
          projects: [
            {
              title: "Sample Project",
              description: "This is a sample project description.",
              status: "on-going",
              tags: ["Web", "Mobile"],
              technologies: ["React", "Node.js"],
            },
          ],
        };
      case "social":
        return {
          links: [
            { platform: "facebook", url: "https://facebook.com" },
            { platform: "linkedin", url: "https://linkedin.com" },
            { platform: "twitter", url: "https://twitter.com" },
            { platform: "instagram", url: "https://instagram.com" },
          ],
        };
      case "jobScope":
        return {
          title: "Your Job Title",
          description: "Describe your job responsibilities here.",
        };
      case "aboutMe":
        return {
          content: "Write a brief description about yourself here.",
        };
      default:
        throw new Error(`Unknown component type: ${type}`);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setComponents((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleComponentUpdate = (id: string, newProps: ComponentData["props"]) => {
    setComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.id === id ? { ...component, props: newProps } : component
      )
    );
  };

  const removeComponent = (id: string) => {
    setComponents((prevComponents) =>
      prevComponents.filter((component) => component.id !== id)
    );
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 border-r p-4">
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => addComponent("profile")}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Profile
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => addComponent("projects")}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Projects
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => addComponent("social")}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Social Media
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => addComponent("jobScope")}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Job Scope
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => addComponent("aboutMe")}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add About Me
          </Button>
        </div>
      </div>
      <div className="flex-1 p-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={components} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {components.map((component) => (
                <SortableItem key={component.id} id={component.id}>
                    {component.type === "profile" && (
                    <ProfileSection
                        data={component.props}
                        onUpdate={(newProps) => handleComponentUpdate(component.id, newProps)}
                        onRemove={() => removeComponent(component.id)}
                    />
                    )}
                  {component.type === "projects" && (
                    <ProjectsSection
                      data={component.props}
                      onUpdate={(newProps) => handleComponentUpdate(component.id, newProps)}
                      onRemove={() => removeComponent(component.id)}
                    />
                  )}
                  {component.type === "social" && (
                    <SocialSection
                      data={component.props}
                      onUpdate={(newProps) => handleComponentUpdate(component.id, newProps)}
                      onRemove={() => removeComponent(component.id)}
                    />
                  )}
                  {component.type === "jobScope" && (
                    <JobScopeSection
                      data={component.props}
                      onUpdate={(newProps) => handleComponentUpdate(component.id, newProps)}
                      onRemove={() => removeComponent(component.id)}
                    />
                  )}
                  {component.type === "aboutMe" && (
                    <AboutMeSection
                      data={component.props}
                      onUpdate={(newProps) => handleComponentUpdate(component.id, newProps)}
                      onRemove={() => removeComponent(component.id)}
                    />
                  )}
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
