import type { Localized } from './messages'
import { plural } from './format'

// HOME › SPACE 的双语文案。中文版页面内的眉题一律中文，纯英文眉题写成 `zh: null`。
export const spaceCopy = {
  fitInterest: { zh: '兴趣匹配', en: 'Interest match' } as Localized,
  fitTime: { zh: '停留时长适配', en: 'Fits your time' } as Localized,
  fitCompanyBoth: { zh: '独自/同行都可', en: 'Fine solo or in company' } as Localized,
  fitCompany: { zh: '出行方式匹配', en: 'Matches how you travel' } as Localized,
  fitCity: { zh: '城市探索', en: 'City exploring' } as Localized,
  fitMake: { zh: '动手创作', en: 'Hands-on' } as Localized,
  fitListen: { zh: '聆听时刻', en: 'Listening' } as Localized,

  preferencesLabel: { zh: '空间偏好筛选', en: 'Space preference filters' } as Localized,
  preferencesEyebrow: { zh: '本地偏好', en: 'YOUR WEEK' } as Localized,
  clearFilters: { zh: '清除筛选', en: 'Clear filters' } as Localized,

  intentsLabel: { zh: '我的预约意向', en: 'My visit intents' } as Localized,
  intentsEyebrow: { zh: '本地演示', en: 'YOUR VISIT INTENTS' } as Localized,
  intentsCount: {
    zh: (count: number) => `已选 ${count} 处空间`,
    en: (count: number) => `${count} ${plural(count, 'space', 'spaces')} selected`,
  } as Localized<(count: number) => string>,

  listLabel: { zh: '上海青年空间精选', en: 'Selected youth spaces in Shanghai' } as Localized,
  featureBadge: { zh: '空间 / 01', en: 'SPACE / 01' } as Localized,
  featureTagline: { zh: '为你的下一个念头打开', en: 'OPEN TO YOUR NEXT IDEA' } as Localized,
  bookedLabel: {
    zh: (slot: string) => `意向已记录 · ${slot}`,
    en: (slot: string) => `Intent recorded · ${slot}`,
  } as Localized<(slot: string) => string>,
  viewIntent: { zh: '查看预约意向', en: 'View visit intent' } as Localized,
  viewSpaceSlots: { zh: '查看空间与时段', en: 'View space and times' } as Localized,
  viewSpaceAria: {
    zh: (name: string) => `查看空间详情：${name}`,
    en: (name: string) => `View space details: ${name}`,
  } as Localized<(name: string) => string>,
  viewSlotsAria: {
    zh: (name: string) => `查看时段：${name}`,
    en: (name: string) => `View times: ${name}`,
  } as Localized<(name: string) => string>,
  emptyHeading: { zh: '这组偏好下还没有合适空间。', en: 'Nothing fits these preferences yet.' } as Localized,
  emptyBody: {
    zh: '演示空间数量有限，调整偏好或查看全部空间。',
    en: 'There are only a few demo spaces — adjust your preferences or browse them all.',
  } as Localized,
  emptyAction: { zh: '显示全部空间', en: 'Show all spaces' } as Localized,
  footnote: {
    zh: '空间、地址、时段与活动均为虚构演示数据 · 不代表真实营业或预约情况',
    en: 'Spaces, addresses, times and activities are fictional demo data · not real opening hours or bookings',
  } as Localized,

  detailClose: { zh: '关闭空间详情', en: 'Close space details' } as Localized,
  hereYouCan: { zh: '你可以做的事', en: 'HERE, YOU CAN' } as Localized,
  beforeYouGo: { zh: '到访前', en: 'BEFORE YOU GO' } as Localized,
  reservedRecorded: { zh: '本地预约意向已记录', en: 'Visit intent saved locally' } as Localized,
  reservedNote: {
    zh: '此确认仅保存在演示页面，不会通知空间或生成真实预约。',
    en: 'This confirmation stays on the demo page; the space is not notified and no real booking is made.',
  } as Localized,
  cancelIntent: { zh: '取消预约意向', en: 'Cancel visit intent' } as Localized,
  timeGroupLabel: { zh: '选择参观时间', en: 'Choose a visit time' } as Localized,
  timeHeading: { zh: '预约参观意向', en: 'Reserve a visit intent' } as Localized,
  submitIntent: { zh: '模拟提交预约意向', en: 'Submit visit intent (demo)' } as Localized,
  demoNote: {
    zh: '虚构空间与时段 · 不连接真实预约服务',
    en: 'Fictional spaces and times · no real booking service',
  } as Localized,
  announceReserved: {
    zh: (name: string) => `${name}的预约意向已记录，仅用于演示`,
    en: (name: string) => `Visit intent for ${name} saved — demo only`,
  } as Localized<(name: string) => string>,
  announceCancelled: {
    zh: '预约意向已从本地演示中取消',
    en: 'Visit intent removed from the local demo',
  } as Localized,
}
