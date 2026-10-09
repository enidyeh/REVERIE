import type { Localized } from '../i18n/messages'

// SHOP 的分类不是传统电商分类（服装 / 家居 / 配饰），而是项目方给的这四个来源。
// id 用 ASCII（存储与筛选用），界面文案按语言显示。
export type ShopGroupId =
  | 'creator-products'
  | 'artist-merch'
  | 'overseas'
  | 'originals'

export const shopGroups: { id: ShopGroupId; label: Localized }[] = [
  { id: 'creator-products', label: { zh: '独立创作者产品', en: 'Independent creators' } },
  { id: 'artist-merch', label: { zh: '艺术家周边', en: 'Artist merch' } },
  { id: 'overseas', label: { zh: '海外小众商品', en: 'Niche imports' } },
  { id: 'originals', label: { zh: '自有原创产品', en: 'REVERIE originals' } },
]

/** 取分类名（双语）。用于 EXPLORE 的商店引导卡片等位置，避免直接显示 id。 */
export function shopGroupLabel(group: ShopGroupId): Localized {
  return shopGroups.find((entry) => entry.id === group)?.label ?? shopGroups[0].label
}

export type CreatorProduct = {
  id: string
  creator: Localized
  title: Localized
  subtitle: Localized
  category: Localized
  categoryId: 'print' | 'object' | 'map'
  group: ShopGroupId
  price: number
  priceLabel: Localized
  image: string
  imageAlt: Localized
  description: Localized
  creatorStory: Localized
  objectDetails: Localized
  origin: Localized
  // WONDERLAND SHOP EDIT 的本期选品（在 SHOP 页以方框卡片单独展示）。
  edit?: boolean
}

// WONDERLAND SHOP EDIT：项目方给出的选品方向，本轮按项目方要求只保留前五件。名称即项目方
// 给的写法（两版一致），价格与图为演示占位、说明待项目方提供，界面上标注为演示选品。
export const shopEdit = {
  note: {
    zh: '演示选品：名称与价格均为占位，图片为占位素材，价格仅用于本地演示；正式选品与报价待项目方提供。',
    en: 'Demo products: names and prices are placeholders, images are placeholder assets, and prices are for the local demo only. Final products and quotes are to be provided.',
  } as Localized,
  imageOf: (name: string) => `https://images.unsplash.com/${name}?auto=format&fit=crop&w=900&q=80`,
}

const toBeProvided = { zh: '待项目方提供', en: 'To be provided' } as Localized
const demoProduct = { zh: '演示选品', en: 'Demo product' } as Localized
const demoProductNote = { zh: '演示选品：作品说明待项目方提供。', en: 'Demo product: the description is to be provided.' } as Localized
const demoCreatorNote = { zh: '演示选品：创作者信息待项目方提供。', en: 'Demo product: creator details are to be provided.' } as Localized
const demoImageAlt = { zh: '演示选品占位图', en: 'Placeholder image for a demo product' } as Localized

