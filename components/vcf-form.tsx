// app/components/vcf-form.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download } from 'lucide-react';

interface VCFFormProps {
  initialData: {
    name: string;
    email: string;
    phone: string;
    title: string;
    organization: string;
    website: string;
  };
  onSave: (data: VCFFormProps['initialData']) => void;
  isDarkMode: boolean;
}

const VCFForm: React.FC<VCFFormProps> = ({ initialData, onSave, isDarkMode }) => {
  const [formData, setFormData] = React.useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleDownloadVCF = () => {
    const { name, email, phone, title, organization, website } = formData;
    const vcfData = `BEGIN:VCARD
VERSION:3.0
FN;CHARSET=UTF-8:${name}
N;CHARSET=UTF-8:${name};;;
EMAIL;CHARSET=UTF-8;type=WORK,INTERNET:${email}
TEL;TYPE=WORK,VOICE:${phone}
TITLE;CHARSET=UTF-8:${title}
ORG;CHARSET=UTF-8:${organization}
URL:${website}
END:VCARD`;
    const blob = new Blob([vcfData], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contact.vcf';
    a.click();
  };

  return (
    <Card className={isDarkMode ? 'dark' : ''}>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="organization">Organization</Label>
            <Input id="organization" name="organization" value={formData.organization} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input id="website" name="website" type="url" value={formData.website} onChange={handleChange} />
          </div>
          <div className="flex space-x-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={handleDownloadVCF}>
              <Download className="mr-2 h-4 w-4" />
              Download VCF
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VCFForm;

