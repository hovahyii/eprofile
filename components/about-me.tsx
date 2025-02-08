//components/about-me.tsx

interface AboutMeProps {
  data: string;
}

export function AboutMe({ data }: AboutMeProps) {
  return (
    <p className="text-sm text-muted-foreground">
      {data || "No description provided."}
    </p>
  );
}
