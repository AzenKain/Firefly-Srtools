export interface EventBasicRaw {
    param?: number[];
    en: string;
    id: string;
    begin: string;
    end: string;
    live_begin: string;
    live_end: string;
    kr: string;
    cn: string;
    jp: string;
}

export interface EventBasic {
    param?: number[];
    id: string;
    begin: string;
    end: string;
    live_begin: string;
    live_end: string;
    lang: Map<string, string>;
}

