export interface RelicBasicRawEffect {
    en: string;
    ParamList: number[];
    kr: string;
    cn: string;
    jp: string;
}

export interface RelicBasicRaw {
    icon: string;
    en: string;
    kr: string;
    cn: string;
    jp: string;
    set: Map<string, RelicBasicRawEffect>;
}

export interface RelicBasicEffect {
    ParamList: number[];
    lang: Map<string, string>;
}

export interface RelicBasic {
    id: string;
    icon: string;
    lang: Map<string, string>;
    set: Map<string, RelicBasicEffect>;
}
