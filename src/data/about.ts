// ABOUT 页面内容。统计数据由项目方提供，正式发布前需要核实。
// 联系方式与活动照片尚未提供，页面以占位说明展示，不填入任何虚构的值；已确认的只有 REVERIE 小红书账号。

import { xiaohongshuUrl } from './social'

export const aboutDefinition = {
  en: 'REVERIE is a youth culture curation and marketing platform.',
  zh: '异想集是一个青年文化策展与营销平台。',
  body: '我们关注年轻人正在喜欢、创造和重新定义的文化，并把它们转化成内容、活动、产品和真实体验。',
}

export type WorldBrand = {
  id: string
  nameEn: string
  nameZh: string
  verb: string
  verbZh: string
  line: string
}

export const worldBrands: WorldBrand[] = [
  { id: 'reverie', nameEn: 'REVERIE', nameZh: '异想集', verb: 'Experience', verbZh: '活动 / 策展 / 社群', line: '把主题变成可以走进去的现场。' },
  { id: 'unseen', nameEn: 'UNSEEN BOX', nameZh: '暗盒', verb: 'Discover', verbZh: '文化内容 / 观察 / 推荐', line: '记录年轻人正在做的事，并给出下一步。' },
  { id: 'shop', nameEn: 'REVERIE SHOP', nameZh: '异想商店', verb: 'Collect', verbZh: '选品 / 原创产品 / 联名', line: '把喜欢的东西带回去，而不只是收藏。' },
  { id: 'realmview', nameEn: 'REALMVIEW', nameZh: '域见', verb: 'Services', verbZh: '品牌 / 营销 / 商业服务', line: '为品牌搭一座通向青年文化的桥。' },
]

export type AboutStat = { id: string; value: string; label: string }

// 数据由项目方提供，尚未核实。
export const aboutStats: AboutStat[] = [
  { id: 'events', value: '15+', label: 'EVENTS' },
  { id: 'attendance', value: '1,000+', label: 'PEAK ATTENDANCE' },
  { id: 'brand', value: '90+', label: 'BRAND COLLABORATIONS' },
  { id: 'creator', value: '60+', label: 'CREATOR COLLABORATIONS' },
]

export const aboutStoryLine = 'Built through real events, real audiences and real collaborations.'
export const aboutStatNote = '以上数据由项目方提供，正式发布前需要核实。'

// 活动照片尚未提供，先保留 6 个位置说明。
export const aboutPhotoSlots = [
  '往期活动现场 01',
  '往期活动现场 02',
  '往期活动现场 03',
  '市集与摊位',
  '演出与舞会',
  '观众与品牌共创',
]

export type ContactChannel = { id: string; label: string; value: string; href?: string }

export type ContactPurpose = {
  id: string
  en: string
  zh: string
  line: string
  channels: ContactChannel[]
}

// 联系方式的实际值尚未提供，统一以占位说明展示；已确认的只有 REVERIE 小红书账号。
export const contactPurposes: ContactPurpose[] = [
  {
    id: 'partnership',
    en: 'PARTNERSHIP',
    zh: '品牌 / 场地 / 商业合作',
    line: '机构、品牌、场地与商业合作请联系这一组。',
    channels: [
      { id: 'email', label: 'Email', value: '待项目方提供' },
      { id: 'wechat', label: 'WeChat', value: '待项目方提供' },
    ],
  },
  {
    id: 'creator',
    en: 'CREATOR & OPEN CALLS',
    zh: '艺术家 / 摊主 / 演出 / 创作者',
    line: '报名与创作者事务走 OPEN CALLS，或直接联系这一组。',
    channels: [
      { id: 'email', label: 'Email', value: '待项目方提供' },
      { id: 'xiaohongshu', label: 'Xiaohongshu', value: 'REVERIE 小红书主页', href: xiaohongshuUrl },
    ],
  },
  {
    id: 'general',
    en: 'GENERAL',
    zh: '其他联系',
    line: '媒体、内容与其他事务请联系这一组。',
    channels: [
      { id: 'email', label: 'Email', value: '待项目方提供' },
      { id: 'instagram', label: 'Instagram', value: '待项目方提供' },
      { id: 'weibo', label: 'Weibo / Douyin', value: '待项目方提供' },
    ],
  },
]
