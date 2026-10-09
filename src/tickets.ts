import { allThemeActivities } from './data/theme'

// 票据记录：只在本地保存「票号 / 对应活动」，不包含昵称、手机号或任何支付信息。
// 付款那一刻就写库，因此没有额外的「确认保存」状态。
export type TicketRecord = {
  id: string
  index: number
  activityId: string
}

const storageKey = 'unseen:tickets:v1'

export function ticketNumber(index: number) {
  return String(index).padStart(3, '0')
}

export function ticketActivity(ticket: TicketRecord) {
  return allThemeActivities.find((activity) => activity.id === ticket.activityId)
}

// 活动编号（01 / 02 / …）按当天活动表里的顺序确定。
export function activityOrder(activityId: string) {
  const position = allThemeActivities.findIndex((activity) => activity.id === activityId)
  return String(position + 1).padStart(2, '0')
}

export function loadTickets(): TicketRecord[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
    if (!Array.isArray(saved)) return []
    return saved
      .flatMap((item): TicketRecord[] => {
        if (typeof item !== 'object' || item === null) return []
        const record = item as Record<string, unknown>
        const activityId = typeof record.activityId === 'string' ? record.activityId : ''
        const index = typeof record.index === 'number' && Number.isInteger(record.index) && record.index > 0 ? record.index : 0
        if (index === 0 || !allThemeActivities.some((activity) => activity.id === activityId)) return []
        return [{ id: `RV-002-${ticketNumber(index)}`, index, activityId }]
      })
      .sort((a, b) => a.index - b.index)
  } catch {
    return []
  }
}

export function persistTickets(tickets: TicketRecord[]) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(tickets))
  } catch {
    // 本地存储不可用时静默跳过：票据只在本次会话内可见。
  }
}

// 每张票对应一场活动：按活动表顺序依次分配，超过全部场次时回到第一场，不随机。
export function buildTickets(count: number, existing: TicketRecord[]): TicketRecord[] {
  const start = existing.reduce((max, ticket) => Math.max(max, ticket.index), 0) + 1
  return Array.from({ length: count }, (_, offset) => {
    const index = start + offset
    const activity = allThemeActivities[(index - 1) % allThemeActivities.length]
    return { id: `RV-002-${ticketNumber(index)}`, index, activityId: activity.id }
  })
}
