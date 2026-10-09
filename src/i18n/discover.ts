import type { Localized } from './messages'
import { plural } from './format'

// DISCOVER（月度主题页）与购票弹层的双语文案。
// 规则：中文版页面内的眉题与子标签一律中文（纯英文眉题写成 `zh: null`，渲染时跳过）；
// 英文版不出现任何中文；品牌标识（REVERIE / UNSEEN 等）与品类专名（Cos / Lolita / BJD）两版一致。

/** 只在英文版出现的眉题：中文版不渲染。 */
const englishOnly = (en: string) => ({ zh: null, en }) as Localized<string | null>

export const themeCopy = {
  tabsNav: { zh: 'DISCOVER 板块导航', en: 'DISCOVER sections' } as Localized,
  tabs: {
    events: { zh: '活动详情', en: 'EVENTS' } as Localized,
    map: { zh: '梦境目录', en: 'DIRECTORY' } as Localized,
    quiz: { zh: '梦境互动', en: 'INTERACT' } as Localized,
  },
  book: { zh: '订票', en: 'BOOK TICKETS' } as Localized,
  entryDate: { zh: '入梦日期', en: 'ENTRY DATE' } as Localized,
  location: { zh: '入梦坐标', en: 'LOCATION' } as Localized,
  dualityLabel: { zh: '甜梦与暗黑梦境', en: 'Sweet dream and dark fairy tale' } as Localized,
  dressCode: { zh: '着装建议', en: 'DRESS CODE' } as Localized,
  scene: { zh: '现场布景风格', en: 'SET DESIGN' } as Localized,

  rituals: {
    eyebrow: englishOnly("WHAT'S INSIDE"),
    heading: { zh: '梦游地图。', en: 'The dream map.' } as Localized,
    count: {
      zh: (count: number) => `${count} 项体验`,
      en: (count: number) => `${count} ${plural(count, 'experience', 'experiences')}`,
    } as Localized<(count: number) => string>,
    disclosure: {
      zh: '玩法内容为项目方提供的演示文案，现场安排以最终官宣为准。',
      en: 'Demo copy provided by the brand; final on-site arrangements follow the official announcement.',
    } as Localized,
  },

  schedule: {
    eyebrow: englishOnly('EVENT SCHEDULE'),
    heading: { zh: '当天活动表。', en: "Today's schedule." } as Localized,
    count: {
      zh: (count: number) => `${count} 场活动`,
      en: (count: number) => `${count} ${plural(count, 'session', 'sessions')}`,
    } as Localized<(count: number) => string>,
    dayGroupLabel: { zh: '选择日期', en: 'Choose a date' } as Localized,
    dayCount: {
      zh: (count: number) => `${count} 场`,
      en: (count: number) => `${count} ${plural(count, 'session', 'sessions')}`,
    } as Localized<(count: number) => string>,
    reserve: { zh: '预约', en: 'Reserve' } as Localized,
    reserved: { zh: '已预约，取消', en: 'Reserved · cancel' } as Localized,
  },

  dreamMap: {
    eyebrow: englishOnly('DIRECTORY'),
    heading: { zh: '梦境目录。', en: 'The directory.' } as Localized,
    count: {
      zh: (count: number) => `${count} 组`,
      en: (count: number) => `${count} ${plural(count, 'group', 'groups')}`,
    } as Localized<(count: number) => string>,
    disclosure: {
      zh: '本板块的创作者与展商资料来自项目方提供的内容，展位与排期信息为演示占位；不代表 UNSEEN 提供售卖、购票、预约或报名服务，价格与展位请以官方渠道为准。',
      en: 'Creator and exhibitor details come from the brand; booth and schedule information is placeholder demo data. This does not mean UNSEEN sells, tickets, books or registers anything — check official channels for prices and booths.',
    } as Localized,
    socialPending: { zh: '社交媒体链接待项目方提供', en: 'Social link to be provided' } as Localized,
    brandPending: { zh: '待项目方补充品牌信息', en: 'Brand details to be provided' } as Localized,
  },

  quiz: {
    eyebrow: englishOnly('WHICH DREAMER ARE YOU'),
    heading: { zh: '你是哪一种梦游者？', en: 'Which dreamer are you?' } as Localized,
    answered: {
      zh: (answered: number, total: number) => `${answered} / ${total} 已作答`,
      en: (answered: number, total: number) => `${answered} / ${total} answered`,
    } as Localized<(answered: number, total: number) => string>,
    seeResult: { zh: '看我的梦境结果', en: 'See my dream result' } as Localized,
    again: { zh: '重新作答', en: 'Start again' } as Localized,
  },

  challenge: {
    eyebrow: englishOnly("THIS MONTH'S MISSION"),
    resultLabel: { zh: '梦境原型', en: 'DREAM ARCHETYPE' } as Localized,
    score: {
      zh: (index: string, fantasy: number, flip: number) => `结果 ${index} · ${fantasy} : ${flip}`,
      en: (index: string, fantasy: number, flip: number) => `RESULT ${index} · ${fantasy} : ${flip}`,
    } as Localized<(index: string, fantasy: number, flip: number) => string>,
    placeholder: {
      zh: '完成「你是哪一种梦游者？」测试后，你的身份会出现在这里。',
      en: 'Finish “Which dreamer are you?” and your archetype appears here.',
    } as Localized,
    howToLabel: { zh: '完成方式', en: 'How to finish' } as Localized,
    shuffle: { zh: '更新', en: 'Shuffle' } as Localized,
    accept: { zh: '接下这个任务', en: 'Accept this task' } as Localized,
    publishTo: { zh: '选择发布渠道', en: 'PUBLISH TO' } as Localized,
    linkPending: { zh: '链接待提供', en: 'Link to be provided' } as Localized,
    notNow: { zh: '先不发布', en: 'Not now' } as Localized,
    rewardLabel: { zh: '完成即可获得', en: 'Finish it to earn' } as Localized,
    statusNew: { zh: '未开始', en: 'Not started' } as Localized,
    statusInProgress: { zh: '进行中', en: 'In progress' } as Localized,
    statusDone: { zh: 'RABBIT HOLE STAMP 已获取', en: 'RABBIT HOLE STAMP earned' } as Localized,
  },

  // 页面顶部的活动切换：左右两个按钮在各场活动之间切换。
  issueSwitch: {
    groupLabel: { zh: '切换活动', en: 'Switch activity' } as Localized,
    prev: { zh: '上一个活动', en: 'Previous activity' } as Localized,
    next: { zh: '下一个活动', en: 'Next activity' } as Localized,
    position: {
      zh: (index: number, total: number) => `第 ${index} / ${total} 个活动`,
      en: (index: number, total: number) => `Activity ${index} of ${total}`,
    } as Localized<(index: number, total: number) => string>,
    switched: {
      zh: (title: string) => `已切换到「${title}」`,
      en: (title: string) => `Switched to “${title}”`,
    } as Localized<(title: string) => string>,
    placeholder: {
      zh: '演示：「游园惊梦」的活动资料尚未提供，本页内容暂为「梦游仙境」的复制占位，等主题资料确认后替换。',
      en: 'Demo: the material for A DREAM IN THE GARDEN has not been provided yet, so this page currently shows a copy of IN THE WONDERLAND, to be replaced once the theme material is confirmed.',
    } as Localized,
  },

  footerLine: {
    zh: '发现主题 → 测试我是谁 → 接受一个小任务 → 发现上海的梦境 → 认识创作者和物件 → 10.31 真正进入 REVERIE 梦境。',
    en: "Find the theme → take the quiz → accept a small task → find Shanghai's dream → meet the creators and objects → step into REVERIE on 10.31.",
  } as Localized,
}

