// ABOUT 页面内容。统计数据由项目方提供，正式发布前需要核实。
// 联系方式与活动照片尚未提供，页面以占位说明展示，不填入任何虚构的值；已确认的只有 REVERIE 小红书账号。
// 双语约定：显示文案写成 `{ zh, en }`，两版各自只显示当前语言。

import type { Localized } from '../i18n/messages'
import { xiaohongshuUrl } from './social'

export const aboutDefinition = {
  definition: {
    zh: '异想集是一个青年文化策展与营销平台。',
    en: 'REVERIE is a youth culture curation and marketing platform.',
  } as Localized,
  body: {
    zh: '我们关注年轻人正在喜欢、创造和重新定义的文化，并把它们转化成内容、活动、产品和真实体验。',
    en: 'We follow the culture young people are enjoying, creating and redefining, and turn it into content, events, products and real experiences.',
  } as Localized,
}

export type WorldBrand = {
  id: string
  name: Localized
  verb: Localized
  line: Localized
}

export const worldBrands: WorldBrand[] = [
  {
    id: 'reverie',
    name: { zh: '异想集', en: 'REVERIE' },
    verb: { zh: '活动 / 策展 / 社群', en: 'Experience' },
    line: { zh: '把主题变成可以走进去的现场。', en: 'Turning a theme into a place you can walk into.' },
  },
  {
    id: 'unseen',
    name: { zh: '暗盒', en: 'UNSEEN BOX' },
    verb: { zh: '文化内容 / 观察 / 推荐', en: 'Discover' },
    line: { zh: '记录年轻人正在做的事，并给出下一步。', en: 'Recording what young people are doing, and suggesting the next step.' },
  },
  {
    id: 'shop',
    name: { zh: '异想商店', en: 'REVERIE SHOP' },
    verb: { zh: '选品 / 原创产品 / 联名', en: 'Collect' },
    line: { zh: '把喜欢的东西带回去，而不只是收藏。', en: 'Taking what you like home, not just saving it.' },
  },
  {
    id: 'realmview',
    name: { zh: '域见', en: 'REALMVIEW' },
    verb: { zh: '品牌 / 营销 / 商业服务', en: 'Services' },
    line: { zh: '为品牌搭一座通向青年文化的桥。', en: 'Building brands a bridge into youth culture.' },
  },
]

export type AboutStat = { id: string; value: string; label: Localized }

// 数据由项目方提供，尚未核实。
export const aboutStats: AboutStat[] = [
  { id: 'events', value: '15+', label: { zh: '活动场次', en: 'EVENTS' } },
  { id: 'attendance', value: '1,000+', label: { zh: '单场最高到场', en: 'PEAK ATTENDANCE' } },
  { id: 'brand', value: '90+', label: { zh: '品牌合作', en: 'BRAND COLLABORATIONS' } },
  { id: 'creator', value: '60+', label: { zh: '创作者合作', en: 'CREATOR COLLABORATIONS' } },
]

export const aboutStoryLine: Localized = {
  zh: '由真实的现场、真实的观众与真实的合作搭起来。',
  en: 'Built through real events, real audiences and real collaborations.',
}

export const aboutStatNote: Localized = {
  zh: '以上数据由项目方提供，正式发布前需要核实。',
  en: 'Data provided by the brand; to be verified before launch.',
}

// 活动照片尚未提供，先保留 6 个位置说明。
export const aboutPhotoSlots: Localized<string[]> = {
  zh: ['往期活动现场 01', '往期活动现场 02', '往期活动现场 03', '市集与摊位', '演出与舞会', '观众与品牌共创'],
  en: ['Past event 01', 'Past event 02', 'Past event 03', 'Markets and stalls', 'Performances and balls', 'Audiences and brand co-creation'],
}

export type ContactChannel = { id: string; label: Localized; value: Localized; href?: string }

export type ContactPurpose = {
  id: string
  title: Localized
  line: Localized
  channels: ContactChannel[]
}

// 联系方式的实际值尚未提供，统一以占位说明展示；已确认的只有 REVERIE 小红书账号。
const toBeProvided: Localized = { zh: '待项目方提供', en: 'To be provided' }

export const contactPurposes: ContactPurpose[] = [
  {
    id: 'partnership',
    title: { zh: '品牌 / 场地 / 商业合作', en: 'PARTNERSHIP' },
    line: {
      zh: '机构、品牌、场地与商业合作请联系这一组。',
      en: 'Institutions, brands, venues and commercial partnerships: contact this group.',
    },
    channels: [
      { id: 'email', label: { zh: '邮箱', en: 'Email' }, value: toBeProvided },
      { id: 'wechat', label: { zh: '微信', en: 'WeChat' }, value: toBeProvided },
    ],
  },
  {
    id: 'creator',
    title: { zh: '艺术家 / 摊主 / 演出 / 创作者', en: 'CREATOR & OPEN CALLS' },
    line: {
      zh: '报名与创作者事务走公开征集，或直接联系这一组。',
      en: 'Applications and creator matters go through OPEN CALLS, or contact this group directly.',
    },
    channels: [
      { id: 'email', label: { zh: '邮箱', en: 'Email' }, value: toBeProvided },
      {
        id: 'xiaohongshu',
        label: { zh: '小红书', en: 'Xiaohongshu' },
        value: { zh: 'REVERIE 小红书主页', en: 'REVERIE on Xiaohongshu' },
        href: xiaohongshuUrl,
      },
    ],
  },
  {
    id: 'general',
    title: { zh: '其他联系', en: 'GENERAL' },
    line: {
      zh: '媒体、内容与其他事务请联系这一组。',
      en: 'Media, content and everything else: contact this group.',
    },
    channels: [
      { id: 'email', label: { zh: '邮箱', en: 'Email' }, value: toBeProvided },
      { id: 'instagram', label: { zh: 'Instagram', en: 'Instagram' }, value: toBeProvided },
      { id: 'weibo', label: { zh: '微博 / 抖音', en: 'Weibo / Douyin' }, value: toBeProvided },
    ],
  },
]
