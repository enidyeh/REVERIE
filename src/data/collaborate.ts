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
    id: 'reverie-garden',
    title: { zh: '游园惊梦', en: 'A DREAM IN THE GARDEN' },
    window: '9.25–9.27',
    status: { zh: '正在招募', en: 'OPEN NOW' },
    line: {
      zh: '集市摊位（时尚 / 器物 / 艺术 / 文化 / 餐饮 / 生活方式）、展览与演出同步招募；摊主报名微信 QINETIC（备注摊主）。',
      en: 'Market stalls (fashion, objects, art, culture, food & drink, lifestyle), exhibitions and performances are open for applications. Vendor WeChat: QINETIC.',
    },
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
  { id: 'name', label: { zh: '品牌 / 称呼', en: 'Brand or name' } as Localized, placeholder: { zh: '品牌名或怎么称呼你', en: 'Your brand or what we should call you' } as Localized, required: true },
  { id: 'intro', label: { zh: '中英文介绍', en: 'Intro in Chinese and English' } as Localized, placeholder: { zh: '一段中文介绍与一段英文介绍', en: 'One short intro in Chinese and one in English' } as Localized, required: true },
  { id: 'social', label: { zh: '社交媒体', en: 'Social media' } as Localized, placeholder: { zh: '小红书 / 微信 / 微博 / Instagram 账号（演示用，不会上传）', en: 'Xiaohongshu / WeChat / Weibo / Instagram handle (demo only, never uploaded)' } as Localized, required: true },
  { id: 'products', label: { zh: '产品信息', en: 'Product info' } as Localized, placeholder: { zh: '品类、价位与现场会带来的商品', en: 'Category, price range and what you will bring' } as Localized, required: true },
  { id: 'markets', label: { zh: '过往集市', en: 'Past markets' } as Localized, placeholder: { zh: '参加过的集市或活动（可选）', en: 'Markets or events you have joined (optional)' } as Localized, required: false },
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
