import { useEffect, useRef } from 'react'
import { ArrowUpRight, X } from 'lucide-react'
import { useLocale } from '../i18n/use-locale'
import type { Localized } from '../i18n/messages'
import { moreMenuCopy as copy } from '../i18n/shell'
import './more-menu.css'

type MoreTarget = { id: string; section: 'collaborate' | 'about'; anchor?: string }
type MoreItem = { label: Localized; note?: Localized; target: MoreTarget }

// 手机端顶部 MORE 菜单：把 COLLABORATE 与 ABOUT 的子项集中在这里。
// 分组原先带英文小字（Partners / Open Calls、Story / Contact），已按项目方要求删除。
const moreGroups: { id: string; en: string; items: MoreItem[] }[] = [
  {
    id: 'collaborate',
    en: 'COLLABORATE',
    items: [
      { label: { zh: '品牌招募', en: 'Brand partnerships' }, note: { zh: 'PARTNER WITH US', en: 'PARTNER WITH US' }, target: { id: 'brand', section: 'collaborate', anchor: '.collab-partner' } },
      { label: { zh: 'OPEN CALL', en: 'OPEN CALL' }, note: { zh: '报名参与', en: 'Join as a creator' }, target: { id: 'open-call', section: 'collaborate', anchor: '.collab-open-calls' } },
    ],
  },
  {
    id: 'about',
    en: 'ABOUT',
    items: [
      { label: { zh: 'About REVERIE', en: 'About REVERIE' }, note: { zh: '一句话定义', en: 'In one sentence' }, target: { id: 'about-reverie', section: 'about', anchor: '.about-definition' } },
      { label: { zh: 'Past Projects', en: 'Past projects' }, note: { zh: '做过的事', en: 'What we have done' }, target: { id: 'past-projects', section: 'about', anchor: '.about-story' } },
      { label: { zh: 'Contact', en: 'Contact' }, note: { zh: '按用途找我们', en: 'Reach us by purpose' }, target: { id: 'contact', section: 'about', anchor: '.about-contact' } },
    ],
  },
]

type MoreMenuProps = {
  onClose: () => void
  onSelect: (target: MoreTarget) => void
}

// 打开时才挂载：与站内其他弹层一样锁定滚动、Esc / 背板关闭、关闭后把焦点交回触发按钮。
export function MoreMenu({ onClose, onSelect }: MoreMenuProps) {
  const { t } = useLocale()
  const panelRef = useRef<HTMLDivElement>(null)

  function handleKey(event: KeyboardEvent) {
    if (event.key === 'Escape') onClose()
  }

  useEffect(() => {
    panelRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = previousOverflow
    }
    // 只在挂载时执行一次。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="more-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="more-panel" role="dialog" aria-modal="true" aria-label={t(copy.panelLabel)} ref={panelRef} tabIndex={-1}>
        <div className="more-head">
          <p className="more-eyebrow">{t(copy.eyebrow)}</p>
          <button className="more-close" type="button" onClick={onClose} aria-label={t(copy.close)}><X size={18} aria-hidden="true" /></button>
        </div>
        {moreGroups.map((group) => (
          <section className="more-group" key={group.id} aria-labelledby={`more-${group.id}-heading`}>
            <div className="more-group-head">
              <h2 id={`more-${group.id}-heading`}>{group.en}</h2>
            </div>
            <ul className="more-list">
              {group.items.map((item) => (
                <li key={item.target.id}>
                  <button type="button" onClick={() => onSelect(item.target)}>
                    <span className="more-item-label">{t(item.label)}</span>
                    {item.note && <span className="more-item-note">{t(item.note)}</span>}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}

export type { MoreTarget }
export default MoreMenu
