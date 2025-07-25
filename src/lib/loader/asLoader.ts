import fs from 'fs';
import path from 'path';
import { ASDetail } from '@/types';
import { getASEventInfoApi } from '../api';

const DATA_DIR = path.join(process.cwd(), 'data');
const asFileCache: Record<string, Record<string, ASDetail>> = {};
export let asMap: Record<string, ASDetail> = {};

function getJsonFilePath(locale: string): string {
  return path.join(DATA_DIR, `as.${locale}.json`);
}

function loadFromFileIfExists(locale: string): Record<string, ASDetail> | null {
  if (asFileCache[locale]) return asFileCache[locale];

  const filePath = getJsonFilePath(locale);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Record<string, ASDetail>;
    asFileCache[locale] = data;
    return data;
  }
  return null;
}

export async function loadAS(charIds: string[], locale: string): Promise<Record<string, ASDetail>> {
  const fileData = loadFromFileIfExists(locale);
  const fileIds = fileData ? Object.keys(fileData) : [];

  if (fileData && charIds.every(id => fileIds.includes(id))) {
    asMap = fileData;
    return asMap;
  }

  const result: Record<string, ASDetail> = {};

  await Promise.all(
    charIds.map(async id => {
      const info = await getASEventInfoApi(Number(id), locale);
      if (info) result[id] = info;
    })
  );

  fs.mkdirSync(DATA_DIR, { recursive: true });
  const filePath = getJsonFilePath(locale);
  fs.writeFileSync(filePath, JSON.stringify(result, null, 2), 'utf-8');

  asFileCache[locale] = result;
  asMap = result;
  return result;
}
