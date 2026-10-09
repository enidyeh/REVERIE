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
import './theme.css'

const storageKey = 'unseen:theme:v1'

type TabId = 'events' | 'quiz' | 'map'
type MapGroupId = 'brands' | 'creators'

const themeTabs: { id: TabId; index: string; label: string; en: string }[] = [
  { id: 'events', index: '01', label: '活动详情', en: 'EVENTS' },
  { id: 'map', index: '02', label: '梦境目录', en: 'DIRECTORY' },
  { id: 'quiz', index: '03', label: '梦境互动', en: 'INTERACT' },
]

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
      exampleIndex: typeof saved.exampleIndex === 'number' && Number.isInteger(saved.exampleIndex) && saved.exampleIndex >= 0 && saved.exampleIndex < themeChallenge.examples.length ? saved.exampleIndex : 0,
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
  return { fantasy, flip, outcome: fantasy >= flip ? themeResults.fantasy : themeResults.flip }
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
  const dayActivities = themeSchedule.filter((activity) => activity.day === scheduleDay)

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
        <img className="theme-hero-image" src={themeMeta.heroImage} alt={themeMeta.heroImageAlt} />
        <div className="theme-hero-shade" aria-hidden="true" />
        <div className="theme-hero-inner">
          <p className="theme-series">{themeMeta.series}</p>
          <h1 id="theme-title">梦 游 <span>仙 境</span></h1>
          <div className="theme-hero-book">
            <button className="theme-primary-action" type="button" ref={bookButtonRef} onClick={() => setBookingOpen(true)}>
              <Ticket size={15} aria-hidden="true" />BOOK TICKETS
            </button>
            <p>三步拿票：登录 → 付款 → 得到票（演示，不接入真实支付）</p>
          </div>
          <div className="theme-hero-entry">
            <div className="theme-hero-when">
              <div>
                <span>ENTRY DATE / 入梦日期</span>
                <p>{themeMeta.window}</p>
              </div>
              <div>
                <span>LOCATION / 入梦坐标</span>
                <p>{themeMeta.city}</p>
              </div>
            </div>
          </div>
          <p className="theme-hero-line">{themeMeta.heroLine}</p>
        </div>
      </section>

      <nav className="theme-tabs" ref={tabsRef} aria-label="DISCOVER 板块导航">
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
              <span className="theme-tab-top"><b>{tab.index}</b>{tab.label}</span>
              <span className="theme-tab-en">{tab.en}</span>
            </a>
          ))}
        </div>
      </nav>

      <section className="theme-duality" id="theme-block-events" ref={eventsRef} aria-label="甜梦与暗黑梦境">
        <figure className="theme-duality-side">
          <img src={themeMeta.sweetImage} alt={themeMeta.sweetImageAlt} />
          <figcaption>
            <span>{themeDuality.sweet.label}</span>
            <dl className="theme-duality-keys">
              <div>
                <dt>DRESS CODE 暗示</dt>
                <dd>{themeDuality.sweet.dressCode}</dd>
              </div>
              <div>
                <dt>现场布景风格</dt>
                <dd>{themeDuality.sweet.scene}</dd>
              </div>
            </dl>
          </figcaption>
        </figure>
        <figure className="theme-duality-side">
          <img src={themeMeta.darkImage} alt={themeMeta.darkImageAlt} />
          <figcaption>
            <span>{themeDuality.dark.label}</span>
            <dl className="theme-duality-keys">
              <div>
                <dt>DRESS CODE 暗示</dt>
                <dd>{themeDuality.dark.dressCode}</dd>
              </div>
              <div>
                <dt>现场布景风格</dt>
                <dd>{themeDuality.dark.scene}</dd>
              </div>
            </dl>
          </figcaption>
        </figure>
      </section>

      <section className="theme-rituals" aria-labelledby="theme-rituals-heading">
        <div className="theme-section-heading">
          <div>
            <p className="theme-eyebrow">WHAT'S INSIDE</p>
            <h2 id="theme-rituals-heading">梦游地图。</h2>
          </div>
          <span>{themeRituals.length.toString().padStart(2, '0')} RITUALS</span>
        </div>
        <div className="theme-ritual-grid">
          {themeRituals.map((ritual) => (
            <article className="theme-ritual" key={ritual.id}>
              <div className="theme-ritual-topline"><span>{ritual.index}</span><b>{ritual.kind}</b></div>
              <h3>{ritual.name}</h3>
              <p className="theme-ritual-en">{ritual.nameEn}</p>
              {ritual.line && <p className="theme-ritual-line">{ritual.line}</p>}
            </article>
          ))}
        </div>
        <p className="theme-disclosure">玩法内容为项目方提供的演示文案，现场安排以最终官宣为准。</p>
      </section>

      <section className="theme-schedule" aria-labelledby="theme-schedule-heading">
        <div className="theme-section-heading">
          <div>
            <p className="theme-eyebrow">EVENT SCHEDULE</p>
            <h2 id="theme-schedule-heading">当天活动表。</h2>
          </div>
          <span>{dayActivities.length.toString().padStart(2, '0')} SESSIONS</span>
        </div>
        <div className="theme-schedule-days" role="group" aria-label="选择日期">
          {themeScheduleDays.map((day) => (
            <button
              className={`theme-day-tab ${scheduleDay === day ? 'is-active' : ''}`}
              key={day}
              type="button"
              aria-pressed={scheduleDay === day}
              onClick={() => setScheduleDay(day)}
            >
              <b>{day}</b>
              <span>{themeSchedule.filter((activity) => activity.day === day).length} 场</span>
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
                  <p className="theme-schedule-en">{activity.nameEn}</p>
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
                    setAnnouncement(booked ? `已取消预约：${activity.name}` : `已预约（演示）：${activity.name}`)
                  }}
                >
                  {booked ? <><Check size={14} aria-hidden="true" />已预约，取消</> : <>预约</>}
                </button>
              </article>
            )
          })}
        </div>
        <p className="theme-disclosure">{themeScheduleNote}</p>
      </section>

      <section className="theme-dreammap" id="theme-block-map" ref={mapRef} aria-labelledby="theme-dreammap-heading">
        <div className="theme-section-heading">
          <div>
            <p className="theme-eyebrow">DIRECTORY</p>
            <h2 id="theme-dreammap-heading">梦境目录。</h2>
          </div>
          <span>{themeMapGroups.length.toString().padStart(2, '0')} GROUPS</span>
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
            <p className="theme-eyebrow">{themeFeatured.label}</p>
            <h3>{themeFeatured.title}</h3>
            <p className="theme-featured-line">{themeFeatured.line}</p>
            <ul className="theme-featured-list">
              {themeFeatured.items.map((item, index) => (
                <li key={item.id}>
                  <button
                    className={`theme-featured-tag ${index === featuredIndex ? 'is-active' : ''}`}
                    type="button"
                    aria-current={index === featuredIndex ? 'true' : undefined}
                    onClick={() => setFeaturedIndex(index)}
                  >
                    {item.en}｜{item.zh}
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
                {themeFeatured.entryLabel}
                <ArrowUpRight size={13} aria-hidden="true" />
              </button>
              <p className="theme-article-note">{themeFeatured.articleNote}</p>
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
              <b>{themeFeatured.items[featuredIndex].en}｜{themeFeatured.items[featuredIndex].zh}</b>
              <span>{String(featuredIndex + 1).padStart(2, '0')} / {String(themeFeatured.items.length).padStart(2, '0')}</span>
            </figcaption>
          </figure>

          <p className="theme-featured-shot-note">{themeFeatured.shotNote}</p>
        </div>

        <figure className="theme-map-plan">
          <div className="theme-map-plan-frame" aria-hidden="true">
            <span>2F</span>
            <span>3F</span>
          </div>
          <figcaption>
            <b>{themeMapPlan.title}</b>
            <p>{themeMapPlan.note}</p>
          </figcaption>
        </figure>

        <p className="theme-disclosure">本板块的创作者与展商资料来自项目方提供的内容，展位与排期信息为演示占位；不代表 UNSEEN 提供售卖、购票、预约或报名服务，价格与展位请以官方渠道为准。</p>

        <div className="theme-map-groups">
          {themeMapGroups.map((group) => (
            <button
              className={`theme-map-group ${mapGroup === group.id ? 'is-active' : ''}`}
              key={group.id}
              type="button"
              aria-pressed={mapGroup === group.id}
              onClick={() => setMapGroup(group.id)}
            >
              <span className="theme-map-group-top"><b>{group.index}</b>{group.en}<em>{group.count}</em></span>
              <span className="theme-map-group-label">{group.label}</span>
              <span className="theme-map-group-desc">{group.desc}</span>
            </button>
          ))}
        </div>

        {mapGroup === 'brands' && (
          <div className="theme-wonderlist-list">
            {themeBrands.map((brand) => (
              <article className="theme-wonder-item" key={brand.id}>
                <span className="theme-wonder-index">{brand.index}</span>
                <div>
                  <h4>{brand.name}{brand.handle && <em>{brand.handle}</em>}</h4>
                  <p>{brand.line}</p>
                  <p className="theme-wonder-meta">{brand.booth}</p>
                  {brand.link
                    ? <a href={brand.link.href} target="_blank" rel="noreferrer noopener">{brand.link.label} <ArrowUpRight size={12} aria-hidden="true" /></a>
                    : <p className="theme-wonder-meta">{brand.handle ? '社交媒体链接待项目方提供' : '待项目方补充品牌信息'}</p>}
                </div>
              </article>
            ))}
          </div>
        )}

        {mapGroup === 'creators' && (
          <div className="theme-wonderlist-list">
            {themeCreators.map((creator) => (
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
            {themeShopCta.label}
            <ArrowUpRight size={14} aria-hidden="true" />
          </button>
          <span>{themeShopCta.note}</span>
        </div>
      </section>

      <section className="theme-quiz" id="theme-block-quiz" ref={quizRef} aria-labelledby="theme-quiz-heading">
        <div className="theme-section-heading">
          <div>
            <p className="theme-eyebrow">WHICH DREAMER ARE YOU</p>
            <h2 id="theme-quiz-heading">你是哪一种梦游者？</h2>
          </div>
          <span>{answered} / {themeQuiz.length} 已作答</span>
        </div>
        <div className="theme-quiz-list">
          {themeQuiz.map((question) => (
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
              setAnnouncement('结果已生成，已写入下面的 24 小时兔子洞任务')
            }}
          >
            <Sparkles size={15} aria-hidden="true" />看我的梦境结果
          </button>
          {state.quizLocked && (
            <button className="theme-secondary-action" type="button" onClick={() => { setState((current) => ({ ...current, quizLocked: false })); setAnnouncement('可以重新选择答案') }}>
              <RefreshCw size={14} aria-hidden="true" />重新作答
            </button>
          )}
        </div>
        <p className="theme-disclosure">多选判断，纯本地预设规则，不调用真实 AI；平手时判为奇幻主义者。结果会显示在下面的「24 小时兔子洞任务」里。</p>
      </section>

      <section className="theme-challenge" ref={challengeRef} aria-labelledby="theme-challenge-heading">
        <img className="theme-challenge-image" src={themeMeta.rabbitImage} alt={themeMeta.rabbitImageAlt} />
        <div className="theme-challenge-body">
          <p className="theme-eyebrow">THIS MONTH'S MISSION</p>
          <h2 id="theme-challenge-heading">{themeChallenge.title}</h2>
          <p className="theme-challenge-en">{themeChallenge.titleEn}</p>
          <div className="theme-result">
            <div className="theme-result-topline">
              <span className="theme-result-label">DREAM ARCHETYPE / 梦境原型</span>
              {state.quizLocked && <b className="theme-result-score">RESULT {resolved.outcome.index} · {resolved.fantasy} : {resolved.flip}</b>}
            </div>
            {state.quizLocked ? (
              <>
                <h3>{resolved.outcome.name}</h3>
                <p className="theme-result-en">{resolved.outcome.nameEn}</p>
                {resolved.outcome.lines.map((line) => <p className="theme-result-line" key={line}>{line}</p>)}
              </>
            ) : (
              <p className="theme-result-placeholder">完成「你是哪一种梦游者？」测试后，你的身份会出现在这里。</p>
            )}
          </div>
          {state.quizLocked && (
            <>
              <p className="theme-challenge-brief">{themeChallenge.brief}</p>
              <div className="theme-challenge-example">
                <p>{themeChallenge.examples[state.exampleIndex]}</p>
                <button
                  className="theme-secondary-action"
                  type="button"
                  onClick={() => {
                    setState((current) => ({ ...current, exampleIndex: (current.exampleIndex + 1) % themeChallenge.examples.length }))
                    setAnnouncement('已换一条任务示例')
                  }}
                >
                  <RefreshCw size={14} aria-hidden="true" />更新
                </button>
              </div>
            </>
          )}
          <div className="theme-challenge-how">
            <span>完成方式</span>
            <p>{themeChallenge.howTo.join(' ＋ ')}</p>
            <p className="theme-challenge-tags">{themeChallenge.hashtags.join(' ')}</p>
            <p className="theme-challenge-boundary">{themeChallenge.boundary}</p>
          </div>
          <div className="theme-challenge-actions">
            {!state.challengeAccepted ? (
              <button className="theme-primary-action" type="button" onClick={() => { setState((current) => ({ ...current, challengeAccepted: true })); setAnnouncement('任务已接下，24 小时内随时回来打卡') }}>
                接下这个任务
              </button>
            ) : (
              <button className="theme-primary-action" type="button" onClick={() => { setPublishOpen((open) => !open); setAnnouncement('选择要发布的渠道') }}>
                <ArrowUpRight size={15} aria-hidden="true" />{themeChallenge.publishLabel}
              </button>
            )}
            <span className="theme-challenge-status">
              {state.challengeDone ? 'RABBIT HOLE STAMP 已获取' : state.challengeAccepted ? '进行中' : '未开始'}
            </span>
          </div>
          {publishOpen && (
            <div className="theme-publish">
              <p className="theme-publish-label">选择发布渠道｜PUBLISH TO</p>
              <div className="theme-publish-targets">
                {themeChallenge.publishTargets.map((target) => {
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
                          setAnnouncement(`已打开 REVERIE 的《${target.name}》账号（新窗口）；发布后即完成本次任务（演示）`)
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
                        setAnnouncement(`演示：正式版会打开 REVERIE 的《${target.name}》账号；该渠道链接待项目方提供，本次未发生跳转，已记为完成（演示）`)
                      }}
                    >
                      {target.name}
                      <span className="theme-publish-target-note">链接待提供</span>
                    </button>
                  )
                })}
              </div>
              <p className="theme-publish-note">{themeChallenge.publishNote}</p>
              <button className="theme-secondary-action" type="button" onClick={() => setPublishOpen(false)}>先不发布</button>
            </div>
          )}
          <div className="theme-challenge-reward">
            <span>完成即可获得</span>
            <p><b>{themeChallenge.reward.name}</b>｜{themeChallenge.reward.label}</p>
          </div>
        </div>
      </section>

      <p className="theme-announcement" aria-live="polite">{announcement}</p>
      <div className="theme-footer-mark">
        <span>发现主题 → 测试我是谁 → 接受一个小任务 → 发现上海的梦境 → 认识创作者和物件 → 10.31 真正进入 REVERIE 梦境。</span>
        <span>REVERIE / {themeMeta.issue}</span>
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
