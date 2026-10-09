import type { Localized } from '../i18n/messages'

// 项目方给的形式清单（均为可选，不含 Space / Brand collaboration）。
// EVENTS 页顶部的「REVERIE｜异想集」定位说明（含页头与 `01 / HOW IT WORKS` 七步链条）
// 已按项目方要求整体删除，只剩这行标签，且只做说明：不可点击、也不筛选列表。
// 双语约定：显示文案写成 `{ zh, en }`；id、人数、时长分钟数、预算上限等保持普通类型。
export const eventsFormats = {
  label: { zh: '可选形式', en: 'OPTIONAL FORMATS' } as Localized,
  items: {
    zh: ['活动', '节展', '展览', '市集', '派对', '对谈', '工作坊', '社群', '快闪'],
    en: ['Event', 'Festival', 'Exhibition', 'Market', 'Party', 'Talk', 'Workshop', 'Community', 'Pop-up'],
  } as Localized<string[]>,
}

export type EventTeam = {
  id: string
  name: Localized
  members: number
  capacity: number
  note: Localized
}

export type CityEvent = {
  id: string
  title: Localized
  /** 可选副标题：只在需要时展示，例如工作坊 / 漫游 / 聆听会一行说明。 */
  subtitle?: Localized
  category: Localized
  interest: 'city' | 'make' | 'listen'
  date: Localized
  duration: Localized
  durationMinutes: number
  venue: Localized
  district: Localized
  price: Localized
  budgetCeiling: number
  socialFit: 'solo' | 'group' | 'both'
  host: Localized
  image: string
  imageAlt: Localized
  description: Localized
  // 活动内容（如节展的各个板块），可选；在活动详情里以标签形式展示。
  program?: Localized<string[]>
  teams: EventTeam[]
}

