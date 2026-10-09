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

export type IdentityBadge = {
  id: string
  number: string
  title: string
  detail: string
}

export const identityProfile = {
  alias: 'E.',
  city: '上海',
  year: '2026',
  interests: ['城市漫游', '独立出版', '手作印刷', '现场音乐'],
}

export const identityBadges: IdentityBadge[] = [
  { id: 'first-walk', number: '01', title: '街区观察者', detail: '第一次慢下来' },
  { id: 'open-page', number: '02', title: '翻开新一页', detail: '体验一种新事物' },
  { id: 'meet-nearby', number: '03', title: '附近的人', detail: '和同行者一起出发' },
]

export const demoArchiveEntries: ArchiveEntry[] = [
  {
    id: 'archive-demo-01',
    date: '2026-09-20',
    title: '在愚园路，把熟悉的街区重新走一遍',
    location: '静安区 · 愚园路',
    category: 'CITY WALK / 城市漫游',
    note: '从一扇旧窗开始，后来一路都在看窗台。原来平常路过的地方，也有很多没有注意到的细节。',
    reflection: '你开始用自己的问题观察城市。下次，可以把最想记住的一个细节画下来。',
    source: 'demo',
  },
  {
    id: 'archive-demo-02',
    date: '2026-09-12',
    title: '做完一张不太像计划中的小海报',
    location: '长宁区 · 延安西路',
    category: 'MAKE / 动手体验',
    note: '颜色叠错了一点，但最后那块意外的留白反而很喜欢。和刚认识的人交换了做法。',
    reflection: '结果没有完全照计划发生，但你愿意留下它。这种变化也属于创作的一部分。',
    source: 'demo',
  },
]