// 屏幕阅读器公告：模板化，专名（REVERIE）不译。
export const themeAnnouncements = {
  resultReady: {
    zh: '结果已生成，已写入下面的 24 小时兔子洞任务',
    en: 'Result ready — added to the 24-hour challenge below',
  } as Localized,
  chooseAgain: { zh: '可以重新选择答案', en: 'Choose again' } as Localized,
  newExample: { zh: '已换一条任务示例', en: 'New task example' } as Localized,
  accepted: {
    zh: '任务已接下，24 小时内随时回来打卡',
    en: 'Task accepted — come back within 24 hours',
  } as Localized,
  chooseChannel: { zh: '选择要发布的渠道', en: 'Choose a channel to publish to' } as Localized,
  cancelled: {
    zh: (name: string) => `已取消预约：${name}`,
    en: (name: string) => `Reservation cancelled: ${name}`,
  } as Localized<(name: string) => string>,
  reserved: {
    zh: (name: string) => `已预约（演示）：${name}`,
    en: (name: string) => `Reserved (demo): ${name}`,
  } as Localized<(name: string) => string>,
  opened: {
    zh: (channel: string) => `已打开 REVERIE 的《${channel}》账号（新窗口）；发布后即完成本次任务（演示）`,
    en: (channel: string) => `Opened REVERIE’s ${channel} account in a new tab; publishing completes this task (demo)`,
  } as Localized<(channel: string) => string>,
  unsupported: {
    zh: (channel: string) => `演示：正式版会打开 REVERIE 的《${channel}》账号；该渠道链接待项目方提供，本次未发生跳转，已记为完成（演示）`,
    en: (channel: string) =>
      `Demo: the live version would open REVERIE’s ${channel} account. That channel’s link is to be provided; nothing opened, and it is marked complete (demo).`,
  } as Localized<(channel: string) => string>,
}

export const bookingCopy = {
  flowLabel: { zh: '购票流程', en: 'Ticket purchase flow' } as Localized,
  close: { zh: '关闭购票流程', en: 'Close ticket purchase' } as Localized,
  // 票面印章：中文版用「夢」，英文版用 R 字标。
  seal: { zh: '夢', en: 'R' } as Localized,
  qrBox: { zh: '二维码', en: 'QR' } as Localized,
  venueLine: {
    zh: (venue: string) => `上海 · ${venue}`,
    en: (venue: string) => `SHANGHAI · ${venue}`,
  } as Localized<(venue: string) => string>,
  steps: {
    zh: ['登录', '付款', '得到票'],
    en: ['Sign in', 'Pay', 'Get your ticket'],
  } as Localized<string[]>,
  // 三步的说明只保留「第几步 + 具体行为」。
  stepNotes: {
    zh: ['第一步 · 填写昵称与手机号。', '第二步 · 选择支付方式并确认（演示）。', '第三步 · 查看并保存票据。'],
    en: ['Step 1 · Nickname and phone number.', 'Step 2 · Choose a payment method and confirm (demo).', 'Step 3 · Review and save your ticket.'],
  } as Localized<string[]>,
  nameLabel: { zh: '梦游者昵称', en: 'DREAMER NAME' } as Localized,
  namePlaceholder: { zh: 'E.', en: 'E.' } as Localized,
  phoneLabel: { zh: '梦游者手机号码', en: 'DREAMER PHONE' } as Localized,
  phonePlaceholder: { zh: '11 位手机号', en: '11-digit number' } as Localized,
  memoryHint: { zh: '只保存在本次操作的页面内存中', en: 'Kept in this page’s memory only' } as Localized,
  ticketsLabel: { zh: '票数', en: 'TICKETS' } as Localized,
  addOne: { zh: '增加一张', en: 'Add one ticket' } as Localized,
  removeOne: { zh: '减少一张', en: 'Remove one ticket' } as Localized,
  count: {
    zh: (count: number) => `${count} 张`,
    en: (count: number) => `${count} ${plural(count, 'ticket', 'tickets')}`,
  } as Localized<(count: number) => string>,
  priceEach: {
    zh: (price: string, total: string) => `${price} / 张 · 合计 ${total}`,
    en: (price: string, total: string) => `${price} each · ${total} total`,
  } as Localized<(price: string, total: string) => string>,
  maxHint: {
    zh: (max: number) => `演示：最多 ${max} 张，不填写任何信息也可直接去付款（默认 1 张）。`,
    en: (max: number) => `Demo: up to ${max} tickets. You can go straight to payment without filling anything in (1 by default).`,
  } as Localized<(max: number) => string>,
  toPayment: { zh: '去付款', en: 'Continue to payment' } as Localized,
  totalLabel: { zh: '应付', en: 'TOTAL' } as Localized,
  amountLabel: { zh: '合计', en: 'AMOUNT' } as Localized,
  statusLabel: { zh: '状态', en: 'STATUS' } as Localized,
  paymentLegend: { zh: '支付方式', en: 'PAYMENT' } as Localized,
  payHint: {
    zh: (price: string) => `演示：不会调用支付宝 / 微信 / 银行卡，也不会产生订单或扣款；票价 ${price} / 张为演示价，正式价格以官方渠道为准。`,
    en: (price: string) => `Demo: Alipay / WeChat Pay / card are not called, and no order or charge is created. The ${price} price is a demo price; the official price comes from official channels.`,
  } as Localized<(price: string) => string>,
  walletHint: {
    zh: '票夹在 IDENTITY › UNSEEN® / CITY PASSPORT 的「我的票据」里；在那里可以逐张查看票面并确认保存。',
    en: 'The wallet is in IDENTITY › UNSEEN® / CITY PASSPORT under My tickets; there you can review each ticket and confirm saving.',
  } as Localized,
  ticketStoredHint: {
    zh: '演示：票据已存入本机浏览器（不包含手机号），可在 CITY PASSPORT 里查看并确认保存；票面二维码为占位，不可入场。',
    en: 'Demo: the ticket is saved in this browser (without your phone number) and can be reviewed in CITY PASSPORT. The QR code is a placeholder and cannot be used for entry.',
  } as Localized,
  confirmPayment: { zh: '确认付款（演示）', en: 'Confirm payment (demo)' } as Localized,
  back: { zh: '返回上一步', en: 'Back' } as Localized,
  notProvided: { zh: '未填写', en: 'Not provided' } as Localized,
  demoNotValid: { zh: '演示票 · 不可入场', en: 'DEMO TICKET · NOT VALID FOR ENTRY' } as Localized,
  issued: {
    zh: (count: number) => `本次发放 · ${count} 张（每张对应一场活动）`,
    en: (count: number) => `ISSUED · ${count} ${plural(count, 'TICKET', 'TICKETS')} (one per session)`,
  } as Localized<(count: number) => string>,
  ticketNo: {
    zh: (number: string) => `第 ${number} 张票`,
    en: (number: string) => `TICKET ${number}`,
  } as Localized<(number: string) => string>,
  sessionNo: {
    zh: (order: string, name: string) => `活动 ${order} · ${name}`,
    en: (order: string, name: string) => `SESSION ${order} · ${name}`,
  } as Localized<(order: string, name: string) => string>,
  qrAria: { zh: '临时二维码占位', en: 'Placeholder QR code' } as Localized,
  qrNote: {
    zh: '临时二维码占位：正式版会在这里显示可用于入场的动态码；演示阶段无法扫描。',
    en: 'Placeholder QR: the live version shows a dynamic code for entry. It cannot be scanned at the demo stage.',
  } as Localized,
  demoNote: {
    zh: '演示票：不产生任何订单或扣款，也不能用于入场；票面信息与二维码均为占位。入梦日期与入梦坐标见弹层顶部。',
    en: 'Demo ticket: no order, no charge, no entry. Ticket details and QR are placeholders. Entry date and location are at the top of this panel.',
  } as Localized,
  done: { zh: '完成', en: 'Done' } as Localized,
  openWallet: { zh: '查看票夹', en: 'Open ticket wallet' } as Localized,
  restart: { zh: '重新填写', en: 'Start over' } as Localized,
}
