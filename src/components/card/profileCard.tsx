
import React from 'react';
import { AvatarProfileCardType } from '@/types';
import useLocaleStore from '@/stores/localeStore';
import useAvatarStore from '@/stores/avatarStore';
import useLightconeStore from '@/stores/lightconeStore';
import useRelicStore from '@/stores/relicStore';
import Image from 'next/image';
import ParseText from '../parseText';


export default function ProfileCard({ profile, selectedProfile, onProfileToggle }: { profile: AvatarProfileCardType, selectedProfile: AvatarProfileCardType[], onProfileToggle: (profileId: AvatarProfileCardType) => void }) {
    const isSelected = selectedProfile.some((selectedProfile) => selectedProfile.key === profile.key);
    const { mapLightconeInfo } = useLightconeStore();
    const { locale } = useLocaleStore();

    return (
        <div
            className={`bg-base-200/60 rounded-xl p-4 border cursor-pointer transition-all duration-200 ${isSelected
                ? 'border-blue-400 ring-2 ring-blue-400/50'
                : 'border-base-300/50 hover:border-base-300 opacity-75'
                }`}

            onClick={() => onProfileToggle(profile)}
        >
            {/* Light Cone */}
            {profile.lightcone && (
                <div className="">
                    <div className="rounded-lg h-42 flex items-center justify-center">
                        <img
                            src={`https://api.hakush.in/hsr/UI/lightconemediumicon/${profile.lightcone.item_id}.webp`}
                            alt={mapLightconeInfo[profile.lightcone.item_id.toString()]?.Name}
                            className="w-full h-full object-contain rounded-lg"
                        />

                    </div>
                    <div className="w-full h-full rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-lg font-bold">
                                <ParseText
                                    text={mapLightconeInfo[profile.lightcone.item_id.toString()]?.Name}
                                    locale={locale}
                                />
                            </div>
                            <div className="text-base mb-1">Lv.{profile.lightcone.level}  S{profile.lightcone.rank}</div>
                        </div>
                    </div>
                </div>
            )}

            {Object.keys(profile.relics).length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                    {Object.entries(profile.relics).map(([key, relic], index) => (
                        <div key={index} className="relative">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center border border-amber-500/50">
                                <Image
                                    src={`https://api.hakush.in/hsr/UI/relicfigures/IconRelic_${relic.relic_set_id}_${relic.relic_id.toString()[relic.relic_id.toString().length - 1]}.webp`}
                                    alt="Relic"
                                    width={124}
                                    height={124}
                                    className="w-14 h-14 object-contain"
                                />
                            </div>
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-1 rounded">
                                +{relic.level}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};