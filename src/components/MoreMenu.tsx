import { useEffect, useRef } from 'react'
import { ArrowUpRight, X } from 'lucide-react'
import './more-menu.css'

type MoreTarget = { id: string; section: 'collaborate' | 'about'; anchor?: string }
type MoreItem = { label: string; note?: string; target: MoreTarget }

// 手机端顶部 MORE 菜单：把 COLLABORATE 与 ABOUT 的子项集中在这里。
const moreGroups: { id: string; en: string; zh: string; items: MoreItem[] }[] = [
  {
    id: 'collaborate',
    en: 'COLLABORATE',
    zh: 'Partners / Open Calls',
    items: [
      { label: '品牌招募', note: 'PARTNER WITH US', target: { id: 'brand', section: 'collaborate', anchor: '.collab-partner' } },
      { label: 'OPEN CALL', note: '报名参与', target: { id: 'open-call', section: 'collaborate', anchor: '.collab-open-calls' } },
    ],
  },
  {
    id: 'about',
    en: 'ABOUT',
    zh: 'Story / Contact',
    items: [
      { label: 'About REVERIE', note: '一句话定义', target: { id: 'about-reverie', section: 'about', anchor: '.about-definition' } },
      { label: 'Past Projects', note: '做过的事', target: { id: 'past-projects', section: 'about', anchor: '.about-story' } },
      { label: 'Contact', note: '按用途找我们', target: { id: 'contact', section: 'about', anchor: '.about-contact' } },
    ],
  },
]

type MoreMenuProps = {
  onClose: () => void
  onSelect: (target: MoreTarget) => void
}

// 打开时才挂载：与站内其他弹层一样锁定滚动、Esc / 背板关闭、关闭后把焦点交回触发按钮。
export function MoreMenu({ onClose, onSelect }: MoreMenuProps) {
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
      <div className="more-panel" role="dialog" aria-modal="true" aria-label="更多入口" ref={panelRef} tabIndex={-1}>
        <div className="more-head">
          <p className="more-eyebrow">MORE / 更多</p>
          <button className="more-close" type="button" onClick={onClose} aria-label="关闭更多入口"><X size={18} aria-hidden="true" /></button>
        </div>
        {moreGroups.map((group) => (
          <section className="more-group" key={group.id} aria-labelledby={`more-${group.id}-heading`}>
            <div className="more-group-head">
              <h2 id={`more-${group.id}-heading`}>{group.en}</h2>
              <span>{group.zh}</span>
            </div>
            <ul className="more-list">
              {group.items.map((item) => (
                <li key={item.target.id}>
                  <button type="button" onClick={() => onSelect(item.target)}>
                    <span className="more-item-label">{item.label}</span>
                    {item.note && <span className="more-item-note">{item.note}</span>}
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
