# Fedora-V Force Images

Board image downloads for Fedora-V Force (RISC-V / ARM). Vite + React SPA, deployed as
static files.

## i18n

- UI copy lives in `src/locales/{en,zh}.json`; `t()` comes from `src/i18n.jsx`.
- The language is picked from `localStorage.lang`, then `navigator.languages`, then English;
  the header switch changes it in place (no reload, view-transition fade).
- Board names, SoCs, changelogs and the markdown docs under `src/md/` are upstream data and
  are not translated.

## Chip vendor names

Chip vendors get a Chinese name where one exists (`src/vendors.jsx`), shown as
"赛昉科技 StarFive" in the zh locale and plain English otherwise. Only verified names are
listed — unknown vendors fall back to the API string. Search matches both scripts. Board
vendors in card subtitles (Milk-V, Shenzhen RongDa, …) are left as-is.
