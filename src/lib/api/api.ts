/* eslint-disable @typescript-eslint/no-explicit-any */

import { AffixDetail, ASDetail, CharacterDetail, ConfigMaze, FreeSRJson, LightConeDetail, MocDetail, PFDetail, PSResponse, RelicDetail } from "@/types";
import axios from 'axios';
import { pSResponseSchema } from "@/zod";

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
            Stage: {},
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

export async function fetchASByIdsNative(ids: string[], locale: string): Promise<Record<string, ASDetail> | null> {
    try {
        const res = await axios.post<Record<string, ASDetail>>(`/api/${locale}/as`, { asIds: ids });
        return res.data;
    } catch (error) {
        console.error('Failed to fetch AS:', error);
        return null;
    }
}

export async function fetchASByIdNative(ids: string, locale: string): Promise<ASDetail | null> {
    try {
        const res = await axios.get<ASDetail>(`/api/${locale}/as/${ids}`);
        return res.data;
    } catch (error) {
        console.error('Failed to fetch AS:', error);
        return null;
    }
}

export async function fetchPFByIdsNative(ids: string[], locale: string): Promise<Record<string, PFDetail> | null> {
    try {
        const res = await axios.post<Record<string, PFDetail>>(`/api/${locale}/pf`, { pfIds: ids });
        return res.data;
    } catch (error) {
        console.error('Failed to fetch PF:', error);
        return null;
    }
}

export async function fetchPFByIdNative(ids: string, locale: string): Promise<PFDetail | null> {
    try {
        const res = await axios.get<PFDetail>(`/api/${locale}/pf/${ids}`);
        return res.data;
    } catch (error) {
        console.error('Failed to fetch PF:', error);
        return null;
    }
}


export async function fetchMOCByIdsNative(ids: string[], locale: string): Promise<Record<string, MocDetail[]> | null> {
    try {
        const res = await axios.post<Record<string, MocDetail[]>>(`/api/${locale}/moc`, { mocIds: ids });
        return res.data;
    } catch (error) {
        console.error('Failed to fetch MOC:', error);
        return null;
    }
}

export async function fetchMOCByIdNative(ids: string, locale: string): Promise<MocDetail[] | null> {
    try {
        const res = await axios.get<MocDetail[]>(`/api/${locale}/moc/${ids}`);
        return res.data;
    } catch (error) {
        console.error('Failed to fetch MOC:', error);
        return null;
    }
}

export async function SendDataToServer(username: string, password: string, serverUrl: string, data: FreeSRJson | null): Promise<PSResponse | string> {
    try {
        const response = await axios.post(`${serverUrl}`, { username, password, data })
        const parsed = pSResponseSchema.safeParse(response.data)
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