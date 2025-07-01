import { LightconeStore, RelicStore } from "./mics";

export interface CharacterInfoCardType {
    key: number;
    avatar_id: number;
    rank: number;
    level: number;
    lightcone: {
        level: number;
        rank: number;
        item_id: number;
    };
    relics: {
        level: number;
        relic_id: number;
        relic_set_id: number;
    }[];
}

export interface AvatarProfileCardType {
    key: number;
    profile_name: string,
    lightcone: LightconeStore | null,
    relics: Record<string, RelicStore>
}