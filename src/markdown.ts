import {marked} from "marked";

export const from_markdown = (source: string): string => marked.parse(source, { async: false }) as string;
