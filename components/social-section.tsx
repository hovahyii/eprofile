import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Facebook, Linkedin, Twitter, Instagram, X } from 'lucide-react'
import type { SocialProps, EditableComponentProps } from "../types/builder"

interface SocialSectionProps extends EditableComponentProps<SocialProps> {
  onRemove: () => void;
}

export function SocialSection({ data, onUpdate, onRemove }: SocialSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(data)

  const getIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="w-5 h-5" />
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />
      case 'twitter':
        return <Twitter className="w-5 h-5" />
      case 'instagram':
        return <Instagram className="w-5 h-5" />
      default:
        return null
    }
  }

  const handleLinkUpdate = (index: number, field: 'platform' | 'url', value: string) => {
    const newLinks = [...editData.links]
    newLinks[index] = { ...newLinks[index], [field]: value }
    setEditData({ links: newLinks })
  }

  const handleAddLink = () => {
    setEditData({
      links: [...editData.links, { platform: 'facebook', url: '' }]
    })
  }

  const handleRemoveLink = (index: number) => {
    const newLinks = [...editData.links]
    newLinks.splice(index, 1)
    setEditData({ links: newLinks })
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
        <CardHeader>
          <CardTitle>Edit Social Media Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {editData.links.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              <Select
                value={link.platform}
                onValueChange={(value: 'facebook' | 'linkedin' | 'twitter' | 'instagram') => handleLinkUpdate(index, 'platform', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={link.url}
                onChange={(e) => handleLinkUpdate(index, 'url', e.target.value)}
                placeholder="Enter URL"
              />
              <Button onClick={() => handleRemoveLink(index)} variant="destructive" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button onClick={handleAddLink}>Add Link</Button>
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
      <CardHeader>
        <CardTitle>Social Media</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {data.links.map((link, index) => (
          <Button key={index} variant="outline" asChild>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {getIcon(link.platform)}
              <span className="ml-2 capitalize">{link.platform}</span>
            </a>
          </Button>
        ))}
        <Button onClick={() => setIsEditing(true)} className="w-full mt-4">Edit Links</Button>
      </CardContent>
    </Card>
  )
}

