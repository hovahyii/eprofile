// components/profile.tsx

import Image from "next/image";
import { MapPin, Building2  } from 'lucide-react'
import { Switch } from "@/components/ui/switch"

interface ProfileProps {
  name: string;
  title: string;
  location: string;
  image_url: string;
  email?: string; // Optional, in case email is used elsewhere
  phone?: string; // Optional
  website?: string; // Optional
}

export function Profile({ data }: { data: ProfileProps }) {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
    <div className="relative w-32 h-32 rounded-full overflow-hidden">
    <Image
        src={data.image_url || "/placeholder.svg"}
        alt="Profile"
        width={60}
        height={60}
        className="rounded-full object-cover"
      />
    </div>
    <div>
      <h1 className="text-3xl font-bold">{data.name || "Name not provided"}</h1>
      <Switch className="mt-2" />
    </div>
    <div className="flex items-center gap-4 text-gray-600">
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        <span>{data.location || "Location not provided"}</span>
      </div>
      <span>|</span>
      <div className="flex items-center gap-2">
        <Building2 className="w-4 h-4" />
        <span>{data.title || "Title not provided"}</span>
      </div>
    </div>
    <h2 className="text-xl">Student, Mentor, Developer</h2>
  </div>

  
  );
}
