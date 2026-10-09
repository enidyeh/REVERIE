import type { Localized } from './messages'

// HOME › CONTENT 的双语文案。中文版页面内的眉题一律中文，纯英文眉题写成 `zh: null`。
export const contentCopy = {
  sectionMetaLeft: { zh: '内容 / 编辑', en: 'CONTENT / EDITORIAL' } as Localized,
  sectionMetaRight: { zh: '暗盒', en: 'UNSEEN BOX' } as Localized,
  featuredEyebrow: { zh: '01 / 特别推荐', en: '01 / FEATURED' } as Localized,
  formsCount: {
    zh: (count: number) => `${count} 种形式`,
    en: (count: number) => `${count} FORMS`,
  } as Localized<(count: number) => string>,
  topicsEyebrow: { zh: '02 / 线上专题', en: '02 / ONLINE TOPICS' } as Localized,
  topicsCount: {
    zh: (count: number) => `${count} 期专题`,
    en: (count: number) => `${count} TOPICS`,
  } as Localized<(count: number) => string>,
  articleNotice: {
    zh: (label: string) => `演示：文章详情页尚未接入，「${label}」的更多文章会在这里展开`,
    en: (label: string) => `Demo: article pages are not built yet; more articles under ${label} would expand here.`,
  } as Localized<(label: string) => string>,
  moreLabel: {
    zh: (label: string) => `更多「${label}」`,
    en: (label: string) => `more ${label}`,
  } as Localized<(label: string) => string>,
  footerMark: { zh: '暗盒 · 内容', en: 'UNSEEN BOX · CONTENT' } as Localized,
}
