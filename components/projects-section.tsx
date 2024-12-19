import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Upload } from 'lucide-react'
import type { ProjectProps, EditableComponentProps } from "../types/builder"

interface ProjectsSectionProps extends EditableComponentProps<{ projects: ProjectProps[] }> {
  onRemove: () => void;
}

export function ProjectsSection({ data, onUpdate, onRemove }: ProjectsSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(data)

  const handleProjectUpdate = (index: number, updatedProject: ProjectProps) => {
    const newProjects = [...editData.projects]
    newProjects[index] = updatedProject
    setEditData({ projects: newProjects })
  }

  const handleAddProject = () => {
    setEditData({
      projects: [
        ...editData.projects,
        { title: '', description: '', status: 'on-going', tags: [], technologies: [] }
      ]
    })
  }

  const handleRemoveProject = (index: number) => {
    const newProjects = [...editData.projects]
    newProjects.splice(index, 1)
    setEditData({ projects: newProjects })
  }

  const handleSave = () => {
    onUpdate(editData)
    setIsEditing(false)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        handleProjectUpdate(index, { ...editData.projects[index], logo: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
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
        <CardHeader>
          <CardTitle>Edit Projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {editData.projects.map((project, index) => (
            <Card key={index}>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={project.logo || "/placeholder.svg?height=48&width=48"}
                      alt={project.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0"
                      onClick={() => document.getElementById(`projectImageUpload-${index}`)?.click()}
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                    <input
                      id={`projectImageUpload-${index}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, index)}
                    />
                  </div>
                  <Input
                    value={project.title}
                    onChange={(e) => handleProjectUpdate(index, { ...project, title: e.target.value })}
                    placeholder="Project Title"
                  />
                </div>
                <Textarea
                  value={project.description}
                  onChange={(e) => handleProjectUpdate(index, { ...project, description: e.target.value })}
                  placeholder="Project Description"
                />
                <Select
                  value={project.status}
                  onValueChange={(value: 'on-going' | 'completed') => handleProjectUpdate(index, { ...project, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on-going">On-going</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={project.tags.join(', ')}
                  onChange={(e) => handleProjectUpdate(index, { ...project, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                  placeholder="Tags (comma-separated)"
                />
                <Input
                  value={project.technologies.join(', ')}
                  onChange={(e) => handleProjectUpdate(index, { ...project, technologies: e.target.value.split(',').map(tech => tech.trim()) })}
                  placeholder="Technologies (comma-separated)"
                />
                <Button onClick={() => handleRemoveProject(index)} variant="destructive">Remove Project</Button>
              </CardContent>
            </Card>
          ))}
          <Button onClick={handleAddProject}>Add Project</Button>
          <Button onClick={handleSave} className="w-full">Save All Projects</Button>
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
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.projects.map((project, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                {project.logo && (
                  <img
                    src={project.logo}
                    alt={project.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{project.title}</h3>
                    <Badge variant={project.status === 'completed' ? 'default' : 'destructive'}>
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        <Button onClick={() => setIsEditing(true)} className="w-full">Edit Projects</Button>
      </CardContent>
    </Card>
  )
}

