import fs from 'fs';
import path from 'path';
import { PFDetail } from '@/types';
import { getPFEventInfoApi } from '../api';

const DATA_DIR = path.join(process.cwd(), 'data');
const pfFileCache: Record<string, Record<string, PFDetail>> = {};
export let pfMap: Record<string, PFDetail> = {};

function getJsonFilePath(locale: string): string {
  return path.join(DATA_DIR, `pf.${locale}.json`);
}

function loadFromFileIfExists(locale: string): Record<string, PFDetail> | null {
  if (pfFileCache[locale]) return pfFileCache[locale];

  const filePath = getJsonFilePath(locale);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Record<string, PFDetail>;
    pfFileCache[locale] = data;
    return data;
  }
  return null;
}

export async function loadPF(charIds: string[], locale: string): Promise<Record<string, PFDetail>> {
  const fileData = loadFromFileIfExists(locale);
  const fileIds = fileData ? Object.keys(fileData) : [];

  if (fileData && charIds.every(id => fileIds.includes(id))) {
    pfMap = fileData;
    return pfMap;
  }

  const result: Record<string, PFDetail> = {};

  await Promise.all(
    charIds.map(async id => {
      const info = await getPFEventInfoApi(Number(id), locale);
      if (info) result[id] = info;
    })
  );

  fs.mkdirSync(DATA_DIR, { recursive: true });
  const filePath = getJsonFilePath(locale);
  fs.writeFileSync(filePath, JSON.stringify(result, null, 2), 'utf-8');

  pfFileCache[locale] = result;
  pfMap = result;
  return result;
}
