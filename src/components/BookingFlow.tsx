import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Check, CreditCard, Minus, Plus, Ticket, X } from 'lucide-react'
import { themeEntryDate, themeMeta, themeTicket, themeVenue } from '../data/theme'
import { activityOrder, buildTickets, loadTickets, persistTickets, ticketActivity, ticketNumber, type TicketRecord } from '../tickets'
import { bookingCopy as copy, themeCopy } from '../i18n/discover'
import { pick } from '../i18n/localize'
import { useLocale } from '../i18n/use-locale'
import './booking-flow.css'
import './ticket-qr.css'

// 入场日期与场地以项目方提供的原文为准，写在流程每一步里。
const entryDate = themeEntryDate

function formatPrice(value: number) {
  return `¥${Number(value.toFixed(2))}`
}

type BookingStep = 'login' | 'pay' | 'ticket'

const steps: { id: BookingStep; index: string }[] = [
  { id: 'login', index: '01' },
  { id: 'pay', index: '02' },
  { id: 'ticket', index: '03' },
]

type BookingFlowProps = {
  onClose: () => void
  onOpenTickets: () => void
  dreamerName: string
  onDreamerNameChange: (value: string) => void
}

function maskPhone(phone: string, fallback: string) {
  if (phone.length === 0) return fallback
  return phone.length === 11 ? `${phone.slice(0, 3)}****${phone.slice(7)}` : phone
}

