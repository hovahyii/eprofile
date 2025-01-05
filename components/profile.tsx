import Image from "next/image";
import { MapPin } from "lucide-react";

interface ProfileProps {
  name: string;
  title: string;
  location: string;
  imageUrl: string;
  email?: string; // Optional, in case email is used elsewhere
  phone?: string; // Optional
  website?: string; // Optional
}

export function Profile({ data }: { data: ProfileProps }) {
  return (
    <div className="flex items-center space-x-4">
      <Image
        src={data.imageUrl || "/placeholder.svg"}
        alt="Profile"
        width={60}
        height={60}
        className="rounded-full object-cover"
      />
      <div>
        <h4 className="font-semibold">{data.name || "Name not provided"}</h4>
        <p className="text-sm text-muted-foreground">{data.title || "Title not provided"}</p>
        <p className="text-sm text-muted-foreground flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          {data.location || "Location not provided"}
        </p>
      </div>
    </div>
  );
}
