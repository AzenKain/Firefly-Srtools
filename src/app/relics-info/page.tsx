"use client"
import Image from "next/image";

import RelicsInfo from "@/components/relicsInfo";
import { useRouter } from 'next/navigation'
export default function RelicsInfoPage() {
  const router = useRouter()
  return (
    <div className="w-full">
      <RelicsInfo></RelicsInfo>
    </div>
  );
}
