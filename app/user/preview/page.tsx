"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Profile } from "@/components/profile";
import { AboutMe } from "@/components/about-me";
import { JobScope } from "@/components/job-scope";
import { Projects } from "@/components/projects";
import { Social } from "@/components/social";
import ContactVCFComponent from "@/components/contact-vcf";

export default function PreviewPage() {
  const [formData, setFormData] = useState<any>(null);
  const [components, setComponents] = useState<any[]>([]);

  useEffect(() => {
    // Get data from localStorage
    const savedFormData = localStorage.getItem("formData");
    const savedComponents = localStorage.getItem("components");

    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }

    if (savedComponents) {
      setComponents(JSON.parse(savedComponents));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-3 flex justify-end gap-4">
          {/* Contact VCF */}
          <ContactVCFComponent
            name={formData?.profile?.name || "Name"}
            email={formData?.profile?.email || "Email"}
            phone={formData?.profile?.phone || "Phone"}
            title={formData?.profile?.title || "Title"}
            organization="My Organization"
            website={formData?.profile?.website || "Website"}
          />
          {/* QR Code Button */}
          <Button variant="outline" className="flex items-center gap-2">
            QR Code
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Render Components Dynamically */}
          {components.map((component) => {
            switch (component.label) {
              case "Profile":
                return (
                  <section key={component.id} className="bg-white rounded-lg p-8 space-y-6">
                    <Profile data={formData?.profile} />
                  </section>
                );

              case "About Me":
                return (
                  <section key={component.id} className="bg-white rounded-lg p-8">
                    <h2 className="text-2xl font-bold mb-4">About Me</h2>
                    <AboutMe data={formData?.aboutMe} />
                  </section>
                );

              case "Job Scope":
                return (
                  <section key={component.id} className="bg-white rounded-lg p-8">
                    <h2 className="text-2xl font-bold mb-4">Job Scope</h2>
                    <JobScope data={formData?.jobScope} />
                  </section>
                );

              case "Projects":
                return (
                  <section key={component.id} className="space-y-4">
                    <h2 className="text-2xl font-bold">Projects</h2>
                    <Projects data={formData?.projects || []} />
                  </section>
                );

              case "Social Links":
                return (
                  <section key={component.id} className="bg-white rounded-lg p-8">
                    <h2 className="text-2xl font-bold mb-4">Social Links</h2>
                    <Social data={formData?.social || []} />
                  </section>
                );

              default:
                return null;
            }
          })}

          {/* Fallback for Empty Components */}
          {components.length === 0 && (
            <p className="text-gray-500 text-center">
              No data to preview. Please go back and add components.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
