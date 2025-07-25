import MocBar from "./moc";
import useUserDataStore from "@/stores/userDataStore";
import PfBar from "./pf";
import Image from "next/image";
import AsBar from "./as";
import { useTranslations } from "next-intl";
import CeBar from "./ce";

export default function MonsterBar() {
    const { battle_type, setBattleType } = useUserDataStore()
    const transI18n = useTranslations("DataPage")

    const navItems = [
        { name: transI18n("memoryOfChaos"), icon: 'AbyssIcon01', value: 'MOC' },
        { name: transI18n("pureFiction"), icon: 'ChallengeStory', value: 'PF' },
        { name: transI18n("apocalypticShadow"), icon: 'ChallengeBoss', value: 'AS' },
        { name: transI18n("customEnemy"), icon: 'MonsterIcon', value: 'CE' },
        { name: transI18n("simulatedUniverse"), icon: 'SimulatedUniverse', value: 'SU' },
    ];


    return (
        <div className="min-h-screen">
            {/* Header Navigation */}
            <nav className="border-b border-warning/30 relative">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center h-16">
                        {/* Navigation Tabs */}
                        <div className="flex space-x-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => setBattleType(item.value.toUpperCase())}
                                    className={`px-4 py-2 rounded-lg transition-all cursor-pointer duration-300 flex items-center space-x-2 ${battle_type.toUpperCase() === item.value.toUpperCase()
                                        ? 'bg-success/30 shadow-lg'
                                        : 'bg-base-200/20 hover:bg-base-200/40 '
                                        }`}
                                >
                                    <span
                                        style={
                                            battle_type.toUpperCase() === item.value.toUpperCase()
                                                ? {
                                                    filter:
                                                        'brightness(0) saturate(100%) invert(63%) sepia(78%) saturate(643%) hue-rotate(1deg) brightness(93%) contrast(89%)',
                                                }
                                                : undefined
                                        }
                                    >
                                        <Image src={`/icon/${item.icon}.webp`} alt={item.name} width={24} height={24} />
                                    </span>
                                    <span
                                        style={
                                            battle_type.toUpperCase() === item.value.toUpperCase()
                                                ? {
                                                    filter:
                                                        'brightness(0) saturate(100%) invert(63%) sepia(78%) saturate(643%) hue-rotate(1deg) brightness(93%) contrast(89%)',
                                                }
                                                : undefined
                                        }
                                    >
                                        <span className="font-medium">{item.name}</span>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            {(battle_type.toUpperCase() === "DEFAULT" || battle_type.toUpperCase() === "") && (
                <div className="container mx-auto px-4 py-8 text-center font-bold text-3xl">
                    {transI18n("noEventSelected")}
                </div>
            )}
            {battle_type.toUpperCase() === 'MOC' && <MocBar />}
            {battle_type.toUpperCase() === 'PF' && <PfBar />}
            {battle_type.toUpperCase() === 'AS' && <AsBar />}
            {battle_type.toUpperCase() === 'CE' && <CeBar />}
            {battle_type.toUpperCase() === 'SU' && (
                <div className="container mx-auto px-4 py-8 text-center font-bold text-3xl">
                   {transI18n("comingSoon")}
                </div>
            )}

        </div>
    )
}