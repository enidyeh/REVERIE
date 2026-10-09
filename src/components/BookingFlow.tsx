import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Check, CreditCard, Minus, Plus, Ticket, X } from 'lucide-react'
import { themeEntryDate, themeTicket, themeVenue } from '../data/theme'
import { activityOrder, buildTickets, loadTickets, persistTickets, ticketActivity, ticketNumber, type TicketRecord } from '../tickets'
import './booking-flow.css'
import './ticket-qr.css'

// 入场信息以项目方提供的原文为准，写在流程每一步里。
const entryDate = themeEntryDate
const entryLocation = `SHANGHAI · ${themeVenue}`

function formatPrice(value: number) {
  return `¥${Number(value.toFixed(2))}`
}

type BookingStep = 'login' | 'pay' | 'ticket'

const steps: { id: BookingStep; index: string; label: string }[] = [
  { id: 'login', index: '01', label: '登录' },
  { id: 'pay', index: '02', label: '付款' },
  { id: 'ticket', index: '03', label: '得到票' },
]

type BookingFlowProps = {
  onClose: () => void
  onOpenTickets: () => void
  dreamerName: string
  onDreamerNameChange: (value: string) => void
}

function maskPhone(phone: string) {
  if (phone.length === 0) return '未填写'
  return phone.length === 11 ? `${phone.slice(0, 3)}****${phone.slice(7)}` : phone
}

