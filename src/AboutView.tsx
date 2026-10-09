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
import './about.css'

function AboutView() {
  return (
    <div className="about-page">
      <div className="section-meta"><span>ABOUT / 关于异想</span><span>STORY / CONTACT</span></div>

      <header className="about-heading">
        <div>
          <p className="about-eyebrow"><span className="about-live-dot" /> KNOW WHO WE ARE</p>
          <h1>我们是谁，<br /><span>以及为什么。</span></h1>
        </div>
        <p className="about-heading-aside">不为了转化，<br />只为了让你知道我们在做什么。</p>
      </header>

      <section className="about-definition" aria-labelledby="about-definition-heading">
        <div className="about-section-heading">
          <div>
            <p className="about-eyebrow">01 / ABOUT REVERIE</p>
            <h2 id="about-definition-heading">一句话定义。</h2>
          </div>
          <span>WHO WE ARE</span>
        </div>
        <p className="about-definition-en">{aboutDefinition.en}</p>
        <p className="about-definition-zh">{aboutDefinition.zh}</p>
        <p className="about-definition-body">{aboutDefinition.body}</p>
      </section>

      <section className="about-world" aria-label="四个名字，一个世界">
        <div className="about-world-grid">
          {worldBrands.map((brand) => (
            <article className="about-brand" key={brand.id}>
              <p className="about-brand-verb">{brand.verb}</p>
              <h3>{brand.nameEn}</h3>
              <p className="about-brand-zh">{brand.nameZh} · {brand.verbZh}</p>
              <p className="about-brand-line">{brand.line}</p>
            </article>
          ))}
        </div>
        <p className="about-world-note">异想集、暗盒、异想商店与域见属于同一个体系，分别负责体验、内容、选品与服务。</p>
      </section>

      <section className="about-story" aria-labelledby="about-story-heading">
        <div className="about-section-heading">
          <div>
            <p className="about-eyebrow">02 / OUR STORY</p>
            <h2 id="about-story-heading">做过的事。</h2>
          </div>
          <span>WHAT WE'VE DONE</span>
        </div>
        <dl className="about-stats">
          {aboutStats.map((stat) => (
            <div key={stat.id}>
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
            </div>
          ))}
        </dl>
        <p className="about-stat-note">{aboutStatNote}</p>

        <div className="about-photos" aria-label="往期活动现场">
          {aboutPhotoSlots.map((slot) => (
            <figure className="about-photo" key={slot}>
              <ImageOff size={16} aria-hidden="true" />
              <figcaption>{slot}<span>照片待项目方提供</span></figcaption>
            </figure>
          ))}
        </div>
        <p className="about-story-line">{aboutStoryLine}</p>
      </section>

      <section className="about-contact" aria-labelledby="about-contact-heading">
        <div className="about-section-heading">
          <div>
            <p className="about-eyebrow">03 / CONTACT</p>
            <h2 id="about-contact-heading">按用途找我们。</h2>
          </div>
          <span>CONTACT</span>
        </div>
        <div className="about-contact-grid">
          {contactPurposes.map((purpose) => (
            <article className="about-contact-card" key={purpose.id}>
              <p className="about-contact-en">{purpose.en}</p>
              <h3>{purpose.zh}</h3>
              <p className="about-contact-line">{purpose.line}</p>
              <ul>
                {purpose.channels.map((channel) => (
                  <li key={`${purpose.id}-${channel.id}`}>
                    {channel.href ? <ArrowUpRight size={13} aria-hidden="true" /> : <Mail size={13} aria-hidden="true" />}
                    <span className="about-channel-label">{channel.label}</span>
                    {channel.href ? (
                      <a className="about-channel-value about-channel-link" href={channel.href} target="_blank" rel="noreferrer noopener">
                        {channel.value}<ArrowUpRight size={12} aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="about-channel-value">{channel.value}</span>
                    )}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="about-disclosure">除已确认的 REVERIE 小红书账号（新窗口打开）外，其余联系方式与活动照片尚未提供，页面以占位说明展示，没有填入任何虚构的账号或邮箱。统计数据由项目方提供，正式发布前需要核实。</p>
      </section>

      <div className="about-footer-mark"><span>AS WE WANDER, WE BECOME.</span><span><a href="#top">回到页首 <ArrowUpRight size={12} aria-hidden="true" /></a></span></div>
    </div>
  )
}

export default AboutView
