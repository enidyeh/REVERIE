import type { Localized } from '../i18n/messages'

export type SpaceVisitSlot = {
  id: string
  label: Localized
}

export type YouthSpace = {
  id: string
  name: Localized
  category: Localized
  interest: 'city' | 'make' | 'listen'
  socialFit: 'solo' | 'group' | 'both'
  district: Localized
  address: Localized
  hours: Localized
  price: Localized
  durationMinutes: number
  budgetCeiling: number
  visitDuration: Localized
  visitGuide: Localized
  image: string
  imageAlt: Localized
  description: Localized
  activities: Localized<string[]>
  visitSlots: SpaceVisitSlot[]
}

export const youthSpaces: YouthSpace[] = [
  {
    id: 'echo-house',
    name: { zh: '回声青年空间', en: 'Echo Youth Space' },
    category: { zh: '创作与聆听', en: 'LISTEN / making and listening' },
    interest: 'listen',
    socialFit: 'both',
    district: { zh: '徐汇区 · 湖南路', en: 'Xuhui · Hunan Road' },
    address: { zh: '永嘉路附近 · 演示地址', en: 'Near Yongjia Road · demo address' },
    hours: { zh: '周二至周日 11:00–21:00', en: 'Tue–Sun 11:00–21:00' },
    price: { zh: '到访免费', en: 'Free entry' },
    durationMinutes: 90,
    budgetCeiling: 0,
    visitDuration: { zh: '建议停留 60–90 分钟', en: 'Suggested stay 60–90 min' },
    visitGuide: {
      zh: '可以独自到访，也可以和同行者一起来。第一次来时，空间伙伴会介绍共享桌和聆听区的使用方式。',
      en: 'Come alone or with a companion. On a first visit a host shows you how the shared desks and the listening area work.',
    },
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1300&q=85',
    imageAlt: { zh: '带有桌椅与日光的青年共享空间', en: 'A shared youth space with tables, chairs and daylight' },
    description: {
      zh: '一间可以安静工作、交换唱片和办小型放映的社区空间。第一次来可以预约一个短时段，由空间伙伴带你熟悉环境。',
      en: 'A community space for working quietly, swapping records and hosting small screenings. On a first visit you can book a short slot and have a host walk you through the space.',
    },
    activities: {
      zh: ['黑胶聆听', '独立放映', '共享工作桌'],
      en: ['Vinyl listening', 'Independent screening', 'Shared work desk'],
    },
    visitSlots: [
      { id: 'echo-sat-1500', label: { zh: '周六 15:00', en: 'Sat 15:00' } },
      { id: 'echo-sun-1100', label: { zh: '周日 11:00', en: 'Sun 11:00' } },
    ],
  },
  {
    id: 'open-door-lab',
    name: { zh: '开门实验室', en: 'Open Door Lab' },
    category: { zh: '动手与共创', en: 'MAKE / making and co-creating' },
    interest: 'make',
    socialFit: 'group',
    district: { zh: '长宁区 · 延安西路', en: 'Changning · West Yan’an Road' },
    address: { zh: '中山公园附近 · 演示地址', en: 'Near Zhongshan Park · demo address' },
    hours: { zh: '周三至周日 12:00–20:00', en: 'Wed–Sun 12:00–20:00' },
    price: { zh: '空间参观免费', en: 'Visits are free' },
    durationMinutes: 120,
    budgetCeiling: 0,
    visitDuration: { zh: '建议留出约 2 小时', en: 'Set aside about 2 hours' },
    visitGuide: {
      zh: '适合对创作好奇的人一起参观；不需要自带材料，先看看公共工具台和开放桌即可。',
      en: 'Good for anyone curious about making, and you can come as a group. No materials needed — start by looking at the public tool bench and the open table.',
    },
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1300&q=85',
    imageAlt: { zh: '桌椅和创作工作台组成的室内空间', en: 'An indoor space with tables, chairs and a making bench' },
    description: {
      zh: '为刚开始做东西的人留的一间工作室，有公共工具台、作品交换架和每周一次的开放桌。参观时可以了解空间规则和当周活动。',
      en: 'A studio kept for people who have just started making things, with a public tool bench, a shelf for swapping work and a weekly open table. Visits cover the house rules and the week’s activity.',
    },
    activities: {
      zh: ['开放工作台', '作品交换', '小型工作坊'],
      en: ['Open workbench', 'Work swap', 'Small workshop'],
    },
    visitSlots: [
      { id: 'open-sat-1400', label: { zh: '周六 14:00', en: 'Sat 14:00' } },
      { id: 'open-sun-1600', label: { zh: '周日 16:00', en: 'Sun 16:00' } },
    ],
  },
  {
    id: 'corner-club',
    name: { zh: '街角俱乐部', en: 'Corner Club' },
    category: { zh: '城市与社群', en: 'MEET / city and community' },
    interest: 'city',
    socialFit: 'group',
    district: { zh: '静安区 · 愚园路', en: 'Jing’an · Yuyuan Road' },
    address: { zh: '静安寺附近 · 演示地址', en: 'Near Jing’an Temple · demo address' },
    hours: { zh: '周一至周日 10:00–22:00', en: 'Mon–Sun 10:00–22:00' },
    price: { zh: '到访免费', en: 'Free entry' },
    durationMinutes: 90,
    budgetCeiling: 0,
    visitDuration: { zh: '建议停留 60–90 分钟', en: 'Suggested stay 60–90 min' },
    visitGuide: {
      zh: '如果想参加主题晚餐，建议约同行者一起；只想读书或休息，也可以短暂停留。',
      en: 'For a themed dinner, bring a companion; if you only want to read or rest, a short stop is fine too.',
    },
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1300&q=85',
    imageAlt: { zh: '共享桌边有植物和自然光的室内空间', en: 'An indoor space with plants and daylight beside shared tables' },
    description: {
      zh: '把旧店屋改成的城市客厅，适合停下来读书、认识邻居，或者参加一场不太正式的主题晚餐。',
      en: 'An old shop turned into a city living room — a place to stop, read, meet neighbours, or join a fairly informal themed dinner.',
    },
    activities: {
      zh: ['邻里晚餐', '城市读书会', '周末闲谈'],
      en: ['Neighbourhood dinner', 'City reading group', 'Weekend conversation'],
    },
    visitSlots: [
      { id: 'corner-fri-1830', label: { zh: '周五 18:30', en: 'Fri 18:30' } },
      { id: 'corner-sat-1100', label: { zh: '周六 11:00', en: 'Sat 11:00' } },
    ],
  },
]