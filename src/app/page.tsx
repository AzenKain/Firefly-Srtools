"use client"
import AvatarInfo from "@/components/avatarInfo";

import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter()
    return (
      <div className="w-full">
        <AvatarInfo></AvatarInfo>
      </div>
    );
}
