import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Check, RefreshCw, Sparkles, Ticket } from 'lucide-react'
import {
  themeBrands,
  themeChallenge,
  themeCreators,
  themeDuality,
  themeFeatured,
  themeMapGroups,
  themeMapPlan,
  themeShopCta,
  themeMeta,
  themeQuiz,
  themeResults,
  themeRituals,
  themeSchedule,
  themeScheduleDays,
  themeScheduleNote,
} from './data/theme'
import { BookingFlow } from './components/BookingFlow'
import { themeAnnouncements, themeCopy as copy } from './i18n/discover'
import { useLocale } from './i18n/use-locale'
import { useLocalized } from './i18n/use-localized'
import './theme.css'

const storageKey = 'unseen:theme:v1'

type TabId = 'events' | 'quiz' | 'map'
type MapGroupId = 'brands' | 'creators'

const themeTabs: { id: TabId; index: string }[] = [
  { id: 'events', index: '01' },
  { id: 'map', index: '02' },
  { id: 'quiz', index: '03' },
]

// 数据模块保持单一数据源，这里按当前语言解析一次，视图里拿到的都是单语值。
const themeContent = {
  meta: themeMeta,
  duality: themeDuality,
  rituals: themeRituals,
  schedule: themeSchedule,
  scheduleNote: themeScheduleNote,
  quiz: themeQuiz,
  results: themeResults,
  challenge: themeChallenge,
  featured: themeFeatured,
  mapPlan: themeMapPlan,
  mapGroups: themeMapGroups,
  brands: themeBrands,
  creators: themeCreators,
  shopCta: themeShopCta,
}

type QuizPicks = Record<string, string[]>

type ThemeState = {
  quizPicks: QuizPicks
  quizLocked: boolean
  challengeAccepted: boolean
  challengeDone: boolean
  exampleIndex: number
  bookedActivities: string[]
  dreamerName: string
}

const emptyState: ThemeState = {
  quizPicks: {},
  quizLocked: false,
  challengeAccepted: false,
  challengeDone: false,
  exampleIndex: 0,
  bookedActivities: [],
  dreamerName: '',
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function loadThemeState(): ThemeState {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
    if (!isRecord(saved)) return emptyState

    const quizPicks: QuizPicks = {}
    if (isRecord(saved.quizPicks)) {
      for (const question of themeQuiz) {
        const picked = saved.quizPicks[question.id]
        if (!Array.isArray(picked)) continue
        const optionIds = new Set(question.options.map((option) => option.id))
        quizPicks[question.id] = picked.filter((id): id is string => typeof id === 'string' && optionIds.has(id))
      }
    }

    return {
      quizPicks,
      quizLocked: saved.quizLocked === true,
      challengeAccepted: saved.challengeAccepted === true,
      challengeDone: saved.challengeDone === true,
      exampleIndex: typeof saved.exampleIndex === 'number' && Number.isInteger(saved.exampleIndex) && saved.exampleIndex >= 0 && saved.exampleIndex < themeChallenge.examples.zh.length ? saved.exampleIndex : 0,
      bookedActivities: Array.isArray(saved.bookedActivities) ? saved.bookedActivities.filter((id): id is string => typeof id === 'string' && themeSchedule.some((activity) => activity.id === id)) : [],
      dreamerName: typeof saved.dreamerName === 'string' && saved.dreamerName.trim() ? saved.dreamerName.slice(0, 18) : emptyState.dreamerName,
    }
  } catch {
    return emptyState
  }
}

function resolveResult(picks: QuizPicks) {
  let fantasy = 0
  let flip = 0
  for (const question of themeQuiz) {
    const selected = new Set(picks[question.id] ?? [])
    for (const option of question.options) {
      if (!selected.has(option.id)) continue
      if (option.leansTo === 'fantasy') fantasy += 1
      else flip += 1
    }
  }
  const outcome = fantasy >= flip ? ('fantasy' as const) : ('flip' as const)
  return { fantasy, flip, outcome }
}

function scrollToSection(node: HTMLElement | null, offset = 0) {
  if (!node) return
  const top = window.scrollY + node.getBoundingClientRect().top - offset
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: Math.max(top, 0), behavior: reduced ? 'auto' : 'smooth' })
}

