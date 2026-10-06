import type { Config } from "tailwindcss";
export default { content:["./app/**/*.tsx","./components/**/*.tsx"],
theme:{extend:{colors:{ink:"var(--ink)",cream:"var(--cream)",brand:"var(--brand)",accent:"var(--accent)"},fontFamily:{serif:["Georgia","Times New Roman","serif"]}}},plugins:[]} satisfies Config;
