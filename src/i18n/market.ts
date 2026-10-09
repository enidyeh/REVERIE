import type { Localized } from './messages'
import { plural } from './format'

// HOME › SHOP（REVERIE SHOP）的双语文案。中文版页面内的眉题一律中文，纯英文眉题写成 `zh: null`。
export const marketCopy = {
  headingEyebrow: { zh: null, en: 'OBJECTS WITH A POINT OF VIEW / 01—03' } as Localized<string | null>,
  headingLines: {
    zh: ['小小的东西，', '有很大的来处。'],
    en: ['Small things,', 'with big origins.'],
  } as Localized<string[]>,
  headingLead: {
    zh: '从创作者手里，遇见另一种日常。',
    en: 'Meet another kind of everyday, straight from the makers.',
  } as Localized,
  bagLabel: { zh: '购物袋', en: 'Shopping bag' } as Localized,
  bagAria: {
    zh: (count: number) => `打开购物袋，${count} 件商品`,
    en: (count: number) => `Open your bag, ${count} ${plural(count, 'item', 'items')}`,
  } as Localized<(count: number) => string>,
  categoryGroupLabel: { zh: '按商品类别筛选', en: 'Filter by product category' } as Localized,
  categoryAll: { zh: '全部', en: 'All' } as Localized,
  sortFeatured: { zh: '精选排序', en: 'Featured order' } as Localized,
  sortAscending: { zh: '价格 ↑', en: 'Price ↑' } as Localized,
  sortDescending: { zh: '价格 ↓', en: 'Price ↓' } as Localized,
  sortAriaFeatured: { zh: '精选排序，点击按价格由低到高', en: 'Featured order, tap to sort by lowest price' } as Localized,
  sortAriaAscending: { zh: '价格由低到高，点击按高到低', en: 'Price low to high, tap to switch to high to low' } as Localized,
  sortAriaDescending: { zh: '价格由高到低，点击恢复精选排序', en: 'Price high to low, tap to return to featured order' } as Localized,
  featuredBadge: { zh: '商品精选', en: 'FEATURED' } as Localized,
  creatorNote: { zh: '创作者手记', en: 'CREATOR’S NOTE' } as Localized,
  viewPiece: { zh: '看作品', en: 'See the piece' } as Localized,
  addToBag: { zh: '加入购物袋', en: 'Add to bag' } as Localized,
  addToCart: { zh: '加入购物车', en: 'Add to cart' } as Localized,
  viewProductAria: {
    zh: (title: string) => `查看商品详情：${title}`,
    en: (title: string) => `View product details: ${title}`,
  } as Localized<(title: string) => string>,
  addToBagAria: {
    zh: (title: string) => `加入购物袋：${title}`,
    en: (title: string) => `Add to bag: ${title}`,
  } as Localized<(title: string) => string>,
  gridLabel: { zh: '创作者精选商品', en: 'Featured products from creators' } as Localized,
  addedNotice: {
    zh: (title: string) => `${title}已加入购物袋`,
    en: (title: string) => `${title} added to your bag`,
  } as Localized<(title: string) => string>,
  addedGeneric: { zh: '商品已加入购物袋', en: 'Added to your bag' } as Localized,
  footerNote: {
    zh: '商品与创作者均为虚构演示内容 · 不代表真实在售',
    en: 'Products and creators are fictional demo content · nothing is really for sale',
  } as Localized,

  dialogClose: { zh: '关闭商品详情', en: 'Close product details' } as Localized,
  dialogDemoTag: { zh: '演示商品', en: 'Demo product' } as Localized,
  dialogDemoProduct: { zh: '虚构演示商品', en: 'Fictional demo product' } as Localized,
  dialogDemoNote: { zh: '不涉及真实库存、发货或支付', en: 'No real stock, shipping or payment' } as Localized,

  cartEyebrow: { zh: '购物袋', en: 'CREATOR MARKET / YOUR BAG' } as Localized,
  cartClose: { zh: '关闭购物袋', en: 'Close your bag' } as Localized,
  orderEyebrow: { zh: '演示 · 不是真实订单', en: 'DEMO / NOT A REAL ORDER' } as Localized,
  orderHeading: { zh: '这次购买，只在演示里发生。', en: 'This purchase only happens in the demo.' } as Localized,
  orderBody: {
    zh: '购物袋已清空。没有创建真实订单、扣款或安排发货。',
    en: 'Your bag is now empty. No real order, charge or shipping was created.',
  } as Localized,
  keepBrowsing: { zh: '继续逛集市', en: 'Keep browsing' } as Localized,
  quantityAria: {
    zh: (title: string) => `${title}数量`,
    en: (title: string) => `Quantity of ${title}`,
  } as Localized<(title: string) => string>,
  decreaseAria: {
    zh: (title: string) => `减少${title}数量`,
    en: (title: string) => `Decrease quantity of ${title}`,
  } as Localized<(title: string) => string>,
  increaseAria: {
    zh: (title: string) => `增加${title}数量`,
    en: (title: string) => `Increase quantity of ${title}`,
  } as Localized<(title: string) => string>,
  subtotalLabel: { zh: '演示小计', en: 'Demo subtotal' } as Localized,
  subtotalNote: {
    zh: '价格仅用于交互演示，不会产生实际扣款。',
    en: 'Prices are for the interactive demo only; nothing is charged.',
  } as Localized,
  placeOrder: { zh: '模拟下单', en: 'Place demo order' } as Localized,
  emptyHeading: { zh: '袋子还是空的。', en: 'Your bag is still empty.' } as Localized,
  emptyBody: {
    zh: '逛到喜欢的创作者作品，可以先放进这里。',
    en: 'When you find a creator piece you like, put it here first.',
  } as Localized,
  backToMarket: { zh: '回到集市', en: 'Back to the market' } as Localized,
  cartDemoLabel: { zh: '仅本地演示 · 不接入支付', en: 'LOCAL DEMO ONLY / NO PAYMENT' } as Localized,
}
