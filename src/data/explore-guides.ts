// EXPLORE 的四处栏目引导与计划卡片的轻度映射。
// 规则只用现有演示数据做挑选与排序：不新增任何文案，也不调用网络或 AI。
import { contentTopics } from './content'
import {
  experiences,
  type DiscoverPreferences,
  type EditorPromptId,
  type Experience,
} from './discover'
import { creatorProducts, type CreatorProduct } from './market'
import { youthSpaces, type YouthSpace } from './spaces'

type Option<Value extends string> = { value: Value; label: string }

// 偏好的选项文案：筛选控件与「已按你的选择调整」提示共用同一份，避免两处不一致。
export const preferenceOptions: {
  interest: Option<DiscoverPreferences['interest']>[]
  timeLimit: Option<DiscoverPreferences['timeLimit']>[]
  company: Option<DiscoverPreferences['company']>[]
} = {
  interest: [
    { value: 'all', label: '都可以' },
    { value: 'city', label: '城市漫游' },
    { value: 'make', label: '动手创作' },
    { value: 'listen', label: '聆听时刻' },
  ],
  timeLimit: [
    { value: 'any', label: '暂不限定' },
    { value: '60', label: '1 小时内' },
    { value: '90', label: '90 分钟内' },
    { value: '120', label: '2 小时内' },
  ],
  company: [
    { value: 'any', label: '都可以' },
    { value: 'solo', label: '适合独自出发' },
    { value: 'group', label: '想认识同行者' },
  ],
}

const lookUp = <Value extends string>(list: Option<Value>[], value: Value) => list.find((option) => option.value === value)?.label

// 只列出「已经选过」的条件，用于提示下面的内容为什么是这样。
export function activePreferenceLabels(preferences: DiscoverPreferences): string[] {
  const labels: string[] = []
  const interest = lookUp(preferenceOptions.interest, preferences.interest)
  const time = lookUp(preferenceOptions.timeLimit, preferences.timeLimit)
  const company = lookUp(preferenceOptions.company, preferences.company)
  if (preferences.interest !== 'all' && interest) labels.push(interest)
  if (preferences.timeLimit !== 'any' && time) labels.push(time)
  if (preferences.company !== 'any' && company) labels.push(company)
  return labels
}

// 与「这周，试试这些。」用同一套筛选规则（原先写在 ExploreView 里）。
export function matchingExperiences(preferences: DiscoverPreferences): Experience[] {
  return experiences.filter((experience) => {
    if (preferences.interest !== 'all' && experience.interest !== preferences.interest) return false
    if (preferences.timeLimit !== 'any' && experience.durationMinutes > Number(preferences.timeLimit)) return false
    if (preferences.company !== 'any' && experience.socialFit !== 'both' && experience.socialFit !== preferences.company) return false
    return true
  })
}

// 线上专题：把与当前兴趣更贴近的那一期提到最前，其余保持项目方给的顺序。
// 八条专题本身仍然是项目方的原文，这里只调整先后。
const topicAffinity: Record<DiscoverPreferences['interest'], string[]> = {
  all: [],
  city: ['上海 5 个奇怪空间'],
  make: ['Doll Culture'],
  listen: ['5 个梦境创作者'],
}

export function guideTopics(preferences: DiscoverPreferences): string[] {
  const items = contentTopics.items.slice(0, 8)
  const affinity = topicAffinity[preferences.interest]
  if (affinity.length === 0) return items
  return [...items.filter((topic) => affinity.includes(topic)), ...items.filter((topic) => !affinity.includes(topic))]
}

// 商店：按兴趣方向对应的分类挑三件（单次预算筛选已按项目方要求去掉）。
// 聆听时刻目前没有对应分类，回退到默认的三件本期选品。
const shopAffinity: Record<DiscoverPreferences['interest'], CreatorProduct['group'][]> = {
  all: [],
  city: ['creator-products'],
  make: ['artist-merch', 'creator-products'],
  listen: [],
}

export function guideShopPicks(preferences: DiscoverPreferences): CreatorProduct[] {
  const picks = creatorProducts.filter((product) => product.edit === true)
  const groups = shopAffinity[preferences.interest]
  if (groups.length === 0) return picks.slice(0, 3)
  const matched = picks.filter((product) => groups.includes(product.group))
  return (matched.length >= 3 ? matched : [...matched, ...picks.filter((product) => !groups.includes(product.group))]).slice(0, 3)
}

// 空间：兴趣方向与出行方式各算一分，分数高的排前面；同分保持原有顺序。
export function guideSpaces(preferences: DiscoverPreferences): YouthSpace[] {
  return youthSpaces
    .map((space) => {
      let score = 0
      if (preferences.interest !== 'all' && space.interest === preferences.interest) score += 2
      if (preferences.company !== 'any' && (space.socialFit === preferences.company || space.socialFit === 'both')) score += 1
      return { space, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.space)
}

export type PlanCard = { id: string; source: string; title: string; text: string; next: string; fallback: boolean }

// 计划卡片：不再用固定的预设回答，改为按当前筛选结果从现有数据里挑一条，
// 标题 / 说明 / 一行信息都取自该条目本身的字段。
// `usedIds` 用于让同一组里的多条计划尽量指向不同条目（拿不到新条目时才会重复）。
export function planFor(preferences: DiscoverPreferences, promptId: EditorPromptId, usedIds: string[] = []): PlanCard {
  const matches = matchingExperiences(preferences)
  const freshMatches = matches.filter((experience) => !usedIds.includes(experience.id))
  const freshAny = experiences.filter((experience) => !usedIds.includes(experience.id))

  if (promptId === 'go-solo') {
    const spaces = guideSpaces({ ...preferences, company: 'solo' })
    const space = spaces.find((item) => !usedIds.includes(item.id)) ?? spaces[0]
    return { id: space.id, source: 'SPACE / 青年空间', title: space.name, text: space.description, next: `${space.district} · ${space.category} · ${space.price}`, fallback: false }
  }

  // 精选体验没有完全匹配时退回其它精选，并在界面上说明原因。
  const fallback = freshMatches.length === 0
  const pool = fallback && promptId !== 'meet-people' ? [experiences[0]] : freshMatches

  if (promptId === 'meet-people') {
    const pick = freshMatches.find((experience) => experience.socialFit === 'group')
      ?? freshMatches[0]
      ?? freshAny[0]
      ?? experiences[0]
    return { id: pick.id, source: 'EXPLORE / 精选体验', title: pick.title, text: pick.reason, next: `${pick.location} · ${pick.duration} · ${pick.budget}`, fallback: freshMatches.length === 0 }
  }

  const pick = [...pool].sort((a, b) => a.durationMinutes - b.durationMinutes)[0] ?? experiences[0]
  return { id: pick.id, source: 'EXPLORE / 精选体验', title: pick.title, text: pick.reason, next: `${pick.location} · ${pick.duration} · ${pick.budget}`, fallback }
}
