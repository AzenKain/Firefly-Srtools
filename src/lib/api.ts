
import { CharacterBasic, CharacterBasicRaw } from "@/types/characterBasic";
import { AffixDetail, CharacterDetail, ConfigMaze, EnkaResponse, FreeSRJson, LightConeBasic, LightConeBasicRaw, LightConeDetail, PSResponse, RelicBasic, RelicBasicEffect, RelicBasicRaw, RelicDetail } from "@/types";
import axios from 'axios';
import { convertAvatar, convertLightcone, convertRelicSet } from "@/helper";
import { psResponseSchema } from "@/zod";

export async function getConfigMazeApi(): Promise<ConfigMaze> {
    try {
        const res = await axios.get<ConfigMaze>(
            `/api/config-maze`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return res.data as ConfigMaze;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log(`Error: ${error.response?.status} - ${error.message}`);
        } else {
            console.log(`Unexpected error: ${String(error)}`);
        }
        return {
            Avatar: {},
            MOC: {},
            AS: {},
            PF: {},
        };
    }
}

export async function getMainAffixApi(): Promise<Record<string, Record<string, AffixDetail>>> {
    try {
        const res = await axios.get<Record<string, Record<string, AffixDetail>>>(
            `/api/main-affixes`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return res.data as Record<string, Record<string, AffixDetail>>;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log(`Error: ${error.response?.status} - ${error.message}`);
        } else {
            console.log(`Unexpected error: ${String(error)}`);
        }
        return {};
    }
}

export async function getSubAffixApi(): Promise<Record<string, Record<string, AffixDetail>>> {
    try {
        const res = await axios.get<Record<string, Record<string, AffixDetail>>>(
            `/api/sub-affixes`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return res.data as Record<string, Record<string, AffixDetail>>;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log(`Error: ${error.response?.status} - ${error.message}`);
        } else {
            console.log(`Unexpected error: ${String(error)}`);
        }
        return {};
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

export async function fetchCharacterByIdNative(id: string, locale: string): Promise<CharacterDetail | null> {
    try {
        const res = await axios.get<CharacterDetail>(`/api/${locale}/characters/${id}`);
        return res.data;
    } catch (error) {
        console.error('Failed to fetch character:', error);
        return null;
    }
}

export async function fetchCharactersByIdsNative(ids: string[], locale: string): Promise<Record<string, CharacterDetail>> {
    try {
        const res = await axios.post<Record<string, CharacterDetail>>(`/api/${locale}/characters`, { charIds: ids });
        return res.data;
    } catch (error) {
        console.error('Failed to fetch characters:', error);
        return {};
    }
}

export async function fetchLightconeByIdNative(id: string, locale: string): Promise<LightConeDetail | null> {
    try {
        const res = await axios.get<LightConeDetail>(`/api/${locale}/lightcones/${id}`);
        return res.data;
    } catch (error) {
        console.error('Failed to fetch lightcone:', error);
        return null;
    }
}

export async function fetchLightconesByIdsNative(ids: string[], locale: string): Promise<Record<string, LightConeDetail>> {
    try {
        const res = await axios.post<Record<string, LightConeDetail>>(`/api/${locale}/lightcones`, { lightconeIds: ids });
        return res.data;
    } catch (error) {
        console.error('Failed to fetch lightcones:', error);
        return {};
    }
}

export async function fetchRelicByIdNative(id: string, locale: string): Promise<RelicDetail | null> {
    try {
        const res = await axios.get<RelicDetail>(`/api/${locale}/relics/${id}`);
        return res.data;
    } catch (error) {
        console.error('Failed to fetch relic:', error);
        return null;
    }
}

export async function fetchRelicsByIdsNative(ids: string[], locale: string): Promise<Record<string, RelicDetail>> {
    try {
        const res = await axios.post<Record<string, RelicDetail>>(`/api/${locale}/relics`, { relicIds: ids });
        return res.data;
    } catch (error) {
        console.error('Failed to fetch relics:', error);
        return {};
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

export async function SendDataToServer(username: string, password: string, serverUrl: string, data: FreeSRJson | null): Promise<PSResponse | string> {
    try {
        const response = await axios.post(`${serverUrl}`, { username, password, data })
        const parsed = psResponseSchema.safeParse(response.data)
        if (!parsed.success) {
            return "Invalid response schema";
        }
        return parsed.data;
    } catch (error: any) {
        return error?.message || "Unknown error";
    }
}

export async function SendDataThroughProxy({data}: {data: any}) {
    try {
        const response = await axios.post(`/api/proxy`, { ...data })
        return response.data;
    } catch (error: any) {
        return error;
    }
}