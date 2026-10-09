// 国家与城市选择器数据。当前仅有上海的演示内容，其他城市仅作为可选项存在。

export type City = { id: string; zh: string; en: string }

export type Country = {
  id: string
  zh: string
  en: string
  code: string
  cities: City[]
}

export const countries: Country[] = [
  {
    id: 'cn',
    zh: '中国',
    en: 'CHINA',
    code: 'CN',
    cities: [
      { id: 'cn-shanghai', zh: '上海', en: 'SHANGHAI' },
      { id: 'cn-beijing', zh: '北京', en: 'BEIJING' },
      { id: 'cn-guangzhou', zh: '广州', en: 'GUANGZHOU' },
      { id: 'cn-shenzhen', zh: '深圳', en: 'SHENZHEN' },
      { id: 'cn-chengdu', zh: '成都', en: 'CHENGDU' },
      { id: 'cn-hangzhou', zh: '杭州', en: 'HANGZHOU' },
      { id: 'cn-nanjing', zh: '南京', en: 'NANJING' },
      { id: 'cn-wuhan', zh: '武汉', en: 'WUHAN' },
      { id: 'cn-xian', zh: '西安', en: "XI'AN" },
      { id: 'cn-chongqing', zh: '重庆', en: 'CHONGQING' },
      { id: 'cn-suzhou', zh: '苏州', en: 'SUZHOU' },
      { id: 'cn-xiamen', zh: '厦门', en: 'XIAMEN' },
      { id: 'cn-changsha', zh: '长沙', en: 'CHANGSHA' },
      { id: 'cn-qingdao', zh: '青岛', en: 'QINGDAO' },
      { id: 'cn-kunming', zh: '昆明', en: 'KUNMING' },
      { id: 'cn-hongkong', zh: '香港', en: 'HONG KONG' },
      { id: 'cn-macau', zh: '澳门', en: 'MACAU' },
      { id: 'cn-taiwan', zh: '台湾', en: 'TAIWAN' },
    ],
  },
  {
    id: 'jp',
    zh: '日本',
    en: 'JAPAN',
    code: 'JP',
    cities: [
      { id: 'jp-tokyo', zh: '东京', en: 'TOKYO' },
      { id: 'jp-osaka', zh: '大阪', en: 'OSAKA' },
      { id: 'jp-kyoto', zh: '京都', en: 'KYOTO' },
      { id: 'jp-fukuoka', zh: '福冈', en: 'FUKUOKA' },
      { id: 'jp-sapporo', zh: '札幌', en: 'SAPPORO' },
      { id: 'jp-nagoya', zh: '名古屋', en: 'NAGOYA' },
    ],
  },
  {
    id: 'kr',
    zh: '韩国',
    en: 'SOUTH KOREA',
    code: 'KR',
    cities: [
      { id: 'kr-seoul', zh: '首尔', en: 'SEOUL' },
      { id: 'kr-busan', zh: '釜山', en: 'BUSAN' },
      { id: 'kr-daegu', zh: '大邱', en: 'DAEGU' },
    ],
  },
  {
    id: 'sg',
    zh: '新加坡',
    en: 'SINGAPORE',
    code: 'SG',
    cities: [{ id: 'sg-singapore', zh: '新加坡', en: 'SINGAPORE' }],
  },
  {
    id: 'th',
    zh: '泰国',
    en: 'THAILAND',
    code: 'TH',
    cities: [
      { id: 'th-bangkok', zh: '曼谷', en: 'BANGKOK' },
      { id: 'th-chiangmai', zh: '清迈', en: 'CHIANG MAI' },
      { id: 'th-phuket', zh: '普吉', en: 'PHUKET' },
    ],
  },
  {
    id: 'my',
    zh: '马来西亚',
    en: 'MALAYSIA',
    code: 'MY',
    cities: [
      { id: 'my-kualalumpur', zh: '吉隆坡', en: 'KUALA LUMPUR' },
      { id: 'my-penang', zh: '槟城', en: 'PENANG' },
    ],
  },
  {
    id: 'gb',
    zh: '英国',
    en: 'UNITED KINGDOM',
    code: 'GB',
    cities: [
      { id: 'gb-london', zh: '伦敦', en: 'LONDON' },
      { id: 'gb-manchester', zh: '曼彻斯特', en: 'MANCHESTER' },
      { id: 'gb-edinburgh', zh: '爱丁堡', en: 'EDINBURGH' },
      { id: 'gb-glasgow', zh: '格拉斯哥', en: 'GLASGOW' },
    ],
  },
  {
    id: 'fr',
    zh: '法国',
    en: 'FRANCE',
    code: 'FR',
    cities: [
      { id: 'fr-paris', zh: '巴黎', en: 'PARIS' },
      { id: 'fr-lyon', zh: '里昂', en: 'LYON' },
      { id: 'fr-marseille', zh: '马赛', en: 'MARSEILLE' },
    ],
  },
  {
    id: 'de',
    zh: '德国',
    en: 'GERMANY',
    code: 'DE',
    cities: [
      { id: 'de-berlin', zh: '柏林', en: 'BERLIN' },
      { id: 'de-munich', zh: '慕尼黑', en: 'MUNICH' },
      { id: 'de-hamburg', zh: '汉堡', en: 'HAMBURG' },
    ],
  },
  {
    id: 'it',
    zh: '意大利',
    en: 'ITALY',
    code: 'IT',
    cities: [
      { id: 'it-milan', zh: '米兰', en: 'MILAN' },
      { id: 'it-rome', zh: '罗马', en: 'ROME' },
      { id: 'it-florence', zh: '佛罗伦萨', en: 'FLORENCE' },
    ],
  },
  {
    id: 'es',
    zh: '西班牙',
    en: 'SPAIN',
    code: 'ES',
    cities: [
      { id: 'es-barcelona', zh: '巴塞罗那', en: 'BARCELONA' },
      { id: 'es-madrid', zh: '马德里', en: 'MADRID' },
    ],
  },
  {
    id: 'nl',
    zh: '荷兰',
    en: 'NETHERLANDS',
    code: 'NL',
    cities: [
      { id: 'nl-amsterdam', zh: '阿姆斯特丹', en: 'AMSTERDAM' },
      { id: 'nl-rotterdam', zh: '鹿特丹', en: 'ROTTERDAM' },
    ],
  },
  {
    id: 'se',
    zh: '瑞典',
    en: 'SWEDEN',
    code: 'SE',
    cities: [
      { id: 'se-stockholm', zh: '斯德哥尔摩', en: 'STOCKHOLM' },
      { id: 'se-gothenburg', zh: '哥德堡', en: 'GOTHENBURG' },
    ],
  },
  {
    id: 'us',
    zh: '美国',
    en: 'UNITED STATES',
    code: 'US',
    cities: [
      { id: 'us-newyork', zh: '纽约', en: 'NEW YORK' },
      { id: 'us-losangeles', zh: '洛杉矶', en: 'LOS ANGELES' },
      { id: 'us-sanfrancisco', zh: '旧金山', en: 'SAN FRANCISCO' },
      { id: 'us-chicago', zh: '芝加哥', en: 'CHICAGO' },
      { id: 'us-seattle', zh: '西雅图', en: 'SEATTLE' },
      { id: 'us-boston', zh: '波士顿', en: 'BOSTON' },
    ],
  },
  {
    id: 'ca',
    zh: '加拿大',
    en: 'CANADA',
    code: 'CA',
    cities: [
      { id: 'ca-toronto', zh: '多伦多', en: 'TORONTO' },
      { id: 'ca-vancouver', zh: '温哥华', en: 'VANCOUVER' },
      { id: 'ca-montreal', zh: '蒙特利尔', en: 'MONTREAL' },
    ],
  },
  {
    id: 'au',
    zh: '澳大利亚',
    en: 'AUSTRALIA',
    code: 'AU',
    cities: [
      { id: 'au-sydney', zh: '悉尼', en: 'SYDNEY' },
      { id: 'au-melbourne', zh: '墨尔本', en: 'MELBOURNE' },
      { id: 'au-brisbane', zh: '布里斯班', en: 'BRISBANE' },
    ],
  },
  {
    id: 'nz',
    zh: '新西兰',
    en: 'NEW ZEALAND',
    code: 'NZ',
    cities: [
      { id: 'nz-auckland', zh: '奥克兰', en: 'AUCKLAND' },
      { id: 'nz-wellington', zh: '惠灵顿', en: 'WELLINGTON' },
    ],
  },
]

export type SelectedLocation = { city: string; cityEn: string; country: string; countryCode: string }

export const defaultLocationId = 'cn-shanghai'

export function resolveLocation(cityId: string): SelectedLocation {
  for (const country of countries) {
    const city = country.cities.find((entry) => entry.id === cityId)
    if (city) return { city: city.zh, cityEn: city.en, country: country.zh, countryCode: country.code }
  }
  const fallbackCountry = countries[0]
  const fallbackCity = fallbackCountry.cities[0]
  return { city: fallbackCity.zh, cityEn: fallbackCity.en, country: fallbackCountry.zh, countryCode: fallbackCountry.code }
}

export function locationLabel(location: SelectedLocation) {
  return `${location.cityEn}, ${location.countryCode}`
}
