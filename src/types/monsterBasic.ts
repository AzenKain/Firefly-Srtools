export interface MonsterBasicRaw {
    rank: string;
    camp: string | null;
    icon: string;
    child: number[];
    weak: string[];
    en: string;
    desc: string;
    kr: string;
    cn: string;
    jp: string;
}

export interface MonsterBasic {
    id: string;
    rank: string;
    camp: string | null;
    icon: string;
    child: number[];
    weak: string[];
    desc: string;
    lang: Map<string, string>;  
}


