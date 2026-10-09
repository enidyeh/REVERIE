import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Check, Download, MoreHorizontal, Ticket, X } from 'lucide-react'
import { themeEntryDate, themeVenue } from '../data/theme'
import { activityOrder, ticketActivity, ticketNumber, type TicketRecord } from '../tickets'
import { downloadTicketImage } from '../ticket-image'
import { useLocale } from '../i18n/use-locale'
import { ticketImageCopy as imageCopy, ticketVaultCopy as copy } from '../i18n/tickets'
import './ticket-vault.css'
import './ticket-qr.css'

type TicketVaultProps = {
  tickets: TicketRecord[]
  onClose: () => void
  onCancelTicket: (id: string) => void
}

// 打开时才挂载：进入即显示票据列表，点某一张进入票面详情。
export function TicketVault({ tickets, onClose, onCancelTicket }: TicketVaultProps) {
  const { locale, t } = useLocale()
  const [openId, setOpenId] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmingCancel, setConfirmingCancel] = useState(false)
  const [notice, setNotice] = useState('')
  const sheetRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuOpenRef = useRef(false)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const opened = tickets.find((ticket) => ticket.id === openId) ?? null
  const openedActivity = opened ? ticketActivity(opened) : undefined

  useEffect(() => {
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    sheetRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      // 菜单展开时先收起菜单，再按一次才关闭弹层。
      if (menuOpenRef.current) {
        menuOpenRef.current = false
        setMenuOpen(false)
        return
      }
      close()
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = previousOverflow
    }
    // 只在挂载时执行一次：弹层每次打开都是新实例。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 点菜单外部或按别的键时收起菜单。
  useEffect(() => {
    if (!menuOpen) return
    menuOpenRef.current = true
    const handlePointer = (event: MouseEvent) => {
      if (menuRef.current && event.target instanceof Node && menuRef.current.contains(event.target)) return
      menuOpenRef.current = false
      setMenuOpen(false)
    }
    document.addEventListener('mousedown', handlePointer)
    return () => document.removeEventListener('mousedown', handlePointer)
  }, [menuOpen])

  function toggleMenu() {
    menuOpenRef.current = !menuOpen
    setMenuOpen(!menuOpen)
  }

  function backToList(message = '') {
    setOpenId(null)
    setMenuOpen(false)
    menuOpenRef.current = false
    setConfirmingCancel(false)
    setNotice(message)
  }

  function close() {
    onClose()
    const target = returnFocusRef.current
    if (target && target !== document.body) target.focus()
  }

  async function saveImage() {
    if (!opened) return
    const created = await downloadTicketImage(opened, locale)
    setNotice(created ? t(copy.imageCreated) : t(copy.imageFailed))
  }

  return (
    <div
      className="vault-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <div className="vault-sheet" role="dialog" aria-modal="true" aria-label="我的票据" ref={sheetRef} tabIndex={-1}>
        <div className="vault-head">
          <p className="vault-eyebrow"><Ticket size={13} aria-hidden="true" />UNSEEN® / CITY PASSPORT</p>
          <button className="vault-close" type="button" onClick={close} aria-label={t(copy.closeAria)}><X size={18} aria-hidden="true" /></button>
        </div>

        {opened && openedActivity ? (
          <div className="vault-detail">
            <div className="vault-detail-bar">
              <button className="vault-back" type="button" onClick={() => backToList()}>
                <ArrowLeft size={14} aria-hidden="true" />{t(copy.back)}
              </button>
              <div className="vault-more" ref={menuRef}>
                <button
                  className="vault-more-button"
                  type="button"
                  aria-label={t(copy.moreAria)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  onClick={toggleMenu}
                >
                  <MoreHorizontal size={18} aria-hidden="true" />
                </button>
                {menuOpen && (
                  <div className="vault-menu" role="menu">
                    <button type="button" role="menuitem" onClick={() => { setMenuOpen(false); menuOpenRef.current = false; setConfirmingCancel(true); setNotice('') }}>{t(copy.cancelTicket)}</button>
                    <button type="button" role="menuitem" onClick={() => { setMenuOpen(false); menuOpenRef.current = false; setNotice(t(copy.supportNotice)) }}>{t(copy.contactSupport)}</button>
                  </div>
                )}
              </div>
            </div>
            <div className="vault-ticket">
              <div className="vault-ticket-top">
                <span>REVERIE WONDERLAND</span>
                <span>ISSUE 002</span>
              </div>
              <p className="vault-ticket-mark" aria-hidden="true">{t(imageCopy.seal)}</p>
              <dl className="vault-ticket-body">
                <div><dt>{t(imageCopy.labelNo)}</dt><dd>{t(copy.ticketNo)(ticketNumber(opened.index))}<span>{opened.id}</span></dd></div>
                <div><dt>{t(imageCopy.labelEvent)}</dt><dd>{t(copy.sessionNo)(activityOrder(opened.activityId), t(openedActivity.name))}<span>{t(openedActivity.kind)}</span></dd></div>
                <div><dt>{t(imageCopy.labelTime)}</dt><dd>{openedActivity.day} {openedActivity.time}</dd></div>
                <div><dt>{t(imageCopy.labelVenue)}</dt><dd>{t(copy.venueLine)(t(themeVenue))}</dd></div>
                <div><dt>{t(imageCopy.labelDate)}</dt><dd>{themeEntryDate}</dd></div>
              </dl>
              <div className="ticket-qr">
                <div className="ticket-qr-box" role="img" aria-label={t(copy.qrAria)}><span>{t(imageCopy.qrPlaceholder)}</span></div>
                <p>{t(copy.qrNote)}</p>
              </div>
              <p className="vault-ticket-note">{t(copy.ticketDemoNote)}</p>
            </div>

            <p className="vault-status is-saved"><Check size={14} aria-hidden="true" />{t(copy.savedStatus)}</p>

            <div className="vault-actions">
              <button className="vault-primary" type="button" onClick={() => { void saveImage() }}>
                <Download size={15} aria-hidden="true" />{t(copy.download)}
              </button>
            </div>

            {confirmingCancel ? (
              <div className="vault-cancel">
                <p>{t(copy.cancelNote)}</p>
                <div className="vault-cancel-actions">
                  <button className="vault-secondary" type="button" onClick={() => { onCancelTicket(opened.id); backToList(t(copy.cancelledNotice)(ticketNumber(opened.index))) }}>{t(copy.confirmCancel)}</button>
                  <button className="vault-secondary" type="button" onClick={() => setConfirmingCancel(false)}>{t(copy.keepTicket)}</button>
                </div>
              </div>
            ) : null}

            {notice ? <p className="vault-notice" role="status">{notice}</p> : null}
          </div>
        ) : (
          <div className="vault-list-view">
            <h2 className="vault-title">{t(copy.title)}<span>{t(copy.count)(tickets.length)}</span></h2>
            {notice ? <p className="vault-notice" role="status">{notice}</p> : null}
            {tickets.length ? (
              <>
                <p className="vault-note">{t(copy.listNote1)}</p>
                <ul className="vault-list">
                  {tickets.map((ticket) => {
                    const activity = ticketActivity(ticket)
                    if (!activity) return null
                    return (
                      <li key={ticket.id}>
                        <button className="vault-item" type="button" onClick={() => setOpenId(ticket.id)}>
                          <span className="vault-item-top">
                            <b>{t(copy.ticketNo)(ticketNumber(ticket.index))}</b>
                          </span>
                          <span className="vault-item-activity">{t(copy.sessionNo)(activityOrder(ticket.activityId), t(activity.name))}</span>
                          <span className="vault-item-meta">{activity.day} {activity.time} · {t(activity.kind)} · SHANGHAI</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
                <p className="vault-note">{t(copy.listNote2)}</p>
              </>
            ) : (
              <div className="vault-empty">
                <p>{t(copy.emptyTitle)}</p>
                <p>{t(copy.emptyBodyPrefix)}<b>{t(copy.bookButton)}</b>{t(copy.emptyBodySuffix)}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TicketVault
