import type { Locale, Localized } from './messages'

/** 取当前语言的值。 */
export function pick<T>(locale: Locale, value: Localized<T>): T {
  return locale === 'en' ? value.en : value.zh
}

/** 解析后的类型：把 `{ zh, en }` 叶子换成单语值。 */
export type Resolved<T> = T extends Localized<infer U>
  ? Resolved<U>
  : T extends readonly (infer U)[]
    ? Resolved<U>[]
    : T extends object
      ? { [K in keyof T]: Resolved<T[K]> }
      : T

// 恰好只有 zh / en 两个键的对象视为双语内容。数据模块里没有别的对象用这两个键。
function isLocalized(value: unknown): value is Localized<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value as object).length === 2 &&
    'zh' in (value as object) &&
    'en' in (value as object)
  )
}

/**
 * 递归把数据模块里的 `{ zh, en }` 叶子解析成单语值，得到一份只含当前语言的数据树。
 * 数据模块（`src/data/*`）保持单一数据源，视图拿到的对象已经是单语，渲染时不必再判断语言。
 */
export function localizeDeep<T>(value: T, locale: Locale): Resolved<T> {
  if (isLocalized(value)) return localizeDeep(pick(locale, value), locale) as Resolved<T>
  if (Array.isArray(value)) return value.map((item) => localizeDeep(item, locale)) as Resolved<T>
  if (value && typeof value === 'object') {
    const source = value as Record<string, unknown>
    const next: Record<string, unknown> = {}
    for (const key of Object.keys(source)) next[key] = localizeDeep(source[key], locale)
    return next as Resolved<T>
  }
  return value as Resolved<T>
}
