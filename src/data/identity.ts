import type { Localized } from '../i18n/messages'

/** 用户写入的档案：存的是写入时的语言，切换语言时不再翻译。 */
export type ArchiveEntry = {
  id: string
  date: string
  title: string
  location: string
  category: string
  note: string
  reflection: string
  source: 'demo' | 'user'
  relatedExperienceId?: string
}

/** 示例档案：双语，按当前语言显示。 */
export type DemoArchiveEntry = {
  id: string
  date: string
  title: Localized
  location: Localized
  category: Localized
  note: Localized
  reflection: Localized
  source: 'demo'
}

export type IdentityBadge = {
  id: string
  number: string
  title: Localized
  detail: Localized
}

export const identityProfile = {
  alias: 'E.',
  city: { zh: '上海', en: 'Shanghai' } as Localized,
  year: '2026',
  interests: {
    zh: ['城市漫游', '独立出版', '手作印刷', '现场音乐'],
    en: ['City wander', 'Indie publishing', 'Hand printing', 'Live music'],
  } as Localized<string[]>,
}

export const identityBadges: IdentityBadge[] = [
  {
    id: 'first-walk',
    number: '01',
    title: { zh: '街区观察者', en: 'Street watcher' },
    detail: { zh: '第一次慢下来', en: 'The first time you slowed down' },
  },
  {
    id: 'open-page',
    number: '02',
    title: { zh: '翻开新一页', en: 'Turning a new page' },
    detail: { zh: '体验一种新事物', en: 'Trying something new' },
  },
  {
    id: 'meet-nearby',
    number: '03',
    title: { zh: '附近的人', en: 'People nearby' },
    detail: { zh: '和同行者一起出发', en: 'Setting out with someone else' },
  },
]

export const demoArchiveEntries: DemoArchiveEntry[] = [
  {
    id: 'archive-demo-01',
    date: '2026-09-20',
    title: { zh: '在愚园路，把熟悉的街区重新走一遍', en: 'Walking a familiar block again on Yuyuan Road' },
    location: { zh: '静安区 · 愚园路', en: 'Jing’an · Yuyuan Road' },
    category: { zh: '城市漫游', en: 'CITY WALK' },
    note: {
      zh: '从一扇旧窗开始，后来一路都在看窗台。原来平常路过的地方，也有很多没有注意到的细节。',
      en: 'It started with one old window, and after that I looked at window ledges the whole way. Places I pass every day hold more details than I noticed.',
    },
    reflection: {
      zh: '你开始用自己的问题观察城市。下次，可以把最想记住的一个细节画下来。',
      en: 'You have started watching the city through your own questions. Next time, draw the one detail you most want to remember.',
    },
    source: 'demo',
  },
  {
    id: 'archive-demo-02',
    date: '2026-09-12',
    title: { zh: '做完一张不太像计划中的小海报', en: 'Finishing a poster that did not match the plan' },
    location: { zh: '长宁区 · 延安西路', en: 'Changning · West Yan’an Road' },
    category: { zh: '动手体验', en: 'MAKE' },
    note: {
      zh: '颜色叠错了一点，但最后那块意外的留白反而很喜欢。和刚认识的人交换了做法。',
      en: 'The colours overlapped a little off, but I ended up liking the accidental blank space. I swapped methods with someone I had just met.',
    },
    reflection: {
      zh: '结果没有完全照计划发生，但你愿意留下它。这种变化也属于创作的一部分。',
      en: 'The result did not go to plan, and you were willing to keep it. That kind of change is part of making too.',
    },
    source: 'demo',
  },
]