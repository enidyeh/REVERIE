import type { Localized } from './messages'
import { plural } from './format'

// HOME › EVENTS 的双语文案。中文版页面内的眉题一律中文，纯英文眉题写成 `zh: null`。
export const eventsCopy = {
  preferencesLabel: { zh: '活动偏好筛选', en: 'Event preference filters' } as Localized,
  preferencesEyebrow: { zh: '本地偏好', en: 'YOUR WEEK' } as Localized,
  clearFilters: { zh: '清除筛选', en: 'Clear filters' } as Localized,

  curationEyebrow: { zh: '演示活动', en: 'EDITOR’S PICKS' } as Localized,
  curationCount: {
    zh: (matched: number, total: number) => `${matched} / 0${total} 场符合偏好`,
    en: (matched: number, total: number) => `${matched} / 0${total} match your filters`,
  } as Localized<(matched: number, total: number) => string>,
  squadsTotal: {
    zh: (count: number) => `${count} 个同行小队`,
    en: (count: number) => `${count} ${plural(count, 'squad', 'squads')} going`,
  } as Localized<(count: number) => string>,

  imageIndex: {
    zh: (index: number) => `活动 / 0${index}`,
    en: (index: number) => `EVENT / 0${index}`,
  } as Localized<(index: number) => string>,
  viewEventSquads: { zh: '查看活动与小队', en: 'View event and squads' } as Localized,
  viewEventAria: {
    zh: (title: string) => `查看活动详情：${title}`,
    en: (title: string) => `View event details: ${title}`,
  } as Localized<(title: string) => string>,
  openEventAria: {
    zh: (title: string) => `打开活动详情：${title}`,
    en: (title: string) => `Open event details: ${title}`,
  } as Localized<(title: string) => string>,
  seatsLine: {
    zh: (open: number, seats: number) => `${open} 个小队可加入 · ${seats} 个空位`,
    en: (open: number, seats: number) => `${open} ${plural(open, 'squad', 'squads')} open · ${seats} ${plural(seats, 'seat', 'seats')} left`,
  } as Localized<(open: number, seats: number) => string>,
  seatsLineCompact: {
    zh: (open: number, seats: number) => `${open} 组可加入 · ${seats} 个空位`,
    en: (open: number, seats: number) => `${open} ${plural(open, 'group', 'groups')} open · ${seats} ${plural(seats, 'seat', 'seats')} left`,
  } as Localized<(open: number, seats: number) => string>,
  joinedLabel: {
    zh: (name: string) => `已加入：${name}`,
    en: (name: string) => `Joined: ${name}`,
  } as Localized<(name: string) => string>,
  joinedCompact: {
    zh: (name: string) => ` · 已加入 ${name}`,
    en: (name: string) => ` · joined ${name}`,
  } as Localized<(name: string) => string>,

  emptyHeading: { zh: '这组偏好下还没有合适活动。', en: 'Nothing fits these preferences yet.' } as Localized,
  emptyBody: {
    zh: '演示活动数量有限，调整偏好或显示全部活动。',
    en: 'There are only a few demo events — adjust your preferences or show them all.',
  } as Localized,
  emptyAction: { zh: '显示全部活动', en: 'Show all events' } as Localized,
  footnote: {
    zh: '活动、人名、时间、地点与小队均为虚构演示数据，不代表真实活动。',
    en: 'Events, names, times, places and squads are fictional demo data, not real events.',
  } as Localized,

  detailClose: { zh: '关闭活动详情', en: 'Close event details' } as Localized,
  programLabel: { zh: '活动内容', en: 'PROGRAM' } as Localized,
  teamsEyebrow: { zh: null, en: 'MEET BEFORE YOU GO' } as Localized<string | null>,
  teamsHeading: { zh: '看看谁也想去。', en: 'See who else wants to go.' } as Localized,
  teamsCount: {
    zh: (count: number) => `${count} 个小队`,
    en: (count: number) => `${count} ${plural(count, 'squad', 'squads')}`,
  } as Localized<(count: number) => string>,
  membersLine: {
    zh: (joined: number, capacity: number) => `${joined}/${capacity} 位同行者`,
    en: (joined: number, capacity: number) => `${joined}/${capacity} going`,
  } as Localized<(joined: number, capacity: number) => string>,
  leaveSquad: { zh: '退出小队', en: 'Leave squad' } as Localized,
  squadFull: { zh: '小队已满', en: 'Squad full' } as Localized,
  joinedOtherSquad: { zh: '已加入其他小队', en: 'You joined another squad' } as Localized,
  joinSquad: { zh: '加入小队', en: 'Join squad' } as Localized,
  demoNote: {
    zh: '虚构活动与小队 · 加入仅用于本地演示，不代表真实报名',
    en: 'Fictional events and squads · joining is a local demo, not a real sign-up',
  } as Localized,

  fitInterest: { zh: '兴趣匹配', en: 'Interest match' } as Localized,
  fitTime: { zh: '时长适配', en: 'Fits your time' } as Localized,
  fitCompanyBoth: { zh: '独自/同行都可', en: 'Fine solo or in company' } as Localized,
  fitCompany: { zh: '出行方式匹配', en: 'Matches how you travel' } as Localized,
  fitCity: { zh: '城市观察', en: 'City watching' } as Localized,
  fitMake: { zh: '动手体验', en: 'Hands-on' } as Localized,
  fitListen: { zh: '聆听现场', en: 'Live listening' } as Localized,
}
