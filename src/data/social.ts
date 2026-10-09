// 项目方已确认的 REVERIE 小红书账号（分享链接里的 xsec_token 等跟踪参数已去掉）。
export const xiaohongshuUrl = 'https://www.xiaohongshu.com/user/profile/649917aa000000002b008d69'

export type SocialMark = {
  id: string
  label: string
  /** 已有确认地址的渠道：新窗口打开。 */
  href?: string
  /** 还没有地址的渠道：点击只显示演示提示，不给自编地址。 */
  note?: string
}

// 顶部导航里的四个社交入口。只有小红书有项目方确认的地址，其余三个待提供。
export const socialMarks: SocialMark[] = [
  { id: 'xiaohongshu', label: '小红书', href: xiaohongshuUrl, note: '演示：已接入项目方确认的 REVERIE 小红书账号，会在新窗口打开。' },
  { id: 'douyin', label: '抖音', note: '待项目方提供：链接或二维码尚未给出，这里只给演示提示。' },
  { id: 'official-account', label: '公众号', note: '待项目方提供：公众号名片或二维码尚未给出，这里只给演示提示。' },
  { id: 'wechat', label: '微信', note: '待项目方提供：微信号或二维码尚未给出，这里只给演示提示。' },
]
