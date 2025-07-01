"use client"
import Image from "next/image";
import EidolonsInfo from "@/components/eidolonsInfo";
import { useRouter } from 'next/navigation'
export default function EidolonsInfoPage() {
  const router = useRouter()
  return (
    <div className="w-full">
      <EidolonsInfo/>
    </div>
  );
}
