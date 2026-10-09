import type { Localized } from '../i18n/messages'

// 项目方已确认的 REVERIE 小红书账号（分享链接里的 xsec_token 等跟踪参数已去掉）。
export const xiaohongshuUrl = 'https://www.xiaohongshu.com/user/profile/649917aa000000002b008d69'

export type SocialMark = {
  id: string
  /** 渠道名：中文版用中文名，英文版用通行的英文写法。 */
  label: Localized
  /** 已有确认地址的渠道：新窗口打开。 */
  href?: string
  /** 还没有地址的渠道：点击只显示演示提示，不给自编地址。 */
  note?: Localized
}

// 顶部导航里的四个社交入口。只有小红书有项目方确认的地址，其余三个待提供。
export const socialMarks: SocialMark[] = [
  {
    id: 'xiaohongshu',
    label: { zh: '小红书', en: 'Xiaohongshu' },
    href: xiaohongshuUrl,
    note: {
      zh: '演示：已接入项目方确认的 REVERIE 小红书账号，会在新窗口打开。',
      en: "Demo: opens REVERIE's confirmed Xiaohongshu account in a new tab.",
    },
  },
  {
    id: 'douyin',
    label: { zh: '抖音', en: 'Douyin' },
    note: {
      zh: '待项目方提供：链接或二维码尚未给出，这里只给演示提示。',
      en: 'To be provided: no link or QR code yet, so this is a demo notice only.',
    },
  },
  {
    id: 'official-account',
    label: { zh: '公众号', en: 'WeChat Official Account' },
    note: {
      zh: '待项目方提供：公众号名片或二维码尚未给出，这里只给演示提示。',
      en: 'To be provided: no account card or QR code yet, so this is a demo notice only.',
    },
  },
  {
    id: 'wechat',
    label: { zh: '微信', en: 'WeChat' },
    note: {
      zh: '待项目方提供：微信号或二维码尚未给出，这里只给演示提示。',
      en: 'To be provided: no WeChat ID or QR code yet, so this is a demo notice only.',
    },
  },
]
