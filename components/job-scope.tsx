interface JobScopeProps {
  title: string;
  description: string;
}

export function JobScope({ data }: { data: JobScopeProps }) {
  return (
    <div className="space-y-2">
      <h4 className="font-semibold">{data.title || "Job Title"}</h4>
      <p className="text-sm text-muted-foreground">
        {data.description || "Description not provided."}
      </p>
    </div>
  );
}
