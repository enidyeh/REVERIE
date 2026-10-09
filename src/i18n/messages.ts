// 语言相关的类型与常量（与组件分开，避免 react-refresh 的「只导出组件」约束）。

// 站点语言：两个完全独立的版本。
// 中文版：页面内的眉题与子标签一律中文，只有品牌标识（REVERIE / UNSEEN 等）与主导航保留英文。
// 英文版：不出现任何中文（专有名词 REVERIE / UNSEEN BOX / REALMVIEW 等除外）。
export type Locale = 'zh' | 'en'

/**
 * 一条双语内容：中文版取 `zh`，英文版取 `en`。
 * 值可以是字符串，也可以是带参数的函数：`{ zh: (n: number) => `${n} 张票`, en: (n: number) => plural(n, 'ticket', 'tickets') }`。
 */
export type Localized<T = string> = { zh: T; en: T }

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
