import { CharacterBasic, CharacterBasicRaw, LightConeBasic, LightConeBasicRaw, RelicBasic, RelicBasicEffect, RelicBasicRaw } from "@/types";

export function convertRelicSet(id: string, item: RelicBasicRaw): RelicBasic {
    let lang = new Map<string, string>([
        ['en', item.en],
        ['kr', item.kr],
        ['cn', item.cn],
        ['jp', item.jp]
    ]);

    const setRelic = new Map<string, RelicBasicEffect>();

    Object.entries(item.set).forEach(([key, value]) => {
        setRelic.set(key, {
            ParamList: value.ParamList,
            lang: new Map<string, string>([
                ['en', value.en],
                ['kr', value.kr],
                ['cn', value.cn],
                ['jp', value.jp]
            ])
        });
    });

    const result: RelicBasic = {
        icon: item.icon,
        lang: lang,
        id: id,
        set: setRelic
    };

    return result;
}

export function convertLightcone(id: string, item: LightConeBasicRaw): LightConeBasic {

    let lang = new Map<string, string>([
        ['en', item.en],
        ['kr', item.kr],
        ['cn', item.cn],
        ['jp', item.jp]
    ]);
    const result: LightConeBasic = {
        rank: item.rank,
        baseType: item.baseType,
        desc: item.desc,
        lang: lang,
        id: id
    };

    return result;
}


export function convertAvatar(id: string, item: CharacterBasicRaw): CharacterBasic {

    let lang = new Map<string, string>([
        ['en', item.en],
        ['kr', item.kr],
        ['cn', item.cn],
        ['jp', item.jp]
    ]);
    let text = ""
    if (Number(id) % 2 === 0 && Number(id) > 8000) {
        text = `Female ${item.damageType} MC`
    } else if (Number(id) > 8000) {
        text = `Male ${item.damageType} MC`
    }
    if (text !== "") {
        lang.set("en", text)
        lang.set("kr", text)
        lang.set("cn", text)
        lang.set("jp", text)
    }
    const result: CharacterBasic = {
        release: item.release,
        icon: item.icon,
        rank: item.rank,
        baseType: item.baseType,
        damageType: item.damageType,
        desc: item.desc,
        lang: lang,
        id: id
    };

    return result;
}


