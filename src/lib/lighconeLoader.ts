import fs from 'fs';
import path from 'path';
import { getLightconeInfoApi } from './api';
import { LightConeDetail } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const lightconeFileCache: Record<string, Record<string, LightConeDetail>> = {};
export let lightconeMap: Record<string, LightConeDetail> = {};

function getJsonFilePath(locale: string): string {
  return path.join(DATA_DIR, `lightcones.${locale}.json`);
}

function loadLightconeFromFileIfExists(locale: string): Record<string, LightConeDetail> | null {
  if (lightconeFileCache[locale]) return lightconeFileCache[locale];

  const filePath = getJsonFilePath(locale);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Record<string, LightConeDetail>;
    lightconeFileCache[locale] = data;
    return data;
  }
  return null;
}

export async function loadLightcones(charIds: string[], locale: string): Promise<Record<string, LightConeDetail>> {
  const fileData = loadLightconeFromFileIfExists(locale);
  const fileIds = fileData ? Object.keys(fileData) : [];

  if (fileData && charIds.every(id => fileIds.includes(id))) {
    lightconeMap = fileData;
    return lightconeMap;
  }

  const result: Record<string, LightConeDetail> = {};

  await Promise.all(
    charIds.map(async id => {
      const info = await getLightconeInfoApi(Number(id), locale);
      if (info) result[id] = info;
    })
  );

  fs.mkdirSync(DATA_DIR, { recursive: true });
  const filePath = getJsonFilePath(locale);
  fs.writeFileSync(filePath, JSON.stringify(result, null, 2), 'utf-8');

  lightconeFileCache[locale] = result;
  lightconeMap = result;
  return result;
}
