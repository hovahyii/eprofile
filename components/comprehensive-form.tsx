// app/components/comprehensive-form.tsx

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, X } from 'lucide-react';

interface FormData {
  profile: {
    name: string;
    title: string;
    location: string;
    imageUrl: string;
    email: string;
    phone: string;
    website: string;
  };
  aboutMe: string;
  jobScope: {
    title: string;
    description: string;
  };
  projects: Array<{
    title: string;
    description: string;
    status: 'on-going' | 'completed' | 'on-hold';
    tags: string[];
    technologies: string[];
  }>;
  social: Array<{
    platform: string;
    url: string;
  }>;
}

interface ComprehensiveFormProps {
  initialData?: FormData | null;
  onSave: (data: FormData) => void;
  onViewProfile: () => void; // Function to switch to builder.tsx

}

const defaultFormData: FormData = {
  profile: {
    name: '',
    title: '',
    location: '',
    imageUrl: '',
    email: '',
    phone: '',
    website: '',
  },
  aboutMe: '',
  jobScope: {
    title: '',
    description: '',
  },
  projects: [{
    title: '',
    description: '',
    status: 'on-going',
    tags: [],
    technologies: [],
  }],
  social: [{
    platform: '',
    url: '',
  }],
};

export function ComprehensiveForm({ initialData = defaultFormData, onSave, onViewProfile }: ComprehensiveFormProps) {
  const [formData, setFormData] = useState<FormData>(initialData || defaultFormData);

  const handleChange = (section: keyof FormData, field: string, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(typeof prev[section] === 'object' ? prev[section] : {}),
        [field]: value
      }
    }));
  };

  const handleProjectChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) =>
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  const handleSocialChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social: prev.social.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        { title: '', description: '', status: 'on-going', tags: [], technologies: [] }
      ]
    }));
  };

  const removeProject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      social: [...prev.social, { platform: '', url: '' }]
    }));
  };

  const removeSocialLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      social: prev.social.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Edit Your Profile Information</h1>
        <Button variant="outline" onClick={onViewProfile}>
          View Profile
        </Button>
      </div>
    
     {/* Profile Information Section */}
     <Card className="shadow-md border-none">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm">Name</Label>
            <Input
              id="name"
              value={formData.profile.name}
              onChange={(e) => handleChange('profile', 'name', e.target.value)}
              className="p-3 mt-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="title" className="text-sm">Title</Label>
            <Input
              id="title"
              value={formData.profile.title}
              onChange={(e) => handleChange('profile', 'title', e.target.value)}
              className="p-3 mt-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="location" className="text-sm">Location</Label>
            <Input
              id="location"
              value={formData.profile.location}
              onChange={(e) => handleChange('profile', 'location', e.target.value)}
              className="p-3 mt-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="imageUpload" className="text-sm">Profile Image</Label>
            <Input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    handleChange('profile', 'imageUrl', reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="p-2 mt-2 rounded-md"
            />
            {formData.profile.imageUrl && (
              <img
                src={formData.profile.imageUrl}
                alt="Profile"
                className="mt-4 w-32 h-32 object-cover rounded-full border-2 border-gray-200"
              />
            )}
          </div>
          <div>
            <Label htmlFor="email" className="text-sm">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.profile.email}
              onChange={(e) => handleChange('profile', 'email', e.target.value)}
              className="p-3 mt-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-sm">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.profile.phone}
              onChange={(e) => handleChange('profile', 'phone', e.target.value)}
              className="p-3 mt-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="website" className="text-sm">Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.profile.website}
              onChange={(e) => handleChange('profile', 'website', e.target.value)}
              className="p-3 mt-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>


 {/* About Me Section */}
 <Card className="shadow-md border-none">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">About Me</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.aboutMe}
            onChange={(e) => setFormData(prev => ({ ...prev, aboutMe: e.target.value }))}
            rows={5}
            className="p-3 mt-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </CardContent>
      </Card>

     
 
      {/* Projects Section */}
      <Card className="shadow-md border-none">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Projects</CardTitle>
          <p className="text-sm text-gray-500">Add your project details.</p>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left px-4 py-2">Title</th>
                <th className="text-left px-4 py-2">Description</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {formData.projects.map((project, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">
                    <Input
                      placeholder="Project Title"
                      value={project.title}
                      onChange={(e) =>
                        handleProjectChange(index, "title", e.target.value)
                      }
                      className="p-2 border rounded"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Textarea
                      placeholder="Project Description"
                      value={project.description}
                      onChange={(e) =>
                        handleProjectChange(index, "description", e.target.value)
                      }
                      className="p-2 border rounded resize-none"
                      rows={2}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      placeholder="Project Title"
                      value={project.tags}
                      onChange={(e) =>
                        handleProjectChange(index, "tags", e.target.value)
                      }
                      className="p-2 border rounded"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      placeholder="Project Title"
                      value={project.technologies}
                      onChange={(e) =>
                        handleProjectChange(index, "technologies", e.target.value)
                      }
                      className="p-2 border rounded"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={project.status}
                      onChange={(e) =>
                        handleProjectChange(index, "status", e.target.value)
                      }
                      className="p-2 border rounded w-full"
                    >
                      <option value="on-going">On-going</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                    </select>
                  </td>
                  
                  <td className="px-4 py-2 flex space-x-2 items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProject(index)}
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button 
              type="button" 
              onClick={addProject} 
              className="w-full mt-4 flex items-center justify-center"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Project
            </Button>

        </CardContent>
      </Card>

      {/* Social Links Section */}
      <Card className="shadow-md border-none">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.social.map((link, index) => (
            <div key={index} className="flex items-center space-x-2">
              <select
                className="p-3 mt-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={link.platform}
                onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
              >
                <option value="">Select Platform</option>
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
                <option value="instagram">Instagram</option>
                <option value="website">Website</option>
              </select>
              <Input
                placeholder="Enter URL"
                value={link.url}
                onChange={(e) => handleSocialChange(index, 'url', e.target.value)}
                className="p-3 mt-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSocialLink(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addSocialLink} className="w-full mt-4">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Social Link
          </Button>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button type="submit" className="w-full mt-6 bg-blue-600 text-white rounded-lg py-3 text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
        Save All Information
      </Button>
    </form>
  );
}
