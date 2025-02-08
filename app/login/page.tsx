"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // Assuming you are still using Supabase as a backend
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");  // To display error message
  const router = useRouter();

  const handleLogin = async () => {
    setIsLoading(true);
    setError(""); // Reset the error message

    try {
      // Query the profiles table to check if the email exists
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("id, password")
        .eq("email", email)
        .single();  // Ensure only one result is returned

      if (fetchError) {
        throw new Error("Email not found.");
      }

      // Compare the provided password with the stored password
      if (data.password === password) {
        // If password matches, store the profile ID in localStorage
        localStorage.setItem("profileId", data.id);

        // Redirect to the user profile or builder page
        router.push("/user/profile");
      } else {
        throw new Error("Incorrect password.");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);  // Display the error message
      } else {
        setError("An unknown error occurred.");
      }
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-[40px] font-medium leading-tight text-gray-600">
            Login to{" "}
            <div className="mt-1">
              Tapnex{" "}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-md border-gray-200 px-4"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-base font-medium text-gray-900">
              Password
            </label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-md border-gray-200 px-4"
            />
          </div>
          <Button
            onClick={handleLogin}
            className="h-12 w-full rounded-md bg-[#14162E] text-base font-medium hover:bg-[#14162E]/90"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
}
