"use client";

import { Input } from "@/components/ui/input";
import { revalidatePath } from "next/cache";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/search/${username.trim()}`);
    setUsername("");
  };

  return (
    <div className="relative w-1/5">
      <form action="" onSubmit={handleSearch}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-500 left-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <Input
          type="text"
          placeholder="Find a user"
          className="pl-10 pr-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </form>
    </div>
  );
}
