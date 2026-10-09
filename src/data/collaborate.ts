// COLLABORATE 页面内容。所有表单均为本地演示，不会提交到任何服务。

export type PartnerAudience = { id: string; zh: string; en: string }

export const partnerAudiences: PartnerAudience[] = [
  { id: 'brand', zh: '品牌', en: 'BRAND' },
  { id: 'venue', zh: '场地', en: 'VENUE' },
  { id: 'art', zh: '艺术机构 / 艺术家', en: 'ART & CULTURE' },
  { id: 'media', zh: '媒体', en: 'MEDIA' },
  { id: 'community', zh: '社群', en: 'COMMUNITY' },
  { id: 'creator', zh: '创作者', en: 'CREATOR' },
  { id: 'sponsor', zh: '赞助 / 联名 / 内容共创', en: 'SPONSOR' },
]

export const collaborationFormats = [
  'Market / Retail',
  'Brand Activation',
  'Exhibition',
  'Workshop / Talk',
  'Performance',
  'Content Co-Creation',
  'Product Collaboration',
  'Venue Partnership',
  'Sponsorship',
]

export type OpenCall = {
  id: string
  title: string
  titleZh: string
  window: string
  status: string
  line: string
}

export const openCalls: OpenCall[] = [
  {
    id: 'reverie-wonderland',
    title: 'REVERIE WONDERLAND',
    titleZh: '梦游梦境',
    window: '10.31–11.01',
    status: 'OPEN NOW',
    line: 'Cos / Lolita / Dream Market / Midnight Ball。',
  },
]

export type OpenCallRole = { id: string; zh: string; en: string; line: string }

export const openCallRoles: OpenCallRole[] = [
  { id: 'vendor', zh: '品牌 / 摊主', en: 'VENDOR', line: '带上你的商品、选品或自制品进入市集。' },
  { id: 'artist', zh: '艺术家', en: 'ARTIST', line: '装置、影像、绘画、雕塑或跨媒介作品。' },
  { id: 'performer', zh: '演出者', en: 'PERFORMER', line: 'Live、DJ、舞蹈、戏剧或行为演出。' },
  { id: 'workshop', zh: '工作坊', en: 'WORKSHOP HOST', line: '带一场动手或分享型的小型工作坊。' },
  { id: 'creator', zh: '创作者 / KOL', en: 'CREATOR / KOL', line: '内容记录、现场拍摄或平台传播。' },
  { id: 'volunteer', zh: '志愿者', en: 'VOLUNTEER', line: '现场执行、引导与物料支持。' },
  { id: 'community', zh: '社群伙伴', en: 'COMMUNITY PARTNER', line: '带着你的社群一起进入梦境。' },
]

// 表单字段为通用演示字段，提交只在本地模拟，不发送任何数据。
export const openCallFields = [
  { id: 'name', label: '称呼', placeholder: '怎么称呼你', required: true },
  { id: 'contact', label: '联系方式', placeholder: '邮箱或社交账号（演示用，不会上传）', required: true },
  { id: 'link', label: '作品 / 项目链接', placeholder: '主页、作品集或往期现场', required: false },
  { id: 'intro', label: '你想带来的东西', placeholder: '一小段介绍，说清你想在这个梦里做什么', required: true },
]

export const partnerFormFields = [
  { id: 'org', label: '机构 / 品牌名称', placeholder: '公司、品牌或机构名', required: true },
  { id: 'name', label: '联系人', placeholder: '怎么称呼你', required: true },
  { id: 'contact', label: '联系方式', placeholder: '邮箱或社交账号（演示用，不会上传）', required: true },
  { id: 'intro', label: '合作想法', placeholder: '想合作的方向、时间与大致设想', required: true },
]

export const openCallNote = '这是本地演示表单：不会提交、不会保存你填写的内容，也不会产生真实的报名或合作。'
