import type { Localized } from './messages'

// 票据图片（canvas 绘制）上的文字。中文版用中文，英文版用英文；票号、序列、场次数字两版一致。
export const ticketImageCopy = {
  // 票面印章：中文版用「夢」，英文版用 R 字标。
  seal: { zh: '夢', en: 'R' } as Localized,
  qrPlaceholder: { zh: '二维码', en: 'QR' } as Localized,
  labelNo: { zh: '票号', en: 'TICKET NO.' } as Localized,
  labelEvent: { zh: '活动', en: 'EVENT' } as Localized,
  labelTime: { zh: '活动时间', en: 'TIME' } as Localized,
  labelVenue: { zh: '活动地点', en: 'VENUE' } as Localized,
  labelDate: { zh: '票期', en: 'ENTRY DATE' } as Localized,
  ticketNo: {
    zh: (number: string, id: string) => `第 ${number} 张票 · ${id}`,
    en: (number: string, id: string) => `TICKET ${number} · ${id}`,
  } as Localized<(number: string, id: string) => string>,
  event: {
    zh: (order: string, name: string) => `活动 ${order} · ${name}`,
    en: (order: string, name: string) => `SESSION ${order} · ${name}`,
  } as Localized<(order: string, name: string) => string>,
  time: {
    zh: (day: string, time: string, kind: string) => `${day} ${time} · ${kind}`,
    en: (day: string, time: string, kind: string) => `${day} ${time} · ${kind}`,
  } as Localized<(day: string, time: string, kind: string) => string>,
  venue: {
    zh: (venue: string) => `上海 · ${venue}`,
    en: (venue: string) => `SHANGHAI · ${venue}`,
  } as Localized<(venue: string) => string>,
  pending: { zh: '待项目方补充', en: 'To be provided' } as Localized,
  demoNotValid: { zh: '演示票 · 不可入场', en: 'DEMO TICKET · NOT VALID FOR ENTRY' } as Localized,
  demoNote: {
    zh: '演示票：不产生订单或扣款，二维码为占位，不能用于入场。',
    en: 'Demo ticket: no order, no charge; the QR code is a placeholder and cannot be used for entry.',
  } as Localized,
}
