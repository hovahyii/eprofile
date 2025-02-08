"use client";
import { useState, useEffect } from "react";
import Builder from "@/components/builder";
import { useRouter } from "next/navigation";

export default function BuilderPage() {
  const [formData, setFormData] = useState<any>(null);
  const [components, setComponents] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedFormData = localStorage.getItem("formData");
    const savedComponents = localStorage.getItem("components");
    if (savedFormData && savedComponents) {
      setFormData(JSON.parse(savedFormData));
      setComponents(JSON.parse(savedComponents));
    }
  }, []);

  if (isEditing) {
    return (
      // Render the ComprehensiveForm without automatic redirect.
      <ComprehensiveForm 
        initialData={{ formData, components }}
        onSave={(updatedData) => {
          setFormData(updatedData);
          setIsEditing(false);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full p-4">
        <button onClick={() => setIsEditing(true)}>
          Edit Information
        </button>
        <Builder initialData={{ formData, components }} />
      </div>
    </div>
  );
}
