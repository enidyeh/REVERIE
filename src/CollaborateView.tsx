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
import { collaborateCopy as copy } from './i18n/collaborate'
import { useLocale } from './i18n/use-locale'
import './collaborate.css'

type Track = 'partner' | 'open-call'

function CollaborateView() {
  const { t } = useLocale()
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
      <div className="section-meta"><span>{t(copy.sectionMetaLeft)}</span><span>{t(copy.sectionMetaRight)}</span></div>

      <header className="collab-heading">
        <div>
          {t(copy.coverEyebrow) && <p className="collab-eyebrow"><span className="collab-live-dot" /> {t(copy.coverEyebrow)}</p>}
          <h1>{t(copy.coverTitleLines)[0]}<br /><span>{t(copy.coverTitleLines)[1]}</span></h1>
        </div>
        <p className="collab-heading-aside">{t(copy.headingAsideLines)[0]}<br />{t(copy.headingAsideLines)[1]}</p>
      </header>

      <section className="collab-entries" aria-label={t(copy.entriesLabel)}>
        <button className="collab-entry" type="button" onClick={() => jumpTo(partnerRef)}>
          <span className="collab-entry-index"><Handshake size={17} aria-hidden="true" /></span>
          <span className="collab-entry-body">
            <b>01</b>
            <strong>{t(copy.entryPartnerTitle)}</strong>
            <em>{t(copy.entryPartnerNote)}</em>
          </span>
          <ArrowUpRight size={16} aria-hidden="true" />
        </button>
        <button className="collab-entry" type="button" onClick={() => jumpTo(openCallRef)}>
          <span className="collab-entry-index"><Megaphone size={17} aria-hidden="true" /></span>
          <span className="collab-entry-body">
            <b>02</b>
            <strong>{t(copy.entryCallsTitle)}</strong>
            <em>{t(copy.entryCallsNote)}</em>
          </span>
          <ArrowUpRight size={16} aria-hidden="true" />
        </button>
      </section>

      <section className="collab-partner" ref={partnerRef} aria-labelledby="collab-partner-heading">
        <div className="collab-section-heading">
          <div>
            <p className="collab-eyebrow">{t(copy.partnerEyebrow)}</p>
            <h2 id="collab-partner-heading">{t(copy.partnerHeading)}</h2>
          </div>
          <span>{t(copy.partnerBadge)}</span>
        </div>
        <p className="collab-partner-lead">{t(copy.partnerLead)}</p>

        <h3 className="collab-subheading">{t(copy.audienceHeading)}</h3>
        <ul className="collab-audiences">
          {partnerAudiences.map((audience) => (
            <li key={audience.id}><span>{t(audience.label)}</span></li>
          ))}
        </ul>

        <h3 className="collab-subheading">{t(copy.formatsHeading)}</h3>
        <ul className="collab-formats">
          {t(collaborationFormats).map((format) => <li key={format}>{format}</li>)}
        </ul>

        <div className="collab-actions">
          <button className="collab-primary-action" type="button" onClick={() => jumpTo(partnerFormRef)}>{t(copy.partnerDetailAction)} <ArrowUpRight size={15} aria-hidden="true" /></button>
          <span className="collab-action-note">{t(copy.partnerDeckNote)}</span>
        </div>

        <div className="collab-form-block" ref={partnerFormRef}>
          <p className="collab-eyebrow">{t(copy.partnerFormEyebrow)}</p>
          <form className="collab-form" onSubmit={(event) => handleSubmit(event, 'partner')}>
            {partnerFormFields.map((field) => (
              <label key={field.id} htmlFor={`partner-${field.id}`}>
                {t(field.label)}
                <input id={`partner-${field.id}`} name={field.id} placeholder={t(field.placeholder)} required={field.required} maxLength={160} />
              </label>
            ))}
            <label htmlFor="partner-format">
              {t(copy.partnerFormatLabel)}
              <select id="partner-format" name="format" defaultValue={t(collaborationFormats)[0]}>
                {t(collaborationFormats).map((format) => <option key={format} value={format}>{format}</option>)}
              </select>
            </label>
            <button className="collab-primary-action" type="submit">{t(copy.partnerSubmit)}</button>
            <p className="collab-form-note">{t(openCallNote)}</p>
          </form>
          {submitted === 'partner' && <p className="collab-submit-result" aria-live="polite"><Check size={15} aria-hidden="true" />{t(copy.partnerSubmitted)}</p>}
        </div>
      </section>

      <section className="collab-open-calls" ref={openCallRef} aria-labelledby="collab-open-calls-heading">
        <div className="collab-section-heading">
          <div>
            <p className="collab-eyebrow">{t(copy.callsEyebrow)}</p>
            <h2 id="collab-open-calls-heading">{t(copy.callsHeading)}</h2>
          </div>
          <span>{t(copy.callsOpenCount)(openCalls.length)}</span>
        </div>

        <article className="collab-call-card">
          <div className="collab-call-topline">
            <span>{t(call.status)}</span>
            <b>{call.window}</b>
          </div>
          <h3>{t(call.title)}</h3>
          <p className="collab-call-line">{t(call.line)}</p>
        </article>

        <h3 className="collab-subheading">{t(copy.rolesHeading)}</h3>
        <div className="collab-roles">
          {openCallRoles.map((entry) => (
            <button
              className={`collab-role ${activeRole === entry.id ? 'is-active' : ''}`}
              key={entry.id}
              type="button"
              aria-pressed={activeRole === entry.id}
              onClick={() => pickRole(entry.id)}
            >
              <span className="collab-role-label">{t(entry.label)}</span>
              <span className="collab-role-line">{t(entry.line)}</span>
            </button>
          ))}
        </div>

        {role && (
          <div className="collab-form-block" ref={openCallFormRef} aria-live="polite">
            <p className="collab-eyebrow">{t(copy.applyEyebrow)(t(role.label))}</p>
            <h3 className="collab-form-title">{t(copy.applyTitle)(t(role.label))}</h3>
            <p className="collab-form-hint">{t(copy.callHint)(t(call.title), call.window)}</p>
            <form className="collab-form" onSubmit={(event) => handleSubmit(event, 'open-call')}>
              {openCallFields.map((field) => (
                <label key={field.id} htmlFor={`call-${field.id}`}>
                  {t(field.label)}
                  <input id={`call-${field.id}`} name={field.id} placeholder={t(field.placeholder)} required={field.required} maxLength={200} />
                </label>
              ))}
              <button className="collab-primary-action" type="submit">{t(copy.callsSubmit)}</button>
              <p className="collab-form-note">{t(openCallNote)}</p>
            </form>
            {submitted === 'open-call' && <p className="collab-submit-result" aria-live="polite"><Check size={15} aria-hidden="true" />{t(copy.callsSubmitted)}</p>}
          </div>
        )}

        {!role && (
          <p className="collab-roles-hint"><FlaskConical size={14} aria-hidden="true" />{t(copy.rolesHint)}</p>
        )}
        <p className="collab-disclosure">{t(copy.disclosure)}</p>
      </section>

      <div className="collab-footer-mark"><span>{t(copy.footerLines)[0]}</span><span>{t(copy.footerLines)[1]}</span></div>
    </div>
  )
}

export default CollaborateView
