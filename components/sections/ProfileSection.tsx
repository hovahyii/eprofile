// components/sections/ProfileSection.tsx
"use client";

import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileData {
  name: string;
  title: string;
  location: string;
  image_url: string;
  email: string;
  phone: string;
  website: string;
}

interface FormData {
  profile: ProfileData;
  aboutMe: string;
  jobScope: { title: string; description: string };
  projects: any[];
  social: any[];
}

interface ProfileSectionProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export default function ProfileSection({ formData, setFormData }: ProfileSectionProps) {
  const profile = formData.profile;

  const handleChange = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      profile: { ...prev.profile, [field]: value },
    }));
  };

  // Example of uploading an image to Supabase storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = `${file.name.split(".")[0]}-${Date.now()}.${
      file.name.split(".").pop() ?? "png"
    }`;

    const { error } = await supabase.storage.from("profiles").upload(fileName, file);
    if (error) {
      console.error("Error uploading image:", error);
      return;
    }

    const { data, error: urlError } = supabase.storage.from("profiles").getPublicUrl(fileName);
    if (urlError) {
      console.error("Error retrieving public URL:", urlError);
      return;
    }

    // Store the final public URL in our form
    handleChange("image_url", data?.publicUrl || "");
  };

  return (
    <Card className="shadow-md border-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-sm">
            Name
          </Label>
          <Input
            id="name"
            value={profile.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="title" className="text-sm">
            Title
          </Label>
          <Input
            id="title"
            value={profile.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="location" className="text-sm">
            Location
          </Label>
          <Input
            id="location"
            value={profile.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="imageUpload" className="text-sm">
            Profile Image
          </Label>
          <Input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {profile.image_url && (
            <img
              src={profile.image_url}
              alt="Profile"
              className="mt-2 w-24 h-24 object-cover rounded-full border"
            />
          )}
        </div>
        <div>
          <Label htmlFor="email" className="text-sm">
            Email
          </Label>
          <Input
            id="email"
            value={profile.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-sm">
            Phone
          </Label>
          <Input
            id="phone"
            value={profile.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="website" className="text-sm">
            Website
          </Label>
          <Input
            id="website"
            value={profile.website}
            onChange={(e) => handleChange("website", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
