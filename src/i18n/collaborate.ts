import type { Localized } from './messages'

// 首页级入口 COLLABORATE 的双语文案。中文版页面内的眉题一律中文，纯英文眉题写成 `zh: null`。
export const collaborateCopy = {
  sectionMetaLeft: { zh: '合作 / 一起创造', en: 'COLLABORATE' } as Localized,
  sectionMetaRight: { zh: '合作与报名', en: 'PARTNER / OPEN CALLS' } as Localized,
  coverEyebrow: { zh: null, en: 'CREATE WITH US' } as Localized<string | null>,
  coverTitleLines: {
    zh: ['把你的世界，', '带进这里。'],
    en: ['Bring your world,', 'step inside.'],
  } as Localized<string[]>,
  headingAsideLines: {
    zh: ['左边是进入 REVERIE 世界，', '这里是和 REVERIE 一起做事。'],
    en: ['The left is about entering REVERIE’s world;', 'this side is about working with REVERIE.'],
  } as Localized<string[]>,

  entriesLabel: { zh: '合作与报名入口', en: 'Partnership and open call entries' } as Localized,
  entryPartnerTitle: { zh: '与我们合作', en: 'PARTNER WITH US' } as Localized,
  entryPartnerNote: { zh: '合作伙伴 · 品牌 / 场地 / 机构', en: 'Partners · brands, venues, institutions' } as Localized,
  entryCallsTitle: { zh: '公开征集', en: 'OPEN CALLS' } as Localized,
  entryCallsNote: { zh: '报名参与 · 摊主 / 艺术家 / 演出者', en: 'Open calls · vendors, artists, performers' } as Localized,

  partnerEyebrow: { zh: '01 / 与我们合作', en: '01 / PARTNER WITH US' } as Localized,
  partnerHeading: { zh: '把你的世界带进来。', en: 'Bring your world into ours.' } as Localized,
  partnerBadge: { zh: '合作伙伴', en: 'PARTNERS' } as Localized,
  partnerLead: {
    zh: '把你的品牌、作品、空间或想法带进 REVERIE。',
    en: 'Bring your brand, work, space or idea into REVERIE.',
  } as Localized,
  audienceHeading: { zh: '我们和谁合作', en: 'Who we work with' } as Localized,
  formatsHeading: { zh: '合作方式', en: 'How we work together' } as Localized,
  partnerDetailAction: { zh: '合作详情', en: 'Partnership details' } as Localized,
  partnerDeckNote: {
    zh: '合作手册尚未提供，本次演示中不提供下载。',
    en: 'VIEW PARTNERSHIP DECK · the deck is not available; nothing can be downloaded in this demo.',
  } as Localized,
  partnerFormEyebrow: { zh: '开始合作', en: 'START A COLLABORATION' } as Localized,
  partnerFormatLabel: { zh: '合作方向', en: 'Partnership direction' } as Localized,
  partnerSubmit: { zh: '提交合作意向', en: 'Send partnership intent' } as Localized,
  partnerSubmitted: {
    zh: '演示提交已完成：真实提交需要接入服务，当前版本不会发送任何内容。',
    en: 'Demo submission complete: a real submission would need a service; this version sends nothing.',
  } as Localized,

  callsEyebrow: { zh: '02 / 公开征集', en: '02 / OPEN CALLS' } as Localized,
  callsHeading: { zh: '现在正在招募。', en: 'Now open for applications.' } as Localized,
  callsOpenCount: {
    zh: (count: number) => `${count} 个征集`,
    en: (count: number) => `${count} OPEN`,
  } as Localized<(count: number) => string>,
  rolesHeading: { zh: '选择你的身份', en: 'Choose your role' } as Localized,
  applyEyebrow: {
    zh: (label: string) => `报名 / ${label}`,
    en: (label: string) => `APPLY / ${label}`,
  } as Localized<(label: string) => string>,
  applyTitle: {
    zh: (label: string) => `报名成为${label}。`,
    en: (label: string) => `Apply as ${label}.`,
  } as Localized<(label: string) => string>,
  callHint: {
    zh: (title: string, window: string) => `${title} · ${window}`,
    en: (title: string, window: string) => `${title} · ${window}`,
  } as Localized<(title: string, window: string) => string>,
  callsSubmit: { zh: '提交报名', en: 'Send application' } as Localized,
  callsSubmitted: {
    zh: '演示提交已完成：没有产生真实报名，也没有保存你填写的内容。',
    en: 'Demo submission complete: no real application was made and nothing you typed was saved.',
  } as Localized,
  rolesHint: {
    zh: '选一个身份即可看到对应的报名表单，两步完成。',
    en: 'Pick a role to see the matching form — two steps.',
  } as Localized,
  disclosure: {
    zh: '本页所有内容与表单均为本地演示：不会提交、不会保存，也不会产生真实的报名、合作或支付。',
    en: 'Everything on this page and every form is a local demo: nothing is submitted or saved, and no real application, partnership or payment is created.',
  } as Localized,
  footerLines: {
    zh: ['一起创造。', '合作 / 2026'],
    en: ['CREATE WITH US.', 'COLLABORATE / 2026'],
  } as Localized<string[]>,
}