const editProducts: CreatorProduct[] = [
  {
    id: 'edit-bjd',
    creator: toBeProvided,
    title: { zh: 'BJD', en: 'BJD' },
    subtitle: { zh: '本期选品 01', en: 'This issue 01' },
    category: { zh: '艺术家周边 / 演示选品', en: 'Artist merch / demo product' },
    categoryId: 'object',
    group: 'artist-merch',
    price: 268,
    priceLabel: { zh: '¥ 268', en: '¥268' },
    image: shopEdit.imageOf('photo-1558568368-dc03d41f78df'),
    imageAlt: demoImageAlt,
    description: demoProductNote,
    creatorStory: demoCreatorNote,
    objectDetails: demoProduct,
    origin: { zh: '演示选品 · 待项目方提供', en: 'Demo product · to be provided' },
    edit: true,
  },
  {
    id: 'edit-lolita-accessories',
    creator: toBeProvided,
    title: { zh: 'Lolita Accessories', en: 'Lolita Accessories' },
    subtitle: { zh: '本期选品 02', en: 'This issue 02' },
    category: { zh: '艺术家周边 / 演示选品', en: 'Artist merch / demo product' },
    categoryId: 'object',
    group: 'artist-merch',
    price: 88,
    priceLabel: { zh: '¥ 88', en: '¥88' },
    image: shopEdit.imageOf('photo-1516280440614-37939bbacd81'),
    imageAlt: demoImageAlt,
    description: demoProductNote,
    creatorStory: demoCreatorNote,
    objectDetails: demoProduct,
    origin: { zh: '演示选品 · 待项目方提供', en: 'Demo product · to be provided' },
    edit: true,
  },
  {
    id: 'edit-weird-objects',
    creator: toBeProvided,
    title: { zh: 'Weird Objects', en: 'Weird Objects' },
    subtitle: { zh: '本期选品 03', en: 'This issue 03' },
    category: { zh: '海外小众商品 / 演示选品', en: 'Niche imports / demo product' },
    categoryId: 'object',
    group: 'overseas',
    price: 66,
    priceLabel: { zh: '¥ 66', en: '¥66' },
    image: shopEdit.imageOf('photo-1606241018160-4985a8ab5dec'),
    imageAlt: demoImageAlt,
    description: demoProductNote,
    creatorStory: demoCreatorNote,
    objectDetails: demoProduct,
    origin: { zh: '演示选品 · 待项目方提供', en: 'Demo product · to be provided' },
    edit: true,
  },
  {
    id: 'edit-zine',
    creator: toBeProvided,
    title: { zh: 'Zine', en: 'Zine' },
    subtitle: { zh: '本期选品 04', en: 'This issue 04' },
    category: { zh: '独立创作者产品 / 演示选品', en: 'Independent creators / demo product' },
    categoryId: 'print',
    group: 'creator-products',
    price: 42,
    priceLabel: { zh: '¥ 42', en: '¥42' },
    image: shopEdit.imageOf('photo-1544947950-fa07a98d237f'),
    imageAlt: demoImageAlt,
    description: demoProductNote,
    creatorStory: demoCreatorNote,
    objectDetails: demoProduct,
    origin: { zh: '演示选品 · 待项目方提供', en: 'Demo product · to be provided' },
    edit: true,
  },
  {
    id: 'edit-playing-card-jewelry',
    creator: toBeProvided,
    title: { zh: 'Playing Card Jewelry', en: 'Playing Card Jewelry' },
    subtitle: { zh: '本期选品 05', en: 'This issue 05' },
    category: { zh: '独立创作者产品 / 演示选品', en: 'Independent creators / demo product' },
    categoryId: 'object',
    group: 'creator-products',
    price: 158,
    priceLabel: { zh: '¥ 158', en: '¥158' },
    image: shopEdit.imageOf('photo-1497366754035-f200968a6e72'),
    imageAlt: demoImageAlt,
    description: demoProductNote,
    creatorStory: demoCreatorNote,
    objectDetails: demoProduct,
    origin: { zh: '演示选品 · 待项目方提供', en: 'Demo product · to be provided' },
    edit: true,
  },
]

export const creatorProducts: CreatorProduct[] = [
  {
    id: 'north-of-island',
    creator: { zh: '潮汐编辑部', en: 'Tidal Editorial' },
    title: { zh: '《岛屿以北》独立短刊', en: 'North of the Island — an independent zine' },
    subtitle: { zh: '一本关于离开与回来的小誌', en: 'A small zine about leaving and coming back' },
    category: { zh: '独立出版', en: 'PRINT / independent publishing' },
    categoryId: 'print',
    group: 'creator-products',
    price: 48,
    priceLabel: { zh: '¥ 48', en: '¥48' },
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&q=85',
    imageAlt: { zh: '封面设计鲜明的独立出版物', en: 'An independent publication with a striking cover' },
    description: {
      zh: '由上海青年编辑与插画创作者共同完成的小型出版物。用访谈、速写和一组短句，记录离开熟悉路线之后遇到的人。',
      en: 'A small publication made by young Shanghai editors and illustrators, using interviews, sketches and a set of short lines to record the people met after leaving a familiar route.',
    },
    creatorStory: {
      zh: '潮汐编辑部从一次临时的海边采访开始，把关于迁徙、回家和重新出发的口述故事整理成这本短刊。',
      en: 'Tidal Editorial began with an improvised interview by the sea and turned oral histories about moving away, coming home and starting over into this zine.',
    },
    objectDetails: { zh: '28 页 · 双色印刷 · 再生纸', en: '28 pages · two-colour print · recycled paper' },
    origin: { zh: '创作者：潮汐编辑部 · 上海', en: 'Creator: Tidal Editorial · Shanghai' },
  },
  {
    id: 'blue-hour-cup',
    creator: { zh: '慢岛陶作', en: 'Slow Island Ceramics' },
    title: { zh: '蓝时刻手作杯', en: 'Blue hour handmade cup' },
    subtitle: { zh: '每一只都有一点不同的釉色', en: 'Every cup has a slightly different glaze' },
    category: { zh: '手作器物', en: 'OBJECT / handmade objects' },
    categoryId: 'object',
    group: 'creator-products',
    price: 126,
    priceLabel: { zh: '¥ 126', en: '¥126' },
    image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=900&q=85',
    imageAlt: { zh: '桌面上带有手工质感的陶杯', en: 'A handmade ceramic cup on a table' },
    description: {
      zh: '由陶艺创作者在上海小型工作室手工制作。釉色和轮廓存在自然差异，每只杯子都是独立作品。',
      en: 'Made by hand by a ceramic artist in a small Shanghai studio. Glaze and silhouette vary naturally, so every cup is its own piece.',
    },
    creatorStory: {
      zh: '慢岛陶作喜欢记录傍晚的蓝色，把工作室窗外最后一段天光留在每只手作杯的釉面里。',
      en: 'Slow Island Ceramics likes to record the blue of dusk, keeping the last light outside the studio window in the glaze of each handmade cup.',
    },
    objectDetails: { zh: '手工成型 · 单件釉色略有不同', en: 'Hand-formed · each glaze slightly different' },
    origin: { zh: '创作者：慢岛陶作 · 上海', en: 'Creator: Slow Island Ceramics · Shanghai' },
  },
  {
    id: 'city-pocket-map',
    creator: { zh: '街角制图社', en: 'Corner Mapping Society' },
    title: { zh: '街角散步口袋地图', en: 'Corner-walk pocket map' },
    subtitle: { zh: '把一条普通路线折进口袋', en: 'Fold an ordinary route into your pocket' },
    category: { zh: '城市印刷', en: 'MAP / city print' },
    categoryId: 'map',
    group: 'creator-products',
    price: 32,
    priceLabel: { zh: '¥ 32', en: '¥32' },
    image: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=900&q=85',
    imageAlt: { zh: '印刷地图和纸面资料铺展在桌面', en: 'Printed maps and paper materials spread on a table' },
    description: {
      zh: '一张围绕愚园路和周边小巷绘制的散步地图。没有打卡清单，只标出几处适合停下来的街角。',
      en: 'A walking map drawn around Yuyuan Road and the alleys beside it. No checklist of sights — just a few corners worth stopping at.',
    },
    creatorStory: {
      zh: '街角制图社从一年的步行笔记里挑出可以坐下来的地方，做成一张不催人赶路的散步地图。',
      en: 'From a year of walking notes, Corner Mapping Society picked the places where you can sit down and made a map that never rushes you.',
    },
    objectDetails: { zh: '折页地图 · 街区散步路线 · 纸张印刷', en: 'Folded map · neighbourhood walking route · paper print' },
    origin: { zh: '创作者：街角制图社 · 上海', en: 'Creator: Corner Mapping Society · Shanghai' },
  },
  ...editProducts,
]