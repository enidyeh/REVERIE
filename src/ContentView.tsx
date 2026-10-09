import { useState } from 'react'
import { ArrowUpRight, Compass } from 'lucide-react'
import { contentMeta, contentNote, contentTopics } from './data/content'
import { themeFeatured } from './data/theme'
import './content.css'

// HOME › CONTENT：UNSEEN｜暗盒，介绍内容与洞察层的范围与定位，并汇总本月「特别推荐」的文章占位。
export function ContentView() {
  const [notice, setNotice] = useState('')

  return (
    <section className="content-view" aria-labelledby="content-title">
      <div className="section-meta"><span>CONTENT / EDITORIAL</span><span>UNSEEN · 暗盒</span></div>

      <div className="content-heading">
        <div>
          <p className="content-eyebrow"><span className="content-dot" />{contentMeta.kicker} &gt;</p>
          <h2 id="content-title">{contentMeta.title}</h2>
          <p className="content-title-en">{contentMeta.titleEn}</p>
        </div>
      </div>

      <section className="content-featured-section" aria-labelledby="content-featured-heading">
        <div className="content-section-heading">
          <div>
            <p className="content-eyebrow">01 / {themeFeatured.label}</p>
            <h3 id="content-featured-heading">{themeFeatured.title}</h3>
          </div>
          <span>{themeFeatured.items.length.toString().padStart(2, '0')} FORMS</span>
        </div>
        <p className="content-featured-line">{themeFeatured.line}</p>
        <div className="content-featured-grid">
          {themeFeatured.items.map((item) => (
            <article className="content-featured-item" key={item.id}>
              <img className="content-featured-image" src={item.image} alt="" aria-hidden="true" />
              <div className="content-featured-body">
                <h4>{item.en}｜{item.zh}</h4>
                <ul className="content-article-list">
                  {item.articles.map((article) => (
                    <li key={article.id}>
                      <span>{article.meta}</span>
                      <p>{article.title}</p>
                    </li>
                  ))}
                </ul>
                <button
                  className="content-more"
                  type="button"
                  onClick={() => setNotice(`演示：文章详情页尚未接入，「${item.zh}」的更多文章会在这里展开`)}
                >
                  {themeFeatured.moreLabel}「{item.zh}」
                  <ArrowUpRight size={13} aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
        {notice ? <p className="content-status" role="status">{notice}</p> : null}
        <p className="content-note-inline">{themeFeatured.articleNoteContent}</p>
        <p className="content-note-inline">{themeFeatured.shotNote}</p>
      </section>

      <section className="content-topics-section" aria-labelledby="content-topics-heading">
        <div className="content-section-heading">
          <div>
            <p className="content-eyebrow">02 / {contentTopics.eyebrow}</p>
            <h3 id="content-topics-heading">{contentTopics.label}</h3>
          </div>
          <span>{contentTopics.items.length.toString().padStart(2, '0')} TOPICS</span>
        </div>
        <ol className="content-topics">
          {contentTopics.items.map((topic, index) => (
            <li className="content-topic" key={topic}>
              <span className="content-topic-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="content-topic-name">{topic}</span>
            </li>
          ))}
        </ol>
        <p className="content-note-inline">{contentTopics.note}</p>
      </section>

      <p className="content-note">{contentNote}</p>
      <div className="content-footer-mark">
        <span>UNSEEN｜暗盒 · CONTENT</span>
        <span><Compass size={13} aria-hidden="true" />REVERIE / SHANGHAI</span>
      </div>
    </section>
  )
}

export default ContentView
