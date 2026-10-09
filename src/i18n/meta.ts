import type { Locale, Localized } from './messages'

// 页面级元信息。静态 HTML 里保留中文（爬虫读到的就是中文），
// 浏览器内切换语言时由 LocaleProvider 按当前语言重写。
// 标题与 og:title 用品牌标语，属品牌标识，两版一致，不做本地化。
export const siteMeta: { description: Localized; localeTag: Record<Locale, string> } = {
  description: {
    zh: 'UNSEEN：把灵感带到上海的真实生活里。内容与活动均为本地演示。',
    en: 'UNSEEN: bringing inspiration into real life in Shanghai. All content and events are local demos.',
  },
  localeTag: { zh: 'zh_CN', en: 'en_US' },
}

const descriptionSelectors = [
  'meta[name="description"]',
  'meta[property="og:description"]',
  'meta[name="twitter:description"]',
]

export function applySiteMeta(locale: Locale): void {
  const description = siteMeta.description[locale]

  for (const selector of descriptionSelectors) {
    document.head.querySelector(selector)?.setAttribute('content', description)
  }

  document.head.querySelector('meta[property="og:locale"]')?.setAttribute('content', siteMeta.localeTag[locale])
}
