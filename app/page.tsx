  'use client'

import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
  return (
    <div>
      <h1>Hello word</h1>
    </div>
  );
}
