"use client";

import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactVCFProps {
  name: string;
  email: string;
  phone: string;
  title: string;
  organization: string;
  website: string;
}

const ContactVCFComponent: React.FC<ContactVCFProps> = ({
  name,
  email,
  phone,
  title,
  organization,
  website,
}) => {
  const handleDownloadVCF = () => {
    const vcfData = `BEGIN:VCARD
VERSION:3.0
FN;CHARSET=UTF-8:${name}
N;CHARSET=UTF-8:${name};;;
EMAIL;CHARSET=UTF-8;type=WORK,INTERNET:${email}
TITLE;CHARSET=UTF-8:${title}
ORG;CHARSET=UTF-8:${organization}
TEL;TYPE=WORK,VOICE:${phone}
URL:${website}
END:VCARD`;
    const blob = new Blob([vcfData], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contact.vcf";
    a.click();
  };

  return (
    <Button onClick={handleDownloadVCF} variant="outline">
      <Download className="w-4 h-4 mr-2" />
      Save Contact
    </Button>
  );
};

export default ContactVCFComponent;
