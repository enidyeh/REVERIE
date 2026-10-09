import { useRef, useState, type FormEvent, type RefObject } from 'react'
import { ArrowUpRight, Check, FlaskConical, Handshake, Megaphone } from 'lucide-react'
import {
  collaborationFormats,
  openCallFields,
  openCallNote,
  openCallRoles,
  openCalls,
  partnerAudiences,
  partnerFormFields,
} from './data/collaborate'
import './collaborate.css'

type Track = 'partner' | 'open-call'

function CollaborateView() {
  const [activeRole, setActiveRole] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState<string | null>(null)
  const openCallRef = useRef<HTMLElement>(null)
  const partnerRef = useRef<HTMLElement>(null)
  const partnerFormRef = useRef<HTMLDivElement>(null)
  const openCallFormRef = useRef<HTMLDivElement>(null)

  function jumpTo(ref: RefObject<HTMLElement | null>) {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function pickRole(roleId: string) {
    setActiveRole(roleId)
    setSubmitted(null)
    window.setTimeout(() => openCallFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>, track: Track) {
    event.preventDefault()
    setSubmitted(track)
    event.currentTarget.reset()
  }

  const role = openCallRoles.find((entry) => entry.id === activeRole) ?? null
  const call = openCalls[0]

  return (
    <div className="collab-page">
      <div className="section-meta"><span>COLLABORATE / 一起创造</span><span>PARTNER / OPEN CALLS</span></div>

      <header className="collab-heading">
        <div>
          <p className="collab-eyebrow"><span className="collab-live-dot" /> CREATE WITH US</p>
          <h1>把你的世界，<br /><span>带进这里。</span></h1>
        </div>
        <p className="collab-heading-aside">左边是进入 REVERIE 世界，<br />这里是和 REVERIE 一起做事。</p>
      </header>

      <section className="collab-entries" aria-label="合作与报名入口">
        <button className="collab-entry" type="button" onClick={() => jumpTo(partnerRef)}>
          <span className="collab-entry-index"><Handshake size={17} aria-hidden="true" /></span>
          <span className="collab-entry-body">
            <b>01</b>
            <strong>PARTNER WITH US</strong>
            <em>合作伙伴 · 品牌 / 场地 / 机构</em>
          </span>
          <ArrowUpRight size={16} aria-hidden="true" />
        </button>
        <button className="collab-entry" type="button" onClick={() => jumpTo(openCallRef)}>
          <span className="collab-entry-index"><Megaphone size={17} aria-hidden="true" /></span>
          <span className="collab-entry-body">
            <b>02</b>
            <strong>OPEN CALLS</strong>
            <em>报名参与 · 摊主 / 艺术家 / 演出者</em>
          </span>
          <ArrowUpRight size={16} aria-hidden="true" />
        </button>
      </section>

      <section className="collab-partner" ref={partnerRef} aria-labelledby="collab-partner-heading">
        <div className="collab-section-heading">
          <div>
            <p className="collab-eyebrow">01 / PARTNER WITH US</p>
            <h2 id="collab-partner-heading">Bring your world into ours.</h2>
          </div>
          <span>合作伙伴</span>
        </div>
        <p className="collab-partner-lead">把你的品牌、作品、空间或想法带进 REVERIE。</p>

        <h3 className="collab-subheading">我们和谁合作</h3>
        <ul className="collab-audiences">
          {partnerAudiences.map((audience) => (
            <li key={audience.id}><span>{audience.zh}</span><b>{audience.en}</b></li>
          ))}
        </ul>

        <h3 className="collab-subheading">合作方式</h3>
        <ul className="collab-formats">
          {collaborationFormats.map((format) => <li key={format}>{format}</li>)}
        </ul>

        <div className="collab-actions">
          <button className="collab-primary-action" type="button" onClick={() => jumpTo(partnerFormRef)}>合作详情 <ArrowUpRight size={15} aria-hidden="true" /></button>
          <span className="collab-action-note">VIEW PARTNERSHIP DECK｜合作手册尚未提供，本次演示中不提供下载。</span>
        </div>

        <div className="collab-form-block" ref={partnerFormRef}>
          <p className="collab-eyebrow">START A COLLABORATION</p>
          <form className="collab-form" onSubmit={(event) => handleSubmit(event, 'partner')}>
            {partnerFormFields.map((field) => (
              <label key={field.id} htmlFor={`partner-${field.id}`}>
                {field.label}
                <input id={`partner-${field.id}`} name={field.id} placeholder={field.placeholder} required={field.required} maxLength={160} />
              </label>
            ))}
            <label htmlFor="partner-format">
              合作方向
              <select id="partner-format" name="format" defaultValue={collaborationFormats[0]}>
                {collaborationFormats.map((format) => <option key={format} value={format}>{format}</option>)}
              </select>
            </label>
            <button className="collab-primary-action" type="submit">提交合作意向</button>
            <p className="collab-form-note">{openCallNote}</p>
          </form>
          {submitted === 'partner' && <p className="collab-submit-result" aria-live="polite"><Check size={15} aria-hidden="true" />演示提交已完成：真实提交需要接入服务，当前版本不会发送任何内容。</p>}
        </div>
      </section>

      <section className="collab-open-calls" ref={openCallRef} aria-labelledby="collab-open-calls-heading">
        <div className="collab-section-heading">
          <div>
            <p className="collab-eyebrow">02 / OPEN CALLS</p>
            <h2 id="collab-open-calls-heading">现在正在招募。</h2>
          </div>
          <span>{openCalls.length.toString().padStart(2, '0')} OPEN</span>
        </div>

        <article className="collab-call-card">
          <div className="collab-call-topline">
            <span>{call.status}</span>
            <b>{call.window}</b>
          </div>
          <h3>{call.title}</h3>
          <p className="collab-call-zh">{call.titleZh}</p>
          <p className="collab-call-line">{call.line}</p>
        </article>

        <h3 className="collab-subheading">选择你的身份</h3>
        <div className="collab-roles">
          {openCallRoles.map((entry) => (
            <button
              className={`collab-role ${activeRole === entry.id ? 'is-active' : ''}`}
              key={entry.id}
              type="button"
              aria-pressed={activeRole === entry.id}
              onClick={() => pickRole(entry.id)}
            >
              <span className="collab-role-zh">{entry.zh}</span>
              <span className="collab-role-en">{entry.en}</span>
              <span className="collab-role-line">{entry.line}</span>
            </button>
          ))}
        </div>

        {role && (
          <div className="collab-form-block" ref={openCallFormRef} aria-live="polite">
            <p className="collab-eyebrow">APPLY / {role.en}</p>
            <h3 className="collab-form-title">报名成为{role.zh}。</h3>
            <p className="collab-form-hint">{call.title}｜{call.titleZh} · {call.window}</p>
            <form className="collab-form" onSubmit={(event) => handleSubmit(event, 'open-call')}>
              {openCallFields.map((field) => (
                <label key={field.id} htmlFor={`call-${field.id}`}>
                  {field.label}
                  <input id={`call-${field.id}`} name={field.id} placeholder={field.placeholder} required={field.required} maxLength={200} />
                </label>
              ))}
              <button className="collab-primary-action" type="submit">提交报名</button>
              <p className="collab-form-note">{openCallNote}</p>
            </form>
            {submitted === 'open-call' && <p className="collab-submit-result" aria-live="polite"><Check size={15} aria-hidden="true" />演示提交已完成：没有产生真实报名，也没有保存你填写的内容。</p>}
          </div>
        )}

        {!role && (
          <p className="collab-roles-hint"><FlaskConical size={14} aria-hidden="true" />选一个身份即可看到对应的报名表单，两步完成。</p>
        )}
        <p className="collab-disclosure">本页所有内容与表单均为本地演示：不会提交、不会保存，也不会产生真实的报名、合作或支付。</p>
      </section>

      <div className="collab-footer-mark"><span>CREATE WITH US.</span><span>COLLABORATE / 2026</span></div>
    </div>
  )
}

export default CollaborateView
