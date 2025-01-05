// app/user/profile/page.tsx

'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronRight, Eye, LogOut, PenSquare } from 'lucide-react'
import Link from "next/link"

export default function ProfileDashboard() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header with Logout */}
        <div className="flex justify-end mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/logout" className="text-muted-foreground">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Link>
          </Button>
        </div>

        {/* Greeting */}
        <h1 className="text-4xl font-bold mb-12">Hi, Jehovah Yii Zui Hon!</h1>

        {/* My Cards Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">My Cards</h2>
          <p className="text-muted-foreground mb-4">
            Start sharing your profile by activating your Tapnex Card
          </p>
          <Button size="lg" className="bg-[#14171F] text-white hover:bg-[#14171F]/90">
            Activate Card
          </Button>
        </section>

        {/* Menu Items */}
        <div className="space-y-4">
          <Card className="p-4 hover:bg-accent cursor-pointer transition-colors">
            <Link href="/edit-profile" className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PenSquare className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Edit Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    Want to make some changes to your profile?
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          </Card>

          <Card className="p-4 hover:bg-accent cursor-pointer transition-colors">
            <Link href="/preview-profile" className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Preview Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    To see how does your profile looks like.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}

