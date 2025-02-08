// components/projects.tsx

import { Badge } from "@/components/ui/badge";

interface Project {
  id: string;
  title: string;
  description: string;
  status: "on-going" | "completed" | "on-hold";
  categories?: string[]; // an array of strings
}


export function Projects({ data }: { data: ProjectProps[] }) {
  const categories = Array.from(new Set(data.map((project) => project.categories)));

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">{category}</h3>
          <div className="grid grid-cols-1 gap-4">
            {data
              .filter((project) => project.categories === category)
              .map((project, index) => (
                <div key={index} className="p-4 border rounded-lg shadow">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-base font-medium">{project.title}</h4>
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
                  </div>
                  <p className="text-sm text-gray-700">{project.description}</p>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
