import fs from 'fs';
import path from 'path';
import { MocDetail } from '@/types';
import { getMOCEventInfoApi } from '../api';

const DATA_DIR = path.join(process.cwd(), 'data');
const mocFileCache: Record<string, Record<string, MocDetail[]>> = {};
export let mocMap: Record<string, MocDetail[]> = {};

function getJsonFilePath(locale: string): string {
  return path.join(DATA_DIR, `moc.${locale}.json`);
}

function loadFromFileIfExists(locale: string): Record<string, MocDetail[]> | null {
  if (mocFileCache[locale]) return mocFileCache[locale];

  const filePath = getJsonFilePath(locale);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Record<string, MocDetail[]>;
    mocFileCache[locale] = data;
    return data;
  }
  return null;
}

export async function loadMOC(charIds: string[], locale: string): Promise<Record<string, MocDetail[]>> {
  const fileData = loadFromFileIfExists(locale);
  const fileIds = fileData ? Object.keys(fileData) : [];

  if (fileData && charIds.every(id => fileIds.includes(id))) {
    mocMap = fileData;
    return mocMap;
  }

  const result: Record<string, MocDetail[]> = {};

  await Promise.all(
    charIds.map(async id => {
      const info = await getMOCEventInfoApi(Number(id), locale);
      if (info) result[id] = info;
    })
  );

  fs.mkdirSync(DATA_DIR, { recursive: true });
  const filePath = getJsonFilePath(locale);
  fs.writeFileSync(filePath, JSON.stringify(result, null, 2), 'utf-8');

  mocFileCache[locale] = result;
  mocMap = result;
  return result;
}
