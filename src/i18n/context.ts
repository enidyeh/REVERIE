import { createContext } from 'react'
import type { Locale, Localized } from './messages'

export type LocaleContextValue = {
  locale: Locale
  setLocale: (next: Locale) => void
  /** 取当前语言的值：`t({ zh: '中文', en: 'English' })`。 */
  t: (value: Localized) => string
}

// 组件与 hook 分文件存放，避免 react-refresh 的「只导出组件」约束。
export const LocaleContext = createContext<LocaleContextValue>({
  locale: 'zh',
  setLocale: () => undefined,
  t: (value) => value.zh,
})
