export function replaceByParam(desc: string, params: number[]): string {
    desc = desc.replace(/<color=#[0-9a-fA-F]{8}>(.*?)<\/color>/g, (match, inner) => {
        const colorCode = match.match(/#[0-9a-fA-F]{8}/)?.[0] ?? "#ffffff";
        const processed = inner.replace(/#(\d+)\[i\](%)?/g, (_: string, index: string, percent: string | undefined) => {
            const i = parseInt(index, 10) - 1;
            const value = params[i];
            if (value === undefined) return "";
            return percent ? `${(value * 100).toFixed(0)}%` : `${value}`;
        }).replace(/<unbreak>(.*?)<\/unbreak>/g, "$1");

        return `<span style="color:${colorCode}">${processed}</span>`;
    });

    desc = desc.replace(/<unbreak>#(\d+)\[i\](%)?<\/unbreak>/g, (_: string, index: string, percent: string | undefined) => {
        const i = parseInt(index, 10) - 1;
        const value = params[i];
        if (value === undefined) return "";
        return percent ? `${(value * 100).toFixed(0)}%` : `${value}`;
    });

    desc = desc.replace(/<unbreak>(\d+)<\/unbreak>/g, (_, number) => number);

    desc = desc.replaceAll("\\n", "<br></br>");

    return desc;
}
