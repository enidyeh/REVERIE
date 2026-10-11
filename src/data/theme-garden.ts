// 「游园惊梦」的活动内容。资料来自项目方《异想集｜游园惊梦 合作手册》《摊主手册》与摊主确认页（VOL.2 异想集）。
// 已确认：名称与官方英文名、日期 9.25–9.27、集市场地（上海利园 B2）、内容板块（集市 / 展览 / 体验 / 演出 / 消费）、
// 六个招募品类、拟邀阵容、空间与美学关键词、概念文案（含官方英文）。
// 尚未提供、因此不编造的部分：当天具体场次与阵容排期（这里只列日间「游园」与夜间「惊梦」两个时段）、正式场地图、
// 观众票价、互动测试与 24H 任务（这一期用 interact: false 关掉，见 src/data/theme.ts）。
import type { Localized } from '../i18n/messages'
import type {
  ThemeActivity,
  ThemeBrand,
  ThemeCreator,
  ThemeDuality,
  ThemeDualityLabels,
  ThemeMapGroup,
  ThemeMapPlan,
  ThemeMeta,
  ThemeRitual,
  ThemeTicket,
} from './theme'

export const gardenMeta: ThemeMeta = {
  series: { zh: '异想集 REVERIE｜游园惊梦', en: 'REVERIE EAST｜A DREAM IN THE GARDEN' } as Localized,
  title: { zh: '游园惊梦', en: 'A DREAM IN THE GARDEN' } as Localized,
  titleLines: { zh: ['游 园', '惊 梦'], en: ['A DREAM IN THE GARDEN'] } as Localized<string[]>,
  issue: 'ISSUE 002',
  window: '2026.9.25-9.27',
  city: { zh: '上海', en: 'SHANGHAI' } as Localized,
  // 标签行目前不在界面上展示，这里保留与本期主题一致的关键词。
  tags: ['EASTERN', 'MARKET', 'EXHIBITION', 'PERFORMANCE'],
  heroLine: {
    zh: '从白日的「游园」到夜晚的「惊梦」，把独立品牌、艺术展览、戏剧 Live 放进同一个现场，让东方不再只是被观看，而是被看见、被听见、被触碰、被重新创造。',
    en: 'From the daytime to the nighttime we bring independent brands, art exhibitions, theatre and live performances into one shared space, so that the East is no longer something merely observed, but something seen, heard, touched, and created anew.',
  } as Localized,
  // 配图仍为占位素材（Unsplash 演示图），待项目方提供正式视觉。
  heroImage: 'https://images.unsplash.com/photo-1771121789117-c881626f011b?auto=format&fit=crop&w=1600&q=85',
  heroImageAlt: { zh: '白墙灰瓦的院落里，盆景与开花的树', en: 'A courtyard of white walls and tiled roofs, with a bonsai and a blossom tree' } as Localized,
  sweetImage: 'https://images.unsplash.com/photo-1784649164006-8f91b1b84df9?auto=format&fit=crop&w=900&q=80',
  sweetImageAlt: { zh: '白墙花窗与太湖石围出的一方庭院', en: 'A courtyard of white walls, a lattice window and a scholar’s rock' } as Localized,
  darkImage: 'https://images.unsplash.com/photo-1784650922709-2b32951c61b9?auto=format&fit=crop&w=900&q=80',
  darkImageAlt: { zh: '檐下挂起的一串灯笼', en: 'Lanterns hanging under the eaves' } as Localized,
  rabbitImage: 'https://images.unsplash.com/photo-1787668400530-88eb13bd729c?auto=format&fit=crop&w=1000&q=80',
  rabbitImageAlt: { zh: '院落里的一座香炉', en: 'An incense burner in a courtyard' } as Localized,
}

// 两个时段沿用资料里的日间 / 夜间分法（合作手册与摊主手册一致：12:00–18:00 游园、晚间惊梦）。
// 摊主确认页另写摊位时段 11:00-21:00，两者口径不同，已在文档里记录待项目方确认。
export const gardenDualityLabels: ThemeDualityLabels = {
  code: { zh: '内容', en: 'CONTENT' } as Localized,
  scene: { zh: '现场布景', en: 'SET DESIGN' } as Localized,
}