// 弹层在打开时才挂载，因此每次打开都是从第一步开始、手机号为空的新流程。
export function BookingFlow({ onClose, onOpenTickets, dreamerName, onDreamerNameChange }: BookingFlowProps) {
  const { t, locale } = useLocale()
  const entryLocation = t(copy.venueLine)(t(themeVenue))
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
        aria-label={t(copy.flowLabel)}
        ref={sheetRef}
        tabIndex={-1}
      >
        <div className="booking-head">
          <p className="booking-eyebrow"><Ticket size={13} aria-hidden="true" />WONDERLAND TICKET</p>
          <button className="booking-close" type="button" onClick={close} aria-label={t(copy.close)}><X size={18} aria-hidden="true" /></button>
        </div>

        <ol className="booking-steps">
          {steps.map((item, index) => (
            <li className={`booking-step ${step === item.id ? 'is-active' : ''}`} key={item.id} aria-current={step === item.id ? 'step' : undefined}>
              <b>{item.index}</b>{t(copy.steps)[index]}
            </li>
          ))}
        </ol>

        <dl className="booking-when">
          <div>
            <dt>{t(themeCopy.entryDate)}</dt>
            <dd>{entryDate}</dd>
          </div>
          <div>
            <dt>{t(themeCopy.location)}</dt>
            <dd>{entryLocation}</dd>
          </div>
        </dl>

        {step === 'login' && (
          <div className="booking-body">
            <p className="booking-note">{t(copy.stepNotes)[0]}</p>
            <div className="booking-field">
              <label htmlFor="booking-name">{t(copy.nameLabel)}</label>
              <input
                id="booking-name"
                maxLength={18}
                placeholder={t(copy.namePlaceholder)}
                value={dreamerName}
                onChange={(event) => onDreamerNameChange(event.target.value)}
              />
            </div>
            <div className="booking-field">
              <label htmlFor="booking-phone">{t(copy.phoneLabel)}</label>
              <input
                id="booking-phone"
                autoComplete="tel"
                inputMode="tel"
                maxLength={11}
                placeholder={t(copy.phonePlaceholder)}
                value={phone}
                onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 11))}
              />
              <span className="booking-hint">{t(copy.memoryHint)}</span>
            </div>
            <div className="booking-field">
              <span className="booking-label">{t(copy.ticketsLabel)}</span>
              <div className="booking-count" role="group" aria-label={t(copy.ticketsLabel)}>
                <button
                  className="booking-count-button"
                  type="button"
                  aria-label={t(copy.removeOne)}
                  disabled={count <= themeTicket.minCount}
                  onClick={() => changeCount(-1)}
                >
                  <Minus size={14} aria-hidden="true" />
                </button>
                <span className="booking-count-value" aria-live="polite">{t(copy.count)(count)}</span>
                <button
                  className="booking-count-button"
                  type="button"
                  aria-label={t(copy.addOne)}
                  disabled={count >= themeTicket.maxCount}
                  onClick={() => changeCount(1)}
                >
                  <Plus size={14} aria-hidden="true" />
                </button>
                <span className="booking-count-price">{t(copy.priceEach)(formatPrice(themeTicket.price), formatPrice(total))}</span>
              </div>
              <span className="booking-hint">{t(copy.maxHint)(themeTicket.maxCount)}</span>
            </div>
            <div className="booking-actions">
              <button className="theme-primary-action" type="button" onClick={() => setStep('pay')}>
                <CreditCard size={15} aria-hidden="true" />{t(copy.toPayment)}
              </button>
            </div>
          </div>
        )}

        {step === 'pay' && (
          <div className="booking-body">
            <p className="booking-note">{t(copy.stepNotes)[1]}</p>
            <p className="booking-amount">
              {t(copy.totalLabel)} <b>{formatPrice(total)}</b>
              <span>{t(copy.count)(count)} × {formatPrice(themeTicket.price)}</span>
            </p>
            <fieldset className="booking-pay">
              <legend>{t(copy.paymentLegend)}</legend>
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
                    <span>{t(method.name)}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <p className="booking-hint">{t(copy.payHint)(formatPrice(themeTicket.price))}</p>
            <div className="booking-actions">
              <button className="theme-primary-action" type="button" onClick={confirmPay}>
                <CreditCard size={15} aria-hidden="true" />{t(copy.confirmPayment)}
              </button>
              <button className="theme-secondary-action" type="button" onClick={() => setStep('login')}>
                <ArrowLeft size={14} aria-hidden="true" />{t(copy.back)}
              </button>
            </div>
          </div>
        )}

        {step === 'ticket' && (
          <div className="booking-body">
            <p className="booking-note">{t(copy.stepNotes)[2]}</p>
            <p className="booking-hint">{t(copy.ticketStoredHint)}</p>
            <div className="booking-ticket">
              <div className="booking-ticket-top">
                <span>REVERIE WONDERLAND</span>
                <span>ISSUE 002</span>
              </div>
              <p className="booking-ticket-mark" aria-hidden="true">{t(copy.seal)}</p>
              <dl className="booking-ticket-body">
                <div><dt>{t(copy.nameLabel)}</dt><dd>{name || t(copy.notProvided)}</dd></div>
                <div><dt>{t(copy.phoneLabel)}</dt><dd>{maskPhone(phone, t(copy.notProvided))}</dd></div>
                <div><dt>{t(copy.ticketsLabel)}</dt><dd>{t(copy.count)(count)}</dd></div>
                <div><dt>{t(copy.amountLabel)}</dt><dd>{formatPrice(total)}</dd></div>
                <div><dt>{t(copy.statusLabel)}</dt><dd>{t(copy.demoNotValid)}</dd></div>
              </dl>
              <div className="booking-issue">
                {issued.length > 0 && (
                  <div className="booking-issue-text">
                    <p className="booking-issued-label">{t(copy.issued)(issued.length)}</p>
                    <ul className="booking-issued-list">
                      {issued.map((ticket) => {
                        const activity = ticketActivity(ticket)
                        return (
                          <li key={ticket.id}>
                            <span className="booking-issued-no">{t(copy.ticketNo)(ticketNumber(ticket.index))}</span>
                            <span className="booking-issued-name">{t(copy.sessionNo)(activityOrder(ticket.activityId), activity ? pick(locale, activity.name) : '')}</span>
                            <span className="booking-issued-meta">{activity?.day} {activity?.time} · {t(themeMeta.city)}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
                <div className="booking-issue-qr">
                  <div className="ticket-qr-box" role="img" aria-label={t(copy.qrAria)}><span>{t(copy.qrBox)}</span></div>
                  <p>{t(copy.qrNote)}</p>
                </div>
              </div>
              <p className="booking-ticket-note">{t(copy.demoNote)}</p>
            </div>
            <div className="booking-actions">
              <button className="theme-primary-action" type="button" onClick={close}>
                <Check size={15} aria-hidden="true" />{t(copy.done)}
              </button>
              <button className="theme-secondary-action" type="button" onClick={onOpenTickets}>
                <Ticket size={14} aria-hidden="true" />{t(copy.openWallet)}
              </button>
              <button className="theme-secondary-action" type="button" onClick={() => setStep('login')}>
                <ArrowLeft size={14} aria-hidden="true" />{t(copy.restart)}
              </button>
            </div>
            <p className="booking-hint">{t(copy.walletHint)}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingFlow
