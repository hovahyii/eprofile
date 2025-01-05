import { Badge } from "@/components/ui/badge";

interface ProjectProps {
  title: string;
  description: string;
  status: "on-going" | "completed";
  tags?: string[]; // Optional
  technologies?: string[]; // Optional
}

export function Projects({ data }: { data: ProjectProps[] }) {
  return (
    <div className="space-y-4">
      {data.map((project, index) => (
        <div key={index} className="border rounded-lg p-4">
          <h4 className="font-semibold">{project.title || "Project Title"}</h4>
          <p className="text-sm text-muted-foreground mb-2">
            {project.description || "Description not provided."}
          </p>
          <Badge
            variant={
              project.status === "completed"
                ? "default"
                : project.status === "on-going"
                ? "outline"
                : "secondary"
            }
          >
            {project.status || "Status"}
          </Badge>
          {(project.tags?.length ?? 0) > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {project.tags?.map((tag, tagIndex) => (
                <Badge key={tagIndex} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
