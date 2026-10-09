import { ArrowUpRight, ImageOff, Mail } from 'lucide-react'
import {
  aboutDefinition,
  aboutPhotoSlots,
  aboutStatNote,
  aboutStats,
  aboutStoryLine,
  contactPurposes,
  worldBrands,
} from './data/about'
import { aboutCopy as copy } from './i18n/about'
import { useLocale } from './i18n/use-locale'
import './about.css'

function AboutView() {
  const { t } = useLocale()

  return (
    <div className="about-page">
      <div className="section-meta"><span>{t(copy.sectionMetaLeft)}</span><span>{t(copy.sectionMetaRight)}</span></div>

      <header className="about-heading">
        <div>
          {t(copy.coverEyebrow) && <p className="about-eyebrow"><span className="about-live-dot" /> {t(copy.coverEyebrow)}</p>}
          <h1>{t(copy.coverTitleLines)[0]}<br /><span>{t(copy.coverTitleLines)[1]}</span></h1>
        </div>
        <p className="about-heading-aside">{t(copy.headingAsideLines)[0]}<br />{t(copy.headingAsideLines)[1]}</p>
      </header>

      <section className="about-definition" aria-labelledby="about-definition-heading">
        <div className="about-section-heading">
          <div>
            <p className="about-eyebrow">{t(copy.definitionEyebrow)}</p>
            <h2 id="about-definition-heading">{t(copy.definitionHeading)}</h2>
          </div>
          <span>{t(copy.definitionBadge)}</span>
        </div>
        <p className="about-definition-line">{t(aboutDefinition.definition)}</p>
        <p className="about-definition-body">{t(aboutDefinition.body)}</p>
      </section>

      <section className="about-world" aria-label={t(copy.worldLabel)}>
        <div className="about-world-grid">
          {worldBrands.map((brand) => (
            <article className="about-brand" key={brand.id}>
              <p className="about-brand-verb">{t(brand.verb)}</p>
              <h3>{t(brand.name)}</h3>
              <p className="about-brand-line">{t(brand.line)}</p>
            </article>
          ))}
        </div>
        <p className="about-world-note">{t(copy.worldNote)}</p>
      </section>

      <section className="about-story" aria-labelledby="about-story-heading">
        <div className="about-section-heading">
          <div>
            <p className="about-eyebrow">{t(copy.storyEyebrow)}</p>
            <h2 id="about-story-heading">{t(copy.storyHeading)}</h2>
          </div>
          <span>{t(copy.storyBadge)}</span>
        </div>
        <dl className="about-stats">
          {aboutStats.map((stat) => (
            <div key={stat.id}>
              <dt>{t(stat.label)}</dt>
              <dd>{stat.value}</dd>
            </div>
          ))}
        </dl>
        <p className="about-stat-note">{t(aboutStatNote)}</p>

        <div className="about-photos" aria-label={t(copy.photosLabel)}>
          {t(aboutPhotoSlots).map((slot) => (
            <figure className="about-photo" key={slot}>
              <ImageOff size={16} aria-hidden="true" />
              <figcaption>{slot}<span>{t(copy.photoPending)}</span></figcaption>
            </figure>
          ))}
        </div>
        <p className="about-story-line">{t(aboutStoryLine)}</p>
      </section>

      <section className="about-contact" aria-labelledby="about-contact-heading">
        <div className="about-section-heading">
          <div>
            <p className="about-eyebrow">{t(copy.contactEyebrow)}</p>
            <h2 id="about-contact-heading">{t(copy.contactHeading)}</h2>
          </div>
          <span>{t(copy.contactBadge)}</span>
        </div>
        <div className="about-contact-grid">
          {contactPurposes.map((purpose) => (
            <article className="about-contact-card" key={purpose.id}>
              <h3>{t(purpose.title)}</h3>
              <p className="about-contact-line">{t(purpose.line)}</p>
              <ul>
                {purpose.channels.map((channel) => (
                  <li key={`${purpose.id}-${channel.id}`}>
                    {channel.href ? <ArrowUpRight size={13} aria-hidden="true" /> : <Mail size={13} aria-hidden="true" />}
                    <span className="about-channel-label">{t(channel.label)}</span>
                    {channel.href ? (
                      <a className="about-channel-value about-channel-link" href={channel.href} target="_blank" rel="noreferrer noopener">
                        {t(channel.value)}<ArrowUpRight size={12} aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="about-channel-value">{t(channel.value)}</span>
                    )}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="about-disclosure">{t(copy.disclosure)}</p>
      </section>

      <div className="about-footer-mark"><span>AS WE WANDER, WE BECOME.</span><span><a href="#top">{t(copy.backToTop)} <ArrowUpRight size={12} aria-hidden="true" /></a></span></div>
    </div>
  )
}

export default AboutView