export const gardenDuality: ThemeDuality = {
  sweet: {
    label: { zh: '游园 · 日间', en: 'THE GARDEN · DAYTIME' },
    code: { zh: '集市 / 展览 / 工作坊 · 12:00–18:00', en: 'Market / exhibition / workshops · 12:00–18:00' },
    scene: { zh: '园林意象 · 廊道结构 · 镜面纱幕 · 当代东方', en: 'Garden motifs · corridor structures · mirrored gauze · contemporary East' },
  },
  dark: {
    label: { zh: '惊梦 · 夜间', en: 'THE DREAM · NIGHT' },
    code: { zh: '演出 / DJ / 派对 · 18:00–LATE', en: 'Performances / DJ / party · 18:00–LATE' },
    scene: { zh: '戏台装置 · 灯笼与烛火 · 旧梦新生 · 梦核氛围', en: 'Stage installations · lanterns and candlelight · old dreams reborn · dreamcore' },
  },
}

// 六个玩法板块：来自资料里的现场内容策划（集市 / 展览 / 体验 / 演出 / 消费）与平面图上的服务台。
export const gardenRituals: ThemeRitual[] = [
  {
    id: 'garden-market',
    index: '01',
    kind: { zh: '集市', en: 'Market' },
    name: { zh: '游园集市', en: 'THE GARDEN MARKET' },
    line: { zh: '独立品牌、生活方式与餐饮摊位，80–100 个开放名额。', en: 'Independent brands, lifestyle and food stalls — 80 to 100 places.' },
  },
  {
    id: 'eastern-exhibition',
    index: '02',
    kind: { zh: '展览', en: 'Exhibition' },
    name: { zh: '东方异想展', en: 'EASTERN IMAGINATION' },
    line: { zh: '东方艺术、文化研究与艺术装置。', en: 'Eastern art, cultural research and art installations.' },
  },
  {
    id: 'tea-and-workshops',
    index: '03',
    kind: { zh: '体验', en: 'Experience' },
    name: { zh: '茶会与手作坊', en: 'TEA & WORKSHOPS' },
    line: { zh: '茶会、手作坊与文化论坛。', en: 'Tea gatherings, workshops and cultural talks.' },
  },
  {
    id: 'the-stage',
    index: '04',
    kind: { zh: '演出', en: 'Performance' },
    name: { zh: '戏台演出', en: 'THE STAGE' },
    line: { zh: '演出、DJ 与派对，从游园一路走到惊梦。', en: 'Performances, DJ sets and parties, from the garden all the way into the night.' },
  },
  {
    id: 'brands-and-fnb',
    index: '05',
    kind: { zh: '消费', en: 'Commerce' },
    name: { zh: '品牌与餐饮', en: 'BRANDS & F&B' },
    line: { zh: '品牌、餐饮与活动限定。', en: 'Brands, food and drink, and event exclusives.' },
  },
  {
    id: 'garden-guide',
    index: '06',
    kind: { zh: '服务台', en: 'Info desk' },
    name: { zh: '游园指引', en: 'GARDEN GUIDE' },
    line: { zh: '领票、场地图与当天时间表在这里。', en: 'Tickets, the floor plan and the day’s timetable are here.' },
  },
]

export const gardenScheduleDays = ['9.25', '9.26', '9.27'] as const

// 具体场次与阵容待项目方提供：这里只列资料里明确的日间「游园」与夜间「惊梦」两个时段，名额标注为不限，不编造场次名。
export const gardenSchedule: ThemeActivity[] = gardenScheduleDays.flatMap((day) => [
  {
    id: `garden-day-${day.replace('.', '')}`,
    day,
    time: '12:00–18:00',
    kind: { zh: '日间', en: 'Daytime' },
    name: { zh: '游园', en: 'THE GARDEN' },
    seats: { zh: '不限', en: 'Open entry' },
    line: { zh: '集市、展览与工作坊：日间的游园。', en: 'Market, exhibitions and workshops — the garden by day.' },
  },
  {
    id: `garden-night-${day.replace('.', '')}`,
    day,
    time: '18:00–LATE',
    kind: { zh: '夜间', en: 'Night' },
    name: { zh: '惊梦', en: 'THE DREAM' },
    seats: { zh: '不限', en: 'Open entry' },
    line: { zh: '演出、DJ 与派对：夜里的惊梦。', en: 'Performances, DJ sets and parties — the dream by night.' },
  },
])

