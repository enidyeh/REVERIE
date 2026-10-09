import type { Localized } from '../i18n/messages'

// HOME › CONTENT：UNSEEN｜暗盒（内容与洞察层）。范围与措辞由项目方本轮提供。
// 双语约定：显示文案写成 `{ zh, en }`，英文侧不出现中文。
export const contentMeta = {
  kicker: { zh: 'UNSEEN｜暗盒', en: 'UNSEEN BOX' } as Localized,
  title: { zh: '最近这些值得关注', en: 'Things worth discovering.' } as Localized,
  // EXPLORE 的 CONTENT 引导块用图：沿用站内已有的 Unsplash 演示图，正式图待项目方提供。
  coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
  coverImageAlt: { zh: '演示配图：写作与编辑的桌面', en: 'Demo image: a desk for writing and editing' } as Localized,
}

// 「线上专题」：项目方本轮给出的本期专题方向。专题页尚未接入，因此只列出标题、不做跳转。
// id 供 EXPLORE 的专题排序使用：排序不依赖标题文字，翻译后不会失效。
export const contentTopics = {
  label: { zh: '线上专题', en: 'Online topics' } as Localized,
  note: {
    zh: '演示：专题页尚未接入，现阶段只列出本期专题方向，点不进去。',
    en: 'Demo: topic pages are not built yet — this lists this issue’s directions only, and they are not clickable.',
  } as Localized,
  items: [
    { id: 'fairy-tales', label: { zh: '为什么成年人还在需要童话？', en: 'Why do adults still need fairy tales?' } },
    { id: 'lolita', label: { zh: 'Lolita 文化', en: 'Lolita culture' } },
    { id: 'doll-culture', label: { zh: 'Doll Culture', en: 'Doll culture' } },
    { id: 'dark-fairy-tale', label: { zh: 'Dark Fairy Tale', en: 'Dark fairy tale' } },
    { id: 'strange-spaces', label: { zh: '上海 5 个奇怪空间', en: 'Five strange spaces in Shanghai' } },
    { id: 'dream-makers', label: { zh: '5 个梦境创作者', en: 'Five dream makers' } },
    { id: 'dream-test', label: { zh: '梦境人格测试', en: 'The dream archetype test' } },
    { id: 'monthly-mission', label: { zh: '本月任务', en: 'This month’s mission' } },
    { id: 'open-call', label: { zh: 'Open Call', en: 'Open call' } },
  ] as { id: string; label: Localized }[],
}

export const contentNote: Localized = {
  zh: '演示：「特别推荐」下列出的条目取自本页「线上专题」的示范例子，不是已发布的文章；正式的文章标题与链接仍待项目方提供。',
  en: 'Demo: the items under Featured are examples taken from Online topics on this page, not published articles. Final titles and links are to be provided.',
}
