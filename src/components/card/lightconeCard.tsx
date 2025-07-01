"use client";

import { getNameLightcone } from '@/helper';
import useLocaleStore from '@/stores/localeStore';
import { LightConeBasic } from '@/types';
import ParseText from '../parseText';

interface LightconeCardProps {
    data: LightConeBasic
}

export default function LightconeCard({ data }: LightconeCardProps) {

    const { locale } = useLocaleStore();
    const text = getNameLightcone(locale, data)
    return (
        <li className="z-10 flex flex-col items-center rounded-md shadow-lg 
            bg-gradient-to-b from-customStart to-customEnd transform transition-transform duration-300 
            hover:scale-105 cursor-pointer min-h-[220px]"
        >
            <div
                className={`w-full rounded-md bg-gradient-to-br ${data.rank === "CombatPowerLightconeRarity5"
                    ? "from-yellow-400 via-yellow-100 to-yellow-500"
                    : data.rank === "CombatPowerLightconeRarity4" ? "from-purple-300 via-purple-100 to-purple-400" :
                        "from-blue-300 via-blue-100 to-blue-400"
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
