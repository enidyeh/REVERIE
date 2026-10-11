// 本月主题内容。所有条目在界面上均标注为演示内容，不代表真实活动、售卖或预约。
// 真实场馆 / 品牌 / 价格由项目方提供，仅作编辑推荐展示；价格标记为参考价。
// 双语约定：显示用的文案写成 `{ zh, en }`，视图用 `useLocalized(...)` 或 `t(...)` 取值；
// 语言无关的标识（id、序号、展位号、票号、价格、外链）保持普通字符串。

import { contentTopics } from './content'
import { xiaohongshuUrl } from './social'
import type { Localized } from '../i18n/messages'

export type ThemeLink = { label: string; href: string }

export type ThemeCreator = {
  id: string
  index: string
  name: Localized
  field: Localized
  line: Localized
  link?: ThemeLink
}

export type ThemeBrand = {
  id: string
  index: string
  name: Localized
  handle?: Localized
  /** 展位号在「梦游仙境」里是标识（两版一致），在「游园惊梦」里是招募状态（招募中 / OPEN CALL）。 */
  booth: Localized
  line: Localized
  /** 没有外链时要显示的补充说明（游园惊梦用来说明报名方式）。 */
  note?: Localized
  link?: ThemeLink
}

export type ThemeMapGroup = {
  id: 'brands' | 'creators'
  index: string
  /** 分组行里的短标签：中文版用中文，英文版用大写英文词。 */
  token: Localized
  label: Localized
  desc: Localized
  count: string
}

export const themeMapPlan = {
  title: { zh: '2F / 3F 场地图', en: '2F / 3F FLOOR PLAN' } as Localized,
  note: {
    zh: '展位与布景的平面图待项目方提供；正式版会标出每个展商的位置、动线与试衣区／手工坊所在区域。',
    en: 'The floor plan is to be provided. The final version will mark each exhibitor’s position, the walking route, and the fitting area and workshops.',
  } as Localized,
}

export const themeMapGroups: ThemeMapGroup[] = [
  {
    id: 'brands',
    index: '01',
    token: { zh: '展商', en: 'BRANDS' },
    label: { zh: '好玩的产品展商', en: 'Brands' },
    desc: { zh: '玩偶、饰品、服装、香氛与奇怪小物', en: 'Dolls, accessories, clothing, fragrance and odd little objects' },
    count: '05',
  },
  {
    id: 'creators',
    index: '02',
    token: { zh: '创作者', en: 'CREATORS' },
    label: { zh: '艺术家与作品', en: 'Artists' },
    desc: { zh: '本月合作的创作者与他们的作品', en: 'collaborations' },
    count: '05',
  },
]

// 除「因斐涅特」为项目方提供的展商外，其余展位为预留占位，等待项目方补充品牌名、展位号与社交媒体链接。
export const themeBrands: ThemeBrand[] = [
  {
    id: 'infinite',
    index: '01',
    name: { zh: '因斐涅特', en: 'infinite' },
    handle: { zh: '@因斐涅特', en: '@infinite' },
    booth: { zh: 'Booth B07', en: 'Booth B07' },
    line: {
      zh: '玩偶｜把脑海里奇奇怪怪的小东西，缝成可以带走的朋友。',
      en: 'Dolls — odd little things from the back of the mind, stitched into friends you can take home.',
    },
  },
  ...['02', '03', '04', '05'].map((index, position) => ({
    id: `slot-${index}`,
    index,
    name: { zh: '展位待项目方提供', en: 'Booth to be provided' },
    booth: { zh: ['Booth B08', 'Booth B09', 'Booth C04', 'Booth C05'][position], en: ['Booth B08', 'Booth B09', 'Booth C04', 'Booth C05'][position] },
    line: {
      zh: '展位已预留，品牌信息与社交媒体链接待补充。',
      en: 'Booth reserved. Brand details and social links to be provided.',
    },
  })),
]

export type ThemeArticle = { id: string; title: Localized; meta: string }
export type ThemeFeaturedItem = { id: string; label: Localized; image: string; articles: ThemeArticle[] }

// 每个形式下列出的条目是**示范例子**：直接取自 HOME › CONTENT 的「线上专题」九期方向，
// 不是已发布的文章；正式标题与链接仍待项目方提供。
const featuredTopics = (prefix: string, indexes: number[]): ThemeArticle[] =>
  indexes.map((index, position) => ({
    id: `${prefix}-topic-0${position + 1}`,
    meta: `TOPIC 0${position + 1}`,
    title: contentTopics.items[index].label,
  }))

