import { useMemo } from 'react'
import { localizeDeep, type Resolved } from './localize'
import { useLocale } from './use-locale'

/**
 * 把数据模块里的 `{ zh, en }` 叶子按当前语言解析一次。
 * `value` 是模块级常量时引用稳定，只在切换语言时重新计算。
 */
export function useLocalized<T>(value: T): Resolved<T> {
  const { locale } = useLocale()
  return useMemo(() => localizeDeep(value, locale), [value, locale])
}
