import { listCurrentLanguage } from "@/lib/constant";
import { CharacterBasic, EventBasic, LightConeBasic, MonsterBasic } from "@/types";


export function getNameChar(locale: string, data: CharacterBasic | undefined): string {
    if (!data) {
        return ""
    }
    if (!listCurrentLanguage.hasOwnProperty(locale)) {
        return ""
    }

    let text = data.lang.get(listCurrentLanguage[locale as keyof typeof listCurrentLanguage].toLowerCase()) ?? "";
    if (!text) {
        text = data.lang.get("en") ?? "";
    }
    if (Number(data.id) % 2 === 0 && Number(data.id) > 8000) {
        text = `Female ${data.damageType} MC`
    } else if (Number(data.id) > 8000) {
        text = `Male ${data.damageType} MC`
    }
    return text
}

export function getLocaleName(locale: string, data: LightConeBasic | EventBasic | MonsterBasic | undefined): string {
    if (!data) {
        return ""
    }
    if (!listCurrentLanguage.hasOwnProperty(locale)) {
        return ""
    }

    let text = data.lang.get(listCurrentLanguage[locale as keyof typeof listCurrentLanguage].toLowerCase()) ?? "";
    if (!text) {
        text = data.lang.get("en") ?? "";
    }
    return text
}

export function parseRuby(text: string): string {
    const rubyRegex = /\{RUBY_B#(.*?)\}(.*?)\{RUBY_E#\}/gs;
    return text.replace(rubyRegex, (_match, furigana, kanji) => {
        return `<ruby>${kanji}<rt>${furigana}</rt></ruby>`;
    });
}