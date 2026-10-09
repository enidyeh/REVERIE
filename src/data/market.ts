// SHOP 的分类不是传统电商分类（服装 / 家居 / 配饰），而是项目方给的这四个来源。
// id 用 ASCII，界面上显示中文标签。
export type ShopGroupId =
  | 'creator-products'
  | 'artist-merch'
  | 'overseas'
  | 'originals'

export const shopGroups: { id: ShopGroupId; label: string }[] = [
  { id: 'creator-products', label: '独立创作者产品' },
  { id: 'artist-merch', label: '艺术家周边' },
  { id: 'overseas', label: '海外小众商品' },
  { id: 'originals', label: '自有原创产品' },
]

export type CreatorProduct = {
  id: string
  creator: string
  title: string
  subtitle: string
  category: string
  categoryId: 'print' | 'object' | 'map'
  group: ShopGroupId
  price: number
  priceLabel: string
  image: string
  imageAlt: string
  description: string
  creatorStory: string
  objectDetails: string
  origin: string
  // WONDERLAND SHOP EDIT 的本期选品（在 SHOP 页以方框卡片单独展示）。
  edit?: boolean
}

// WONDERLAND SHOP EDIT：项目方给出的选品方向，本轮按项目方要求只保留前五件。名称即项目方
// 给的写法，价格与图为演示占位、说明待项目方提供，界面上标注为演示选品。
// （“WONDERLAND SHOP EDIT / 05 件选品”这个标题区块已随卡片网格合并而删除，卡片上仍以“本期选品 0N”标注。）
export const shopEdit = {
  note: '演示选品：名称与价格均为占位，图片为占位素材，价格仅用于本地演示；正式选品与报价待项目方提供。',
  imageOf: (name: string) => `https://images.unsplash.com/${name}?auto=format&fit=crop&w=900&q=80`,
}

const editProducts: CreatorProduct[] = [
  { id: 'edit-bjd', creator: '待项目方提供', title: 'BJD', subtitle: '本期选品 01', category: '艺术家周边 / 演示选品', categoryId: 'object', group: 'artist-merch', price: 268, priceLabel: '¥ 268', image: shopEdit.imageOf('photo-1558568368-dc03d41f78df'), imageAlt: '演示选品占位图', description: '演示选品：作品说明待项目方提供。', creatorStory: '演示选品：创作者信息待项目方提供。', objectDetails: '演示选品', origin: '演示选品 · 待项目方提供', edit: true },
  { id: 'edit-lolita-accessories', creator: '待项目方提供', title: 'Lolita Accessories', subtitle: '本期选品 02', category: '艺术家周边 / 演示选品', categoryId: 'object', group: 'artist-merch', price: 88, priceLabel: '¥ 88', image: shopEdit.imageOf('photo-1516280440614-37939bbacd81'), imageAlt: '演示选品占位图', description: '演示选品：作品说明待项目方提供。', creatorStory: '演示选品：创作者信息待项目方提供。', objectDetails: '演示选品', origin: '演示选品 · 待项目方提供', edit: true },
  { id: 'edit-weird-objects', creator: '待项目方提供', title: 'Weird Objects', subtitle: '本期选品 03', category: '海外小众商品 / 演示选品', categoryId: 'object', group: 'overseas', price: 66, priceLabel: '¥ 66', image: shopEdit.imageOf('photo-1606241018160-4985a8ab5dec'), imageAlt: '演示选品占位图', description: '演示选品：作品说明待项目方提供。', creatorStory: '演示选品：创作者信息待项目方提供。', objectDetails: '演示选品', origin: '演示选品 · 待项目方提供', edit: true },
  { id: 'edit-zine', creator: '待项目方提供', title: 'Zine', subtitle: '本期选品 04', category: '独立创作者产品 / 演示选品', categoryId: 'print', group: 'creator-products', price: 42, priceLabel: '¥ 42', image: shopEdit.imageOf('photo-1544947950-fa07a98d237f'), imageAlt: '演示选品占位图', description: '演示选品：作品说明待项目方提供。', creatorStory: '演示选品：创作者信息待项目方提供。', objectDetails: '演示选品', origin: '演示选品 · 待项目方提供', edit: true },
  { id: 'edit-playing-card-jewelry', creator: '待项目方提供', title: 'Playing Card Jewelry', subtitle: '本期选品 05', category: '独立创作者产品 / 演示选品', categoryId: 'object', group: 'creator-products', price: 158, priceLabel: '¥ 158', image: shopEdit.imageOf('photo-1497366754035-f200968a6e72'), imageAlt: '演示选品占位图', description: '演示选品：作品说明待项目方提供。', creatorStory: '演示选品：创作者信息待项目方提供。', objectDetails: '演示选品', origin: '演示选品 · 待项目方提供', edit: true },
]

export const creatorProducts: CreatorProduct[] = [
  {
    id: 'north-of-island',
    creator: '潮汐编辑部',
    title: '《岛屿以北》独立短刊',
    subtitle: '一本关于离开与回来的小誌',
    category: 'PRINT / 独立出版',
    categoryId: 'print',
    group: 'creator-products',
    price: 48,
    priceLabel: '¥ 48',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&q=85',
    imageAlt: '封面设计鲜明的独立出版物',
    description: '由上海青年编辑与插画创作者共同完成的小型出版物。用访谈、速写和一组短句，记录离开熟悉路线之后遇到的人。',
    creatorStory: '潮汐编辑部从一次临时的海边采访开始，把关于迁徙、回家和重新出发的口述故事整理成这本短刊。',
    objectDetails: '28 页 · 双色印刷 · 再生纸',
    origin: '创作者：潮汐编辑部 · 上海',
  },
  {
    id: 'blue-hour-cup',
    creator: '慢岛陶作',
    title: '蓝时刻手作杯',
    subtitle: '每一只都有一点不同的釉色',
    category: 'OBJECT / 手作器物',
    categoryId: 'object',
    group: 'creator-products',
    price: 126,
    priceLabel: '¥ 126',
    image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=900&q=85',
    imageAlt: '桌面上带有手工质感的陶杯',
    description: '由陶艺创作者在上海小型工作室手工制作。釉色和轮廓存在自然差异，每只杯子都是独立作品。',
    creatorStory: '慢岛陶作喜欢记录傍晚的蓝色，把工作室窗外最后一段天光留在每只手作杯的釉面里。',
    objectDetails: '手工成型 · 单件釉色略有不同',
    origin: '创作者：慢岛陶作 · 上海',
  },
  {
    id: 'city-pocket-map',
    creator: '街角制图社',
    title: '街角散步口袋地图',
    subtitle: '把一条普通路线折进口袋',
    category: 'MAP / 城市印刷',
    categoryId: 'map',
    group: 'creator-products',
    price: 32,
    priceLabel: '¥ 32',
    image: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=900&q=85',
    imageAlt: '印刷地图和纸面资料铺展在桌面',
    description: '一张围绕愚园路和周边小巷绘制的散步地图。没有打卡清单，只标出几处适合停下来的街角。',
    creatorStory: '街角制图社从一年的步行笔记里挑出可以坐下来的地方，做成一张不催人赶路的散步地图。',
    objectDetails: '折页地图 · 街区散步路线 · 纸张印刷',
    origin: '创作者：街角制图社 · 上海',
  },
  ...editProducts,
]