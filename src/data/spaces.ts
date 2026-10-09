export type SpaceVisitSlot = {
  id: string
  label: string
}

export type YouthSpace = {
  id: string
  name: string
  category: string
  interest: 'city' | 'make' | 'listen'
  socialFit: 'solo' | 'group' | 'both'
  district: string
  address: string
  hours: string
  price: string
  durationMinutes: number
  budgetCeiling: number
  visitDuration: string
  visitGuide: string
  image: string
  imageAlt: string
  description: string
  activities: string[]
  visitSlots: SpaceVisitSlot[]
}

export const youthSpaces: YouthSpace[] = [
  {
    id: 'echo-house',
    name: '回声青年空间',
    category: 'LISTEN / 创作与聆听',
    interest: 'listen',
    socialFit: 'both',
    district: '徐汇区 · 湖南路',
    address: '永嘉路附近 · 演示地址',
    hours: '周二至周日 11:00–21:00',
    price: '到访免费',
    durationMinutes: 90,
    budgetCeiling: 0,
    visitDuration: '建议停留 60–90 分钟',
    visitGuide: '可以独自到访，也可以和同行者一起来。第一次来时，空间伙伴会介绍共享桌和聆听区的使用方式。',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1300&q=85',
    imageAlt: '带有桌椅与日光的青年共享空间',
    description: '一间可以安静工作、交换唱片和办小型放映的社区空间。第一次来可以预约一个短时段，由空间伙伴带你熟悉环境。',
    activities: ['黑胶聆听', '独立放映', '共享工作桌'],
    visitSlots: [
      { id: 'echo-sat-1500', label: '周六 15:00' },
      { id: 'echo-sun-1100', label: '周日 11:00' },
    ],
  },
  {
    id: 'open-door-lab',
    name: '开门实验室',
    category: 'MAKE / 动手与共创',
    interest: 'make',
    socialFit: 'group',
    district: '长宁区 · 延安西路',
    address: '中山公园附近 · 演示地址',
    hours: '周三至周日 12:00–20:00',
    price: '空间参观免费',
    durationMinutes: 120,
    budgetCeiling: 0,
    visitDuration: '建议留出约 2 小时',
    visitGuide: '适合对创作好奇的人一起参观；不需要自带材料，先看看公共工具台和开放桌即可。',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1300&q=85',
    imageAlt: '桌椅和创作工作台组成的室内空间',
    description: '为刚开始做东西的人留的一间工作室，有公共工具台、作品交换架和每周一次的开放桌。参观时可以了解空间规则和当周活动。',
    activities: ['开放工作台', '作品交换', '小型工作坊'],
    visitSlots: [
      { id: 'open-sat-1400', label: '周六 14:00' },
      { id: 'open-sun-1600', label: '周日 16:00' },
    ],
  },
  {
    id: 'corner-club',
    name: '街角俱乐部',
    category: 'MEET / 城市与社群',
    interest: 'city',
    socialFit: 'group',
    district: '静安区 · 愚园路',
    address: '静安寺附近 · 演示地址',
    hours: '周一至周日 10:00–22:00',
    price: '到访免费',
    durationMinutes: 90,
    budgetCeiling: 0,
    visitDuration: '建议停留 60–90 分钟',
    visitGuide: '如果想参加主题晚餐，建议约同行者一起；只想读书或休息，也可以短暂停留。',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1300&q=85',
    imageAlt: '共享桌边有植物和自然光的室内空间',
    description: '把旧店屋改成的城市客厅，适合停下来读书、认识邻居，或者参加一场不太正式的主题晚餐。',
    activities: ['邻里晚餐', '城市读书会', '周末闲谈'],
    visitSlots: [
      { id: 'corner-fri-1830', label: '周五 18:30' },
      { id: 'corner-sat-1100', label: '周六 11:00' },
    ],
  },
]