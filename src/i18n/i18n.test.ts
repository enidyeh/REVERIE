import { describe, expect, it } from 'vitest'
import * as aboutData from '../data/about'
import * as collaborateData from '../data/collaborate'
import * as contentData from '../data/content'
import * as discoverData from '../data/discover'
import * as eventsData from '../data/events'
import * as identityData from '../data/identity'
import * as marketData from '../data/market'
import * as socialData from '../data/social'
import * as spacesData from '../data/spaces'
import * as themeData from '../data/theme'
import * as aboutCopy from './about'
import * as collaborateCopy from './collaborate'
import * as contentCopy from './content'
import * as discoverCopy from './discover'
import * as eventsCopy from './events'
import * as identityCopy from './identity'
import * as exploreCopy from './explore'
import * as homeCopy from './home'
import * as marketCopy from './market'
import * as shellCopy from './shell'
import * as spaceCopy from './space'
import * as ticketsCopy from './tickets'
import { localizeDeep, pick } from './localize'

// 中文版允许出现英文标识（REVERIE / UNSEEN / Booth 编号等）；英文侧必须完全没有中文。
const cjk = /[\u4e00-\u9fa5]/

type Pair = { path: string; zh: unknown; en: unknown }

function isLocalized(value: unknown): value is { zh: unknown; en: unknown } {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value as object).length === 2 &&
    'zh' in (value as object) &&
    'en' in (value as object)
  )
}

function collectPairs(value: unknown, path: string, found: Pair[]): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectPairs(item, `${path}[${index}]`, found))
    return
  }
  if (typeof value !== 'object' || value === null) return
  if (isLocalized(value)) {
    found.push({ path, zh: value.zh, en: value.en })
    return
  }
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) collectPairs(child, `${path}.${key}`, found)
}

function isEmpty(value: unknown): boolean {
  if (value === null) return false
  if (typeof value === 'string') return value.trim().length === 0
  if (Array.isArray(value)) return value.length === 0
  return false
}

function stringsIn(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(stringsIn)
  return []
}

const bilingualModules: [string, Record<string, unknown>][] = [
  ['theme', themeData],
  ['social', socialData],
  ['aboutData', aboutData],
  ['collaborateData', collaborateData],
  ['contentData', contentData],
  ['discoverData', discoverData],
  ['eventsData', eventsData],
  ['identityData', identityData],
  ['marketData', marketData],
  ['spacesData', spacesData],
  ['aboutCopy', aboutCopy],
  ['collaborateCopy', collaborateCopy],
  ['contentCopy', contentCopy],
  ['discoverCopy', discoverCopy],
  ['eventsCopy', eventsCopy],
  ['identityCopy', identityCopy],
  ['exploreCopy', exploreCopy],
  ['homeCopy', homeCopy],
  ['marketCopy', marketCopy],
  ['shellCopy', shellCopy],
  ['spaceCopy', spaceCopy],
  ['ticketsCopy', ticketsCopy],
]

describe('双语数据完整性', () => {
  const pairs: Pair[] = []
  for (const [, module] of bilingualModules) collectPairs(module, '', pairs)

  it('覆盖到足够多的双语条目', () => {
    expect(pairs.length).toBeGreaterThan(380)
  })

  it('每一侧要么有内容，要么明确写成 null，不能是空字符串，也不能两侧都空', () => {
    for (const pair of pairs) {
      expect(isEmpty(pair.zh), `${pair.path} 的 zh 不应是空字符串或空数组`).toBe(false)
      expect(isEmpty(pair.en), `${pair.path} 的 en 不应是空字符串或空数组`).toBe(false)
      expect(pair.zh === null && pair.en === null, `${pair.path} 两侧不能同时为空`).toBe(false)
    }
  })

  it('英文侧不出现中文', () => {
    const offenders = pairs.flatMap((pair) => stringsIn(pair.en).filter((text) => cjk.test(text)).map((text) => `${pair.path}: ${text}`))
    expect(offenders).toEqual([])
  })
})

describe('localizeDeep', () => {
  it('把嵌套的双语叶子解析成单语数据树', () => {
    const source = { title: { zh: '中文', en: 'English' }, list: [{ label: { zh: '甲', en: 'A' } }], id: 'x' }
    expect(localizeDeep(source, 'en')).toEqual({ title: 'English', list: [{ label: 'A' }], id: 'x' })
    expect(localizeDeep(source, 'zh')).toEqual({ title: '中文', list: [{ label: '甲' }], id: 'x' })
  })

  it('保留非双语的数字、布尔与 undefined', () => {
    expect(localizeDeep({ price: 29.9, open: true, missing: undefined }, 'zh')).toEqual({ price: 29.9, open: true, missing: undefined })
  })

  it('pick 返回当前语言的值', () => {
    expect(pick('en', { zh: '中', en: 'en' })).toBe('en')
    expect(pick('zh', { zh: '中', en: 'en' })).toBe('中')
  })
})
