import { AffixDetail } from '@/types';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
let mainAffixCache: Record<string, Record<string, AffixDetail>> = {};
let subAffixCache: Record<string, Record<string, AffixDetail>> = {};

const mainAffixPath = path.join(DATA_DIR, `main_affixes.json`)
const subAffixPath = path.join(DATA_DIR, `sub_affixes.json`)

function loadFromFileIfExists(filePath: string): Record<string, Record<string, AffixDetail>> {
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Record<string, Record<string, AffixDetail>>;
        return data;
    }
    return {};
}

export async function loadMainAffix(): Promise<Record<string, Record<string, AffixDetail>>> {
    if (Object.keys(mainAffixCache).length > 0) return mainAffixCache;
    const fileData = loadFromFileIfExists(mainAffixPath);
    mainAffixCache = fileData;
    return fileData;
}

export async function loadSubAffix(): Promise<Record<string, Record<string, AffixDetail>>> {
    if (Object.keys(subAffixCache).length > 0) return subAffixCache;
    const fileData = loadFromFileIfExists(subAffixPath);
    subAffixCache = fileData;
    return fileData;
}
