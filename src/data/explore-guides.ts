// EXPLORE 的四处栏目引导与计划卡片的轻度映射。
// 规则只用现有演示数据做挑选与排序：不新增任何文案，也不调用网络或 AI。
import { exploreCopy, preferenceOptionLabels } from '../i18n/explore'
import { pick } from '../i18n/localize'
import type { Locale, Localized } from '../i18n/messages'
import { contentTopics } from './content'
import {
  experiences,
  type DiscoverPreferences,
  type EditorPromptId,
  type Experience,
} from './discover'
import { creatorProducts, type CreatorProduct } from './market'
import { youthSpaces, type YouthSpace } from './spaces'

type Option<Value extends string> = { value: Value; label: Localized }

// 偏好的选项文案：筛选控件与「已按你的选择调整」提示共用同一份，避免两处不一致。
export const preferenceOptions: {
  interest: Option<DiscoverPreferences['interest']>[]
  timeLimit: Option<DiscoverPreferences['timeLimit']>[]
  company: Option<DiscoverPreferences['company']>[]
} = {
  interest: [
    { value: 'all', label: preferenceOptionLabels.interest.all },
    { value: 'city', label: preferenceOptionLabels.interest.city },
    { value: 'make', label: preferenceOptionLabels.interest.make },
    { value: 'listen', label: preferenceOptionLabels.interest.listen },
  ],
  timeLimit: [
    { value: 'any', label: preferenceOptionLabels.timeLimit.any },
    { value: '60', label: preferenceOptionLabels.timeLimit['60'] },
    { value: '90', label: preferenceOptionLabels.timeLimit['90'] },
    { value: '120', label: preferenceOptionLabels.timeLimit['120'] },
  ],
  company: [
    { value: 'any', label: preferenceOptionLabels.company.any },
    { value: 'solo', label: preferenceOptionLabels.company.solo },
    { value: 'group', label: preferenceOptionLabels.company.group },
  ],
}

const lookUp = <Value extends string>(list: Option<Value>[], value: Value) => list.find((option) => option.value === value)?.label

// 只列出「已经选过」的条件，用于提示下面的内容为什么是这样。
export function activePreferenceLabels(preferences: DiscoverPreferences, locale: Locale): string[] {
  const labels: string[] = []
  const interest = lookUp(preferenceOptions.interest, preferences.interest)
  const time = lookUp(preferenceOptions.timeLimit, preferences.timeLimit)
  const company = lookUp(preferenceOptions.company, preferences.company)
  if (preferences.interest !== 'all' && interest) labels.push(pick(locale, interest))
  if (preferences.timeLimit !== 'any' && time) labels.push(pick(locale, time))
  if (preferences.company !== 'any' && company) labels.push(pick(locale, company))
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
// 用专题 id 匹配，不用标题文字：翻译后排序不会失效。
const topicAffinity: Record<DiscoverPreferences['interest'], string[]> = {
  all: [],
  city: ['strange-spaces'],
  make: ['doll-culture'],
  listen: ['dream-makers'],
}

export function guideTopics(preferences: DiscoverPreferences, locale: Locale): { id: string; label: string }[] {
  const items = contentTopics.items.slice(0, 8)
  const affinity = topicAffinity[preferences.interest]
  const ordered = affinity.length === 0
    ? items
    : [...items.filter((topic) => affinity.includes(topic.id)), ...items.filter((topic) => !affinity.includes(topic.id))]
  return ordered.map((topic) => ({ id: topic.id, label: pick(locale, topic.label) }))
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
// 标题 / 说明 / 一行信息都取自该条目本身的字段，并按当前语言解析成单语文案。
// `usedIds` 用于让同一组里的多条计划尽量指向不同条目（拿不到新条目时才会重复）。
export function planFor(preferences: DiscoverPreferences, promptId: EditorPromptId, locale: Locale, usedIds: string[] = []): PlanCard {
  const matches = matchingExperiences(preferences)
  const freshMatches = matches.filter((experience) => !usedIds.includes(experience.id))
  const freshAny = experiences.filter((experience) => !usedIds.includes(experience.id))

  if (promptId === 'go-solo') {
    const spaces = guideSpaces({ ...preferences, company: 'solo' })
    const space = spaces.find((item) => !usedIds.includes(item.id)) ?? spaces[0]
    return {
      id: space.id,
      source: pick(locale, exploreCopy.planSourceSpace),
      title: pick(locale, space.name),
      text: pick(locale, space.description),
      next: `${pick(locale, space.district)} · ${pick(locale, space.category)} · ${pick(locale, space.price)}`,
      fallback: false,
    }
  }

  // 精选体验没有完全匹配时退回其它精选，并在界面上说明原因。
  const fallback = freshMatches.length === 0
  const pool = fallback && promptId !== 'meet-people' ? [experiences[0]] : freshMatches
  const source = pick(locale, exploreCopy.planSourceExperience)
  const line = (experience: Experience) => `${pick(locale, experience.location)} · ${pick(locale, experience.duration)} · ${pick(locale, experience.budget)}`

  if (promptId === 'meet-people') {
    const pickOne = freshMatches.find((experience) => experience.socialFit === 'group')
      ?? freshMatches[0]
      ?? freshAny[0]
      ?? experiences[0]
    return {
      id: pickOne.id,
      source,
      title: pick(locale, pickOne.title),
      text: pick(locale, pickOne.reason),
      next: line(pickOne),
      fallback: freshMatches.length === 0,
    }
  }

  const chosen = [...pool].sort((a, b) => a.durationMinutes - b.durationMinutes)[0] ?? experiences[0]
  return { id: chosen.id, source, title: pick(locale, chosen.title), text: pick(locale, chosen.reason), next: line(chosen), fallback }
}
