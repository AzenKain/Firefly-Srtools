import { ConfigMaze } from "@/types";
import fs from 'fs';
import path from "path";

const DATA_DIR = path.join(process.cwd(), 'data');

export let configMazeMap: Record<string, ConfigMaze> = {};

function loadFromFileIfExists(): Record<string, ConfigMaze> | null {
  const filePath = path.join(DATA_DIR, 'config_maze.json');
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Record<string, ConfigMaze>;
    configMazeMap = data;
    return data;
  }
  return null;
}

export async function loadConfigMaze(): Promise<Record<string, ConfigMaze>> {
    if (Object.keys(configMazeMap).length > 0) return configMazeMap;
    const fileData = loadFromFileIfExists();
    return fileData || {};
}
