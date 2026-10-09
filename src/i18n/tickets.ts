import type { Localized } from './messages'
import { plural } from './format'

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

// 票夹（IDENTITY 的「我的票据」弹层）文案。
export const ticketVaultCopy = {
  title: { zh: '我的票据', en: 'My tickets' } as Localized,
  count: {
    zh: (count: number) => `${count} 张`,
    en: (count: number) => `${count} ${plural(count, 'ticket', 'tickets')}`,
  } as Localized<(count: number) => string>,
  closeAria: { zh: '关闭我的票据', en: 'Close my tickets' } as Localized,
  back: { zh: '返回票据列表', en: 'Back to the ticket list' } as Localized,
  moreAria: { zh: '更多票据操作', en: 'More ticket actions' } as Localized,
  cancelTicket: { zh: '取消票据', en: 'Cancel ticket' } as Localized,
  contactSupport: { zh: '联系客服', en: 'Contact support' } as Localized,
  supportNotice: {
    zh: '演示：正式版会打开客服入口（客服邮箱或站内消息），现在还没有接入。',
    en: 'Demo: the live version would open a support channel (email or in-app message); it is not built yet.',
  } as Localized,
  ticketNo: {
    zh: (number: string) => `第 ${number} 张票`,
    en: (number: string) => `TICKET ${number}`,
  } as Localized<(number: string) => string>,
  sessionNo: {
    zh: (order: string, name: string) => `活动 ${order} · ${name}`,
    en: (order: string, name: string) => `SESSION ${order} · ${name}`,
  } as Localized<(order: string, name: string) => string>,
  venueLine: {
    zh: (venue: string) => `上海 · ${venue}`,
    en: (venue: string) => `SHANGHAI · ${venue}`,
  } as Localized<(venue: string) => string>,
  qrAria: { zh: '临时二维码占位', en: 'Placeholder QR code' } as Localized,
  qrNote: {
    zh: '临时二维码占位：正式版会在这里显示可用于入场的动态码；演示阶段无法扫描。',
    en: 'Placeholder QR: the live version shows a dynamic code for entry. It cannot be scanned at the demo stage.',
  } as Localized,
  ticketDemoNote: {
    zh: '演示票：不产生任何订单或扣款，也不能用于入场；票面信息与二维码均为占位。',
    en: 'Demo ticket: no order, no charge, no entry. Ticket details and QR are placeholders.',
  } as Localized,
  savedStatus: {
    zh: '票据付款后已自动保存入库（演示：正式版登录同一账号后可在其他设备同步）。',
    en: 'The ticket is saved automatically after payment (demo: the live version would sync across devices on the same account).',
  } as Localized,
  download: { zh: '下载票据图片', en: 'Download ticket image' } as Localized,
  cancelNote: {
    zh: '取消后这张票会从票夹里移除，且无法恢复（演示，不涉及任何退款）。',
    en: 'Cancelling removes this ticket from your wallet and cannot be undone (demo; no refund involved).',
  } as Localized,
  confirmCancel: { zh: '确认取消', en: 'Confirm' } as Localized,
  keepTicket: { zh: '先不取消', en: 'Keep it' } as Localized,
  cancelledNotice: {
    zh: (number: string) => `已取消第 ${number} 张票`,
    en: (number: string) => `Ticket ${number} cancelled`,
  } as Localized<(number: string) => string>,
  listNote1: {
    zh: '每张票对应一场活动，按当天活动表顺序发放；票据付款后即保存在本机，点开某一张可以看票号、活动、时间、地点与二维码占位。',
    en: 'Each ticket matches one session, issued in schedule order. Tickets are saved in this browser after payment; open one to see its number, session, time, place and placeholder QR.',
  } as Localized,
  listNote2: {
    zh: '票据只保存在本机浏览器，不包含手机号等个人信息；二维码为占位，票不可入场。',
    en: 'Tickets are stored in this browser only, with no phone number or other personal details; the QR code is a placeholder and the ticket cannot be used for entry.',
  } as Localized,
  emptyTitle: { zh: '还没有票据。', en: 'No tickets yet.' } as Localized,
  emptyBodyPrefix: { zh: '在 DISCOVER 的开屏点 ', en: 'Tap ' } as Localized,
  emptyBodySuffix: {
    zh: '，走完三步（登录 → 付款 → 得到票）后，票据会出现在这里。',
    en: ' on the DISCOVER screen, finish the three steps (sign in → pay → get your ticket) and your tickets appear here.',
  } as Localized,
  bookButton: { zh: '订票', en: 'BOOK TICKETS' } as Localized,
  imageCreated: {
    zh: '已生成票据图片（演示票，不可入场）；若浏览器没有自动下载，请检查下载设置。',
    en: 'Ticket image created (demo ticket, not valid for entry). If your browser did not download it, check your download settings.',
  } as Localized,
  imageFailed: {
    zh: '演示：当前环境无法生成票据图片。',
    en: 'Demo: this environment cannot generate the ticket image.',
  } as Localized,
}