// 弹层在打开时才挂载，因此每次打开都是从第一步开始、手机号为空的新流程。
export function BookingFlow({ onClose, onOpenTickets, dreamerName, onDreamerNameChange }: BookingFlowProps) {
  const [step, setStep] = useState<BookingStep>('login')
  // 手机号只存在组件内存里：关闭弹层即清空，不写入 localStorage（见 docs/quality-security.md）。
  const [phone, setPhone] = useState('')
  // 票数默认一张；不填任何信息也能直接去付款。
  const [count, setCount] = useState(themeTicket.minCount)
  // 支付方式只是界面选项，默认选中第一种，不会调用任何支付渠道。
  const [payMethod, setPayMethod] = useState(themeTicket.payMethods[0].id)
  // 确认付款时生成并保存到本机的票据（每张对应一场活动），仅用于第三步展示。
  const [issued, setIssued] = useState<TicketRecord[]>([])
  const sheetRef = useRef<HTMLDivElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    sheetRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      close()
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = previousOverflow
    }
    // 只在挂载时执行一次：弹层每次打开都是新实例，避免重复执行时抢走输入焦点。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function close() {
    onClose()
    // 只把焦点还给真正可聚焦的元素：对 <body> 调 focus() 反而会把焦点从触发按钮上抢走。
    const target = returnFocusRef.current
    if (target && target !== document.body) target.focus()
  }

  const name = dreamerName.trim()
  const total = themeTicket.price * count

  function changeCount(delta: number) {
    setCount((current) => Math.min(themeTicket.maxCount, Math.max(themeTicket.minCount, current + delta)))
  }

  // 演示付款：不生订单、不扣款，只在本机生成票据并进入票面。
  function confirmPay() {
    const existing = loadTickets()
    const created = buildTickets(count, existing)
    persistTickets([...existing, ...created])
    setIssued(created)
    setStep('ticket')
  }

  return (
    <div
      className="booking-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <div
        className="booking-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="购票流程"
        ref={sheetRef}
        tabIndex={-1}
      >
        <div className="booking-head">
          <p className="booking-eyebrow"><Ticket size={13} aria-hidden="true" />WONDERLAND TICKET</p>
          <button className="booking-close" type="button" onClick={close} aria-label="关闭购票流程"><X size={18} aria-hidden="true" /></button>
        </div>

        <ol className="booking-steps">
          {steps.map((item) => (
            <li className={`booking-step ${step === item.id ? 'is-active' : ''}`} key={item.id} aria-current={step === item.id ? 'step' : undefined}>
              <b>{item.index}</b>{item.label}
            </li>
          ))}
        </ol>

        <dl className="booking-when">
          <div>
            <dt>ENTRY DATE / 入梦日期</dt>
            <dd>{entryDate}</dd>
          </div>
          <div>
            <dt>LOCATION / 入梦坐标</dt>
            <dd>{entryLocation}</dd>
          </div>
        </dl>

        {step === 'login' && (
          <div className="booking-body">
            <p className="booking-note">第一步「登录」：本站没有真实账号系统，这一步就是填写昵称与手机号。手机号只保存在当前页面的内存里，关闭或刷新即消失，不写入本机存储、不上传、不发送短信。</p>
            <div className="booking-field">
              <label htmlFor="booking-name">DREAMER NAME｜梦游者昵称</label>
              <input
                id="booking-name"
                maxLength={18}
                placeholder="E."
                value={dreamerName}
                onChange={(event) => onDreamerNameChange(event.target.value)}
              />
            </div>
            <div className="booking-field">
              <label htmlFor="booking-phone">DREAMER PHONE｜梦游者手机号码</label>
              <input
                id="booking-phone"
                autoComplete="tel"
                inputMode="tel"
                maxLength={11}
                placeholder="11 位手机号"
                value={phone}
                onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 11))}
              />
              <span className="booking-hint">演示字段：只保存在本次操作的页面内存中</span>
            </div>
            <div className="booking-field">
              <span className="booking-label">TICKETS｜票数</span>
              <div className="booking-count" role="group" aria-label="票数">
                <button
                  className="booking-count-button"
                  type="button"
                  aria-label="减少一张"
                  disabled={count <= themeTicket.minCount}
                  onClick={() => changeCount(-1)}
                >
                  <Minus size={14} aria-hidden="true" />
                </button>
                <span className="booking-count-value" aria-live="polite">{count} 张</span>
                <button
                  className="booking-count-button"
                  type="button"
                  aria-label="增加一张"
                  disabled={count >= themeTicket.maxCount}
                  onClick={() => changeCount(1)}
                >
                  <Plus size={14} aria-hidden="true" />
                </button>
                <span className="booking-count-price">{formatPrice(themeTicket.price)} / 张 · 合计 {formatPrice(total)}</span>
              </div>
              <span className="booking-hint">演示：最多 {themeTicket.maxCount} 张，不填写任何信息也可直接去付款（默认 1 张）。</span>
            </div>
            <div className="booking-actions">
              <button className="theme-primary-action" type="button" onClick={() => setStep('pay')}>
                <CreditCard size={15} aria-hidden="true" />去付款
              </button>
            </div>
          </div>
        )}

        {step === 'pay' && (
          <div className="booking-body">
            <p className="booking-note">第二步「付款」：本站不接入真实支付，这里不会产生订单、不会扣款，也不会把信息提交给任何服务。</p>
            <p className="booking-amount">
              应付｜TOTAL <b>{formatPrice(total)}</b>
              <span>{count} 张 × {formatPrice(themeTicket.price)}</span>
            </p>
            <fieldset className="booking-pay">
              <legend>支付方式｜PAYMENT</legend>
              <div className="booking-pay-list">
                {themeTicket.payMethods.map((method) => (
                  <label className={`booking-pay-option ${payMethod === method.id ? 'is-picked' : ''}`} key={method.id}>
                    <input
                      type="radio"
                      name="booking-pay"
                      value={method.id}
                      checked={payMethod === method.id}
                      onChange={() => setPayMethod(method.id)}
                    />
                    <span>{method.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <p className="booking-hint">演示：不会调用支付宝 / 微信 / 银行卡，也不会产生订单或扣款；票价 {formatPrice(themeTicket.price)} / 张为演示票价，正式价格以官方渠道为准。</p>
            <div className="booking-actions">
              <button className="theme-primary-action" type="button" onClick={confirmPay}>
                <CreditCard size={15} aria-hidden="true" />确认付款（演示）
              </button>
              <button className="theme-secondary-action" type="button" onClick={() => setStep('login')}>
                <ArrowLeft size={14} aria-hidden="true" />返回上一步
              </button>
            </div>
          </div>
        )}

        {step === 'ticket' && (
          <div className="booking-body">
            <p className="booking-note">第三步「得到票」：付款后可在 IDENTITY › UNSEEN® / CITY PASSPORT 查看票据。</p>
            <p className="booking-hint">演示：票据已存入本机浏览器（不包含手机号），可在 CITY PASSPORT 里查看并确认保存；票面二维码为占位，不可入场。</p>
            <div className="booking-ticket">
              <div className="booking-ticket-top">
                <span>REVERIE WONDERLAND</span>
                <span>ISSUE 002</span>
              </div>
              <p className="booking-ticket-mark" aria-hidden="true">夢</p>
              <dl className="booking-ticket-body">
                <div><dt>DREAMER NAME｜梦游者昵称</dt><dd>{name || '未填写'}</dd></div>
                <div><dt>DREAMER PHONE｜梦游者手机号码</dt><dd>{maskPhone(phone)}</dd></div>
                <div><dt>TICKETS｜票数</dt><dd>{count} 张</dd></div>
                <div><dt>AMOUNT｜合计</dt><dd>{formatPrice(total)}</dd></div>
                <div><dt>STATUS｜状态</dt><dd>DEMO TICKET · 不可入场</dd></div>
              </dl>
              <div className="booking-issue">
                {issued.length > 0 && (
                  <div className="booking-issue-text">
                    <p className="booking-issued-label">本次发放｜{issued.length} 张（每张对应一场活动）</p>
                    <ul className="booking-issued-list">
                      {issued.map((ticket) => {
                        const activity = ticketActivity(ticket)
                        return (
                          <li key={ticket.id}>
                            <span className="booking-issued-no">第 {ticketNumber(ticket.index)} 张票</span>
                            <span className="booking-issued-name">活动 {activityOrder(ticket.activityId)} · {activity?.name}</span>
                            <span className="booking-issued-meta">{activity?.day} {activity?.time} · SHANGHAI</span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
                <div className="booking-issue-qr">
                  <div className="ticket-qr-box" role="img" aria-label="临时二维码占位"><span>QR</span></div>
                  <p>临时二维码占位：正式版会在这里显示可用于入场的动态码；演示阶段无法扫描。</p>
                </div>
              </div>
              <p className="booking-ticket-note">演示票：不产生任何订单或扣款，也不能用于入场；票面信息与二维码均为占位。入梦日期与入梦坐标见弹层顶部。</p>
            </div>
            <div className="booking-actions">
              <button className="theme-primary-action" type="button" onClick={close}>
                <Check size={15} aria-hidden="true" />完成
              </button>
              <button className="theme-secondary-action" type="button" onClick={onOpenTickets}>
                <Ticket size={14} aria-hidden="true" />查看票夹
              </button>
              <button className="theme-secondary-action" type="button" onClick={() => setStep('login')}>
                <ArrowLeft size={14} aria-hidden="true" />重新填写
              </button>
            </div>
            <p className="booking-hint">票夹在 IDENTITY › UNSEEN® / CITY PASSPORT 的「我的票据」里；在那里可以逐张查看票面并确认保存。</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingFlow
