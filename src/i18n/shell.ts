import type { Localized } from './messages'

// 外壳（导航、页头、页脚、弹层框架）的双语文案。
// 规则：中文版保持现有的中英混排眉题，英文版不出现任何中文。
export const shell = {
  home: { zh: 'REVERIE 首页', en: 'REVERIE home' } as Localized,
  profile: { zh: '打开个人档案', en: 'Open your profile' } as Localized,
  more: { zh: '打开更多入口', en: 'Open more links' } as Localized,
  mainNav: { zh: '主导航', en: 'Main navigation' } as Localized,
  mobileNav: { zh: '移动端主导航', en: 'Primary navigation' } as Localized,
}

export const moreMenuCopy = {
  eyebrow: { zh: 'MORE / 更多', en: 'MORE' } as Localized,
  panelLabel: { zh: '更多入口', en: 'More links' } as Localized,
  close: { zh: '关闭更多入口', en: 'Close more links' } as Localized,
}

export const locationPickerCopy = {
  trigger: { zh: 'SHANGHAI, CN', en: 'SHANGHAI, CN' } as Localized,
  triggerLabel: { zh: '选择国家与城市', en: 'Choose country and city' } as Localized,
  eyebrow: { zh: 'SELECT REGION / 选择国家地区', en: 'SELECT REGION' } as Localized,
  title: { zh: '你在哪里？', en: 'Where are you?' } as Localized,
  close: { zh: '关闭地点选择', en: 'Close location picker' } as Localized,
  searchLabel: { zh: '搜索国家或城市', en: 'Search country or city' } as Localized,
  searchPlaceholder: { zh: '搜索国家或城市', en: 'Search country or city' } as Localized,
  current: { zh: '当前：', en: 'Current: ' } as Localized,
  empty: { zh: '没有匹配的国家或城市。', en: 'No matching country or city.' } as Localized,
  note: {
    zh: '当前只有上海的演示内容；其他城市的体验、活动、商品与空间尚未上线。国家与城市列表为演示数据。',
    en: 'Only Shanghai has demo content for now; experiences, events, products and spaces for other cities are not live yet. The country and city list is demo data.',
  } as Localized,
}
