import { themeEntryDate, themeVenue } from './data/theme'
import { activityOrder, ticketActivity, ticketNumber, type TicketRecord } from './tickets'

// 把票面画成一张 PNG：纯本地 canvas 绘制，不请求任何服务，也不生成真实可用凭证。
const width = 900
const height = 620
const mono = '"SFMono-Regular", ui-monospace, Menlo, monospace'
const sans = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'

function fitText(ctx: CanvasRenderingContext2D, value: string, maxWidth: number, size: number) {
  ctx.font = `500 ${size}px ${sans}`
  if (ctx.measureText(value).width <= maxWidth) return
  ctx.font = `500 ${size - 5}px ${sans}`
  if (ctx.measureText(value).width <= maxWidth) return
  ctx.font = `500 ${size - 10}px ${sans}`
}

function drawQrPlaceholder(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
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
  ctx.fillText('QR 占位', x + size / 2, y + size / 2 + 6)
  ctx.textAlign = 'left'
}

// 返回是否真的生成了图片；调用方根据结果给出演示提示。
export function downloadTicketImage(ticket: TicketRecord): Promise<boolean> {
  const activity = ticketActivity(ticket)
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
  ctx.fillText('REVERIE WONDERLAND', 40, 62)
  ctx.fillText('ISSUE 002', width - 40 - ctx.measureText('ISSUE 002').width, 62)
  ctx.save()
  ctx.fillStyle = 'rgba(255, 47, 164, .45)'
  ctx.font = `90px ${sans}`
  ctx.textAlign = 'right'
  ctx.fillText('夢', width - 40, 178)
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
    ['票号｜TICKET NO.', `第 ${ticketNumber(ticket.index)} 张票 · ${ticket.id}`],
    ['活动｜EVENT', activity ? `活动 ${activityOrder(ticket.activityId)} · ${activity.name} / ${activity.nameEn}` : '待项目方补充'],
    ['活动时间｜TIME', activity ? `${activity.day} ${activity.time} · ${activity.kind}` : '待项目方补充'],
    ['活动地点｜VENUE', `SHANGHAI · ${themeVenue}`],
    ['票期｜ENTRY DATE', themeEntryDate],
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

  drawQrPlaceholder(ctx, 662, 190, 180)

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
  ctx.fillText('DEMO TICKET · 不可入场', width - 40 - ctx.measureText('DEMO TICKET · 不可入场').width, 566)
  ctx.fillText('演示票：不产生订单或扣款，二维码为占位，不能用于入场。', 40, 596)

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
