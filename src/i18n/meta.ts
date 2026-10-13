import type { Locale, Localized } from './messages'

// 页面级元信息。静态 HTML 里保留中文（爬虫读到的就是中文），
// 浏览器内切换语言时由 LocaleProvider 按当前语言重写。
// 站点名为「异想集 REVERIE」（英文版写 REVERIE，不出现中文），分享标题与 description 都跟它一致。
export const siteMeta: { title: Localized; description: Localized; localeTag: Record<Locale, string> } = {
  title: {
    zh: '异想集 REVERIE',
    en: 'REVERIE',
  },
  description: {
    zh: '异想集 REVERIE：把灵感带到上海的真实生活里。内容与活动均为本地演示。',
    en: 'REVERIE: bringing inspiration into real life in Shanghai. All content and events are local demos.',
  },
  localeTag: { zh: 'zh_CN', en: 'en_US' },
}

const descriptionSelectors = [
  'meta[name="description"]',
  'meta[property="og:description"]',
  'meta[name="twitter:description"]',
]

const titleSelectors = [
  'meta[property="og:title"]',
  'meta[name="twitter:title"]',
  'meta[property="og:site_name"]',
]

export function applySiteMeta(locale: Locale): void {
  const description = siteMeta.description[locale]
  const title = siteMeta.title[locale]

  document.title = title

  for (const selector of titleSelectors) {
    document.head.querySelector(selector)?.setAttribute('content', title)
  }

  for (const selector of descriptionSelectors) {
    document.head.querySelector(selector)?.setAttribute('content', description)
  }

  document.head.querySelector('meta[property="og:locale"]')?.setAttribute('content', siteMeta.localeTag[locale])
}
