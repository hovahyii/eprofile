// components/sections/SocialLinksSection.tsx
"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface FormData {
  social: SocialLink[];
  // plus any other fields
}

interface SocialLinksSectionProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export default function SocialLinksSection({ formData, setFormData }: SocialLinksSectionProps) {
  const handleDelete = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      social: prev.social.filter((link) => link.id !== id),
    }));
  };

  return (
    <div className="border p-4 rounded space-y-4 w-full">
      <h3 className="text-lg font-semibold">Social Links</h3>

      {formData.social.map((link, index) => (
        <div key={link.id} className="flex gap-2 items-center mb-2">
          {/* Platform */}
          <select
            className="border p-2 rounded w-1/3"
            value={link.platform}
            onChange={(e) =>
              setFormData((prev) => {
                const updated = [...prev.social];
                updated[index].platform = e.target.value;
                return { ...prev, social: updated };
              })
            }
          >
            <option value="GitHub">GitHub</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Twitter">Twitter</option>
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
            <option value="Other">Other</option>
          </select>

          {/* URL */}
          <input
            className="border p-2 rounded w-1/2"
            type="url"
            placeholder="https://example.com"
            value={link.url}
            onChange={(e) =>
              setFormData((prev) => {
                const updated = [...prev.social];
                updated[index].url = e.target.value;
                return { ...prev, social: updated };
              })
            }
          />

          {/* Delete button */}
          <Button variant="destructive" type="button" onClick={() => handleDelete(link.id)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}

      {/* Add new link */}
      <Button
        type="button"
        onClick={() =>
          setFormData((prev) => ({
            ...prev,
            social: [
              ...prev.social,
              {
                id: Date.now().toString(),
                platform: "Other",
                url: "",
              },
            ],
          }))
        }
      >
        Add Social Link
      </Button>
    </div>
  );
}
