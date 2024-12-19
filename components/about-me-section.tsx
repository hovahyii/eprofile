import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { AboutMeProps, EditableComponentProps } from "../types/builder"

export function AboutMeSection({ data, onUpdate }: EditableComponentProps<AboutMeProps>) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(data)

  const handleSave = () => {
    if (!editData.content.trim()) {
      alert("Content cannot be empty");
      return;
    }
    onUpdate(editData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Edit About Me</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={editData.content}
            onChange={(e) => setEditData({ ...editData, content: e.target.value })}
            placeholder="Write about yourself"
          />
          <Button onClick={handleSave} className="w-full">Save</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>About Me</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{data.content}</p>
        <Button onClick={() => setIsEditing(true)} className="w-full mt-4">Edit</Button>
      </CardContent>
    </Card>
  )
}