export const gardenScheduleNote: Localized = {
  zh: '当天排期待项目方提供：这里只列出日间「游园」与夜间「惊梦」两个时段，具体场次与阵容以官方发布为准；「预约」只在本机记录，不产生真实报名、不收集手机号或身份信息。',
  en: 'The detailed schedule is to be provided: only the daytime garden and the nighttime dream sessions are listed here; the final programme and line-up follow the official announcement. "Reserve" only records on this device — no real sign-up, and no phone number or identity is collected.',
} as Localized

export const gardenMapPlan: ThemeMapPlan = {
  title: { zh: '利园 B2 集市平面图', en: 'LEE GARDEN B2 FLOOR PLAN' } as Localized,
  note: {
    zh: '集市位于上海利园 B2；正式平面图与展位排布待项目方提供。',
    en: 'The market is on B2 at Lee Garden; the final floor plan and stall layout are to be provided.',
  } as Localized,
}

export const gardenMapGroups: ThemeMapGroup[] = [
  {
    id: 'brands',
    index: '01',
    token: { zh: '摊位', en: 'STALLS' },
    label: { zh: '集市摊位', en: 'Market stalls' },
    desc: { zh: '6 个招募品类，80–100 个开放名额', en: 'Six categories, 80 to 100 places' },
    count: '100',
  },
  {
    id: 'creators',
    index: '02',
    token: { zh: '阵容', en: 'LINE-UP' },
    label: { zh: '拟邀阵容', en: 'Proposed line-up' },
    desc: { zh: '均为拟邀请，最终以官方发布为准', en: 'Proposed line-up, subject to the official announcement' },
    count: '10',
  },
]

// 六个招募品类（资料自带中英文）。摊位状态两版都写「招募中 / OPEN CALL」，报名方式写在 note 里。
const applyNote: Localized = { zh: '报名微信 QINETIC（备注摊主）。', en: 'Apply via WeChat: QINETIC.' } as Localized

export const gardenBrands: ThemeBrand[] = [
  { id: 'fashion', index: '01', name: { zh: '时尚', en: 'FASHION' }, booth: { zh: '招募中', en: 'OPEN CALL' }, line: { zh: '服装 / 古着 / 包 / 饰品', en: 'Clothing / vintage / bags / accessories' }, note: applyNote },
  { id: 'objects', index: '02', name: { zh: '器物', en: 'OBJECT' }, booth: { zh: '招募中', en: 'OPEN CALL' }, line: { zh: '家居 / 器物 / 香氛 / 文具', en: 'Homeware / objects / fragrance / stationery' }, note: applyNote },
  { id: 'art', index: '03', name: { zh: '艺术', en: 'ART' }, booth: { zh: '招募中', en: 'OPEN CALL' }, line: { zh: '插画 / 艺术 / 印刷 / 摄影', en: 'Illustration / art / print / photography' }, note: applyNote },
  { id: 'culture', index: '04', name: { zh: '文化', en: 'CULTURE' }, booth: { zh: '招募中', en: 'OPEN CALL' }, line: { zh: '文化创造 / 独立出版', en: 'Cultural creation / independent publishing' }, note: applyNote },
  { id: 'food', index: '05', name: { zh: '餐饮', en: 'FOOD & DRINK' }, booth: { zh: '招募中', en: 'OPEN CALL' }, line: { zh: '咖啡 / 零食 / 酒水', en: 'Coffee / snacks / drinks' }, note: applyNote },
  { id: 'lifestyle', index: '06', name: { zh: '生活方式', en: 'LIFESTYLE' }, booth: { zh: '招募中', en: 'OPEN CALL' }, line: { zh: '花艺 / 宠物 / 兴趣', en: 'Floristry / pets / hobbies' }, note: applyNote },
]

