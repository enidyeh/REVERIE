// 语言相关的类型与常量（与组件分开，避免 react-refresh 的「只导出组件」约束）。

// 站点语言：两个完全独立的版本。中文版保持现有的「英文眉题 + 中文正文」编辑感；
// 英文版不出现任何中文（专有名词如 REVERIE / UNSEEN BOX 除外）。
export type Locale = 'zh' | 'en'

/** 一条双语内容：中文版取 `zh`，英文版取 `en`。 */
export type Localized = { zh: string; en: string }

export const localeStorageKey = 'unseen:locale:v1'

export const locales: { id: Locale; label: string; note: string }[] = [
  { id: 'zh', label: '中文', note: 'CHINESE' },
  { id: 'en', label: 'English', note: 'ENGLISH' },
]

export function loadLocale(): Locale {
  try {
    return localStorage.getItem(localeStorageKey) === 'en' ? 'en' : 'zh'
  } catch {
    return 'zh'
  }
}
