import { themePackOfActivity, themePacks } from './data/theme'
import { activityOrder, ticketActivity, ticketNumber, type TicketRecord } from './tickets'
import { pick } from './i18n/localize'
import { ticketImageCopy as copy } from './i18n/tickets'
import type { Locale } from './i18n/messages'

// 把票面画成一张 PNG：纯本地 canvas 绘制，不请求任何服务，也不生成真实可用凭证。
const width = 900
const height = 620
const mono = '"SFMono-Regular", ui-monospace, Menlo, monospace'
const sans = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'

// 英文名称比中文更长，逐级缩小直到放进列宽（英文场地名与活动名最长）。
function fitText(ctx: CanvasRenderingContext2D, value: string, maxWidth: number, size: number) {
  let current = size
  ctx.font = `500 ${current}px ${sans}`
  while (ctx.measureText(value).width > maxWidth && current > 15) {
    current -= 3
    ctx.font = `500 ${current}px ${sans}`
  }
}

function drawQrPlaceholder(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, label: string) {
  const cell = size / 9
  ctx.fillStyle = '#081627'
  ctx.fillRect(x, y, size, size)
  for (let row = 0; row < 9; row += 1) {
    for (let column = 0; column < 9; column += 1) {
      if ((row + column) % 2 !== 0) continue
      ctx.fillStyle = 'rgba(243, 235, 221, .12)'
      ctx.fillRect(x + column * cell, y + row * cell, cell, cell)
    }
  }
  ctx.save()
  ctx.strokeStyle = 'rgba(243, 235, 221, .45)'
  ctx.lineWidth = 2
  ctx.setLineDash([8, 6])
  ctx.strokeRect(x + 1, y + 1, size - 2, size - 2)
  ctx.restore()
  ctx.fillStyle = '#a89bff'
  ctx.font = `16px ${mono}`
  ctx.textAlign = 'center'
  ctx.fillText(label, x + size / 2, y + size / 2 + 6)
  ctx.textAlign = 'left'
}

// 返回是否真的生成了图片；调用方根据结果给出演示提示。
export function downloadTicketImage(ticket: TicketRecord, locale: Locale): Promise<boolean> {
  const activity = ticketActivity(ticket)
  // 票面身份跟随票据所属的活动，不写死第一个活动。
  const pack = themePackOfActivity(ticket.activityId) ?? themePacks[0]
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return Promise.resolve(false)

  ctx.fillStyle = '#081627'
  ctx.fillRect(0, 0, width, height)
  ctx.strokeStyle = 'rgba(243, 235, 221, .5)'
  ctx.lineWidth = 3
  ctx.strokeRect(1.5, 1.5, width - 3, height - 3)

  // 顶部信息行与「夢」印章
  ctx.fillStyle = '#b9c6ce'
  ctx.font = `20px ${mono}`
  ctx.fillText(pick(locale, pack.meta.title), 40, 62)
  const issue = pack.meta.issue
  ctx.fillText(issue, width - 40 - ctx.measureText(issue).width, 62)
  ctx.save()
  ctx.fillStyle = 'rgba(255, 47, 164, .45)'
  ctx.font = `90px ${sans}`
  ctx.textAlign = 'right'
  ctx.fillText(pick(locale, copy.seal), width - 40, 178)
  ctx.textAlign = 'left'
  ctx.restore()

  ctx.save()
  ctx.strokeStyle = 'rgba(243, 235, 221, .28)'
  ctx.lineWidth = 2
  ctx.setLineDash([10, 8])
  ctx.beginPath()
  ctx.moveTo(40, 96)
  ctx.lineTo(width - 40, 96)
  ctx.stroke()
  ctx.restore()

  const rows: [string, string][] = [
    [pick(locale, copy.labelNo), pick(locale, copy.ticketNo)(ticketNumber(ticket.index), ticket.id)],
    [pick(locale, copy.labelEvent), activity ? pick(locale, copy.event)(activityOrder(ticket.activityId), pick(locale, activity.name)) : pick(locale, copy.pending)],
    [pick(locale, copy.labelTime), activity ? pick(locale, copy.time)(activity.day, activity.time, pick(locale, activity.kind)) : pick(locale, copy.pending)],
    [pick(locale, copy.labelVenue), pick(locale, copy.venue)(pick(locale, pack.venue))],
    [pick(locale, copy.labelDate), pack.entryDate],
  ]
  let y = 150
  rows.forEach(([label, value]) => {
    ctx.fillStyle = '#7c8b93'
    ctx.font = `17px ${mono}`
    ctx.fillText(label, 40, y)
    ctx.fillStyle = '#f7f864'
    fitText(ctx, value, 560, 27)
    ctx.fillText(value, 40, y + 36)
    y += 78
  })

  drawQrPlaceholder(ctx, 662, 190, 180, pick(locale, copy.qrPlaceholder))

  ctx.save()
  ctx.strokeStyle = 'rgba(243, 235, 221, .28)'
  ctx.setLineDash([10, 8])
  ctx.beginPath()
  ctx.moveTo(40, 528)
  ctx.lineTo(width - 40, 528)
  ctx.stroke()
  ctx.restore()

  ctx.fillStyle = '#7c8b93'
  ctx.font = `18px ${mono}`
  ctx.fillText('UNSEEN® / CITY PASSPORT', 40, 566)
  const demoNotValid = pick(locale, copy.demoNotValid)
  ctx.fillText(demoNotValid, width - 40 - ctx.measureText(demoNotValid).width, 566)
  ctx.fillText(pick(locale, copy.demoNote), 40, 596)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(false)
        return
      }
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `REVERIE-CITY-PASSPORT-${ticket.id}.png`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      resolve(true)
    }, 'image/png')
  })
}
