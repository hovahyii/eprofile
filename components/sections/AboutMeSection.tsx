// components/sections/AboutMeSection.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
  aboutMe: string;
  // plus other fields
}

interface AboutMeSectionProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export default function AboutMeSection({ formData, setFormData }: AboutMeSectionProps) {
  return (
    <Card className="shadow-md border-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          About Me
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={formData.aboutMe}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, aboutMe: e.target.value }))
          }
          rows={5}
          className="p-3 mt-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />
      </CardContent>
    </Card>
  );
}
