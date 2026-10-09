import type { Localized } from './messages'

// HOME 外壳（英雄区与五个子栏目标签）的双语文案。
// 规则：中文版页面内的眉题一律中文，纯英文眉题写成 `zh: null`；英文版不出现中文。
export const homeCopy = {
  // 「THE CITY, IN REAL LIFE」是纯英文眉题，中文版不渲染。
  sectionMeta: { zh: null, en: 'THE CITY, IN REAL LIFE' } as Localized<string | null>,
  city: { zh: '上海', en: 'SHANGHAI' } as Localized,
  titleLines: { zh: ['在现场，', '遇见更多。'], en: ['On site,', 'meet more.'] } as Localized<string[]>,
  asideLines: {
    zh: ['城市不是背景，', '它是正在发生的事。'],
    en: ['The city is not a backdrop;', 'it is what’s happening.'],
  } as Localized<string[]>,
  tabsLabel: { zh: '城市栏目', en: 'City sections' } as Localized,
  tabs: {
    explore: { zh: '探索', en: 'EXPLORE' } as Localized,
    content: { zh: '内容', en: 'CONTENT' } as Localized,
    events: { zh: '活动', en: 'EVENTS' } as Localized,
    shop: { zh: '商店', en: 'SHOP' } as Localized,
    space: { zh: '空间', en: 'SPACE' } as Localized,
  },
}
