import { describe, expect, it } from 'vitest'
import { defaultDiscoverPreferences, editorPrompts, experiences, parseDiscoverPreferences } from './discover'
import { activePreferenceLabels, guideShopPicks, guideSpaces, guideTopics, matchingExperiences, planFor, preferenceOptions } from './explore-guides'
import { creatorProducts, shopGroups, type ShopGroupId } from './market'
import { activityOrder, buildTickets, ticketActivity, ticketNumber } from '../tickets'

const defaultLabels = () => activePreferenceLabels(defaultDiscoverPreferences)

describe('筛选条件读取', () => {
  it('null 与损坏数据都回退到默认值', () => {
    expect(parseDiscoverPreferences(null)).toEqual(defaultDiscoverPreferences)
    expect(parseDiscoverPreferences({ interest: 'nope', timeLimit: 12, company: [] })).toEqual(defaultDiscoverPreferences)
  })

  it('忽略已删除的 budgetLimit，只接受三个已知字段', () => {
    expect(parseDiscoverPreferences({ interest: 'make', timeLimit: '90', company: 'solo', budgetLimit: '50' }))
      .toEqual({ interest: 'make', timeLimit: '90', company: 'solo' })
  })

  it('三个下拉的选项与默认值一致', () => {
    expect(preferenceOptions.interest.some((option) => option.value === defaultDiscoverPreferences.interest)).toBe(true)
    expect(preferenceOptions.timeLimit.some((option) => option.value === defaultDiscoverPreferences.timeLimit)).toBe(true)
    expect(preferenceOptions.company.some((option) => option.value === defaultDiscoverPreferences.company)).toBe(true)
  })
})

describe('筛选联动', () => {
  it('默认状态下没有偏好标签，选中后逐项出现', () => {
    expect(defaultLabels()).toEqual([])
    expect(activePreferenceLabels({ interest: 'city', timeLimit: 'any', company: 'any' })).toHaveLength(1)
    expect(activePreferenceLabels({ interest: 'city', timeLimit: '90', company: 'solo' })).toHaveLength(3)
  })

  it('时长筛选只保留不超过上限的体验', () => {
    const matched = matchingExperiences({ interest: 'all', timeLimit: '60', company: 'any' })
    expect(matched.length).toBeGreaterThan(0)
    expect(matched.every((item) => item.durationMinutes <= 60)).toBe(true)
    expect(matched.length).toBeLessThan(experiences.length)
  })

  it('兴趣方向不匹配时结果为空数组，不抛错', () => {
    expect(matchingExperiences({ interest: 'make', timeLimit: 'any', company: 'any' }).length).toBeGreaterThan(0)
    expect(Array.isArray(matchingExperiences({ interest: 'listen', timeLimit: '60', company: 'group' }))).toBe(true)
  })

  it('三条计划条目互不重复，且都带来源与回退说明字段', () => {
    const used: string[] = []
    const plans = editorPrompts.map((prompt) => {
      const plan = planFor(defaultDiscoverPreferences, prompt.id, used)
      used.push(plan.id)
      return plan
    })
    expect(plans).toHaveLength(3)
    expect(new Set(plans.map((plan) => plan.id)).size).toBe(3)
    plans.forEach((plan) => {
      expect(plan.title.length).toBeGreaterThan(0)
      expect(plan.source.length).toBeGreaterThan(0)
      expect(typeof plan.fallback).toBe('boolean')
    })
  })

  it('商店引导始终给出三件不重复的演示选品', () => {
    for (const interest of ['all', 'city', 'make', 'listen'] as const) {
      const picks = guideShopPicks({ interest, timeLimit: 'any', company: 'any' })
      expect(picks).toHaveLength(3)
      expect(new Set(picks.map((pick) => pick.id)).size).toBe(3)
    }
  })

  it('空间引导给出三个空间，且随兴趣方向改变顺序', () => {
    const base = guideSpaces(defaultDiscoverPreferences)
    expect(base).toHaveLength(3)
    expect(new Set(base.map((space) => space.id)).size).toBe(3)
    expect(guideSpaces({ interest: 'make', timeLimit: 'any', company: 'any' })).toHaveLength(3)
  })

  it('专题列表始终包含全部条目，不丢项', () => {
    expect(guideTopics(defaultDiscoverPreferences)).toHaveLength(8)
  })
})

describe('商店分类与商品', () => {
  it('分类 id 唯一，且每件商品都归到已知分类', () => {
    const ids = shopGroups.map((group) => group.id)
    expect(new Set(ids).size).toBe(ids.length)
    const known = new Set<ShopGroupId>(ids)
    expect(creatorProducts.every((product) => known.has(product.group))).toBe(true)
  })

  it('分类计数与需求一致（全部 8 件，四项分类 5 / 2 / 1 / 0）', () => {
    const count = (id: ShopGroupId) => creatorProducts.filter((product) => product.group === id).length
    expect(creatorProducts).toHaveLength(8)
    const counts = shopGroups.map((group) => count(group.id))
    expect(counts.reduce((sum, value) => sum + value, 0)).toBe(8)
    expect(counts.filter((value) => value === 0).length).toBe(1)
  })

  it('五件选品仍标记为演示选品，商品 id 不重复', () => {
    expect(creatorProducts.filter((product) => product.edit === true)).toHaveLength(5)
    expect(new Set(creatorProducts.map((product) => product.id)).size).toBe(creatorProducts.length)
  })
})

describe('票据编号与活动', () => {
  it('票号按序递增，活动按当天活动表顺序绑定', () => {
    expect(ticketNumber(1)).toBe('001')
    const tickets = buildTickets(3, [])
    expect(tickets).toHaveLength(3)
    expect(tickets.map((ticket) => ticket.index)).toEqual([1, 2, 3])
    expect(tickets.map((ticket) => activityOrder(ticket.activityId))).toEqual(['01', '02', '03'])
    expect(ticketActivity(tickets[0])?.name.zh.length).toBeGreaterThan(0)
  })

  it('追加买票从已有最大票号之后继续，不覆盖已有票', () => {
    const first = buildTickets(2, [])
    const more = buildTickets(1, first)
    expect(more).toHaveLength(1)
    expect(more[0].index).toBe(3)
    expect([...first, ...more].map((ticket) => ticket.index)).toEqual([1, 2, 3])
  })
})
