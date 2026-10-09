import { useState } from 'react'
import { ArrowUpRight, Compass } from 'lucide-react'
import { contentMeta, contentNote, contentTopics } from './data/content'
import { themeFeatured } from './data/theme'
import { contentCopy as copy } from './i18n/content'
import { useLocale } from './i18n/use-locale'
import './content.css'

// HOME › CONTENT：UNSEEN｜暗盒，介绍内容与洞察层的范围与定位，并汇总本月「特别推荐」的文章占位。
export function ContentView() {
  const { t } = useLocale()
  const [notice, setNotice] = useState('')

  return (
    <section className="content-view" aria-labelledby="content-title">
      <div className="section-meta"><span>{t(copy.sectionMetaLeft)}</span><span>{t(copy.sectionMetaRight)}</span></div>

      <div className="content-heading">
        <div>
          <p className="content-eyebrow"><span className="content-dot" />{t(contentMeta.kicker)} &gt;</p>
          <h2 id="content-title">{t(contentMeta.title)}</h2>
        </div>
      </div>

      <section className="content-featured-section" aria-labelledby="content-featured-heading">
        <div className="content-section-heading">
          <div>
            <p className="content-eyebrow">{t(copy.featuredEyebrow)}</p>
            <h3 id="content-featured-heading">{t(themeFeatured.title)}</h3>
          </div>
          <span>{t(copy.formsCount)(themeFeatured.items.length)}</span>
        </div>
        <p className="content-featured-line">{t(themeFeatured.line)}</p>
        <div className="content-featured-grid">
          {themeFeatured.items.map((item) => (
            <article className="content-featured-item" key={item.id}>
              <img className="content-featured-image" src={item.image} alt="" aria-hidden="true" />
              <div className="content-featured-body">
                <h4>{t(item.label)}</h4>
                <ul className="content-article-list">
                  {item.articles.map((article) => (
                    <li key={article.id}>
                      <span>{article.meta}</span>
                      <p>{t(article.title)}</p>
                    </li>
                  ))}
                </ul>
                <button
                  className="content-more"
                  type="button"
                  onClick={() => setNotice(t(copy.articleNotice)(t(item.label)))}
                >
                  {t(copy.moreLabel)(t(item.label))}
                  <ArrowUpRight size={13} aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
        {notice ? <p className="content-status" role="status">{notice}</p> : null}
        <p className="content-note-inline">{t(themeFeatured.articleNoteContent)}</p>
        <p className="content-note-inline">{t(themeFeatured.shotNote)}</p>
      </section>

      <section className="content-topics-section" aria-labelledby="content-topics-heading">
        <div className="content-section-heading">
          <div>
            <p className="content-eyebrow">{t(copy.topicsEyebrow)}</p>
            <h3 id="content-topics-heading">{t(contentTopics.label)}</h3>
          </div>
          <span>{t(copy.topicsCount)(contentTopics.items.length)}</span>
        </div>
        <ol className="content-topics">
          {contentTopics.items.map((topic, index) => (
            <li className="content-topic" key={topic.id}>
              <span className="content-topic-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="content-topic-name">{t(topic.label)}</span>
            </li>
          ))}
        </ol>
        <p className="content-note-inline">{t(contentTopics.note)}</p>
      </section>

      <p className="content-note">{t(contentNote)}</p>
      <div className="content-footer-mark">
        <span>{t(copy.footerMark)}</span>
        <span><Compass size={13} aria-hidden="true" />REVERIE / SHANGHAI</span>
      </div>
    </section>
  )
}

export default ContentView
