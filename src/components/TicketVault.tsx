import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Check, Download, MoreHorizontal, Ticket, X } from 'lucide-react'
import { themeEntryDate, themeVenue } from '../data/theme'
import { activityOrder, ticketActivity, ticketNumber, type TicketRecord } from '../tickets'
import { downloadTicketImage } from '../ticket-image'
import './ticket-vault.css'
import './ticket-qr.css'

type TicketVaultProps = {
  tickets: TicketRecord[]
  onClose: () => void
  onCancelTicket: (id: string) => void
}

// 打开时才挂载：进入即显示票据列表，点某一张进入票面详情。
export function TicketVault({ tickets, onClose, onCancelTicket }: TicketVaultProps) {
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
    const created = await downloadTicketImage(opened)
    setNotice(created
      ? '已生成票据图片（演示票，不可入场）；若浏览器没有自动下载，请检查下载设置。'
      : '演示：当前环境无法生成票据图片。')
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
          <button className="vault-close" type="button" onClick={close} aria-label="关闭我的票据"><X size={18} aria-hidden="true" /></button>
        </div>

        {opened && openedActivity ? (
          <div className="vault-detail">
            <div className="vault-detail-bar">
              <button className="vault-back" type="button" onClick={() => backToList()}>
                <ArrowLeft size={14} aria-hidden="true" />返回票据列表
              </button>
              <div className="vault-more" ref={menuRef}>
                <button
                  className="vault-more-button"
                  type="button"
                  aria-label="更多票据操作"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  onClick={toggleMenu}
                >
                  <MoreHorizontal size={18} aria-hidden="true" />
                </button>
                {menuOpen && (
                  <div className="vault-menu" role="menu">
                    <button type="button" role="menuitem" onClick={() => { setMenuOpen(false); menuOpenRef.current = false; setConfirmingCancel(true); setNotice('') }}>取消票据</button>
                    <button type="button" role="menuitem" onClick={() => { setMenuOpen(false); menuOpenRef.current = false; setNotice('演示：正式版会打开客服入口（客服邮箱或站内消息），现在还没有接入。') }}>联系客服</button>
                  </div>
                )}
              </div>
            </div>
            <div className="vault-ticket">
              <div className="vault-ticket-top">
                <span>REVERIE WONDERLAND</span>
                <span>ISSUE 002</span>
              </div>
              <p className="vault-ticket-mark" aria-hidden="true">夢</p>
              <dl className="vault-ticket-body">
                <div><dt>票号｜TICKET NO.</dt><dd>第 {ticketNumber(opened.index)} 张票<span>{opened.id}</span></dd></div>
                <div><dt>活动｜EVENT</dt><dd>活动 {activityOrder(opened.activityId)} · {openedActivity.name}<span>{openedActivity.nameEn} · {openedActivity.kind}</span></dd></div>
                <div><dt>活动时间｜TIME</dt><dd>{openedActivity.day} {openedActivity.time}</dd></div>
                <div><dt>活动地点｜VENUE</dt><dd>SHANGHAI · {themeVenue}</dd></div>
                <div><dt>票期｜ENTRY DATE</dt><dd>{themeEntryDate}</dd></div>
              </dl>
              <div className="ticket-qr">
                <div className="ticket-qr-box" role="img" aria-label="临时二维码占位"><span>QR</span></div>
                <p>临时二维码占位：正式版会在这里显示可用于入场的动态码；演示阶段无法扫描。</p>
              </div>
              <p className="vault-ticket-note">演示票：不产生任何订单或扣款，也不能用于入场；票面信息与二维码均为占位。</p>
            </div>

            <p className="vault-status is-saved"><Check size={14} aria-hidden="true" />票据付款后已自动保存入库（演示：正式版登录同一账号后可在其他设备同步）。</p>

            <div className="vault-actions">
              <button className="vault-primary" type="button" onClick={() => { void saveImage() }}>
                <Download size={15} aria-hidden="true" />下载票据图片
              </button>
            </div>

            {confirmingCancel ? (
              <div className="vault-cancel">
                <p>取消后这张票会从票夹里移除，且无法恢复（演示，不涉及任何退款）。</p>
                <div className="vault-cancel-actions">
                  <button className="vault-secondary" type="button" onClick={() => { onCancelTicket(opened.id); backToList(`已取消第 ${ticketNumber(opened.index)} 张票`) }}>确认取消</button>
                  <button className="vault-secondary" type="button" onClick={() => setConfirmingCancel(false)}>先不取消</button>
                </div>
              </div>
            ) : null}

            {notice ? <p className="vault-notice" role="status">{notice}</p> : null}
          </div>
        ) : (
          <div className="vault-list-view">
            <h2 className="vault-title">我的票据<span>{tickets.length.toString().padStart(2, '0')} 张</span></h2>
            {notice ? <p className="vault-notice" role="status">{notice}</p> : null}
            {tickets.length ? (
              <>
                <p className="vault-note">每张票对应一场活动，按当天活动表顺序发放；票据付款后即保存在本机，点开某一张可以看票号、活动、时间、地点与二维码占位。</p>
                <ul className="vault-list">
                  {tickets.map((ticket) => {
                    const activity = ticketActivity(ticket)
                    if (!activity) return null
                    return (
                      <li key={ticket.id}>
                        <button className="vault-item" type="button" onClick={() => setOpenId(ticket.id)}>
                          <span className="vault-item-top">
                            <b>第 {ticketNumber(ticket.index)} 张票</b>
                          </span>
                          <span className="vault-item-activity">活动 {activityOrder(ticket.activityId)} · {activity.name}</span>
                          <span className="vault-item-meta">{activity.day} {activity.time} · {activity.kind} · SHANGHAI</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
                <p className="vault-note">票据只保存在本机浏览器，不包含手机号等个人信息；二维码为占位，票不可入场。</p>
              </>
            ) : (
              <div className="vault-empty">
                <p>还没有票据。</p>
                <p>在 DISCOVER 的开屏点 <b>BOOK TICKETS</b>，走完三步（登录 → 付款 → 得到票）后，票据会出现在这里。</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TicketVault
