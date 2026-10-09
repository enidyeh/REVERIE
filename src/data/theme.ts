// 本月主题内容。所有条目在界面上均标注为演示内容，不代表真实活动、售卖或预约。
// 真实场馆 / 品牌 / 价格由项目方提供，仅作编辑推荐展示；价格标记为参考价。

import { contentTopics } from './content'
import { xiaohongshuUrl } from './social'

export type ThemeLink = { label: string; href: string }

export type ThemeCreator = {
  id: string
  index: string
  name: string
  field: string
  line: string
  link?: ThemeLink
}

export type ThemeBrand = {
  id: string
  index: string
  name: string
  handle?: string
  booth: string
  line: string
  link?: ThemeLink
}

export type ThemeMapGroup = {
  id: 'brands' | 'creators'
  index: string
  en: string
  label: string
  desc: string
  count: string
}

export const themeMapPlan = {
  title: '2F / 3F 场地图',
  note: '展位与布景的平面图待项目方提供；正式版会标出每个展商的位置、动线与试衣区／手工坊所在区域。',
}

export const themeMapGroups: ThemeMapGroup[] = [
  { id: 'brands', index: '01', en: 'BRANDS', label: '好玩的产品展商', desc: '玩偶、饰品、服装、香氛与奇怪小物', count: '05' },
  { id: 'creators', index: '02', en: 'CREATORS', label: '艺术家与作品', desc: '本月合作的创作者与他们的作品', count: '05' },
]

// 除「因斐涅特」为项目方提供的展商外，其余展位为预留占位，等待项目方补充品牌名、展位号与社交媒体链接。
export const themeBrands: ThemeBrand[] = [
  { id: 'infinite', index: '01', name: '因斐涅特', handle: '@因斐涅特 infinite', booth: 'Booth B07', line: '玩偶｜把脑海里奇奇怪怪的小东西，缝成可以带走的朋友。' },
  { id: 'slot-02', index: '02', name: '展位待项目方提供', booth: 'Booth B08', line: '展位已预留，品牌信息与社交媒体链接待补充。' },
  { id: 'slot-03', index: '03', name: '展位待项目方提供', booth: 'Booth B09', line: '展位已预留，品牌信息与社交媒体链接待补充。' },
  { id: 'slot-04', index: '04', name: '展位待项目方提供', booth: 'Booth C04', line: '展位已预留，品牌信息与社交媒体链接待补充。' },
  { id: 'slot-05', index: '05', name: '展位待项目方提供', booth: 'Booth C05', line: '展位已预留，品牌信息与社交媒体链接待补充。' },
]

export type ThemeArticle = { id: string; title: string; meta: string }
export type ThemeFeaturedItem = { id: string; en: string; zh: string; image: string; articles: ThemeArticle[] }

// 每个形式下列出的条目是**示范例子**：直接取自 HOME › CONTENT 的「线上专题」九期方向，
// 不是已发布的文章；正式标题与链接仍待项目方提供。
const featuredTopics = (prefix: string, indexes: number[]): ThemeArticle[] =>
  indexes.map((index, position) => ({
    id: `${prefix}-topic-0${position + 1}`,
    meta: `TOPIC 0${position + 1}`,
    title: contentTopics.items[index],
  }))

// 四张配图为占位素材（沿用本站已有的 Unsplash 演示图），待项目方提供对应专题的正式图片。
export const themeFeatured = {
  label: 'FEATURED',
  title: '特别推荐',
  line: '品牌可以和本月主题共创：',
  moreLabel: '更多',
  // DISCOVER 的「特别推荐」里，文章列表（ARTICLES + 两篇占位）已按项目方要求删除，这个位置改为这个入口。
  entryLabel: '查看更多内容',
  articleNote: '点它会到 HOME › CONTENT 看本月全部共创形式；文章详情页尚未接入。',
  articleNoteContent: '演示：每个形式下列出的是示范例子（取自本页「线上专题」），不是已发布的文章；正式标题与链接仍待项目方提供，点「更多」只显示提示。',
  // 形式清单按项目方本轮的写法与顺序：FEATURE｜青年文化专题 / TRENDS & LIFE｜趋势与生活 /
  // CITY GUIDE｜城市指南 / INTERVIEW｜品牌人物专访（后两项的英文名由项目方本轮补充）。
  items: [
    { id: 'feature', en: 'FEATURE', zh: '青年文化专题', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80', articles: featuredTopics('feature', [0, 3]) },
    { id: 'trends', en: 'TRENDS & LIFE', zh: '趋势与生活', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80', articles: featuredTopics('trends', [1, 2, 6]) },
    { id: 'city-guide', en: 'CITY GUIDE', zh: '城市指南', image: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=900&q=80', articles: featuredTopics('city-guide', [4, 7]) },
    { id: 'interview', en: 'INTERVIEW', zh: '品牌人物专访', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80', articles: featuredTopics('interview', [5, 8]) },
  ],
  shotNote: '配图为占位素材，待项目方提供各自对应的正式图片。',
}

// 入场时间与场地以项目方提供的原文为准：DISCOVER 的购票流程与 IDENTITY 的票据都引用这两条。
export const themeEntryDate = '2026.10.31-11.1 11:00-20:00'
export const themeVenue = '上海市黄浦区八号桥艺术空间'

// 购票演示用的票种：价格与限购由项目方提供，仍是本地演示，不接入真实支付。
export const themeTicket = {
  name: '梦游入场券',
  price: 29.9,
  minCount: 1,
  maxCount: 10,
  note: '演示票价，正式价格以官方渠道为准；本站不接入真实支付，不会扣款。',
  // 支付方式仅为界面选项，不会调用任何支付渠道。
  payMethods: [
    { id: 'alipay', name: '支付宝' },
    { id: 'wechat', name: '微信支付' },
    { id: 'card', name: '银行卡' },
  ],
}

// REVERIE SHOP 入口：按项目方要求统一写回 SHOP，点击会切到 HOME 的 SHOP 栏目。
export const themeShopCta = {
  label: 'COLLECT THEM AT REVERIE SHOP',
  note: '点它会切到 HOME › SHOP 栏目；该栏目的商品与展商目前仍为演示内容。',
}

export type ThemeRitual = {
  id: string
  index: string
  name: string
  nameEn: string
  kind: string
  line?: string
}

export type ThemeQuizOption = { id: string; label: string; leansTo: 'fantasy' | 'flip' }

export type ThemeQuizQuestion = {
  id: string
  index: string
  prompt: string
  options: ThemeQuizOption[]
}

export const themeMeta = {
  series: '异想集 REVERIE｜IN THE WONDERLAND',
  title: '梦游仙境',
  titleEn: 'REVERIE ｜in the WONDERLAND',
  issue: 'ISSUE 002',
  window: '2026.10.31-11.1',
  city: 'SHANGHAI',
  tags: ['COSPLAY', 'LOLITA', 'FANTASY', 'DARK FAIRY TALE'],
  heroLine: '这个梦境，我们把兔子洞、镜中世界、暗黑童话和午夜舞会装进同一个梦境。',
  heroImage: 'https://images.unsplash.com/photo-1544039161-b0c20826c6f6?auto=format&fit=crop&w=1600&q=85',
  heroImageAlt: '雾气弥漫的林间小径，尽头有光',
  sweetImage: 'https://images.unsplash.com/photo-1558568368-dc03d41f78df?auto=format&fit=crop&w=900&q=80',
  sweetImageAlt: '浅色蕾丝布料的细节特写',
  darkImage: 'https://images.unsplash.com/photo-1606241018160-4985a8ab5dec?auto=format&fit=crop&w=900&q=80',
  darkImageAlt: '昏暗房间里的古旧镜子',
  rabbitImage: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=1000&q=80',
  rabbitImageAlt: '草地上的一只兔子',
}

export type ThemeDualitySide = {
  label: string
  dressCode: string
  scene: string
}

export const themeDuality: { sweet: ThemeDualitySide; dark: ThemeDualitySide } = {
  sweet: {
    label: '甜梦 / SWEET DREAM',
    dressCode: '奶油色 · 蕾丝 · 缎带 · 珍珠 · 蕾丝伞',
    scene: '棉花糖色帷幔、蕾丝灯罩、软光与遍地散落的糖果道具。',
  },
  dark: {
    label: '暗黑梦境 / DARK FAIRY TALE',
    dressCode: '黑红 · 皮革 · 面纱 · 银饰 · 暗色红唇',
    scene: '镜厅、红心与烛火、枯枝与旧相框，光线只落在人物边缘。',
  },
}

export type ThemeActivity = {
  id: string
  day: string
  time: string
  kind: string
  name: string
  nameEn: string
  seats: string
  line: string
}

// 以下排期为演示草稿：项目方尚未提供当天活动表，名称、时段与名额均为拟定占位，需确认后替换。
export const themeScheduleDays = ['10.31', '11.01'] as const

// 每天只排三场（原 11.01 的「红心审判辩论会」与 10.31 的讨论会类型重复，已按“每天三条”删除，可替换）。
export const themeSchedule: ThemeActivity[] = [
  { id: 'rabbit-workshop', day: '10.31', time: '14:00–15:30', kind: '手作坊', name: '兔子洞手作坊', nameEn: 'RABBIT HOLE WORKSHOP', seats: '20 人', line: '做一件只属于梦境的入场信物，材料现场提供。' },
  { id: 'mirror-talk', day: '10.31', time: '16:00–17:00', kind: '讨论会', name: '镜中自画像讨论会', nameEn: 'MIRROR TALK', seats: '24 人', line: '带着你最不像自己的一套造型，聊聊它替你说了什么。' },
  { id: 'ribbon-lab', day: '10.31', time: '18:00–19:30', kind: '手作坊', name: '缎带与蕾丝改造工坊', nameEn: 'RIBBON LAB', seats: '16 人', line: '把旧衣物改造成甜梦一侧的配饰。' },
  { id: 'fairy-tale-reading', day: '11.01', time: '13:30–14:30', kind: '朗读会', name: '暗黑童话朗读会', nameEn: 'DARK FAIRY TALE READING', seats: '30 人', line: '几个人轮流读一段他们心里的暗黑童话。' },
  { id: 'charm-making', day: '11.01', time: '16:30–18:00', kind: '手作坊', name: '梦游者护身符手作', nameEn: 'CHARM MAKING', seats: '20 人', line: '做一枚只在这个周末有效的护身符。' },
  { id: 'midnight-ritual', day: '11.01', time: '19:00–20:00', kind: '仪式', name: '入梦仪式', nameEn: 'MIDNIGHT RITUAL', seats: '40 人', line: '用一场集体仪式收尾，把这两天的身份留下一部分。' },
]

export const themeScheduleNote = '当天活动排期为演示草稿：名称、时段与名额均为拟定占位，实际以官方公布为准；「预约」只在本机记录，不产生真实报名、不收集手机号或身份信息。'

export const themeRituals: ThemeRitual[] = [
  { id: 'rabbit-hole', index: '01', name: '兔子洞口', nameEn: 'RABBIT HOLE', kind: '服务台', line: '穿过尺寸失衡的入口，正式离开现实。在这里领取你的入梦物料。' },
  { id: 'wonder-market', index: '02', name: '梦游集市', nameEn: 'WONDER MARKET', kind: '集市', line: 'Lolita、BJD、饰品、服装、香氛、独立出版、奇异器物与创作者商品。' },
  { id: 'wonder-room', index: '03', name: '奇异幻境', nameEn: 'WONDER ROOM', kind: '置景', line: '巨型家具、缩小门洞、漂浮物件，让身体尺度开始失控。' },
  { id: 'parade', index: '04', name: '仙境留念', nameEn: 'PARADE', kind: '拍照', line: 'Lolita / Cos / Gothic / Fantasy Outfit 开放巡游与拍摄。' },
  { id: 'red-court', index: '05', name: '红心挑战', nameEn: 'THE RED COURT', kind: '游戏', line: '扑克牌任务、荒诞规则、投票与随机惩罚。' },
  { id: 'midnight-ball', index: '06', name: '午夜梦境舞会', nameEn: 'MIDNIGHT BALL', kind: '舞会', line: 'Live / DJ / Slow Dance / Costume Awards / Midnight Ritual。' },
]

// 演示判断规则：每题可多选，选项分别偏向两个结果，取偏向较多的一方；平手时判为奇幻主义者。
export const themeQuiz: ThemeQuizQuestion[] = [
  {
    id: 'q1',
    index: '01',
    prompt: '如果兔子洞只能通向一个地方，我希望那里有——',
    options: [
      { id: 'q1-show', label: '一间诡异展览', leansTo: 'flip' },
      { id: 'q1-market', label: '一条奇怪集市', leansTo: 'fantasy' },
      { id: 'q1-ball', label: '一场午夜舞会', leansTo: 'flip' },
      { id: 'q1-own', label: '我自己想象的地方', leansTo: 'flip' },
    ],
  },
  {
    id: 'q2',
    index: '02',
    prompt: '要让我一直待到午夜，这里必须有——',
    options: [
      { id: 'q2-live', label: '一场演出', leansTo: 'fantasy' },
      { id: 'q2-photo', label: '一个很会拍照的空间', leansTo: 'flip' },
      { id: 'q2-people', label: '一群有意思的人', leansTo: 'fantasy' },
      { id: 'q2-drink', label: '一杯酒', leansTo: 'flip' },
      { id: 'q2-reason', label: '一个舍不得提前离开的理由', leansTo: 'fantasy' },
    ],
  },
  {
    id: 'q3',
    index: '03',
    prompt: '要叫一个朋友一起掉进兔子洞，我会因为——',
    options: [
      { id: 'q3-outfit', label: '穿搭', leansTo: 'flip' },
      { id: 'q3-cos', label: 'Cos', leansTo: 'flip' },
      { id: 'q3-lolita', label: 'Lolita', leansTo: 'flip' },
      { id: 'q3-social', label: '朋友社交', leansTo: 'fantasy' },
      { id: 'q3-good', label: '奇怪的商品', leansTo: 'fantasy' },
      { id: 'q3-once', label: '这件事只有这一天会发生', leansTo: 'fantasy' },
    ],
  },
]

export type ThemeResult = {
  id: 'fantasy' | 'flip'
  index: string
  name: string
  nameEn: string
  lines: string[]
}

export const themeResults: { fantasy: ThemeResult; flip: ThemeResult } = {
  fantasy: {
    id: 'fantasy',
    index: '01',
    name: '奇幻主义者',
    nameEn: 'THE FANTASY SEEKER',
    lines: ['你相信奇怪的事情值得被相信。', '你容易被未知、新鲜感、漂亮但没有实际用途的东西吸引。比起理解梦境，你更想直接跳进去。'],
  },
  flip: {
    id: 'flip',
    index: '02',
    name: '梦幻颠倒者',
    nameEn: 'THE DREAM FLIPPER',
    lines: ['你不只是喜欢幻想，你喜欢把规则弄坏。', '你会注意到世界里那些不合理的小漏洞，并忍不住重新排列它们。你喜欢镜子、错位、暗黑童话和介于美丽与诡异之间的东西。'],
  },
}

export const themeChallenge = {
  titleEn: '24H RABBIT HOLE CHALLENGE',
  title: '24 小时兔子洞任务',
  brief: '接下来的 24 小时里，做一件没有实际用途、但会让你开心的事。',
  examples: [
    '穿最漂亮的衣服去便利店',
    '给一栋陌生建筑取名字',
    '买一束完全不需要的花',
    '给未来的自己写一封荒唐邀请函',
    '在回家路上故意绕一条没走过的路',
  ],
  howTo: ['拍下一张照片', '写一句发生了什么'],
  hashtags: ['#梦游梦境', '@异想集REVERIE'],
  // 发布渠道：小红书为项目方提供的真实账号（已去掉分享链接里的跟踪参数），其余渠道的账号链接待提供。
  publishLabel: '去发布',
  publishNote: '小红书会打开 REVERIE 的账号（新窗口）；其余渠道的账号链接待项目方提供，现在不会跳转。发布后即完成本次任务（演示，不上传任何内容）。',
  publishTargets: [
    { id: 'xiaohongshu', name: '小红书', href: xiaohongshuUrl },
    { id: 'weibo', name: '微博' },
    { id: 'douyin', name: '抖音' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'wechat', name: '微信公众号' },
  ],
  reward: { name: 'RABBIT HOLE STAMP', label: '兔子洞印章' },
  boundary: '照片在你自己手机上完成，UNSEEN 这一版不支持上传图片。',
  surveyQuestion: '如果可以把一样东西带进梦境，你会带什么？',
  // 以下选项为根据本月主题拟定的待确认草稿，项目方可直接替换。
  surveyOptions: [
    { id: 'outfit', label: '一件平时不会穿的衣服或配饰' },
    { id: 'object', label: '一件说不出用途的小东西' },
    { id: 'sound', label: '一首歌或一段声音' },
    { id: 'people', label: '一个人，或一群朋友' },
    { id: 'memory', label: '一段记忆或一封信' },
    { id: 'other', label: '其他（自己填）' },
  ],
  surveyNote: '这是本月的演示调研题，答案只保存在本机浏览器，不会上传或用于真实统计。',
}

export const themeCreators: ThemeCreator[] = [
  { id: 'infinite', index: '01', name: '因斐涅特 infinite', field: '原创挂偶 / 手工软雕塑', line: '把脑海里奇奇怪怪的小东西，缝成可以带走的朋友。' },
  { id: 'roe2me', index: '02', name: 'Roe2me Dolly', field: '上海 BJD 艺术人形品牌', line: '把玩偶做成真正意义上的时装角色。', link: { label: 'roe2me-dolly.com', href: 'https://roe2me-dolly.com/' } },
  { id: 'abilletage', index: '03', name: 'abilletage', field: 'Corset / Gothic Fashion', line: '介于古典服装、舞台造型和暗黑童话之间的身体建筑。', link: { label: 'shop.abilletage.com', href: 'https://shop.abilletage.com/' } },
  { id: 'alice-pirates', index: '04', name: 'Alice and the Pirates', field: 'Lolita / Fantasy Fashion', line: '少女、海盗、童话与维多利亚式幻想交错的 Lolita 世界。' },
  { id: 'tim-walker', index: '05', name: 'Tim Walker', field: '时尚摄影师', line: '他不是在拍衣服，而是在搭建一个让人暂时相信童话存在的世界。' },
]
