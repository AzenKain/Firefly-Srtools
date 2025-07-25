import { convertAvatar, convertEvent, convertLightcone, convertMonster, convertRelicSet } from "@/helper";
import { ASDetail, CharacterBasic, CharacterBasicRaw, CharacterDetail, EventBasic, EventBasicRaw, LightConeBasic, LightConeBasicRaw, LightConeDetail, MocDetail, MonsterBasic, MonsterBasicRaw, MonsterDetail, PFDetail, RelicBasic, RelicBasicRaw, RelicDetail } from "@/types";
import axios from "axios";

export async function getLightconeInfoApi(lightconeId: number, locale: string): Promise<LightConeDetail | null> {
    try {
        const res = await axios.get<LightConeDetail>(
            `https://api.hakush.in/hsr/data/${locale}/lightcone/${lightconeId}.json`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return res.data as LightConeDetail;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log(`Error: ${error.response?.status} - ${error.message}`);
        } else {
            console.log(`Unexpected error: ${String(error)}`);
        }
        return null;
    }
}

export async function getRelicInfoApi(relicId: number, locale: string): Promise<RelicDetail | null> {
    try {
        const res = await axios.get<RelicDetail>(
            `https://api.hakush.in/hsr/data/${locale}/relicset/${relicId}.json`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return res.data as RelicDetail;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log(`Error: ${error.response?.status} - ${error.message}`);
        } else {
            console.log(`Unexpected error: ${String(error)}`);
        }
        return null;
    }
}

export async function getCharacterInfoApi(avatarId: number, locale: string): Promise<CharacterDetail | null> {
    try {
        const res = await axios.get<CharacterDetail>(
            `https://api.hakush.in/hsr/data/${locale}/character/${avatarId}.json`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return res.data as CharacterDetail;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log(`Error: ${error.response?.status} - ${error.message}`);
        } else {
            console.log(`Unexpected error: ${String(error)}`);
        }
        return null;
    }
}

export async function getMOCEventInfoApi(eventId: number, locale: string): Promise<MocDetail[] | null> {
    try {
        const res = await axios.get<MocDetail[]>(
            `https://api.hakush.in/hsr/data/${locale}/maze/${eventId}.json`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return res.data as MocDetail[];
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log(`Error: ${error.response?.status} - ${error.message}`);
        } else {
            console.log(`Unexpected error: ${String(error)}`);
        }
        return null;
    }
}

export async function getASEventInfoApi(eventId: number, locale: string): Promise<ASDetail | null> {
    try {
        const res = await axios.get<ASDetail>(
            `https://api.hakush.in/hsr/data/${locale}/boss/${eventId}.json`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return res.data as ASDetail;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log(`Error: ${error.response?.status} - ${error.message}`);
        } else {
            console.log(`Unexpected error: ${String(error)}`);
        }
        return null;
    }
}

export async function getPFEventInfoApi(eventId: number, locale: string): Promise<PFDetail | null> {
    try {
        const res = await axios.get<PFDetail>(
            `https://api.hakush.in/hsr/data/${locale}/story/${eventId}.json`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return res.data as PFDetail;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log(`Error: ${error.response?.status} - ${error.message}`);
        } else {
            console.log(`Unexpected error: ${String(error)}`);
        }
        return null;
    }
}

export async function getCharacterListApi(): Promise<CharacterBasic[]> {
    try {
        const res = await axios.get<Record<string, CharacterBasicRaw>>(
            'https://api.hakush.in/hsr/data/character.json',
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = new Map(Object.entries(res.data));

        return Array.from(data.entries()).map(([id, it]) => convertAvatar(id, it));
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log(`Error: ${error.response?.status} - ${error.message}`);
        } else {
            console.log(`Unexpected error: ${String(error)}`);
        }
        return [];
    }
}

export async function getLightconeListApi(): Promise<LightConeBasic[]> {
    try {
        const res = await axios.get<Record<string, LightConeBasicRaw>>(
            'https://api.hakush.in/hsr/data/lightcone.json',
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = new Map(Object.entries(res.data));

        return Array.from(data.entries()).map(([id, it]) => convertLightcone(id, it));
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log(`Error: ${error.response?.status} - ${error.message}`);
        } else {
            console.log(`Unexpected error: ${String(error)}`);
        }
        return [];
    }
}

export async function getRelicSetListApi(): Promise<RelicBasic[]> {
    try {
        const res = await axios.get<Record<string, RelicBasicRaw>>(
            'https://api.hakush.in/hsr/data/relicset.json',
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = new Map(Object.entries(res.data));

        return Array.from(data.entries()).map(([id, it]) => convertRelicSet(id, it));
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log(`Error: ${error.response?.status} - ${error.message}`);
        } else {
            console.log(`Unexpected error: ${String(error)}`);
        }
        return [];
    }
}

export async function getMOCEventListApi(): Promise<EventBasic[]> {
    try {
        const res = await axios.get<Record<string, EventBasicRaw>>(
            'https://api.hakush.in/hsr/data/maze.json',
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = new Map(Object.entries(res.data));

        return Array.from(data.entries()).map(([id, it]) => convertEvent(id, it));
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log(`Error: ${error.response?.status} - ${error.message}`);
        } else {
            console.log(`Unexpected error: ${String(error)}`);
        }
        return [];
    }
}

export async function getASEventListApi(): Promise<EventBasic[]> {
    try {
        const res = await axios.get<Record<string, EventBasicRaw>>(
            'https://api.hakush.in/hsr/data/maze_boss.json',
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = new Map(Object.entries(res.data));

        return Array.from(data.entries()).map(([id, it]) => convertEvent(id, it));
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log(`Error: ${error.response?.status} - ${error.message}`);
        } else {
            console.log(`Unexpected error: ${String(error)}`);
        }
        return [];
    }
}

export async function getPFEventListApi(): Promise<EventBasic[]> {
    try {
        const res = await axios.get<Record<string, EventBasicRaw>>(
            'https://api.hakush.in/hsr/data/maze_extra.json',
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = new Map(Object.entries(res.data));

        return Array.from(data.entries()).map(([id, it]) => convertEvent(id, it));
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log(`Error: ${error.response?.status} - ${error.message}`);
        } else {
            console.log(`Unexpected error: ${String(error)}`);
        }
        return [];
    }
}

export async function getMonsterListApi(): Promise<{list: MonsterBasic[], map: Record<string, MonsterBasic>}> {
    try {
        const res = await axios.get<Record<string, MonsterBasicRaw>>(
            'https://api.hakush.in/hsr/data/monster.json',
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const dataArr = Array.from(Object.entries(res.data)).map(([id, it]) => convertMonster(id, it));
        const dataMap = Object.fromEntries(Object.entries(res.data).map(([id, it]) => [id, convertMonster(id, it)]));

        return {
            list: dataArr, 
            map: dataMap
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log(`Error: ${error.response?.status} - ${error.message}`);
        } else {
            console.log(`Unexpected error: ${String(error)}`);
        }
        return {list: [], map: {}};
    }
}

export async function getMonsterDetailApi(): Promise<Record<string, MonsterDetail> | null> {
    try {
        const res = await axios.get<Record<string, MonsterDetail>>(
            `https://api.hakush.in/hsr/data/monstervalue.json`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return res.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log(`Error: ${error.response?.status} - ${error.message}`);
        } else {
            console.log(`Unexpected error: ${String(error)}`);
        }
        return null;
    }
}
