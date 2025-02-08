// components/social.tsx

interface SocialProps {
  platform: string;
  url: string;
}

export function Social({ data }: { data: SocialProps[] }) {
  return (
    <div className="flex space-x-4">
      {data.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {link.platform || "Platform"}
        </a>
      ))}
    </div>
  );
}
