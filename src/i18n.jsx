import { createContext, Fragment, useCallback, useContext, useLayoutEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import en from "./locales/en.json";
import zh from "./locales/zh.json";

// Both catalogs are bundled, so switching language never waits on the network.
export const LOCALES = {
  en: { messages: en, label: "EN", tag: "en" },
  zh: { messages: zh, label: "中文", tag: "zh-CN" },
};

const STORAGE_KEY = "lang";

// A choice made on the site wins; otherwise the first supported language the browser asks for.
const detectLang = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LOCALES[saved]) return saved;
  } catch {
    // storage blocked: fall through to the browser languages
  }
  for (const l of navigator.languages ?? [navigator.language]) {
    const base = String(l).toLowerCase().split("-")[0];
    if (LOCALES[base]) return base;
  }
  return "en";
};

const lookup = (messages, key) => key.split(".").reduce((o, k) => (o == null ? o : o[k]), messages);

if (import.meta.env.DEV) {
  // Every key in en.json should exist in the other catalogs; missing ones fall back to English.
  const walk = (ref, other, path) =>
    Object.entries(ref).forEach(([k, v]) => {
      const p = path ? `${path}.${k}` : k;
      if (other?.[k] === undefined) console.warn(`[i18n] missing ${p}`);
      else if (v && typeof v === "object" && !("other" in v)) walk(v, other[k], p);
    });
  Object.entries(LOCALES).forEach(([code, { messages }]) => code !== "en" && walk(en, messages, `${code}:`));
}

// "{name}" placeholders are filled from vars. A message can be { one, other } for plurals,
// chosen by vars.count. With React elements in vars the result is a node array, else a string.
const makeT = (lang) => {
  const { messages, tag } = LOCALES[lang];
  const plural = new Intl.PluralRules(tag);
  return (key, vars) => {
    let msg = lookup(messages, key) ?? lookup(en, key);
    if (msg == null) return key;
    if (typeof msg === "object" && !Array.isArray(msg) && "other" in msg) {
      msg = msg[plural.select(vars?.count ?? 0)] ?? msg.other;
    }
    if (typeof msg !== "string" || !vars) return msg;
    const parts = msg.split(/\{(\w+)\}/).map((p, i) => (i % 2 ? vars[p] ?? `{${p}}` : p));
    if (parts.every((p) => typeof p === "string" || typeof p === "number")) return parts.join("");
    return parts.map((p, i) => <Fragment key={i}>{p}</Fragment>);
  };
};

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(detectLang);
  const t = useMemo(() => makeT(lang), [lang]);

  // Runs inside the view-transition update, so the new snapshot already has the right :lang() styles.
  useLayoutEffect(() => {
    document.documentElement.lang = LOCALES[lang].tag;
  }, [lang]);

  const setLang = useCallback(
    (next) => {
      if (next === lang || !LOCALES[next]) return;
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // storage blocked: the switch still works for this visit
      }
      const apply = () => flushSync(() => setLangState(next));
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!document.startViewTransition || reduce) return apply();
      const root = document.documentElement;
      root.dataset.vt = "lang";
      document.startViewTransition(apply).finished.finally(() => delete root.dataset.vt);
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t, tag: LOCALES[lang].tag }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