// 四张配图为占位素材（沿用本站已有的 Unsplash 演示图），待项目方提供对应专题的正式图片。
export const themeFeatured = {
  title: { zh: '特别推荐', en: 'Featured' } as Localized,
  line: { zh: '品牌可以和本月主题共创：', en: 'co-create with us:' } as Localized,
  moreLabel: { zh: '更多', en: 'more' } as Localized,
  // DISCOVER 的「特别推荐」里，文章列表（ARTICLES + 两篇占位）已按项目方要求删除，这个位置改为这个入口。
  entryLabel: { zh: '查看更多内容', en: 'read more' } as Localized,
  articleNote: {
    zh: '点它会到 HOME › CONTENT 看本月全部共创形式；文章详情页尚未接入。',
    en: 'See all co-creation formats.',
  } as Localized,
  articleNoteContent: {
    zh: '演示：每个形式下列出的是示范例子（取自本页「线上专题」），不是已发布的文章；正式标题与链接仍待项目方提供，点「更多」只显示提示。',
    en: 'Demo: the items under each format are examples (drawn from the topics listed on this page), not published articles. Final titles and links are to be provided; tapping more only shows a note.',
  } as Localized,
  // 形式清单按项目方本轮的写法与顺序：FEATURE｜青年文化专题 / TRENDS & LIFE｜趋势与生活 /
  // CITY GUIDE｜城市指南 / INTERVIEW｜品牌人物专访。
  items: [
    { id: 'feature', label: { zh: '青年文化专题', en: 'FEATURE' }, image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80', articles: featuredTopics('feature', [0, 3]) },
    { id: 'trends', label: { zh: '趋势与生活', en: 'TRENDS & LIFE' }, image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80', articles: featuredTopics('trends', [1, 2, 6]) },
    { id: 'city-guide', label: { zh: '城市指南', en: 'CITY GUIDE' }, image: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=900&q=80', articles: featuredTopics('city-guide', [4, 7]) },
    { id: 'interview', label: { zh: '品牌人物专访', en: 'INTERVIEW' }, image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80', articles: featuredTopics('interview', [5, 8]) },
  ],
  shotNote: { zh: '配图为占位素材，待项目方提供各自对应的正式图片。', en: 'Images' } as Localized,
}

// 入场时间与场地以项目方提供的原文为准：DISCOVER 的购票流程与 IDENTITY 的票据都引用这两条。
// 日期与时间是标识，两版一致；场地的英文名待项目方确认官方写法。
export const themeEntryDate = '2026.10.31-11.1 11:00-20:00'
export const themeVenue: Localized = {
  zh: '上海市黄浦区八号桥艺术空间',
  en: 'No.8 Bridge Art Space, Huangpu, Shanghai',
}

// 购票演示用的票种：价格与限购由项目方提供，仍是本地演示，不接入真实支付。
export const themeTicket = {
  name: { zh: '梦游入场券', en: 'WONDERLAND ENTRY TICKET' } as Localized,
  price: 29.9,
  minCount: 1,
  maxCount: 10,
  note: {
    zh: '演示票价，正式价格以官方渠道为准；本站不接入真实支付，不会扣款。',
    en: 'Demo price. The official price comes from official channels; no real payment is connected and nothing is charged.',
  } as Localized,
  // 支付方式仅为界面选项，不会调用任何支付渠道。
  payMethods: [
    { id: 'alipay', name: { zh: '支付宝', en: 'Alipay' } as Localized },
    { id: 'wechat', name: { zh: '微信支付', en: 'WeChat Pay' } as Localized },
    { id: 'card', name: { zh: '银行卡', en: 'Card' } as Localized },
  ],
}

// REVERIE SHOP 入口：按项目方要求统一写回 SHOP，点击会切到 HOME 的 SHOP 栏目。
export const themeShopCta = {
  label: { zh: '去异想商店看看', en: 'COLLECT THEM AT REVERIE SHOP' } as Localized,
  note: {
    zh: '点它会切到 HOME › SHOP 栏目；该栏目的商品与展商目前仍为演示内容。',
    en: 'Opens HOME › SHOP. Products and brands there are still demo content.',
  } as Localized,
}

export type ThemeRitual = {
  id: string
  index: string
  /** 中文版用中文名，英文版用英文名（原先单列的英文副标题已并入）。 */
  name: Localized
  kind: Localized
  line?: Localized
}

export type ThemeQuizOption = { id: string; label: Localized; leansTo: 'fantasy' | 'flip' }

export type ThemeQuizQuestion = {
  id: string
  index: string
  prompt: Localized
  options: ThemeQuizOption[]
}

export const themeMeta = {
  series: { zh: '异想集 REVERIE｜梦游仙境', en: 'REVERIE｜IN THE WONDERLAND' } as Localized,
  title: { zh: '梦游仙境', en: 'IN THE WONDERLAND' } as Localized,
  // H1 的断行：中文版保持错位的两行排版，英文版一行。
  titleLines: { zh: ['梦 游', '仙 境'], en: ['IN THE WONDERLAND'] } as Localized<string[]>,
  // 期号按时间线排：游园惊梦（9.25–9.27）是 ISSUE 002，梦游仙境（10.31–11.1）是 ISSUE 003。
  issue: 'ISSUE 003',
  window: '2026.10.31-11.1',
  city: { zh: '上海', en: 'SHANGHAI' } as Localized,
  tags: ['COSPLAY', 'LOLITA', 'FANTASY', 'DARK FAIRY TALE'],
  heroLine: {
    zh: '这个梦境，我们把兔子洞、镜中世界、暗黑童话和午夜舞会装进同一个梦境。',
    en: 'This time we put the rabbit hole, the mirror world, dark fairy tales and a midnight ball into one dream.',
  } as Localized,
  heroImage: 'https://images.unsplash.com/photo-1544039161-b0c20826c6f6?auto=format&fit=crop&w=1600&q=85',
  heroImageAlt: { zh: '雾气弥漫的林间小径，尽头有光', en: 'A misty forest path with light at the end' } as Localized,
  sweetImage: 'https://images.unsplash.com/photo-1558568368-dc03d41f78df?auto=format&fit=crop&w=900&q=80',
  sweetImageAlt: { zh: '浅色蕾丝布料的细节特写', en: 'Close-up of pale lace fabric' } as Localized,
  darkImage: 'https://images.unsplash.com/photo-1606241018160-4985a8ab5dec?auto=format&fit=crop&w=900&q=80',
  darkImageAlt: { zh: '昏暗房间里的古旧镜子', en: 'An old mirror in a dim room' } as Localized,
  rabbitImage: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=1000&q=80',
  rabbitImageAlt: { zh: '草地上的一只兔子', en: 'A rabbit on the grass' } as Localized,
}

export type ThemeDualitySide = {
  label: Localized
  /** 两侧的第一行：梦游仙境写着装建议，游园惊梦写内容；具体标签由 dualityLabels 提供。 */
  code: Localized
  scene: Localized
}

export type ThemeDualityLabels = { code: Localized; scene: Localized }

export const themeDualityLabels: ThemeDualityLabels = {
  code: { zh: '着装建议', en: 'DRESS CODE' },
  scene: { zh: '现场布景风格', en: 'SET DESIGN' },
}

export const themeDuality: { sweet: ThemeDualitySide; dark: ThemeDualitySide } = {
  sweet: {
    label: { zh: '甜梦', en: 'SWEET DREAM' },
    code: { zh: '奶油色 · 蕾丝 · 缎带 · 珍珠 · 蕾丝伞', en: 'Cream · lace · ribbon · pearl · lace parasol' },
    scene: {
      zh: '棉花糖色帷幔、蕾丝灯罩、软光与遍地散落的糖果道具。',
      en: 'Cotton-candy drapes, lace lampshades, soft light and candy props scattered everywhere.',
    },
  },
  dark: {
    label: { zh: '暗黑梦境', en: 'DARK FAIRY TALE' },
    code: { zh: '黑红 · 皮革 · 面纱 · 银饰 · 暗色红唇', en: 'Black and red · leather · veil · silver · dark red lips' },
    scene: {
      zh: '镜厅、红心与烛火、枯枝与旧相框，光线只落在人物边缘。',
      en: 'A mirror hall, hearts and candlelight, bare branches and old frames, with light only on the edges of people.',
    },
  },
}

export type ThemeActivity = {
  id: string
  day: string
  time: string
  kind: Localized
  /** 中文版用中文名，英文版用英文名（原先单列的英文副标题已并入）。 */
  name: Localized
  seats: Localized
  line: Localized
}

// 以下排期为演示草稿：项目方尚未提供当天活动表，名称、时段与名额均为拟定占位，需确认后替换。
export const themeScheduleDays = ['10.31', '11.01'] as const

// 每天只排三场（原 11.01 的「红心审判辩论会」与 10.31 的讨论会类型重复，已按“每天三条”删除，可替换）。
export const themeSchedule: ThemeActivity[] = [
  {
    id: 'rabbit-workshop',
    day: '10.31',
    time: '14:00–15:30',
    kind: { zh: '手作坊', en: 'Workshop' },
    name: { zh: '兔子洞手作坊', en: 'RABBIT HOLE WORKSHOP' },
    seats: { zh: '20 人', en: '20 seats' },
    line: { zh: '做一件只属于梦境的入场信物，材料现场提供。', en: 'Make an entry token that belongs only to this dream. Materials provided on site.' },
  },
  {
    id: 'mirror-talk',
    day: '10.31',
    time: '16:00–17:00',
    kind: { zh: '讨论会', en: 'Talk' },
    name: { zh: '镜中自画像讨论会', en: 'MIRROR TALK' },
    seats: { zh: '24 人', en: '24 seats' },
    line: {
      zh: '带着你最不像自己的一套造型，聊聊它替你说了什么。',
      en: 'Bring the outfit that looks least like you and talk about what it says for you.',
    },
  },
  {
    id: 'ribbon-lab',
    day: '10.31',
    time: '18:00–19:30',
    kind: { zh: '手作坊', en: 'Workshop' },
    name: { zh: '缎带与蕾丝改造工坊', en: 'RIBBON LAB' },
    seats: { zh: '16 人', en: '16 seats' },
    line: { zh: '把旧衣物改造成甜梦一侧的配饰。', en: 'Turn old clothes into accessories for the sweet-dream side.' },
  },
  {
    id: 'fairy-tale-reading',
    day: '11.01',
    time: '13:30–14:30',
    kind: { zh: '朗读会', en: 'Reading' },
    name: { zh: '暗黑童话朗读会', en: 'DARK FAIRY TALE READING' },
    seats: { zh: '30 人', en: '30 seats' },
    line: { zh: '几个人轮流读一段他们心里的暗黑童话。', en: 'A few people take turns reading a dark fairy tale of their own.' },
  },
  {
    id: 'charm-making',
    day: '11.01',
    time: '16:30–18:00',
    kind: { zh: '手作坊', en: 'Workshop' },
    name: { zh: '梦游者护身符手作', en: 'CHARM MAKING' },
    seats: { zh: '20 人', en: '20 seats' },
    line: { zh: '做一枚只在这个周末有效的护身符。', en: 'Make a charm that only works this weekend.' },
  },
  {
    id: 'midnight-ritual',
    day: '11.01',
    time: '19:00–20:00',
    kind: { zh: '仪式', en: 'Ritual' },
    name: { zh: '入梦仪式', en: 'MIDNIGHT RITUAL' },
    seats: { zh: '40 人', en: '40 seats' },
    line: {
      zh: '用一场集体仪式收尾，把这两天的身份留下一部分。',
      en: 'Close with a collective ritual and keep part of who you were these two days.',
    },
  },
]

export const themeScheduleNote: Localized = {
  zh: '当天活动排期为演示草稿：名称、时段与名额均为拟定占位，实际以官方公布为准；「预约」只在本机记录，不产生真实报名、不收集手机号或身份信息。',
  en: 'This schedule is a demo draft: names, times and capacities are placeholders and the official announcement prevails. "Reserve" only records on this device — no real sign-up, and no phone number or identity is collected.',
}

export const themeRituals: ThemeRitual[] = [
  {
    id: 'rabbit-hole',
    index: '01',
    name: { zh: '兔子洞口', en: 'RABBIT HOLE' },
    kind: { zh: '服务台', en: 'Info desk' },
    line: {
      zh: '穿过尺寸失衡的入口，正式离开现实。在这里领取你的入梦物料。',
      en: 'Step through an out-of-scale doorway and leave reality behind. Pick up your dream kit here.',
    },
  },
  {
    id: 'wonder-market',
    index: '02',
    name: { zh: '梦游集市', en: 'WONDER MARKET' },
    kind: { zh: '集市', en: 'Market' },
    line: {
      zh: 'Lolita、BJD、饰品、服装、香氛、独立出版、奇异器物与创作者商品。',
      en: 'Lolita, BJD, accessories, clothing, fragrance, indie publishing, strange objects and creator goods.',
    },
  },
  {
    id: 'wonder-room',
    index: '03',
    name: { zh: '奇异幻境', en: 'WONDER ROOM' },
    kind: { zh: '置景', en: 'Set' },
    line: {
      zh: '巨型家具、缩小门洞、漂浮物件，让身体尺度开始失控。',
      en: 'Oversized furniture, shrunken doorways and floating objects set your sense of scale adrift.',
    },
  },
  {
    id: 'parade',
    index: '04',
    name: { zh: '仙境留念', en: 'PARADE' },
    kind: { zh: '拍照', en: 'Photo' },
    line: {
      zh: 'Lolita / Cos / Gothic / Fantasy Outfit 开放巡游与拍摄。',
      en: 'Open parade and photo session for Lolita / cos / gothic / fantasy outfits.',
    },
  },
  {
    id: 'red-court',
    index: '05',
    name: { zh: '红心挑战', en: 'THE RED COURT' },
    kind: { zh: '游戏', en: 'Game' },
    line: { zh: '扑克牌任务、荒诞规则、投票与随机惩罚。', en: 'Card tasks, absurd rules, voting and random penalties.' },
  },
  {
    id: 'midnight-ball',
    index: '06',
    name: { zh: '午夜梦境舞会', en: 'MIDNIGHT BALL' },
    kind: { zh: '舞会', en: 'Ball' },
    line: {
      zh: 'Live / DJ / Slow Dance / Costume Awards / Midnight Ritual。',
      en: 'Live / DJ / slow dance / costume awards / midnight ritual.',
    },
  },
]

// 演示判断规则：每题可多选，选项分别偏向两个结果，取偏向较多的一方；平手时判为奇幻主义者。
// 品类与专名（Cos / Lolita / BJD / DJ 等）两版一致，不翻译。
export const themeQuiz: ThemeQuizQuestion[] = [
  {
    id: 'q1',
    index: '01',
    prompt: { zh: '如果兔子洞只能通向一个地方，我希望那里有——', en: 'If the rabbit hole led to only one place, I would want it to have —' },
    options: [
      { id: 'q1-show', label: { zh: '一间诡异展览', en: 'A strange exhibition' }, leansTo: 'flip' },
      { id: 'q1-market', label: { zh: '一条奇怪集市', en: 'An odd market' }, leansTo: 'fantasy' },
      { id: 'q1-ball', label: { zh: '一场午夜舞会', en: 'A midnight ball' }, leansTo: 'flip' },
      { id: 'q1-own', label: { zh: '我自己想象的地方', en: 'Somewhere I imagine myself' }, leansTo: 'flip' },
    ],
  },
  {
    id: 'q2',
    index: '02',
    prompt: { zh: '要让我一直待到午夜，这里必须有——', en: 'To keep me there until midnight, it needs —' },
    options: [
      { id: 'q2-live', label: { zh: '一场演出', en: 'A live show' }, leansTo: 'fantasy' },
      { id: 'q2-photo', label: { zh: '一个很会拍照的空间', en: 'A space that photographs well' }, leansTo: 'flip' },
      { id: 'q2-people', label: { zh: '一群有意思的人', en: 'Interesting people' }, leansTo: 'fantasy' },
      { id: 'q2-drink', label: { zh: '一杯酒', en: 'A drink' }, leansTo: 'flip' },
      { id: 'q2-reason', label: { zh: '一个舍不得提前离开的理由', en: 'A reason I would not want to leave early' }, leansTo: 'fantasy' },
    ],
  },
  {
    id: 'q3',
    index: '03',
    prompt: { zh: '要叫一个朋友一起掉进兔子洞，我会因为——', en: 'To drag a friend down the rabbit hole, I would do it for the —' },
    options: [
      { id: 'q3-outfit', label: { zh: '穿搭', en: 'outfits' }, leansTo: 'flip' },
      { id: 'q3-cos', label: { zh: 'Cos', en: 'cosplay' }, leansTo: 'flip' },
      { id: 'q3-lolita', label: { zh: 'Lolita', en: 'Lolita' }, leansTo: 'flip' },
      { id: 'q3-social', label: { zh: '朋友社交', en: 'people to meet' }, leansTo: 'fantasy' },
      { id: 'q3-good', label: { zh: '奇怪的商品', en: 'strange goods' }, leansTo: 'fantasy' },
      { id: 'q3-once', label: { zh: '这件事只有这一天会发生', en: 'the fact it happens only this one day' }, leansTo: 'fantasy' },
    ],
  },
]

export type ThemeResult = {
  id: 'fantasy' | 'flip'
  index: string
  /** 中文版用中文名，英文版用英文名（原先单列的英文副标题已并入）。 */
  name: Localized
  lines: Localized<string[]>
}

export const themeResults: { fantasy: ThemeResult; flip: ThemeResult } = {
  fantasy: {
    id: 'fantasy',
    index: '01',
    name: { zh: '奇幻主义者', en: 'THE FANTASY SEEKER' },
    lines: {
      zh: ['你相信奇怪的事情值得被相信。', '你容易被未知、新鲜感、漂亮但没有实际用途的东西吸引。比起理解梦境，你更想直接跳进去。'],
      en: [
        'You believe strange things are worth believing in.',
        'The unknown, the new, and beautiful things with no practical use pull you in. Rather than understand a dream, you would rather jump straight into it.',
      ],
    },
  },
  flip: {
    id: 'flip',
    index: '02',
    name: { zh: '梦幻颠倒者', en: 'THE DREAM FLIPPER' },
    lines: {
      zh: ['你不只是喜欢幻想，你喜欢把规则弄坏。', '你会注意到世界里那些不合理的小漏洞，并忍不住重新排列它们。你喜欢镜子、错位、暗黑童话和介于美丽与诡异之间的东西。'],
      en: [
        'You do not just like fantasy — you like breaking the rules.',
        'You notice the illogical little gaps in the world and cannot help rearranging them. You like mirrors, misalignment, dark fairy tales, and things somewhere between beautiful and uncanny.',
      ],
    },
  },
}

export const themeChallenge = {
  title: { zh: '24 小时兔子洞任务', en: '24H RABBIT HOLE CHALLENGE' } as Localized,
  brief: {
    zh: '接下来的 24 小时里，做一件没有实际用途、但会让你开心的事。',
    en: 'In the next 24 hours, do one thing that has no practical use and simply makes you happy.',
  } as Localized,
  examples: {
    zh: [
      '穿最漂亮的衣服去便利店',
      '给一栋陌生建筑取名字',
      '买一束完全不需要的花',
      '给未来的自己写一封荒唐邀请函',
      '在回家路上故意绕一条没走过的路',
    ],
    en: [
      'Wear your best outfit to the convenience store',
      'Name a building you have never been in',
      'Buy flowers you absolutely do not need',
      'Write an absurd invitation to your future self',
      'Take a street you have never walked on the way home',
    ],
  } as Localized<string[]>,
  howTo: {
    zh: ['拍下一张照片', '写一句发生了什么'],
    en: ['Take one photo', 'Write one line about what happened'],
  } as Localized<string[]>,
  // 话题标签：中文标签只用于中文版；英文版用英文标签，@ 账号名保持 REVERIE。
  hashtags: {
    zh: ['#梦游梦境', '@异想集REVERIE'],
    en: ['#REVERIEwonderland', '@REVERIE'],
  } as Localized<string[]>,
  // 发布渠道：小红书为项目方提供的真实账号（已去掉分享链接里的跟踪参数），其余渠道的账号链接待提供。
  publishLabel: { zh: '去发布', en: 'Publish' } as Localized,
  publishNote: {
    zh: '小红书会打开 REVERIE 的账号（新窗口）；其余渠道的账号链接待项目方提供，现在不会跳转。发布后即完成本次任务（演示，不上传任何内容）。',
    en: 'Xiaohongshu opens REVERIE’s account in a new tab; links for the other channels are to be provided and will not open. Publishing completes this task (demo — nothing is uploaded).',
  } as Localized,
  publishTargets: [
    { id: 'xiaohongshu', name: { zh: '小红书', en: 'Xiaohongshu' } as Localized, href: xiaohongshuUrl },
    { id: 'weibo', name: { zh: '微博', en: 'Weibo' } as Localized },
    { id: 'douyin', name: { zh: '抖音', en: 'Douyin' } as Localized },
    { id: 'instagram', name: { zh: 'Instagram', en: 'Instagram' } as Localized },
    { id: 'wechat', name: { zh: '微信公众号', en: 'WeChat Official Account' } as Localized },
  ],
  // 奖励名是品牌标识，两版一致；中文版另有一行中文解释，英文版不再显示。
  reward: { name: 'RABBIT HOLE STAMP', label: { zh: '兔子洞印章', en: null } as Localized<string | null> },
  boundary: {
    zh: '照片在你自己手机上完成，UNSEEN 这一版不支持上传图片。',
    en: 'The photo stays on your phone — this version of UNSEEN does not support image upload.',
  } as Localized,
  surveyQuestion: {
    zh: '如果可以把一样东西带进梦境，你会带什么？',
    en: 'If you could bring one thing into the dream, what would it be?',
  } as Localized,
  // 以下选项为根据本月主题拟定的待确认草稿，项目方可直接替换。
  surveyOptions: [
    { id: 'outfit', label: { zh: '一件平时不会穿的衣服或配饰', en: 'An outfit or accessory you would never normally wear' } as Localized },
    { id: 'object', label: { zh: '一件说不出用途的小东西', en: 'A small object with no explainable purpose' } as Localized },
    { id: 'sound', label: { zh: '一首歌或一段声音', en: 'A song or a sound' } as Localized },
    { id: 'people', label: { zh: '一个人，或一群朋友', en: 'One person, or a group of friends' } as Localized },
    { id: 'memory', label: { zh: '一段记忆或一封信', en: 'A memory or a letter' } as Localized },
    { id: 'other', label: { zh: '其他（自己填）', en: 'Something else (write your own)' } as Localized },
  ],
  surveyNote: {
    zh: '这是本月的演示调研题，答案只保存在本机浏览器，不会上传或用于真实统计。',
    en: 'This is this month’s demo survey question. Answers stay in this browser and are not uploaded or used for real statistics.',
  } as Localized,
}

export const themeCreators: ThemeCreator[] = [
  {
    id: 'infinite',
    index: '01',
    name: { zh: '因斐涅特', en: 'infinite' },
    field: { zh: '原创挂偶 / 手工软雕塑', en: 'Original plush / hand-sewn soft sculpture' },
    line: {
      zh: '把脑海里奇奇怪怪的小东西，缝成可以带走的朋友。',
      en: 'Odd little things from the back of the mind, stitched into friends you can take home.',
    },
  },
  {
    id: 'roe2me',
    index: '02',
    name: { zh: 'Roe2me Dolly', en: 'Roe2me Dolly' },
    field: { zh: '上海 BJD 艺术人形品牌', en: 'Shanghai BJD art doll brand' },
    line: { zh: '把玩偶做成真正意义上的时装角色。', en: 'Turning dolls into fashion characters in the truest sense.' },
    link: { label: 'roe2me-dolly.com', href: 'https://roe2me-dolly.com/' },
  },
  {
    id: 'abilletage',
    index: '03',
    name: { zh: 'abilletage', en: 'abilletage' },
    field: { zh: '束身衣 / 哥特时装', en: 'Corset / gothic fashion' },
    line: {
      zh: '介于古典服装、舞台造型和暗黑童话之间的身体建筑。',
      en: 'Body architecture somewhere between historical costume, stage styling and dark fairy tale.',
    },
    link: { label: 'shop.abilletage.com', href: 'https://shop.abilletage.com/' },
  },
  {
    id: 'alice-pirates',
    index: '04',
    name: { zh: 'Alice and the Pirates', en: 'Alice and the Pirates' },
    field: { zh: 'Lolita / 幻想时装', en: 'Lolita / fantasy fashion' },
    line: {
      zh: '少女、海盗、童话与维多利亚式幻想交错的 Lolita 世界。',
      en: 'A Lolita world where girlhood, pirates, fairy tales and Victorian fantasy cross.',
    },
  },
  {
    id: 'tim-walker',
    index: '05',
    name: { zh: 'Tim Walker', en: 'Tim Walker' },
    field: { zh: '时尚摄影师', en: 'Fashion photographer' },
    line: {
      zh: '他不是在拍衣服，而是在搭建一个让人暂时相信童话存在的世界。',
      en: 'He is not photographing clothes; he is building a world that makes you briefly believe in fairy tales.',
    },
  },
]

// ---------------------------------------------------------------------------
// 活动（主题）打包：DISCOVER 页用左右按钮在各场活动之间切换，视图只读取当前活动这一份数据。
// 上面所有导出都是「梦游仙境」的内容；「游园惊梦」的内容在 src/data/theme-garden.ts。
// 新增一场活动 = 再写一份内容对象 + 在 themePacks 里登记，不需要改视图。
// ---------------------------------------------------------------------------
import {
  gardenBrands,
  gardenCreators,
  gardenDuality,
  gardenDualityLabels,
  gardenEntryDate,
  gardenMapGroups,
  gardenMapPlan,
  gardenMeta,
  gardenRituals,
  gardenSchedule,
  gardenScheduleDays,
  gardenScheduleNote,
  gardenTicket,
  gardenVenue,
} from './theme-garden'

export type ThemeTicket = typeof themeTicket

export type ThemeMeta = typeof themeMeta
export type ThemeDuality = typeof themeDuality
export type ThemeResults = typeof themeResults
export type ThemeChallenge = typeof themeChallenge
export type ThemeFeatured = typeof themeFeatured
export type ThemeMapPlan = typeof themeMapPlan
export type ThemeShopCta = typeof themeShopCta

export type ThemePack = {
  id: string
  meta: ThemeMeta
  /** 入场时间以项目方原文为准，购票流程与票据都用它。 */
  entryDate: string
  venue: Localized
  ticket: ThemeTicket
  duality: ThemeDuality
  /** 活动详情里双面那一行的两个标签：梦游仙境是「着装建议 / 现场布景风格」，游园惊梦是「内容 / 现场布景」。 */
  dualityLabels: ThemeDualityLabels
  rituals: ThemeRitual[]
  scheduleDays: readonly string[]
  schedule: ThemeActivity[]
  scheduleNote: Localized
  /** 互动测试与 24H 任务：这一期没有策划的活动留空，并把 interact 设为 false，页面不渲染这两块。 */
  quiz?: ThemeQuizQuestion[]
  results?: ThemeResults
  challenge?: ThemeChallenge
  interact?: boolean
  featured: ThemeFeatured
  mapPlan: ThemeMapPlan
  mapGroups: ThemeMapGroup[]
  brands: ThemeBrand[]
  creators: ThemeCreator[]
  shopCta: ThemeShopCta
}

const wonderlandPack: ThemePack = {
  id: 'wonderland',
  meta: themeMeta,
  entryDate: themeEntryDate,
  venue: themeVenue,
  ticket: themeTicket,
  duality: themeDuality,
  dualityLabels: themeDualityLabels,
  rituals: themeRituals,
  scheduleDays: themeScheduleDays,
  schedule: themeSchedule,
  scheduleNote: themeScheduleNote,
  quiz: themeQuiz,
  results: themeResults,
  challenge: themeChallenge,
  interact: true,
  featured: themeFeatured,
  mapPlan: themeMapPlan,
  mapGroups: themeMapGroups,
  brands: themeBrands,
  creators: themeCreators,
  shopCta: themeShopCta,
}

// 游园惊梦：内容全部来自项目方资料（见 src/data/theme-garden.ts）。
// 这一期没有可用的互动测试与 24H 任务策划，因此 interact 为 false，页面上只保留「活动详情」与「梦境目录」两个板块。
const gardenPack: ThemePack = {
  id: 'garden',
  meta: gardenMeta,
  entryDate: gardenEntryDate,
  venue: gardenVenue,
  ticket: gardenTicket,
  duality: gardenDuality,
  dualityLabels: gardenDualityLabels,
  rituals: gardenRituals,
  scheduleDays: gardenScheduleDays,
  schedule: gardenSchedule,
  scheduleNote: gardenScheduleNote,
  interact: false,
  featured: themeFeatured,
  mapPlan: gardenMapPlan,
  mapGroups: gardenMapGroups,
  brands: gardenBrands,
  creators: gardenCreators,
  shopCta: themeShopCta,
}

// 顺序按时间线：游园惊梦（9.25–9.27）在前，是默认打开的那一场；梦游仙境（10.31–11.1）在后。
export const themePacks: ThemePack[] = [gardenPack, wonderlandPack]

// 活动切换之前只存了第一场（梦游仙境）的互动记录，旧数据要归到它名下，而不是现在的第一场。
export const legacyThemePackId = 'wonderland'

/** 所有活动里的活动条目，按 id 去重：票夹与票号按它解析。 */
export const allThemeActivities: ThemeActivity[] = [...new Map(themePacks.flatMap((pack) => pack.schedule).map((activity) => [activity.id, activity])).values()]


/** 按活动条目 id 找回它所属的活动（票面渲染用）。 */
export function themePackOfActivity(activityId: string): ThemePack | undefined {
  return themePacks.find((pack) => pack.schedule.some((activity) => activity.id === activityId))
}
