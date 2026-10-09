import type { Localized } from '../i18n/messages'

// 双语约定：显示用的文案写成 `{ zh, en }`；id、时长分钟数、预算上限等用于筛选的数值保持普通类型。
export type Experience = {
  id: string
  title: Localized
  category: Localized
  interest: 'city' | 'make' | 'listen'
  location: Localized
  date: Localized
  duration: Localized
  durationMinutes: number
  budget: Localized
  budgetCeiling: number
  socialFit: 'solo' | 'group' | 'both'
  groupSize: Localized
  image: string
  imageAlt: Localized
  match: Localized
  reason: Localized
  description: Localized
}

export type DiscoverPreferences = {
  interest: 'all' | 'city' | 'make' | 'listen'
  timeLimit: 'any' | '60' | '90' | '120'
  company: 'any' | 'solo' | 'group'
}

export const discoverPreferencesStorageKey = 'unseen:explore-preferences:v1'
export const defaultDiscoverPreferences: DiscoverPreferences = {
  interest: 'all',
  timeLimit: 'any',
  company: 'any',
}

const interestOptions = new Set<DiscoverPreferences['interest']>(['all', 'city', 'make', 'listen'])
const timeOptions = new Set<DiscoverPreferences['timeLimit']>(['any', '60', '90', '120'])
const companyOptions = new Set<DiscoverPreferences['company']>(['any', 'solo', 'group'])

export function parseDiscoverPreferences(value: unknown): DiscoverPreferences {
  if (typeof value !== 'object' || value === null) return defaultDiscoverPreferences
  const saved = value as Record<string, unknown>
  return {
    interest: typeof saved.interest === 'string' && interestOptions.has(saved.interest as DiscoverPreferences['interest']) ? saved.interest as DiscoverPreferences['interest'] : 'all',
    timeLimit: typeof saved.timeLimit === 'string' && timeOptions.has(saved.timeLimit as DiscoverPreferences['timeLimit']) ? saved.timeLimit as DiscoverPreferences['timeLimit'] : 'any',
    company: typeof saved.company === 'string' && companyOptions.has(saved.company as DiscoverPreferences['company']) ? saved.company as DiscoverPreferences['company'] : 'any',
  }
}

export const experiences: Experience[] = [
  {
    id: 'street-notes',
    title: { zh: '沿着愚园路，做一次街道观察', en: 'A street-watching walk along Yuyuan Road' },
    category: { zh: '城市漫游', en: 'CITY WALK' },
    interest: 'city',
    location: { zh: '静安区 · 愚园路', en: 'Jing’an · Yuyuan Road' },
    date: { zh: '本周六 15:00', en: 'Sat 15:00, this week' },
    duration: { zh: '约 90 分钟', en: 'about 90 min' },
    durationMinutes: 90,
    budget: { zh: '¥ 0–30', en: '¥0–30' },
    budgetCeiling: 30,
    socialFit: 'both',
    groupSize: { zh: '2–6 人', en: '2–6 people' },
    image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1400&q=85',
    imageAlt: { zh: '街道边树影与建筑的日常一角', en: 'An everyday corner of street, trees and buildings' },
    match: { zh: '与你的城市好奇心相遇', en: 'Meets your curiosity about the city' },
    reason: {
      zh: '不需要做很多准备，带着一个问题出门，就能重新认识熟悉的街区。',
      en: 'No preparation needed — leave with one question and you will see a familiar block again.',
    },
    description: {
      zh: '从一处老建筑开始，沿路记录三件平时容易错过的小事。可以独自完成，也可以和一位同行者交换观察。',
      en: 'Start at an old building and note down three small things you would normally miss. Go alone, or trade observations with one companion.',
    },
  },
  {
    id: 'print-afternoon',
    title: { zh: '在一张纸上，试试孔版印刷', en: 'Try stencil printing on a single sheet' },
    category: { zh: '动手体验', en: 'MAKE' },
    interest: 'make',
    location: { zh: '长宁区 · 延安西路', en: 'Changning · West Yan’an Road' },
    date: { zh: '本周日 14:00', en: 'Sun 14:00, this week' },
    duration: { zh: '约 2 小时', en: 'about 2 hours' },
    durationMinutes: 120,
    budget: { zh: '¥ 68', en: '¥68' },
    budgetCeiling: 68,
    socialFit: 'group',
    groupSize: { zh: '4–8 人', en: '4–8 people' },
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
    imageAlt: { zh: '桌面上的纸张与创作工具', en: 'Paper and making tools on a table' },
    match: { zh: '给动手创作留一点时间', en: 'Room for some hands-on making' },
    reason: {
      zh: '从随手写下的一句话开始，把抽象的念头变成可以带走的作品。',
      en: 'Start from one line you jot down and turn an abstract idea into something you can take home.',
    },
    description: {
      zh: '用简单的颜色和手工印刷做一张小海报。无需经验，现场会有带领者讲解完整流程。',
      en: 'Make a small poster with simple colours and hand printing. No experience needed — a host walks through the whole process.',
    },
  },
  {
    id: 'listening-room',
    title: { zh: '去一个陌生的房间，听完一面唱片', en: 'Sit in a room you do not know and play one record through' },
    category: { zh: '安静时刻', en: 'LISTEN' },
    interest: 'listen',
    location: { zh: '徐汇区 · 湖南路', en: 'Xuhui · Hunan Road' },
    date: { zh: '本周五 19:30', en: 'Fri 19:30, this week' },
    duration: { zh: '约 60 分钟', en: 'about 60 min' },
    durationMinutes: 60,
    budget: { zh: '¥ 35', en: '¥35' },
    budgetCeiling: 35,
    socialFit: 'both',
    groupSize: { zh: '1–4 人', en: '1–4 people' },
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80',
    imageAlt: { zh: '灯光柔和的室内聆听空间', en: 'A softly lit indoor listening space' },
    match: { zh: '适合给自己留一段安静时间', en: 'A quiet stretch of time for yourself' },
    reason: {
      zh: '不必社交，也不需要完成任务；只要坐下来，认真听一会儿。',
      en: 'No socialising needed and no task to finish — just sit down and listen properly for a while.',
    },
    description: {
      zh: '一场小型黑胶聆听体验。演示活动信息为虚构内容，可独自前往，也可以邀请朋友同行。',
      en: 'A small vinyl listening session. This demo listing is fictional; go alone or bring a friend.',
    },
  },
]

export const editorPrompts: { id: 'little-time' | 'meet-people' | 'go-solo'; label: Localized }[] = [
  { id: 'little-time', label: { zh: '我今天只有一点时间', en: 'I only have a little time today' } },
  { id: 'meet-people', label: { zh: '我想认识新的人', en: 'I want to meet new people' } },
  { id: 'go-solo', label: { zh: '我想一个人出门', en: 'I want to go out alone' } },
]

export type EditorPromptId = (typeof editorPrompts)[number]['id']

/**
 * 从 EXPLORE 写进 IDENTITY 档案时带过去的字段。
 * 写入前已按当前语言解析成单语字符串：用户写下的内容不再随语言变化。
 */
export type ExperienceDraft = { id: string; title: string; location: string; category: string }

