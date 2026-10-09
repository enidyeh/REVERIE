import type { Localized } from './messages'

// HOME › IDENTITY 的双语文案。中文版页面内的眉题一律中文（保留序号），纯英文眉题写成 `zh: null`。
export const identityCopy = {
  sectionMetaLeft: { zh: '身份 / 个人档案', en: 'IDENTITY / PERSONAL ARCHIVE' } as Localized,
  sectionMetaRight: {
    zh: (year: string) => `年鉴 · ${year}`,
    en: (year: string) => `YEARBOOK · ${year}`,
  } as Localized<(year: string) => string>,
  coverEyebrow: { zh: 'CITY PASSPORT / SHANGHAI', en: 'CITY PASSPORT / SHANGHAI' } as Localized,
  coverTitleLines: {
    zh: ['走过的地方，', '正在成为你。'],
    en: ['The places you walk', 'become who you are.'],
  } as Localized<string[]>,
  coverLine: { zh: '一份关于真实出发的年度档案。', en: 'A yearly archive of actually going out.' } as Localized,
  ticketsButton: { zh: '我的票据', en: 'My tickets' } as Localized,
  ticketsNote: {
    zh: '演示票据存在本机浏览器，不含手机号；票面二维码为占位，不可入场。',
    en: 'Demo tickets are stored in this browser without your phone number; the QR code is a placeholder and cannot be used for entry.',
  } as Localized,
  passportHolder: { zh: '持有人', en: 'HOLDER' } as Localized,
  passportFieldNotes: { zh: '档案', en: 'FIELD NOTES' } as Localized,
  cardLink: { zh: '链接实体卡片', en: 'Link the physical card' } as Localized,
  cardLinkNotice: {
    zh: '演示：实体卡的链接入口还没有接入，正式版会在这里打开实体卡页面。',
    en: 'Demo: the physical-card link is not built yet; the live version would open the card page here.',
  } as Localized,
  demoToken: { zh: '演示档案', en: 'DEMO ARCHIVE' } as Localized,
  demoNote: {
    zh: '示例身份、徽章和过往体验为虚构数据；你新增的个人记录只保存在本机浏览器。',
    en: 'The sample identity, badges and past experiences are fictional; records you add are stored in this browser only.',
  } as Localized,

  badgesEyebrow: { zh: '01 / 你的护照', en: '01 / YOUR PASSPORT' } as Localized,
  badgesHeading: { zh: '一路收下的小小证明。', en: 'Small proofs collected along the way.' } as Localized,
  badgesCount: {
    zh: (count: number) => `${count} 枚徽章`,
    en: (count: number) => `${count} BADGES`,
  } as Localized<(count: number) => string>,

  interestsEyebrow: { zh: '02 / 你在意什么', en: '02 / WHAT MOVES YOU' } as Localized,
  interestsHeading: { zh: '最近在意的事。', en: 'What you have been noticing lately.' } as Localized,

  connectionsEyebrow: { zh: '03 / 路上的人', en: '03 / PEOPLE ALONG THE WAY' } as Localized,
  connectionsHeading: { zh: '同行小队。', en: 'Squads along the way.' } as Localized,
  connectionIntent: { zh: '演示同行意向', en: 'demo companion intent' } as Localized,
  connectionsEmpty: { zh: '还没有加入同行小队。', en: 'You have not joined a squad yet.' } as Localized,
  findCompanions: { zh: '去活动里找同伴', en: 'Find companions in events' } as Localized,

  nextEyebrow: { zh: '04 / 还在路上', en: '04 / STILL IN MOTION' } as Localized,
  nextHeading: { zh: '正在路上的事。', en: 'Things still in motion.' } as Localized,
  nextCount: {
    zh: (count: number) => `${count} 项在计划中`,
    en: (count: number) => `${count} PLANNED`,
  } as Localized<(count: number) => string>,
  nextExploreEyebrow: { zh: '已选体验', en: 'EXPLORE' } as Localized,
  nextExploreHeading: { zh: '下一次出发', en: 'Your next outing' } as Localized,
  nextEventsEyebrow: { zh: '同行小队', en: 'EVENTS' } as Localized,
  nextEventsHeading: { zh: '一起去现场', en: 'Heading there together' } as Localized,
  nextSpaceEyebrow: { zh: '到访意向', en: 'SPACE' } as Localized,
  nextSpaceHeading: { zh: '准备去看看', en: 'Getting ready to visit' } as Localized,
  nextPlannedState: { zh: '计划中', en: 'planned' } as Localized,
  nextIntentState: { zh: '意向中', en: 'intent' } as Localized,
  nextEmptyExplore: { zh: '还没有加入计划的体验。', en: 'No planned experiences yet.' } as Localized,
  nextEmptyEvents: { zh: '还没有加入活动小队。', en: 'No squads joined yet.' } as Localized,
  nextEmptySpace: { zh: '还没有空间到访意向。', en: 'No space visit intents yet.' } as Localized,
  backToExploreAria: { zh: '返回 EXPLORE 查看计划', en: 'Back to EXPLORE to see plans' } as Localized,
  backToEventsAria: { zh: '返回 Events 查看小队', en: 'Back to Events to see squads' } as Localized,
  backToSpaceAria: { zh: '返回 Space 查看预约意向', en: 'Back to Space to see visit intents' } as Localized,
  nextDisclosure: {
    zh: '这些是尚未完成的本地演示意向，不属于已完成体验记录。',
    en: 'These are unfinished local demo intents, not completed experience records.',
  } as Localized,

  recordEyebrow: { zh: '05 / 写进你的一年', en: '05 / WRITE IT INTO YOUR YEAR' } as Localized,
  recordHeading: { zh: '给经历留一个位置。', en: 'Give the experience a place.' } as Localized,
  prefillLabel: { zh: '来自 EXPLORE · 演示体验', en: 'FROM EXPLORE · demo experience' } as Localized,
  removeDraftAria: { zh: '移除体验关联', en: 'Remove the experience link' } as Localized,
  formTitle: { zh: '这次经历叫什么？', en: 'What is this experience called?' } as Localized,
  formTitlePlaceholder: {
    zh: '例如：在陌生街区散了一会儿步',
    en: 'For example: a short walk in an unfamiliar block',
  } as Localized,
  formLocation: { zh: '在哪里发生？', en: 'Where did it happen?' } as Localized,
  formLocationPlaceholder: { zh: '上海 · 某个街角', en: 'Shanghai · some street corner' } as Localized,
  formNote: { zh: '你想记住什么？', en: 'What do you want to remember?' } as Localized,
  formNotePlaceholder: {
    zh: '写下一个细节、一段对话，或当时的心情……',
    en: 'Write down one detail, a piece of conversation, or how you felt…',
  } as Localized,
  counter: {
    zh: (length: number, maximum: number) => `${length}/${maximum} · 纯文字`,
    en: (length: number, maximum: number) => `${length}/${maximum} · text only`,
  } as Localized<(length: number, maximum: number) => string>,
  cancelEdit: { zh: '取消', en: 'Cancel' } as Localized,
  saveEdit: { zh: '保存修改', en: 'Save changes' } as Localized,
  addEntry: { zh: '收进档案', en: 'Add to archive' } as Localized,
  reflectionDisclosure: {
    zh: '保存后会出现一条本地预设反思提示，不调用真实 AI。',
    en: 'A local preset reflection appears after saving; no real AI is called.',
  } as Localized,
  asideLines: {
    zh: ['经历不必惊天动地，', '被记住就有了形状。'],
    en: ['An experience need not be dramatic —', 'being remembered gives it a shape.'],
  } as Localized<string[]>,
  fieldNoteLabel: {
    zh: '档案',
    en: 'FIELD NOTE',
  } as Localized,
  announceUpdated: { zh: '个人记录已更新', en: 'Your record has been updated' } as Localized,
  announceAdded: { zh: '这段经历已加入你的演示档案', en: 'This experience was added to your demo archive' } as Localized,
  announceRemoved: { zh: '这条个人记录已从本地档案移除', en: 'This record was removed from your local archive' } as Localized,
  announceTicketCancelled: {
    zh: '已取消这张演示票，已从票夹移除',
    en: 'This demo ticket was cancelled and removed from your wallet',
  } as Localized,

  timelineEyebrow: {
    zh: (year: string) => `06 / ${year} 体验档案`,
    en: (year: string) => `06 / ${year} EXPERIENCE ARCHIVE`,
  } as Localized<(year: string) => string>,
  timelineHeading: { zh: '这一年，正在展开。', en: 'This year, unfolding.' } as Localized,
  timelineCount: {
    zh: (count: number) => `${count} 条记录`,
    en: (count: number) => `${count} NOTES`,
  } as Localized<(count: number) => string>,
  searchLabel: { zh: '查找档案', en: 'Search the archive' } as Localized,
  searchPlaceholder: { zh: '标题、地点或记录内容', en: 'Title, place or note text' } as Localized,
  sourceLabel: { zh: '来源', en: 'Source' } as Localized,
  sourceAll: { zh: '全部档案', en: 'All entries' } as Localized,
  sourceUser: { zh: '我的记录', en: 'My records' } as Localized,
  sourceDemo: { zh: '示例档案', en: 'Sample entries' } as Localized,
  resultCount: {
    zh: (shown: number, total: number, year: string) => `显示 ${shown} / ${total} 条 · ${year}`,
    en: (shown: number, total: number, year: string) => `Showing ${shown} / ${total} · ${year}`,
  } as Localized<(shown: number, total: number, year: string) => string>,
  entryDemoBadge: { zh: '示例档案', en: 'Sample entry' } as Localized,
  entryFromExplore: { zh: '来自 EXPLORE', en: 'From EXPLORE' } as Localized,
  entryEdit: { zh: '编辑', en: 'Edit' } as Localized,
  entryDelete: { zh: '删除', en: 'Delete' } as Localized,
  editAria: { zh: (title: string) => `编辑记录：${title}`, en: (title: string) => `Edit record: ${title}` } as Localized<(title: string) => string>,
  deleteAria: { zh: (title: string) => `删除记录：${title}`, en: (title: string) => `Delete record: ${title}` } as Localized<(title: string) => string>,
  reflectLabel: { zh: '预设提示', en: 'REFLECT' } as Localized,
  emptyNoMatch: { zh: '没有符合条件的档案。', en: 'No entries match.' } as Localized,
  emptyYear: { zh: '今年的档案还空着。', en: 'This year’s archive is still empty.' } as Localized,
  resetSearch: { zh: '重置搜索', en: 'Reset search' } as Localized,
  footerMark: { zh: (year: string) => `档案 / ${year}`, en: (year: string) => `ARCHIVE / ${year}` } as Localized<(year: string) => string>,

  // 写入档案时按当前语言生成的默认值：用户自己写的字不翻译。
  defaultLocation: { zh: '上海', en: 'Shanghai' } as Localized,
  defaultCategory: { zh: '个人记录', en: 'MY FIELD NOTE' } as Localized,
  reflectionConnected: {
    zh: '这次体验里，连接也成为了值得带走的一部分。下次可以记下你们共同注意到的一个细节。',
    en: 'Connection turned out to be part of what you took home. Next time, note one detail you both noticed.',
  } as Localized,
  reflectionObservant: {
    zh: '你留下的不只是结果，还有观察过程。下次可以沿着这个细节，继续探索一点点。',
    en: 'What you left behind is not only the result but the noticing. Next time, follow that detail a little further.',
  } as Localized,
  reflectionStart: {
    zh: '从一个具体细节开始，就已经是一次出发。下次可以试着多留十分钟，看看还会遇见什么。',
    en: 'Starting from one concrete detail already counts as setting out. Next time, stay ten minutes longer and see what else turns up.',
  } as Localized,
}
