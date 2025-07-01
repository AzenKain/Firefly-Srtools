import useLocaleStore from "@/stores/localeStore";
import useUserDataStore from "@/stores/userDataStore";
import Image from "next/image";
import { useMemo } from "react";

interface RelicCardProps {
    slot: string
    avatarId: string
}
const getRarityColor = (rarity: string) => {
    switch (rarity) {
        case '3': return 'border-green-500 shadow-green-500/50 bg-gradient-to-br from-green-700 via-green-400 to-green-500';
        case '4': return 'border-blue-500 shadow-blue-500/50 bg-gradient-to-br from-blue-700 via-blue-400 to-blue-500';
        case '5': return 'border-purple-500 shadow-purple-500/50 bg-gradient-to-br from-purple-700 via-purple-400 to-purple-500';
        case '6': return 'border-yellow-500 shadow-yellow-500/50 bg-gradient-to-br from-yellow-700 via-yellow-400 to-yellow-500';
        default: return 'border-gray-500 shadow-gray-500/50';
    }
};
const getRarityName = (slot: string) => {
    switch (slot) {
        case '1': return (
            <div className="flex items-center gap-1">
                <Image src="/relics/HEAD.png" alt="Head" width={20} height={20} />
                <h2>Head</h2>
            </div>
        );
        case '2': return (
            <div className="flex items-center gap-1">
                <Image src="/relics/HAND.png" alt="Head" width={20} height={20} />
                <h2>Hands</h2>
            </div>
        );
        case '3': return (
            <div className="flex items-center gap-1">
                <Image src="/relics/BODY.png" alt="Head" width={20} height={20} />
                <h2>Body</h2>
            </div>
        );
        case '4': return (
            <div className="flex items-center gap-1">
                <Image src="/relics/FOOT.png" alt="Head" width={20} height={20} />
                <h2>Feet</h2>
            </div>
        );
        case '5': return (
            <div className="flex items-center gap-1">
                <Image src="/relics/OBJECT.png" alt="Head" width={20} height={20} />
                <h2>Planar sphere</h2>
            </div>
        );
        case '6': return (
            <div className="flex items-center gap-1">
                <Image src="/relics/NECK.png" alt="Head" width={20} height={20} />
                <h2>Link rope</h2>
            </div>
        );
        default: return '';
    }
};
export default function RelicCard({ slot, avatarId }: RelicCardProps) {
    const { locale } = useLocaleStore();
    const { avatars } = useUserDataStore()

    const relicDetail = useMemo(() => {
        const avatar = avatars[avatarId];
        if (avatar) {
            if (avatar.profileList[avatar.profileSelect].relics[slot]) {
                return avatar.profileList[avatar.profileSelect].relics[slot];
            }
            return null;
        }
        return null;
    }, [avatars, avatarId, slot]);

    return (
        <div>
            {relicDetail ? (
                <div
                    className="flex flex-col items-center cursor-pointer">
                    <div
                        className={`
                              relative w-24 h-24 rounded-full border-4 
                              ${getRarityColor(relicDetail.relic_id.toString()[0])}
                              shadow-xl
                              flex items-center justify-center
                              cursor-pointer hover:scale-105 transition-transform
                              ring-4 ring-primary
                            `}
                    >
                        <span>
                            <Image
                                src={`https://api.hakush.in/hsr/UI/relicfigures/IconRelic_${relicDetail.relic_set_id}_${slot}.webp`}
                                alt="Relic"
                                width={124}
                                height={124}
                                className="w-14 h-14 object-contain"
                            />
                        </span>

                        {/* Level Badge */}
                        <div className="absolute -bottom-2 bg-base-100 border-2 border-base-300 rounded-full px-2 py-1">
                            <span className="text-sm font-bold text-primary">+{relicDetail.level}</span>
                        </div>
                    </div>

                    <div className="mt-3 text-center">
                        <div className="text-sm font-medium text-base-content">{getRarityName(slot)}</div>
                    </div>
                </div>
            ) : (
                <div
                    className="flex flex-col items-center cursor-pointer">
                    <div
                        className={`
                              relative w-24 h-24 rounded-full border-4 
                              ${getRarityColor("None")}
                              bg-base-300 shadow-xl
                              flex items-center justify-center
                              cursor-pointer hover:scale-105 transition-transform
                              ring-4 ring-primary
                            `}
                    >
                        <span className="text-3xl">
                            <svg className="w-12 h-12 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </span>

                        {/* Level Badge */}
                        <div className="absolute -bottom-2 bg-base-100 border-2 border-base-300 rounded-full px-2 py-1">
                            <span className="text-sm font-bold text-primary">+{0}</span>
                        </div>
                    </div>

                    <div className="mt-3 text-center">
                        <div>{getRarityName(slot)}</div>
                    </div>
                </div>
            )}

        </div>
    )
}