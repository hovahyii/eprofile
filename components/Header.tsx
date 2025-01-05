import { Button } from "@/components/ui/button"
import { Eye, Save, Upload } from 'lucide-react'

interface HeaderProps {
  formTitle: string;
}

export default function Header({ formTitle }: HeaderProps) {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{formTitle}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save
          </Button>
          <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
            <Upload className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>
    </header>
  )
}

