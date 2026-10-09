// COLLABORATE 页面内容。所有表单均为本地演示，不会提交到任何服务。
// 双语约定：显示文案写成 `{ zh, en }`，两版各自只显示当前语言。
import type { Localized } from '../i18n/messages'

export type PartnerAudience = { id: string; label: Localized }

export const partnerAudiences: PartnerAudience[] = [
  { id: 'brand', label: { zh: '品牌', en: 'BRAND' } },
  { id: 'venue', label: { zh: '场地', en: 'VENUE' } },
  { id: 'art', label: { zh: '艺术机构 / 艺术家', en: 'ART & CULTURE' } },
  { id: 'media', label: { zh: '媒体', en: 'MEDIA' } },
  { id: 'community', label: { zh: '社群', en: 'COMMUNITY' } },
  { id: 'creator', label: { zh: '创作者', en: 'CREATOR' } },
  { id: 'sponsor', label: { zh: '赞助 / 联名 / 内容共创', en: 'SPONSOR' } },
]

export const collaborationFormats: Localized<string[]> = {
  zh: ['市集 / 零售', '品牌活动', '展览', '工作坊 / 对谈', '演出', '内容共创', '产品联名', '场地合作', '赞助'],
  en: ['Market / Retail', 'Brand Activation', 'Exhibition', 'Workshop / Talk', 'Performance', 'Content Co-Creation', 'Product Collaboration', 'Venue Partnership', 'Sponsorship'],
}

export type OpenCall = {
  id: string
  title: Localized
  window: string
  status: Localized
  line: Localized
}

export const openCalls: OpenCall[] = [
  {
    id: 'reverie-wonderland',
    title: { zh: '梦游梦境', en: 'REVERIE WONDERLAND' },
    window: '10.31–11.01',
    status: { zh: '正在招募', en: 'OPEN NOW' },
    line: { zh: 'Cos / Lolita / 梦境市集 / 午夜舞会。', en: 'Cos / Lolita / dream market / midnight ball.' },
  },
]

export type OpenCallRole = { id: string; label: Localized; line: Localized }

export const openCallRoles: OpenCallRole[] = [
  { id: 'vendor', label: { zh: '品牌 / 摊主', en: 'VENDOR' }, line: { zh: '带上你的商品、选品或自制品进入市集。', en: 'Bring your goods, curation or own-made pieces into the market.' } },
  { id: 'artist', label: { zh: '艺术家', en: 'ARTIST' }, line: { zh: '装置、影像、绘画、雕塑或跨媒介作品。', en: 'Installation, video, painting, sculpture or cross-media work.' } },
  { id: 'performer', label: { zh: '演出者', en: 'PERFORMER' }, line: { zh: 'Live、DJ、舞蹈、戏剧或行为演出。', en: 'Live sets, DJ, dance, theatre or performance art.' } },
  { id: 'workshop', label: { zh: '工作坊', en: 'WORKSHOP HOST' }, line: { zh: '带一场动手或分享型的小型工作坊。', en: 'Host a small hands-on or sharing workshop.' } },
  { id: 'creator', label: { zh: '创作者 / KOL', en: 'CREATOR / KOL' }, line: { zh: '内容记录、现场拍摄或平台传播。', en: 'Content, on-site filming or platform coverage.' } },
  { id: 'volunteer', label: { zh: '志愿者', en: 'VOLUNTEER' }, line: { zh: '现场执行、引导与物料支持。', en: 'On-site support, guiding and materials.' } },
  { id: 'community', label: { zh: '社群伙伴', en: 'COMMUNITY PARTNER' }, line: { zh: '带着你的社群一起进入梦境。', en: 'Bring your community into the dream with you.' } },
]

// 表单字段为通用演示字段，提交只在本地模拟，不发送任何数据。
export const openCallFields = [
  { id: 'name', label: { zh: '称呼', en: 'Name' } as Localized, placeholder: { zh: '怎么称呼你', en: 'What should we call you' } as Localized, required: true },
  { id: 'contact', label: { zh: '联系方式', en: 'Contact' } as Localized, placeholder: { zh: '邮箱或社交账号（演示用，不会上传）', en: 'Email or social handle (demo only, never uploaded)' } as Localized, required: true },
  { id: 'link', label: { zh: '作品 / 项目链接', en: 'Work or project link' } as Localized, placeholder: { zh: '主页、作品集或往期现场', en: 'Homepage, portfolio or past events' } as Localized, required: false },
  { id: 'intro', label: { zh: '你想带来的东西', en: 'What you want to bring' } as Localized, placeholder: { zh: '一小段介绍，说清你想在这个梦里做什么', en: 'A short note on what you want to do in this dream' } as Localized, required: true },
]

export const partnerFormFields = [
  { id: 'org', label: { zh: '机构 / 品牌名称', en: 'Organisation or brand' } as Localized, placeholder: { zh: '公司、品牌或机构名', en: 'Company, brand or organisation name' } as Localized, required: true },
  { id: 'name', label: { zh: '联系人', en: 'Contact person' } as Localized, placeholder: { zh: '怎么称呼你', en: 'What should we call you' } as Localized, required: true },
  { id: 'contact', label: { zh: '联系方式', en: 'Contact' } as Localized, placeholder: { zh: '邮箱或社交账号（演示用，不会上传）', en: 'Email or social handle (demo only, never uploaded)' } as Localized, required: true },
  { id: 'intro', label: { zh: '合作想法', en: 'What you have in mind' } as Localized, placeholder: { zh: '想合作的方向、时间与大致设想', en: 'Direction, timing and a rough idea' } as Localized, required: true },
]

export const openCallNote: Localized = {
  zh: '这是本地演示表单：不会提交、不会保存你填写的内容，也不会产生真实的报名或合作。',
  en: 'This is a local demo form: nothing is submitted, nothing you type is saved, and no real application or partnership is created.',
}
