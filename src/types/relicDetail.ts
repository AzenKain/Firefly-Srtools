export interface PartData {
    Name: string;
    Desc: string;
    Story: string;
}
  
export interface RequireBonus {
    Desc: string;
    ParamList: number[];
}
  
export interface RelicDetail {
    Name: string;
    Icon: string;
    Parts: Record<string, PartData>;
    RequireNum: Record<string, RequireBonus>;
}
  