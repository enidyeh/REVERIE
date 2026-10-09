import { useEffect, useState } from 'react'
import { socialMarks } from '../data/social'
import './social-marks.css'

// 四个渠道的简笔标志：统一 18px、单色描边，跟随 currentColor。
function MarkGlyph({ id }: { id: string }) {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, focusable: false }

  if (id === 'xiaohongshu') {
    return (
      <svg {...common}>
        <path d="M12 8v9" />
        <path d="M12 8c-1.6-1-3.4-1.6-5.6-1.6v9c2.2 0 4 .6 5.6 1.6" />
        <path d="M12 8c1.6-1 3.4-1.6 5.6-1.6v9c-2.2 0-4 .6-5.6 1.6" />
      </svg>
    )
  }

  if (id === 'douyin') {
    return (
      <svg {...common}>
        <path d="M14.4 3.8v9.7a3.8 3.8 0 1 1-3.8-3.8c.3 0 .6 0 .9.1" />
        <path d="M14.4 3.8c.3 2.5 2.1 4.3 4.7 4.6" />
      </svg>
    )
  }

  if (id === 'official-account') {
    return (
      <svg {...common}>
        <path d="M20.2 12.6c0 3.4-3.7 6.2-8.2 6.2-.9 0-1.8-.1-2.6-.3L5 20.3l1-2.7c-1.3-1.1-2.2-2.7-2.2-4.4" />
        <path d="M4.6 12.6c0-3.4 3.7-6.2 8.2-6.2s8.2 2.8 8.2 6.2" />
        <path d="M9.4 11.2h6.4M9.4 14h4" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <rect x="3.2" y="4.4" width="12.6" height="9.4" rx="4" />
      <circle cx="7.4" cy="9.1" r="0.95" fill="currentColor" stroke="none" />
      <circle cx="11.6" cy="9.1" r="0.95" fill="currentColor" stroke="none" />
      <rect x="10.2" y="10.6" width="10.6" height="8.2" rx="3.6" />
      <circle cx="13.8" cy="14.7" r="0.95" fill="currentColor" stroke="none" />
      <circle cx="17.4" cy="14.7" r="0.95" fill="currentColor" stroke="none" />
    </svg>
  )
}

// 桌面端主航栏中间的一排社交入口：IDENTITY 与 COLLABORATE 之间。
export function SocialMarks() {
  const [notice, setNotice] = useState('')

  // 提示 4 秒后自动收起，避免一直占着导航下方。
  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 4000)
    return () => window.clearTimeout(timer)
  }, [notice])

  return (
    <div className="social-marks" aria-label="REVERIE 社交渠道">
      {socialMarks.map((mark) =>
        mark.href ? (
          <a
            className="social-mark"
            key={mark.id}
            href={mark.href}
            target="_blank"
            rel="noreferrer noopener"
            title={mark.label}
            aria-label={`${mark.label}（新窗口打开）`}
            onClick={() => setNotice(`${mark.label}：${mark.note}`)}
          >
            <MarkGlyph id={mark.id} />
          </a>
        ) : (
          <button
            className="social-mark"
            key={mark.id}
            type="button"
            title={mark.label}
            aria-label={`${mark.label}（演示，尚无链接）`}
            onClick={() => setNotice(`${mark.label}：${mark.note}`)}
          >
            <MarkGlyph id={mark.id} />
          </button>
        ),
      )}
      {notice && <p className="social-notice" role="status">{notice}</p>}
    </div>
  )
}

export default SocialMarks
