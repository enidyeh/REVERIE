import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Globe, X } from 'lucide-react'
import { useLocale } from '../i18n/use-locale'
import { locales } from '../i18n/messages'
import type { Localized } from '../i18n/messages'
import './language-picker.css'

// 顶部「选择语言」：与城市选择器同一套交互（弹层 + Esc / 背板关闭 + 焦点交还）。
const copy = {
  trigger: { zh: '中文', en: 'EN' } as Localized,
  triggerLabel: { zh: '切换语言，当前中文', en: 'Switch language, currently English' } as Localized,
  panelTitle: { zh: '选择语言', en: 'Choose language' } as Localized,
  panelEyebrow: { zh: 'LANGUAGE / 选择语言', en: 'LANGUAGE' } as Localized,
  close: { zh: '关闭语言选择', en: 'Close language picker' } as Localized,
  current: { zh: '当前语言', en: 'Current language' } as Localized,
  note: {
    zh: '中文版与英文版是两套独立内容，不会在同一页混排。切换后立即生效，并保存在本机。',
    en: 'Chinese and English are two separate versions, never mixed on one page. The choice applies immediately and is stored on this device.',
  } as Localized,
}

export function LanguagePicker() {
  const { locale, setLocale, t } = useLocale()
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  function close() {
    setOpen(false)
    triggerRef.current?.focus()
  }

  useEffect(() => {
    if (!open) return
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') close()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const current = locales.find((item) => item.id === locale) ?? locales[0]

  return (
    <>
      <button
        className="language-trigger"
        type="button"
        ref={triggerRef}
        onClick={() => setOpen(true)}
        aria-label={t(copy.triggerLabel)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Globe size={13} aria-hidden="true" />
        <span>{t(copy.trigger)}</span>
        <ChevronDown size={12} aria-hidden="true" />
      </button>

      {open && (
        <div className="language-overlay" role="presentation" onClick={close}>
          <section
            className="language-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="language-panel-title"
            onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}
          >
            <header className="language-panel-head">
              <div>
                <p className="language-panel-eyebrow">{t(copy.panelEyebrow)}</p>
                <h2 id="language-panel-title">{t(copy.panelTitle)}</h2>
              </div>
              <button className="language-close" type="button" onClick={close} aria-label={t(copy.close)}>
                <X size={17} aria-hidden="true" />
              </button>
            </header>

            <p className="language-current">{t(copy.current)}：{current.label}</p>

            <ul className="language-list">
              {locales.map((item) => {
                const selected = item.id === locale
                return (
                  <li key={item.id}>
                    <button
                      className={`language-option ${selected ? 'is-selected' : ''}`}
                      type="button"
                      onClick={() => { setLocale(item.id); close() }}
                      aria-current={selected ? 'true' : undefined}
                    >
                      <span className="language-option-label">{item.label}</span>
                      <span className="language-option-note">{item.note}</span>
                      {selected && <Check size={15} aria-hidden="true" />}
                    </button>
                  </li>
                )
              })}
            </ul>

            <p className="language-note">{t(copy.note)}</p>
          </section>
        </div>
      )}
    </>
  )
}

export default LanguagePicker