// 拟邀阵容：全部来自资料，均为「拟邀请」状态（见 gardenMapGroups 的说明）。
// 账号名在英文一侧改用拉丁写法（与「因斐涅特 / infinite」的做法一致），中文一侧保留资料里的原始账号名。
export const gardenCreators: ThemeCreator[] = [
  { id: 'runbobo', index: '01', name: { zh: '逃泡泡 RunBoBo', en: 'RunBoBo' }, field: { zh: '品牌', en: 'Brand' }, line: { zh: '捕捉千禧梦幻回忆，精选幸福供您欣赏。', en: 'Catching millennium dream memories, with a selection of happiness to enjoy.' } },
  { id: 'guanhu', index: '02', name: { zh: '观葫 GUANHU ARTWORK', en: 'GUANHU ARTWORK' }, field: { zh: '品牌', en: 'Brand' }, line: { zh: '专注「现代东方美学」的原创设计品牌。', en: 'An original design brand focused on modern Eastern aesthetics.' } },
  { id: 'iasonas', index: '03', name: { zh: 'iasonas', en: 'iasonas' }, field: { zh: '品牌', en: 'Brand' }, line: { zh: '原创家居品牌：把艺术藏进每一天的光影里。', en: 'An original homeware brand, hiding art in the light and shadow of every day.' } },
  { id: 'lumaodashi', index: '04', name: { zh: '@撸猫大师', en: '@Lumaodashi' }, field: { zh: '艺术家', en: 'Artist' }, line: { zh: '3D 数字艺术：由中式梦核风格衍生的概念短片《假人剧场》《赛博千禧 2077》连载中。', en: '3D digital art: concept shorts born from Chinese dreamcore aesthetics, including Mannequin Theatre and Cyber Millennium 2077.' } },
  { id: 'tintin', index: '05', name: { zh: '@丁丁波-Tintin', en: '@Tintin' }, field: { zh: '艺术家', en: 'Artist' }, line: { zh: '作品方向：千禧梦核 / 游园惊梦。', en: 'Millennium dreamcore, and a dream in the garden.' } },
  { id: 'kaka', index: '06', name: { zh: '@KAKA', en: '@KAKA' }, field: { zh: '演出', en: 'Performance' }, line: { zh: '创新京剧演绎。', en: 'A reinvented Peking opera performance.' } },
  { id: 'hovy-lee', index: '07', name: { zh: '@李麦诚 Hovy Lee', en: '@Hovy Lee' }, field: { zh: '演出', en: 'Performance' }, line: { zh: '京剧演出。', en: 'Peking opera performance.' } },
  { id: 'teahouse-rave', index: '08', name: { zh: '茶馆锐舞', en: 'Teahouse Rave' }, field: { zh: '演出', en: 'Performance' }, line: { zh: '传统演艺。', en: 'Traditional performance.' } },
  { id: 'tata-commune', index: '09', name: { zh: '@她她公社', en: '@Tata Commune' }, field: { zh: '社群', en: 'Community' }, line: { zh: '女性成长社群。', en: 'A community for women’s growth.' } },
  { id: 'lady-talk', index: '10', name: { zh: '@蕾蒂逃课 Lady Talk', en: '@Lady Talk' }, field: { zh: '社群', en: 'Community' }, line: { zh: '美好事物中介所。', en: 'An agency for good things.' } },
]

// 观众票价未提供：沿用演示票价，界面上标注为演示。
export const gardenTicket: ThemeTicket = {
  name: { zh: '游园入场券', en: 'GARDEN ENTRY TICKET' } as Localized,
  price: 29.9,
  minCount: 1,
  maxCount: 10,
  note: {
    zh: '演示票价，正式价格以官方渠道为准；本站不接入真实支付，不会扣款。',
    en: 'Demo price. The official price comes from official channels; no real payment is connected and nothing is charged.',
  } as Localized,
  payMethods: [
    { id: 'alipay', name: { zh: '支付宝', en: 'Alipay' } as Localized },
    { id: 'wechat', name: { zh: '微信支付', en: 'WeChat Pay' } as Localized },
    { id: 'card', name: { zh: '银行卡', en: 'Card' } as Localized },
  ],
}

// 集市位于上海利园 B2（摊主确认页）；入场日期只写日期，时段见活动详情里的日间 / 夜间分法。
export const gardenEntryDate = '2026.9.25-9.27'
export const gardenVenue: Localized = {
  zh: '上海利园 Lee Garden · 静安区新闸路 668 号（集市位于 B2）',
  en: 'Lee Garden, Jing’an · No.668 Xinzha Road, Shanghai (market on B2)',
} as Localized
