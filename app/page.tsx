"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Builder from "@/components/builder";
import LoginForm from "@/app/login/page";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: session } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    fetchUser();
  }, []);

  if (!user) {
    // Redirect to Login if user is not authenticated
    return <LoginForm />;
  }

  return (
    <main className="container mx-auto p-4">
      <Builder />
    </main>
  );
}