export const cityEvents: CityEvent[] = [
  // 旗舰活动：放在首位，因此以「精选卡」形式展开；原来的「把一个念头，印成一张纸」工作坊顺位为普通列表项。
  {
    id: 'reverie-in-the-wonderland',
    title: { zh: 'REVERIE｜梦游仙境', en: 'REVERIE in the WONDERLAND' },
    category: { zh: '主题节', en: 'FESTIVAL' },
    interest: 'city',
    date: { zh: '10 月 31 日 — 11 月 01 日 · 周六日 11:00', en: '31 Oct — 1 Nov · Sat–Sun 11:00' },
    duration: { zh: '两天 · 11:00–20:00', en: 'Two days · 11:00–20:00' },
    durationMinutes: 540,
    venue: { zh: '八号桥艺术空间', en: 'No.8 Bridge Art Space' },
    district: { zh: '黄浦区 · 八号桥', en: 'Huangpu · No.8 Bridge' },
    price: { zh: '¥ 29.9 起 · 演示', en: 'from ¥29.9 · demo' },
    budgetCeiling: 30,
    socialFit: 'both',
    host: { zh: '异想集 REVERIE', en: 'REVERIE' },
    image: 'https://images.unsplash.com/photo-1544039161-b0c20826c6f6?auto=format&fit=crop&w=1300&q=85',
    imageAlt: { zh: '雾中带有紫红色光的梦境场景', en: 'A dreamlike scene in fog with violet light' },
    description: {
      zh: '把异想集的梦境搬进真实场地：兔子洞、疯茶会、Lolita、Cos、展览、Market、Performance 与 Midnight Ball 在同一个周末里接连发生。',
      en: 'Bring REVERIE’s dream into a real venue: rabbit hole, mad tea party, Lolita, cos, exhibition, market, performance and midnight ball back to back in one weekend.',
    },
    program: {
      zh: ['兔子洞', '疯茶会', 'Lolita', 'Cos', '展览', 'Market', 'Performance', 'Midnight Ball'],
      en: ['Rabbit hole', 'Mad tea party', 'Lolita', 'Cos', 'Exhibition', 'Market', 'Performance', 'Midnight Ball'],
    },
    teams: [
      {
        id: 'wonderland-team-01',
        name: { zh: '第一次进梦境的人', en: 'First time in the dream' },
        members: 3,
        capacity: 6,
        note: { zh: '以前没来过 REVERIE，想有人一起走完全场。', en: 'Never been to REVERIE before and want company for the whole run.' },
      },
      {
        id: 'wonderland-team-02',
        name: { zh: 'Cos & Lolita 同好', en: 'Cos & Lolita friends' },
        members: 2,
        capacity: 5,
        note: { zh: '想一起拍照、逆摊位，晚上看午夜舞会。', en: 'Want to shoot photos together, browse the stalls and stay for the midnight ball.' },
      },
    ],
  },
  {
    id: 'print-something',
    title: { zh: '把一个念头，印成一张纸', en: 'Print one idea onto one sheet' },
    subtitle: { zh: '孔版印刷入门工作坊', en: 'Stencil printing for beginners' },
    category: { zh: '动手工作坊', en: 'MAKE' },
    interest: 'make',
    date: { zh: '10 月 03 日 · 周六 14:00', en: '3 Oct · Sat 14:00' },
    duration: { zh: '约 2 小时', en: 'about 2 hours' },
    durationMinutes: 120,
    venue: { zh: '纸间印刷工作室', en: 'Paper Room Print Studio' },
    district: { zh: '长宁区 · 延安西路', en: 'Changning · West Yan’an Road' },
    price: { zh: '¥ 68 / 人', en: '¥68 per person' },
    budgetCeiling: 68,
    socialFit: 'group',
    host: { zh: '主理人 阿禾', en: 'Host: Ahe' },
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1300&q=85',
    imageAlt: { zh: '纸张与创作工具组成的工作台', en: 'A workbench of paper and making tools' },
    description: {
      zh: '用两种颜色和简单的手工印刷，完成一张可以带走的小海报。不需要经验，带着一句想说的话来就好。',
      en: 'Make a small poster you can take home with two colours and simple hand printing. No experience needed — just bring one line you want to say.',
    },
    teams: [
      {
        id: 'print-afternoon-a',
        name: { zh: '一起做点什么', en: 'Make something together' },
        members: 3,
        capacity: 6,
        note: { zh: '想从零开始试印刷，欢迎第一次来。', en: 'Starting printing from zero — first-timers welcome.' },
      },
      {
        id: 'print-afternoon-b',
        name: { zh: '慢慢做小组', en: 'Slow makers' },
        members: 2,
        capacity: 4,
        note: { zh: '结束后想在附近喝杯咖啡。', en: 'Want to grab coffee nearby afterwards.' },
      },
    ],
  },
  {
    id: 'night-notes',
    title: { zh: '上海夜色采集行动', en: 'Shanghai after dark' },
    subtitle: { zh: '静安街区夜间漫游', en: 'A night walk around Jing’an' },
    category: { zh: '城市漫游', en: 'WALK' },
    interest: 'city',
    date: { zh: '10 月 04 日 · 周日 19:00', en: '4 Oct · Sun 19:00' },
    duration: { zh: '约 90 分钟', en: 'about 90 minutes' },
    durationMinutes: 90,
    venue: { zh: '静安寺地铁站 2 号口', en: 'Jing’an Temple metro, exit 2' },
    district: { zh: '静安区 · 愚园路一带', en: 'Jing’an · around Yuyuan Road' },
    price: { zh: '免费', en: 'Free' },
    budgetCeiling: 0,
    socialFit: 'both',
    host: { zh: '城市观察员 小满', en: 'City observer Xiaoman' },
    image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1300&q=85',
    imageAlt: { zh: '街道边树影与建筑的城市一角', en: 'A city corner of trees and buildings along the street' },
    description: {
      zh: '从一处熟悉的路口出发，用声音、光线和气味记录夜晚。路线留有休息点，也可以随时结束行程。',
      en: 'Start from a familiar junction and record the night through sound, light and smell. The route has resting points, and you can leave whenever you like.',
    },
    teams: [
      {
        id: 'night-notes-a',
        name: { zh: '沿路慢慢走', en: 'Walking slowly' },
        members: 2,
        capacity: 5,
        note: { zh: '不赶路，沿街看看老建筑。', en: 'No rush — we look at the old buildings along the way.' },
      },
      {
        id: 'night-notes-b',
        name: { zh: '带上耳机再出门', en: 'Headphones on' },
        members: 4,
        capacity: 4,
        note: { zh: '小队已满，看看其他同行组。', en: 'This squad is full — look at the other groups.' },
      },
    ],
  },
  {
    id: 'record-listen',
    title: { zh: '听完一面唱片，再认识一首歌', en: 'Play one record through, then meet one song' },
    subtitle: { zh: '小型黑胶聆听会', en: 'A small vinyl listening session' },
    category: { zh: '音乐现场', en: 'LISTEN' },
    interest: 'listen',
    date: { zh: '10 月 05 日 · 周一 19:30', en: '5 Oct · Mon 19:30' },
    duration: { zh: '约 60 分钟', en: 'about 60 minutes' },
    durationMinutes: 60,
    venue: { zh: '回声聆听室', en: 'Echo Listening Room' },
    district: { zh: '徐汇区 · 湖南路', en: 'Xuhui · Hunan Road' },
    price: { zh: '¥ 35 / 人', en: '¥35 per person' },
    budgetCeiling: 35,
    socialFit: 'both',
    host: { zh: '唱片收藏者 阿哲', en: 'Record collector Azhe' },
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1300&q=85',
    imageAlt: { zh: '灯光柔和的室内聆听空间', en: 'A softly lit indoor listening space' },
    description: {
      zh: '选一张唱片，从头到尾完整听一遍。可以分享你注意到的声音，也可以安静地听完再离开。',
      en: 'Pick one record and listen from start to finish. Share what you noticed, or just listen quietly and leave.',
    },
    teams: [
      {
        id: 'record-listen-a',
        name: { zh: '安静听完这一面', en: 'Listen to this side in peace' },
        members: 1,
        capacity: 4,
        note: { zh: '第一次参加聆听会，想认识新音乐。', en: 'First listening session — hoping to find new music.' },
      },
    ],
  },
]