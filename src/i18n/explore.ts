import type { Localized } from './messages'
import { plural } from './format'

// HOME › EXPLORE 的双语文案。中文版页面内的眉题一律中文，纯英文眉题写成 `zh: null`。
export const exploreCopy = {
  profileEyebrow: { zh: null, en: 'LIFE PROFILE / THIS WEEK' } as Localized<string | null>,
  profileHeading: { zh: '按你此刻的生活来筛选。', en: 'Filter by the life you are living right now.' } as Localized,
  localNote: {
    zh: '本地偏好 · 不会发送到外部服务',
    en: 'Local preferences · nothing is sent to any external service',
  } as Localized,
  clearPreferences: { zh: '清除偏好', en: 'Clear preferences' } as Localized,
  preferenceLabels: {
    interest: { zh: '兴趣方向', en: 'Interest' } as Localized,
    timeLimit: { zh: '可用时长', en: 'Time available' } as Localized,
    company: { zh: '出行方式', en: 'Company' } as Localized,
  },
  hintActive: {
    zh: (labels: string) => `已按你的选择调整下面的内容：${labels}`,
    en: (labels: string) => `Adjusted for your choices: ${labels}`,
  } as Localized<(labels: string) => string>,
  hintIdle: {
    zh: '选完条件后，下面的内容会跟着调整。',
    en: 'Pick a few conditions and everything below adjusts.',
  } as Localized,
  greetingPlanned: {
    zh: (count: number) => `你已为本周选好 ${count} 次出发。`,
    en: (count: number) => `You have ${count} ${plural(count, 'outing', 'outings')} lined up this week.`,
  } as Localized<(count: number) => string>,
  greetingIdle: { zh: '今天的生活，想从哪里开始？', en: 'Where would you like to start today?' } as Localized,
  planDone: { zh: '已完成', en: 'Done' } as Localized,
  planTodo: { zh: '待完成', en: 'To do' } as Localized,
  planDoneAria: {
    zh: (label: string) => `取消完成：${label}`,
    en: (label: string) => `Mark as not done: ${label}`,
  } as Localized<(label: string) => string>,
  planTodoAria: {
    zh: (label: string) => `标记完成：${label}`,
    en: (label: string) => `Mark as done: ${label}`,
  } as Localized<(label: string) => string>,
  planFallback: {
    zh: '（当前筛选下没有完全匹配的精选，先取这一条）',
    en: '(nothing fully matches these filters yet, so this one is shown)',
  } as Localized,
  planNote: { zh: '预设规则演示 · 不发送数据到外部服务', en: 'Preset rules demo · no data leaves your device' } as Localized,
  // 计划卡片的来源标签：中文版只写中文，英文版用大写英文词。
  planSourceSpace: { zh: '青年空间', en: 'Youth spaces' } as Localized,
  planSourceExperience: { zh: '精选体验', en: 'Curated experiences' } as Localized,

  contentFigureCaption: { zh: '线上专题', en: 'ONLINE TOPICS' } as Localized,
  contentEyebrow: { zh: '内容 / 暗盒', en: 'CONTENT / UNSEEN BOX' } as Localized,
  contentTopicsCount: {
    zh: (count: number) => `${count} 期专题`,
    en: (count: number) => `${count} TOPICS`,
  } as Localized<(count: number) => string>,
  readMore: { zh: '查看更多内容', en: 'read more' } as Localized,
  contentGuideNote: {
    zh: (note: string) => `${note}点「查看更多内容」会切到 HOME › CONTENT；配图为占位素材。`,
    en: (note: string) => `${note} “read more” opens HOME › CONTENT; the image is a placeholder.`,
  } as Localized<(note: string) => string>,

  recommendationsEyebrow: { zh: '01 / 挑一个可能', en: '01 / CHOOSE A POSSIBILITY' } as Localized,
  recommendationsHeading: { zh: '这周，试试这些。', en: 'Try one of these this week.' } as Localized,
  matchCount: {
    zh: (matched: number, total: number) => `符合偏好 ${matched} / 0${total}`,
    en: (matched: number, total: number) => `${matched} / 0${total} match your filters`,
  } as Localized<(matched: number, total: number) => string>,
  curatedOnly: {
    zh: (total: number) => `仅精选 0${total} 条`,
    en: (total: number) => `${total} curated only`,
  } as Localized<(total: number) => string>,
  seeMoreEvents: { zh: '查看更多活动', en: 'See more events' } as Localized,
  photoIndex: { zh: '精选体验 / 01', en: 'EXPERIENCE / 01' } as Localized,
  viewDetails: { zh: '查看详情', en: 'View details' } as Localized,
  addToWeek: { zh: '加入本周计划', en: 'Add to this week' } as Localized,
  addedToWeek: { zh: '已加入本周计划', en: 'Added to this week' } as Localized,
  added: { zh: '已加入计划', en: 'Added' } as Localized,
  viewDetailsAria: {
    zh: (title: string) => `查看体验详情：${title}`,
    en: (title: string) => `View experience details: ${title}`,
  } as Localized<(title: string) => string>,
  addToPlanAria: {
    zh: (title: string) => `加入计划：${title}`,
    en: (title: string) => `Add to plan: ${title}`,
  } as Localized<(title: string) => string>,
  removeFromPlanAria: {
    zh: (title: string) => `从计划移除：${title}`,
    en: (title: string) => `Remove from plan: ${title}`,
  } as Localized<(title: string) => string>,
  closeDetails: { zh: '关闭体验详情', en: 'Close experience details' } as Localized,
  demoPick: { zh: '演示推荐', en: 'Demo pick' } as Localized,
  writeRecord: { zh: '写下这次体验', en: 'Write about this' } as Localized,
  dialogNote: {
    zh: '虚构演示体验 · 不代表真实活动或预约',
    en: 'Fictional demo experience · not a real event or booking',
  } as Localized,
  emptyHeading: { zh: '这组条件下还没有合适的体验。', en: 'Nothing fits these conditions yet.' } as Localized,
  emptyBody: {
    zh: '目前只有 3 条精选演示内容，放宽一项偏好再看看。',
    en: 'Only three curated demos exist so far — loosen one filter and look again.',
  } as Localized,
  emptyAction: { zh: '显示全部精选', en: 'Show all curated' } as Localized,

  shopEyebrow: { zh: '异想商店', en: 'SHOP / REVERIE SHOP' } as Localized,
  shopHeading: { zh: '给自己一个小礼物。', en: 'A small gift for yourself.' } as Localized,
  goShop: { zh: '去异想商店', en: 'Go to REVERIE SHOP' } as Localized,
  shopNote: {
    zh: '演示选品：名称与价格为占位，点入口会切到 HOME › SHOP 看全部商品。',
    en: 'Demo products: names and prices are placeholders. The button opens HOME › SHOP for everything.',
  } as Localized,
  demoProductSuffix: { zh: '演示选品', en: 'demo product' } as Localized,
  spaceEyebrow: { zh: '青年空间', en: 'SPACE / youth spaces' } as Localized,
  spaceHeading: { zh: '探索有意思的空间。', en: 'Find spaces worth exploring.' } as Localized,
  browseSpaces: { zh: '找找这些空间', en: 'Browse spaces' } as Localized,
  spaceNote: {
    zh: '演示空间：地址、时间与价格为占位，到访意向也只在本地记录。',
    en: 'Demo spaces: addresses, hours and prices are placeholders; visit intents are recorded locally only.',
  } as Localized,
  demoSpaceSuffix: { zh: '演示空间', en: 'demo space' } as Localized,
}

/** 偏好选项文案：筛选控件与「已按你的选择调整」提示共用同一份。 */
export const preferenceOptionLabels = {
  interest: {
    all: { zh: '都可以', en: 'Any' },
    city: { zh: '城市漫游', en: 'City wander' },
    make: { zh: '动手创作', en: 'Hands-on' },
    listen: { zh: '聆听时刻', en: 'Listening' },
  } as Record<'all' | 'city' | 'make' | 'listen', Localized>,
  timeLimit: {
    any: { zh: '暂不限定', en: 'No limit' },
    '60': { zh: '1 小时内', en: 'Within 1 hour' },
    '90': { zh: '90 分钟内', en: 'Within 90 minutes' },
    '120': { zh: '2 小时内', en: 'Within 2 hours' },
  } as Record<'any' | '60' | '90' | '120', Localized>,
  company: {
    any: { zh: '都可以', en: 'Any' },
    solo: { zh: '适合独自出发', en: 'Good solo' },
    group: { zh: '想认识同行者', en: 'Meet companions' },
  } as Record<'any' | 'solo' | 'group', Localized>,
}
