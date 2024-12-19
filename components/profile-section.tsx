import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, Upload, X } from 'lucide-react'
import type { ProfileProps, EditableComponentProps } from "../types/builder"

interface ProfileSectionProps extends EditableComponentProps<ProfileProps> {
  onRemove: () => void;
}



export function ProfileSection({ data, onUpdate, onRemove }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false)

  const [editData, setEditData] = useState<ProfileProps>(
    data || {
      name: "",
      title: "",
      location: "",
      imageUrl: "",
      status: false,
    }
  );

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditData({ ...editData, imageUrl: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    onUpdate(editData)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <Card className="w-full max-w-md mx-auto relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img
                src={editData.imageUrl || "/placeholder.svg?height=120&width=120"}
                alt="Profile"
                className="rounded-full w-[120px] h-[120px] object-cover"
              />
              <Button
                size="sm"
                className="absolute bottom-0 right-0"
                onClick={() => document.getElementById('imageUpload')?.click()}
              >
                <Upload className="w-4 h-4" />
              </Button>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <Input
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              placeholder="Your Name"
            />
            <Input
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              placeholder="Your Title"
            />
            <Input
              value={editData.location}
              onChange={(e) => setEditData({ ...editData, location: e.target.value })}
              placeholder="Your Location"
            />
            <div className="flex items-center gap-2">
              <span>Status:</span>
              <Switch
                checked={editData.status}
                onCheckedChange={(checked) => setEditData({ ...editData, status: checked })}
              />
            </div>
          </div>
          <Button onClick={handleSave} className="w-full">Save</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <img
              src={data.imageUrl || "/placeholder.svg?height=120&width=120"}
              alt="Profile"
              className="rounded-full w-[120px] h-[120px] object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-center">{data.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{data.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{data.title}</span>
            <Switch checked={data.status} />
          </div>
        </div>
        <Button onClick={() => setIsEditing(true)} className="mt-4 w-full">Edit</Button>
      </CardContent>
    </Card>
  )
}

