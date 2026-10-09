import { createContext } from 'react'
import type { Locale, Localized } from './messages'

export type LocaleContextValue = {
  locale: Locale
  setLocale: (next: Locale) => void
  /**
   * 取当前语言的值：`t({ zh: '中文', en: 'English' })`。
   * 值可以是函数，用于带数字/量词的文案：`t({ zh: (n) => `${n} 张票`, en: (n) => plural(n, 'ticket', 'tickets') })(2)`。
   */
  t: <T>(value: Localized<T>) => T
}

// 组件与 hook 分文件存放，避免 react-refresh 的「只导出组件」约束。
export const LocaleContext = createContext<LocaleContextValue>({
  locale: 'zh',
  setLocale: () => undefined,
  t: (value) => value.zh,
})
