
export type ASConfigMaze = {
    buff_1: number[];
    buff_2: number[];
    maze_buff: number;
}

export type PFConfigMaze = {
    buff: number[];
    maze_buff: number;
}

export type MOCConfigMaze = {
    maze_buff: number;
}

export type AvatarConfigMaze = {
    maze_buff: number[];
}
export type StageConfigMaze = {
    stage_id: number;
    stage_type: string;
    level: number;
    monster_list: Array<Record<string, number>>;
};

export type ConfigMaze = {
    Avatar: Record<string, AvatarConfigMaze>;
    MOC: Record<string, MOCConfigMaze>;
    AS: Record<string, ASConfigMaze>;
    PF: Record<string, PFConfigMaze>;
    Stage: Record<string, StageConfigMaze>;
};

