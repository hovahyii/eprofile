// login/page.tsx

'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function LoginForm() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-[40px] font-medium leading-tight text-gray-600">
            Login to{' '}
            <div className="mt-1">
              Tapnex{' '}
              <span className="inline-block border-b-2 border-black">
                Profile
              </span>
            </div>
          </h1>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-base font-medium text-gray-900">
              Email
            </label>
            <Input
              id="email"
              placeholder="Email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="h-12 rounded-md border-gray-200 px-4"
            />
          </div>
          <Button 
            className="h-12 w-full rounded-md bg-[#14162E] text-base font-medium hover:bg-[#14162E]/90"
          >
            Sign In
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-4 text-gray-500">
                OR CONTINUE WITH
              </span>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="h-12 w-full rounded-md border-gray-200 text-base font-medium"
          >
            <Image
              src="https://www.google.com/favicon.ico"
              alt="Google"
              width={20}
              height={20}
              className="mr-3"
            />
            Login with Google
          </Button>
        </div>
      </div>
    </div>
  )
}

