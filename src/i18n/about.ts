import type { Localized } from './messages'

// ABOUT 页面的双语文案。中文版页面内的眉题一律中文，纯英文眉题写成 `zh: null`。
export const aboutCopy = {
  sectionMetaLeft: { zh: '关于 / 异想集', en: 'ABOUT' } as Localized,
  sectionMetaRight: { zh: '故事与联系', en: 'STORY / CONTACT' } as Localized,
  coverEyebrow: { zh: null, en: 'KNOW WHO WE ARE' } as Localized<string | null>,
  coverTitleLines: {
    zh: ['我们是谁，', '以及为什么。'],
    en: ['Who we are,', 'and why.'],
  } as Localized<string[]>,
  headingAsideLines: {
    zh: ['不为了转化，', '只为了让你知道我们在做什么。'],
    en: ['Not to convert you —', 'just to show what we do.'],
  } as Localized<string[]>,

  definitionEyebrow: { zh: '01 / 关于异想集', en: '01 / ABOUT REVERIE' } as Localized,
  definitionHeading: { zh: '一句话定义。', en: 'In one line.' } as Localized,
  definitionBadge: { zh: '我们是谁', en: 'WHO WE ARE' } as Localized,

  worldLabel: { zh: '四个名字，一个世界', en: 'Four names, one world' } as Localized,
  worldNote: {
    zh: '异想集、暗盒、异想商店与域见属于同一个体系，分别负责体验、内容、选品与服务。',
    en: 'REVERIE, UNSEEN BOX, REVERIE SHOP and REALMVIEW belong to one system, handling experiences, content, commerce and services.',
  } as Localized,

  storyEyebrow: { zh: '02 / 我们的故事', en: '02 / OUR STORY' } as Localized,
  storyHeading: { zh: '做过的事。', en: 'What we have done.' } as Localized,
  storyBadge: { zh: '做过的事', en: 'WHAT WE’VE DONE' } as Localized,
  photosLabel: { zh: '往期活动现场', en: 'Past events' } as Localized,
  photoPending: { zh: '照片待项目方提供', en: 'Photos to be provided' } as Localized,

  contactEyebrow: { zh: '03 / 联系我们', en: '03 / CONTACT' } as Localized,
  contactHeading: { zh: '按用途找我们。', en: 'Reach us by purpose.' } as Localized,
  contactBadge: { zh: '联系', en: 'CONTACT' } as Localized,
  disclosure: {
    zh: '除已确认的 REVERIE 小红书账号（新窗口打开）外，其余联系方式与活动照片尚未提供，页面以占位说明展示，没有填入任何虚构的账号或邮箱。统计数据由项目方提供，正式发布前需要核实。',
    en: 'Apart from the confirmed REVERIE Xiaohongshu account (opens in a new tab), the other contact details and event photos are not provided yet; this page shows placeholders and no invented accounts or emails. Statistics come from the brand and must be verified before launch.',
  } as Localized,
  backToTop: { zh: '回到页首', en: 'Back to top' } as Localized,
}
