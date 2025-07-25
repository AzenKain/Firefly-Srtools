"use client";

import { getLocaleName } from '@/helper';
import useLocaleStore from '@/stores/localeStore';
import { LightConeBasic } from '@/types';
import ParseText from '../parseText';

interface LightconeCardProps {
    data: LightConeBasic
}

export default function LightconeCard({ data }: LightconeCardProps) {

    const { locale } = useLocaleStore();
    const text = getLocaleName(locale, data)
    return (
        <li className="z-10 flex flex-col items-center rounded-md shadow-lg 
            bg-gradient-to-b from-customStart to-customEnd transform transition-transform duration-300 
            hover:scale-105 cursor-pointer min-h-[220px]"
        >
            <div
                className={`w-full rounded-md bg-gradient-to-br ${data.rank === "CombatPowerLightconeRarity5"
                    ? "from-yellow-400 via-yellow-600/70 to-yellow-800/50"
                    : data.rank === "CombatPowerLightconeRarity4" ? "from-purple-400 via-purple-600/70 to-purple-800/50" :
                        "from-blue-400 via-blue-600/70 to-blue-800/50"
                    }`}
            >

                <div className="relative w-full h-full">
                    <img
                        loading="lazy"
                        src={`https://api.hakush.in/hsr/UI/lightconemediumicon/${data.id}.webp`}
                        className="w-full h-full rounded-md object-cover"
                        alt="ALT"
                    />
                </div>
            </div>

            <ParseText
                locale={locale}
                text={text}
                className="mt-2 px-1 text-center text-base font-normal leading-tight"
            />
        </li>

    );

}
