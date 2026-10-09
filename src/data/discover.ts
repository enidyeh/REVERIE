export type Experience = {
  id: string
  title: string
  category: string
  interest: 'city' | 'make' | 'listen'
  location: string
  date: string
  duration: string
  durationMinutes: number
  budget: string
  budgetCeiling: number
  socialFit: 'solo' | 'group' | 'both'
  groupSize: string
  image: string
  imageAlt: string
  match: string
  reason: string
  description: string
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
    title: '沿着愚园路，做一次街道观察',
    category: 'CITY WALK / 城市漫游',
    interest: 'city',
    location: '静安区 · 愚园路',
    date: '本周六 15:00',
    duration: '约 90 分钟',
    durationMinutes: 90,
    budget: '¥ 0–30',
    budgetCeiling: 30,
    socialFit: 'both',
    groupSize: '2–6 人',
    image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1400&q=85',
    imageAlt: '街道边树影与建筑的日常一角',
    match: '与你的城市好奇心相遇',
    reason: '不需要做很多准备，带着一个问题出门，就能重新认识熟悉的街区。',
    description: '从一处老建筑开始，沿路记录三件平时容易错过的小事。可以独自完成，也可以和一位同行者交换观察。',
  },
  {
    id: 'print-afternoon',
    title: '在一张纸上，试试孔版印刷',
    category: 'MAKE / 动手体验',
    interest: 'make',
    location: '长宁区 · 延安西路',
    date: '本周日 14:00',
    duration: '约 2 小时',
    durationMinutes: 120,
    budget: '¥ 68',
    budgetCeiling: 68,
    socialFit: 'group',
    groupSize: '4–8 人',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
    imageAlt: '桌面上的纸张与创作工具',
    match: '给动手创作留一点时间',
    reason: '从随手写下的一句话开始，把抽象的念头变成可以带走的作品。',
    description: '用简单的颜色和手工印刷做一张小海报。无需经验，现场会有带领者讲解完整流程。',
  },
  {
    id: 'listening-room',
    title: '去一个陌生的房间，听完一面唱片',
    category: 'LISTEN / 安静时刻',
    interest: 'listen',
    location: '徐汇区 · 湖南路',
    date: '本周五 19:30',
    duration: '约 60 分钟',
    durationMinutes: 60,
    budget: '¥ 35',
    budgetCeiling: 35,
    socialFit: 'both',
    groupSize: '1–4 人',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80',
    imageAlt: '灯光柔和的室内聆听空间',
    match: '适合给自己留一段安静时间',
    reason: '不必社交，也不需要完成任务；只要坐下来，认真听一会儿。',
    description: '一场小型黑胶聆听体验。演示活动信息为虚构内容，可独自前往，也可以邀请朋友同行。',
  },
]

export const editorPrompts = [
  { id: 'little-time', label: '我今天只有一点时间' },
  { id: 'meet-people', label: '我想认识新的人' },
  { id: 'go-solo', label: '我想一个人出门' },
] as const

export type EditorPromptId = (typeof editorPrompts)[number]['id']

