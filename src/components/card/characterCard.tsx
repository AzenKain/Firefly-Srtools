"use client";

import { getNameChar } from '@/helper';
import useLocaleStore from '@/stores/localeStore';
import { CharacterBasic } from '@/types';
import ParseText from '../parseText';
import Image from 'next/image';

interface CharacterCardProps {
  data: CharacterBasic
}

export default function CharacterCard({ data }: CharacterCardProps) {
  const { locale } = useLocaleStore();
  const text = getNameChar(locale, data)
  return (
    <li 
    className="z-10 flex flex-col items-center rounded-xl shadow-xl 
               bg-gradient-to-br from-base-300 via-base-100 to-warning/70
               transform transition-transform duration-300 ease-in-out 
               hover:scale-105 cursor-pointer min-h-[170px] sm:min-h-[180px] md:min-h-[210px] lg:min-h-[220px] xl:min-h-[240px] 2xl:min-h-[340px]"
    >
      <div
        className={`w-full rounded-md bg-gradient-to-br ${data.rank === "CombatPowerAvatarRarityType5"
          ? "from-yellow-400 via-yellow-600/70 to-yellow-800/50"
          : "from-purple-400 via-purple-600/70 to-purple-800/50"
          }`}
      >

        <div className="relative w-full h-full">
          <Image
            width={376}
            height={512}
            src={`https://api.hakush.in/hsr/UI/avatarshopicon/${data.id}.webp`}
            priority={true}
            className="w-full h-full rounded-md object-cover"
            alt="ALT"
          />
          <Image
            width={32}
            height={32}
      
            src={`/icon/${data.damageType.toLowerCase()}.webp`}
            className="absolute top-0 left-0 w-6 h-6 rounded-full"
            alt={data.damageType.toLowerCase()}
          />
          <Image
            width={32}
            height={32}
            src={`/icon/${data.baseType.toLowerCase()}.webp`}
            className="absolute top-0 right-0 w-6 h-6 rounded-full"
            alt={data.baseType.toLowerCase()}
            style={{
              boxShadow: "inset 0 0 8px 4px #9CA3AF"
            }}
          />
        </div>
      </div>

      <ParseText
        locale={locale}
        text={text}
        className="mt-2 px-1 text-center text-shadow-white font-bold leading-tight 2xl:text-lg"
      />
    </li>

  );
}
