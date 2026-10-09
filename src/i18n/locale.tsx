import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { loadLocale, localeStorageKey, type Locale, type Localized } from './messages'
import { applySiteMeta } from './meta'
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
    applySiteMeta(locale)
  }, [locale])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: <T,>(item: Localized<T>) => (locale === 'en' ? item.en : item.zh),
    }),
    [locale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
