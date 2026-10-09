// 项目方给的形式清单（均为可选，不含 Space / Brand collaboration）。
// EVENTS 页顶部的「REVERIE｜异想集」定位说明（含页头与 `01 / HOW IT WORKS` 七步链条）
// 已按项目方要求整体删除，只剩这行标签，且只做说明：不可点击、也不筛选列表。
export const eventsFormats = {
  label: 'OPTIONAL FORMATS / 可选形式',
  items: ['Event', 'Festival', 'Exhibition', 'Market', 'Party', 'Talk', 'Workshop', 'Community', 'Pop-up'],
}

export type EventTeam = {
  id: string
  name: string
  members: number
  capacity: number
  note: string
}

export type CityEvent = {
  id: string
  title: string
  /** 可选副标题：只在需要时展示，例如工作坊 / 漫游 / 聆听会一行说明。 */
  subtitle?: string
  category: string
  interest: 'city' | 'make' | 'listen'
  date: string
  duration: string
  durationMinutes: number
  venue: string
  district: string
  price: string
  budgetCeiling: number
  socialFit: 'solo' | 'group' | 'both'
  host: string
  image: string
  imageAlt: string
  description: string
  // 活动内容（如节展的各个板块），可选；在活动详情里以标签形式示。
  program?: string[]
  teams: EventTeam[]
}

export const cityEvents: CityEvent[] = [
  // 旗舰活动：放在首位，因此以「精选卡」形式展开；原来的「把一个念头，印成一张纸」工作坊顺位为普通列表项。
  {
    id: 'reverie-in-the-wonderland',
    title: 'REVERIE in the WONDERLAND｜梦游仙境',
    category: 'FESTIVAL / 主题节',
    interest: 'city',
    date: '10 月 31 日 — 11 月 01 日 · 周六日 11:00',
    duration: '两天 · 11:00–20:00',
    durationMinutes: 540,
    venue: '八号桥艺术空间',
    district: '黄浦区 · 八号桥',
    price: '¥ 29.9 起 · 演示',
    budgetCeiling: 30,
    socialFit: 'both',
    host: '异想集 REVERIE',
    image: 'https://images.unsplash.com/photo-1544039161-b0c20826c6f6?auto=format&fit=crop&w=1300&q=85',
    imageAlt: '雾中带有紫红色光的梦境场景',
    description: '把异想集的梦境搬进真实场地：兔子洞、疯茶会、Lolita、Cos、展览、Market、Performance 与 Midnight Ball 在同一个周末里接连发生。',
    program: ['兔子洞', '疯茶会', 'Lolita', 'Cos', '展览', 'Market', 'Performance', 'Midnight Ball'],
    teams: [
      { id: 'wonderland-team-01', name: '第一次进梦境的人', members: 3, capacity: 6, note: '以前没来过 REVERIE，想有人一起走完全场。' },
      { id: 'wonderland-team-02', name: 'Cos & Lolita 同好', members: 2, capacity: 5, note: '想一起拍照、逆摊位，晚上看午夜舞会。' },
    ],
  },
  {
    id: 'print-something',
    title: '把一个念头，印成一张纸',
    subtitle: '孔版印刷入门工作坊',
    category: 'MAKE / 动手工作坊',
    interest: 'make',
    date: '10 月 03 日 · 周六 14:00',
    duration: '约 2 小时',
    durationMinutes: 120,
    venue: '纸间印刷工作室',
    district: '长宁区 · 延安西路',
    price: '¥ 68 / 人',
    budgetCeiling: 68,
    socialFit: 'group',
    host: '主理人 阿禾',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1300&q=85',
    imageAlt: '纸张与创作工具组成的工作台',
    description: '用两种颜色和简单的手工印刷，完成一张可以带走的小海报。不需要经验，带着一句想说的话来就好。',
    teams: [
      { id: 'print-afternoon-a', name: '一起做点什么', members: 3, capacity: 6, note: '想从零开始试印刷，欢迎第一次来。' },
      { id: 'print-afternoon-b', name: '慢慢做小组', members: 2, capacity: 4, note: '结束后想在附近喝杯咖啡。' },
    ],
  },
  {
    id: 'night-notes',
    title: '上海夜色采集行动',
    subtitle: '静安街区夜间漫游',
    category: 'WALK / 城市漫游',
    interest: 'city',
    date: '10 月 04 日 · 周日 19:00',
    duration: '约 90 分钟',
    durationMinutes: 90,
    venue: '静安寺地铁站 2 号口',
    district: '静安区 · 愚园路一带',
    price: '免费',
    budgetCeiling: 0,
    socialFit: 'both',
    host: '城市观察员 小满',
    image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1300&q=85',
    imageAlt: '街道边树影与建筑的城市一角',
    description: '从一处熟悉的路口出发，用声音、光线和气味记录夜晚。路线留有休息点，也可以随时结束行程。',
    teams: [
      { id: 'night-notes-a', name: '沿路慢慢走', members: 2, capacity: 5, note: '不赶路，沿街看看老建筑。' },
      { id: 'night-notes-b', name: '带上耳机再出门', members: 4, capacity: 4, note: '小队已满，看看其他同行组。' },
    ],
  },
  {
    id: 'record-listen',
    title: '听完一面唱片，再认识一首歌',
    subtitle: '小型黑胶聆听会',
    category: 'LISTEN / 音乐现场',
    interest: 'listen',
    date: '10 月 05 日 · 周一 19:30',
    duration: '约 60 分钟',
    durationMinutes: 60,
    venue: '回声聆听室',
    district: '徐汇区 · 湖南路',
    price: '¥ 35 / 人',
    budgetCeiling: 35,
    socialFit: 'both',
    host: '唱片收藏者 阿哲',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1300&q=85',
    imageAlt: '灯光柔和的室内聆听空间',
    description: '选一张唱片，从头到尾完整听一遍。可以分享你注意到的声音，也可以安静地听完再离开。',
    teams: [
      { id: 'record-listen-a', name: '安静听完这一面', members: 1, capacity: 4, note: '第一次参加聆听会，想认识新音乐。' },
    ],
  },
]