import { useEffect, useState, type ReactNode } from 'react'
import { loadLocale, localeStorageKey, type Locale } from './messages'
import { LocaleContext } from './context'

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(loadLocale)

  useEffect(() => {
    try {
      localStorage.setItem(localeStorageKey, locale)
    } catch {
      // 本地存储不可用时只在本次会话内生效。
    }
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN'
  }, [locale])

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: (value) => (locale === 'en' ? value.en : value.zh) }}>
      {children}
    </LocaleContext.Provider>
  )
}
