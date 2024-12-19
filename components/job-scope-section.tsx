import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { JobScopeProps, EditableComponentProps } from "../types/builder"

export function JobScopeSection({ data, onUpdate }: EditableComponentProps<JobScopeProps>) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(data)

  const handleSave = () => {
    if (!editData.title.trim() || !editData.description.trim()) {
      alert("Both title and description are required.");
      return;
    }
    onUpdate(editData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Edit Job Scope</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            placeholder="Job Title"
          />
          <Textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            placeholder="Job Description"
          />
          <Button onClick={handleSave} className="w-full">Save</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Job Scope</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold text-lg mb-2">{data.title}</h3>
        <p className="text-muted-foreground">{data.description}</p>
        <Button onClick={() => setIsEditing(true)} className="w-full mt-4">Edit</Button>
      </CardContent>
    </Card>
  )
}