// 粘顶的品牌行 + 主导航行会遮住视口上方，滚动落点与高亮判定都要把它算进去（移动端主航栏隐藏，高度为 0）。
function topBarHeight() {
  const header = document.querySelector('.app-header')?.getBoundingClientRect().height ?? 0
  const nav = document.querySelector('.main-nav')?.getBoundingClientRect().height ?? 0
  return header + nav
}

function MonthlyThemeView({ onOpenShop, onOpenTickets, onOpenContent }: { onOpenShop: () => void; onOpenTickets: () => void; onOpenContent: () => void }) {
  const { t } = useLocale()
  const theme = useLocalized(themeContent)
  const [state, setState] = useState<ThemeState>(() => loadThemeState())
  const [announcement, setAnnouncement] = useState('')
  // 购票弹层：登录 → 付款 → 得到票，均为本地演示。
  const [bookingOpen, setBookingOpen] = useState(false)
  // 当前高亮的板块由滚动位置推导，不写入本地存储。
  const [activeTab, setActiveTab] = useState<TabId>('events')
  // 梦境地图的两个入口只是界面状态，不写入本地存储。
  const [mapGroup, setMapGroup] = useState<MapGroupId>('brands')
  // 当天活动表：默认看第一天。
  const [scheduleDay, setScheduleDay] = useState<string>(themeScheduleDays[0])
  // 本期特别推荐的轮播：当前张与是否暂停（悬停 / 聚焦时暂停）。
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [featuredPaused, setFeaturedPaused] = useState(false)
  // 24H 任务的「去发布」渠道选择：只是界面状态，不写入存储。
  const [publishOpen, setPublishOpen] = useState(false)
  const tabsRef = useRef<HTMLElement | null>(null)
  const eventsRef = useRef<HTMLElement | null>(null)
  const quizRef = useRef<HTMLElement | null>(null)
  const mapRef = useRef<HTMLElement | null>(null)
  const challengeRef = useRef<HTMLElement | null>(null)
  const featuredRef = useRef<HTMLDivElement | null>(null)
  const bookButtonRef = useRef<HTMLButtonElement | null>(null)
  const tabRefs = { events: eventsRef, quiz: quizRef, map: mapRef }
  const pendingScrollRef = useRef<HTMLElement | null>(null)
  const suppressSpyUntilRef = useRef(0)
  const tabBarOffset = () => topBarHeight() + (tabsRef.current?.getBoundingClientRect().height ?? 0) + 12

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } catch {
      // 本地存储不可用时静默跳过，页面仍可继续操作。
    }
  }, [state])

  // 点击「看我的梦境结果」后，等兔子洞任务里的结果渲染完再滚过去。
  useEffect(() => {
    const target = pendingScrollRef.current
    if (!target) return
    pendingScrollRef.current = null
    suppressSpyUntilRef.current = Date.now() + 900
    scrollToSection(target, tabBarOffset())
  }, [state])

  // 滚动时高亮当前所在板块，作为长页的定位反馈。
  useEffect(() => {
    const handler = () => {
      if (Date.now() < suppressSpyUntilRef.current) return
      const line = topBarHeight() + (tabsRef.current?.getBoundingClientRect().height ?? 0) + 24
      let next: TabId = 'events'
      if (eventsRef.current && eventsRef.current.getBoundingClientRect().top <= line) next = 'events'
      if (mapRef.current && mapRef.current.getBoundingClientRect().top <= line) next = 'map'
      if (quizRef.current && quizRef.current.getBoundingClientRect().top <= line) next = 'quiz'
      setActiveTab((current) => (current === next ? current : next))
    }
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('scroll', handler)
      window.removeEventListener('resize', handler)
    }
  }, [])

  // 本期特别推荐：每 4.5 秒换一张，仅在区块可见时轮播；不轮播的情况包括用户悬停/聚焦，以及系统开启减少动态效果。
  useEffect(() => {
    if (featuredPaused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const node = featuredRef.current
    if (!node) return
    let visible = false
    const observer = new IntersectionObserver((entries) => { visible = entries[0]?.isIntersecting ?? false }, { threshold: .35 })
    observer.observe(node)
    const timer = window.setInterval(() => {
      if (!visible) return
      setFeaturedIndex((current) => (current + 1) % themeFeatured.items.length)
    }, 4500)
    return () => {
      observer.disconnect()
      window.clearInterval(timer)
    }
  }, [featuredPaused])

  const answered = themeQuiz.filter((question) => (state.quizPicks[question.id] ?? []).length > 0).length
  const resolved = resolveResult(state.quizPicks)
  const outcome = resolved.outcome === 'fantasy' ? theme.results.fantasy : theme.results.flip
  const dayActivities = theme.schedule.filter((activity) => activity.day === scheduleDay)

  function toggleOption(questionId: string, optionId: string) {
    setState((current) => {
      if (current.quizLocked) return current
      const selected = current.quizPicks[questionId] ?? []
      const next = selected.includes(optionId) ? selected.filter((id) => id !== optionId) : [...selected, optionId]
      return { ...current, quizPicks: { ...current.quizPicks, [questionId]: next } }
    })
  }

  return (
    <div className="theme-page">
      <section className="theme-hero" aria-labelledby="theme-title">
        <img className="theme-hero-image" src={theme.meta.heroImage} alt={theme.meta.heroImageAlt} />
        <div className="theme-hero-shade" aria-hidden="true" />
        <div className="theme-hero-inner">
          <p className="theme-series">{theme.meta.series}</p>
          <h1 id="theme-title">
            {theme.meta.titleLines.length > 1
              ? theme.meta.titleLines.map((line, index) => (index < theme.meta.titleLines.length - 1 ? `${line} ` : <span key={line}>{line}</span>))
              : theme.meta.titleLines[0]}
          </h1>
          <div className="theme-hero-book">
            <button className="theme-primary-action" type="button" ref={bookButtonRef} onClick={() => setBookingOpen(true)}>
              <Ticket size={15} aria-hidden="true" />{t(copy.book)}
            </button>
          </div>
          <div className="theme-hero-entry">
            <div className="theme-hero-when">
              <div>
                <span>{t(copy.entryDate)}</span>
                <p>{theme.meta.window}</p>
              </div>
              <div>
                <span>{t(copy.location)}</span>
                <p>{theme.meta.city}</p>
              </div>
            </div>
          </div>
          <p className="theme-hero-line">{theme.meta.heroLine}</p>
        </div>
      </section>

      <nav className="theme-tabs" ref={tabsRef} aria-label={t(copy.tabsNav)}>
        <div className="theme-tabs-inner">
          {themeTabs.map((tab) => (
            <a
              className={`theme-tab ${activeTab === tab.id ? 'is-active' : ''}`}
              href={`#theme-block-${tab.id}`}
              key={tab.id}
              aria-current={activeTab === tab.id ? 'true' : undefined}
              onClick={(event) => {
                event.preventDefault()
                suppressSpyUntilRef.current = Date.now() + 900
                setActiveTab(tab.id)
                scrollToSection(tabRefs[tab.id].current, tabBarOffset())
              }}
            >
              <span className="theme-tab-top"><b>{tab.index}</b>{t(copy.tabs[tab.id])}</span>
            </a>
          ))}
        </div>
      </nav>

      <section className="theme-duality" id="theme-block-events" ref={eventsRef} aria-label={t(copy.dualityLabel)}>
        <figure className="theme-duality-side">
          <img src={theme.meta.sweetImage} alt={theme.meta.sweetImageAlt} />
          <figcaption>
            <span>{theme.duality.sweet.label}</span>
            <dl className="theme-duality-keys">
              <div>
                <dt>{t(copy.dressCode)}</dt>
                <dd>{theme.duality.sweet.dressCode}</dd>
              </div>
              <div>
                <dt>{t(copy.scene)}</dt>
                <dd>{theme.duality.sweet.scene}</dd>
              </div>
            </dl>
          </figcaption>
        </figure>
        <figure className="theme-duality-side">
          <img src={theme.meta.darkImage} alt={theme.meta.darkImageAlt} />
          <figcaption>
            <span>{theme.duality.dark.label}</span>
            <dl className="theme-duality-keys">
              <div>
                <dt>{t(copy.dressCode)}</dt>
                <dd>{theme.duality.dark.dressCode}</dd>
              </div>
              <div>
                <dt>{t(copy.scene)}</dt>
                <dd>{theme.duality.dark.scene}</dd>
              </div>
            </dl>
          </figcaption>
        </figure>
      </section>

      <section className="theme-rituals" aria-labelledby="theme-rituals-heading">
        <div className="theme-section-heading">
          <div>
            {t(copy.rituals.eyebrow) && <p className="theme-eyebrow">{t(copy.rituals.eyebrow)}</p>}
            <h2 id="theme-rituals-heading">{t(copy.rituals.heading)}</h2>
          </div>
          <span>{t(copy.rituals.count)(theme.rituals.length)}</span>
        </div>
        <div className="theme-ritual-grid">
          {theme.rituals.map((ritual) => (
            <article className="theme-ritual" key={ritual.id}>
              <div className="theme-ritual-topline"><span>{ritual.index}</span><b>{ritual.kind}</b></div>
              <h3>{ritual.name}</h3>
              {ritual.line && <p className="theme-ritual-line">{ritual.line}</p>}
            </article>
          ))}
        </div>
        <p className="theme-disclosure">{t(copy.rituals.disclosure)}</p>
      </section>

      <section className="theme-schedule" aria-labelledby="theme-schedule-heading">
        <div className="theme-section-heading">
          <div>
            {t(copy.schedule.eyebrow) && <p className="theme-eyebrow">{t(copy.schedule.eyebrow)}</p>}
            <h2 id="theme-schedule-heading">{t(copy.schedule.heading)}</h2>
          </div>
          <span>{t(copy.schedule.count)(dayActivities.length)}</span>
        </div>
        <div className="theme-schedule-days" role="group" aria-label={t(copy.schedule.dayGroupLabel)}>
          {themeScheduleDays.map((day) => (
            <button
              className={`theme-day-tab ${scheduleDay === day ? 'is-active' : ''}`}
              key={day}
              type="button"
              aria-pressed={scheduleDay === day}
              onClick={() => setScheduleDay(day)}
            >
              <b>{day}</b>
              <span>{t(copy.schedule.dayCount)(theme.schedule.filter((activity) => activity.day === day).length)}</span>
            </button>
          ))}
        </div>
        <div className="theme-schedule-list">
          {dayActivities.map((activity) => {
            const booked = state.bookedActivities.includes(activity.id)
            return (
              <article className={`theme-schedule-item ${booked ? 'is-booked' : ''}`} key={activity.id}>
                <div className="theme-schedule-when">
                  <span>{activity.day}</span>
                  <b>{activity.time}</b>
                </div>
                <div className="theme-schedule-body">
                  <p className="theme-schedule-kind">{activity.kind} · {activity.seats}</p>
                  <h3>{activity.name}</h3>
                  <p className="theme-schedule-line">{activity.line}</p>
                </div>
                <button
                  className={`theme-secondary-action ${booked ? 'is-booked' : ''}`}
                  type="button"
                  aria-pressed={booked}
                  onClick={() => {
                    setState((current) => ({
                      ...current,
                      bookedActivities: current.bookedActivities.includes(activity.id)
                        ? current.bookedActivities.filter((id) => id !== activity.id)
                        : [...current.bookedActivities, activity.id],
                    }))
                    setAnnouncement(booked ? t(themeAnnouncements.cancelled)(activity.name) : t(themeAnnouncements.reserved)(activity.name))
                  }}
                >
                  {booked ? <><Check size={14} aria-hidden="true" />{t(copy.schedule.reserved)}</> : <>{t(copy.schedule.reserve)}</>}
                </button>
              </article>
            )
          })}
        </div>
        <p className="theme-disclosure">{theme.scheduleNote}</p>
      </section>

      <section className="theme-dreammap" id="theme-block-map" ref={mapRef} aria-labelledby="theme-dreammap-heading">
        <div className="theme-section-heading">
          <div>
            {t(copy.dreamMap.eyebrow) && <p className="theme-eyebrow">{t(copy.dreamMap.eyebrow)}</p>}
            <h2 id="theme-dreammap-heading">{t(copy.dreamMap.heading)}</h2>
          </div>
          <span>{t(copy.dreamMap.count)(theme.mapGroups.length)}</span>
        </div>

        <div
          className="theme-featured"
          ref={featuredRef}
          onMouseEnter={() => setFeaturedPaused(true)}
          onMouseLeave={() => setFeaturedPaused(false)}
          onFocus={() => setFeaturedPaused(true)}
          onBlur={() => setFeaturedPaused(false)}
        >
          <div className="theme-featured-text">
            <h3>{theme.featured.title}</h3>
            <p className="theme-featured-line">{theme.featured.line}</p>
            <ul className="theme-featured-list">
              {theme.featured.items.map((item, index) => (
                <li key={item.id}>
                  <button
                    className={`theme-featured-tag ${index === featuredIndex ? 'is-active' : ''}`}
                    type="button"
                    aria-current={index === featuredIndex ? 'true' : undefined}
                    onClick={() => setFeaturedIndex(index)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="theme-featured-articles">
              <button
                className="theme-article-more"
                type="button"
                onClick={onOpenContent}
              >
                {theme.featured.entryLabel}
                <ArrowUpRight size={13} aria-hidden="true" />
              </button>
              <p className="theme-article-note">{theme.featured.articleNote}</p>
            </div>
          </div>

          <figure className="theme-featured-carousel">
            <img
              alt=""
              aria-hidden="true"
              key={themeFeatured.items[featuredIndex].id}
              src={themeFeatured.items[featuredIndex].image}
            />
            <figcaption>
              <b>{theme.featured.items[featuredIndex].label}</b>
              <span>{String(featuredIndex + 1).padStart(2, '0')} / {String(theme.featured.items.length).padStart(2, '0')}</span>
            </figcaption>
          </figure>

          <p className="theme-featured-shot-note">{theme.featured.shotNote}</p>
        </div>

        <figure className="theme-map-plan">
          <div className="theme-map-plan-frame" aria-hidden="true">
            <span>2F</span>
            <span>3F</span>
          </div>
          <figcaption>
            <b>{theme.mapPlan.title}</b>
            <p>{theme.mapPlan.note}</p>
          </figcaption>
        </figure>

        <p className="theme-disclosure">{t(copy.dreamMap.disclosure)}</p>

        <div className="theme-map-groups">
          {theme.mapGroups.map((group) => (
            <button
              className={`theme-map-group ${mapGroup === group.id ? 'is-active' : ''}`}
              key={group.id}
              type="button"
              aria-pressed={mapGroup === group.id}
              onClick={() => setMapGroup(group.id)}
            >
              <span className="theme-map-group-top"><b>{group.index}</b>{group.token}<em>{group.count}</em></span>
              <span className="theme-map-group-label">{group.label}</span>
              <span className="theme-map-group-desc">{group.desc}</span>
            </button>
          ))}
        </div>

        {mapGroup === 'brands' && (
          <div className="theme-wonderlist-list">
            {theme.brands.map((brand) => (
              <article className="theme-wonder-item" key={brand.id}>
                <span className="theme-wonder-index">{brand.index}</span>
                <div>
                  <h4>{brand.name}{brand.handle && <em>{brand.handle}</em>}</h4>
                  <p>{brand.line}</p>
                  <p className="theme-wonder-meta">{brand.booth}</p>
                  {brand.link
                    ? <a href={brand.link.href} target="_blank" rel="noreferrer noopener">{brand.link.label} <ArrowUpRight size={12} aria-hidden="true" /></a>
                    : <p className="theme-wonder-meta">{brand.handle ? t(copy.dreamMap.socialPending) : t(copy.dreamMap.brandPending)}</p>}
                </div>
              </article>
            ))}
          </div>
        )}

        {mapGroup === 'creators' && (
          <div className="theme-wonderlist-list">
            {theme.creators.map((creator) => (
              <article className="theme-wonder-item" key={creator.id}>
                <span className="theme-wonder-index">{creator.index}</span>
                <div>
                  <h4>{creator.name}<em>{creator.field}</em></h4>
                  <p>{creator.line}</p>
                  {creator.link && <a href={creator.link.href} target="_blank" rel="noreferrer noopener">{creator.link.label} <ArrowUpRight size={12} aria-hidden="true" /></a>}
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="theme-shop-entry">
          <button className="theme-shop-link" type="button" onClick={onOpenShop}>
            {theme.shopCta.label}
            <ArrowUpRight size={14} aria-hidden="true" />
          </button>
          <span>{theme.shopCta.note}</span>
        </div>
      </section>

      <section className="theme-quiz" id="theme-block-quiz" ref={quizRef} aria-labelledby="theme-quiz-heading">
        <div className="theme-section-heading">
          <div>
            {t(copy.quiz.eyebrow) && <p className="theme-eyebrow">{t(copy.quiz.eyebrow)}</p>}
            <h2 id="theme-quiz-heading">{t(copy.quiz.heading)}</h2>
          </div>
          <span>{t(copy.quiz.answered)(answered, themeQuiz.length)}</span>
        </div>
        <div className="theme-quiz-list">
          {theme.quiz.map((question) => (
            <fieldset className="theme-question" key={question.id}>
              <legend><span>{question.index}</span>{question.prompt}</legend>
              <div className="theme-options">
                {question.options.map((option) => {
                  const checked = (state.quizPicks[question.id] ?? []).includes(option.id)
                  return (
                    <label className={`theme-option ${checked ? 'is-picked' : ''}`} key={option.id}>
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={state.quizLocked}
                        onChange={() => toggleOption(question.id, option.id)}
                      />
                      <span>{option.label}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          ))}
        </div>
        <div className="theme-quiz-actions">
          <button
            className="theme-primary-action"
            type="button"
            disabled={answered < themeQuiz.length}
            onClick={() => {
              pendingScrollRef.current = challengeRef.current
              setState((current) => ({ ...current, quizLocked: true }))
              setAnnouncement(t(themeAnnouncements.resultReady))
            }}
          >
            <Sparkles size={15} aria-hidden="true" />{t(copy.quiz.seeResult)}
          </button>
          {state.quizLocked && (
            <button className="theme-secondary-action" type="button" onClick={() => { setState((current) => ({ ...current, quizLocked: false })); setAnnouncement(t(themeAnnouncements.chooseAgain)) }}>
              <RefreshCw size={14} aria-hidden="true" />{t(copy.quiz.again)}
            </button>
          )}
        </div>
      </section>

      <section className="theme-challenge" ref={challengeRef} aria-labelledby="theme-challenge-heading">
        <img className="theme-challenge-image" src={theme.meta.rabbitImage} alt={theme.meta.rabbitImageAlt} />
        <div className="theme-challenge-body">
          {t(copy.challenge.eyebrow) && <p className="theme-eyebrow">{t(copy.challenge.eyebrow)}</p>}
          <h2 id="theme-challenge-heading">{theme.challenge.title}</h2>
          <div className="theme-result">
            <div className="theme-result-topline">
              <span className="theme-result-label">{t(copy.challenge.resultLabel)}</span>
              {state.quizLocked && <b className="theme-result-score">{t(copy.challenge.score)(outcome.index, resolved.fantasy, resolved.flip)}</b>}
            </div>
            {state.quizLocked ? (
              <>
                <h3>{outcome.name}</h3>
                {outcome.lines.map((line) => <p className="theme-result-line" key={line}>{line}</p>)}
              </>
            ) : (
              <p className="theme-result-placeholder">{t(copy.challenge.placeholder)}</p>
            )}
          </div>
          {state.quizLocked && (
            <>
              <p className="theme-challenge-brief">{theme.challenge.brief}</p>
              <div className="theme-challenge-example">
                <p>{theme.challenge.examples[state.exampleIndex]}</p>
                <button
                  className="theme-secondary-action"
                  type="button"
                  onClick={() => {
                    setState((current) => ({ ...current, exampleIndex: (current.exampleIndex + 1) % theme.challenge.examples.length }))
                    setAnnouncement(t(themeAnnouncements.newExample))
                  }}
                >
                  <RefreshCw size={14} aria-hidden="true" />{t(copy.challenge.shuffle)}
                </button>
              </div>
            </>
          )}
          <div className="theme-challenge-how">
            <span>{t(copy.challenge.howToLabel)}</span>
            <p>{theme.challenge.howTo.join(' ＋ ')}</p>
            <p className="theme-challenge-tags">{theme.challenge.hashtags.join(' ')}</p>
            <p className="theme-challenge-boundary">{theme.challenge.boundary}</p>
          </div>
          <div className="theme-challenge-actions">
            {!state.challengeAccepted ? (
              <button className="theme-primary-action" type="button" onClick={() => { setState((current) => ({ ...current, challengeAccepted: true })); setAnnouncement(t(themeAnnouncements.accepted)) }}>
                {t(copy.challenge.accept)}
              </button>
            ) : (
              <button className="theme-primary-action" type="button" onClick={() => { setPublishOpen((open) => !open); setAnnouncement(t(themeAnnouncements.chooseChannel)) }}>
                <ArrowUpRight size={15} aria-hidden="true" />{theme.challenge.publishLabel}
              </button>
            )}
            <span className="theme-challenge-status">
              {state.challengeDone ? t(copy.challenge.statusDone) : state.challengeAccepted ? t(copy.challenge.statusInProgress) : t(copy.challenge.statusNew)}
            </span>
          </div>
          {publishOpen && (
            <div className="theme-publish">
              <p className="theme-publish-label">{t(copy.challenge.publishTo)}</p>
              <div className="theme-publish-targets">
                {theme.challenge.publishTargets.map((target) => {
                  const done = () => {
                    setPublishOpen(false)
                    setState((current) => ({ ...current, challengeDone: true }))
                  }
                  // 有真实账号链接的（小红书）按外链打开；其余渠道只给演示提示，不自编地址。
                  if (target.href) {
                    return (
                      <a
                        className="theme-publish-target"
                        key={target.id}
                        href={target.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        onClick={() => {
                          done()
                          setAnnouncement(t(themeAnnouncements.opened)(target.name))
                        }}
                      >
                        {target.name}
                        <ArrowUpRight size={13} aria-hidden="true" />
                      </a>
                    )
                  }
                  return (
                    <button
                      className="theme-publish-target"
                      type="button"
                      key={target.id}
                      onClick={() => {
                        done()
                        setAnnouncement(t(themeAnnouncements.unsupported)(target.name))
                      }}
                    >
                      {target.name}
                      <span className="theme-publish-target-note">{t(copy.challenge.linkPending)}</span>
                    </button>
                  )
                })}
              </div>
              <p className="theme-publish-note">{theme.challenge.publishNote}</p>
              <button className="theme-secondary-action" type="button" onClick={() => setPublishOpen(false)}>{t(copy.challenge.notNow)}</button>
            </div>
          )}
          <div className="theme-challenge-reward">
            <span>{t(copy.challenge.rewardLabel)}</span>
            <p><b>{theme.challenge.reward.name}</b>{theme.challenge.reward.label && <>｜{theme.challenge.reward.label}</>}</p>
          </div>
        </div>
      </section>

      <p className="theme-announcement" aria-live="polite">{announcement}</p>
      <div className="theme-footer-mark">
        <span>{t(copy.footerLine)}</span>
        <span>REVERIE / {theme.meta.issue}</span>
      </div>

      {bookingOpen && (
        <BookingFlow
          onClose={() => {
            setBookingOpen(false)
            // 等弹层卸载的那一帧结束后再把焦点还给触发按钮，否则焦点会被浏览器丢回 <body>。
            window.requestAnimationFrame(() => bookButtonRef.current?.focus())
          }}
          onOpenTickets={onOpenTickets}
          dreamerName={state.dreamerName}
          onDreamerNameChange={(value) => setState((current) => ({ ...current, dreamerName: value }))}
        />
      )}
    </div>
  )
}

export default MonthlyThemeView
