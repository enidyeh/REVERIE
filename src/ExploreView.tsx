import { useEffect, useState } from 'react'
import {
  ArrowUpRight,
  BookOpen,
  Check,
  Clock3,
  MapPin,
  ShoppingBag,
  Sparkles,
  SlidersHorizontal,
  UsersRound,
  X,
} from 'lucide-react'
import {
  editorPrompts,
  experiences,
  defaultDiscoverPreferences,
  discoverPreferencesStorageKey,
  parseDiscoverPreferences,
  type DiscoverPreferences,
  type EditorPromptId,
  type Experience,
  type ExperienceDraft,
} from './data/discover'
import PreferenceControls from './components/PreferenceControls'
import { contentMeta, contentTopics } from './data/content'
import { activePreferenceLabels, guideShopPicks, guideSpaces, guideTopics, matchingExperiences, planFor } from './data/explore-guides'
import { shopGroupLabel } from './data/market'
import { exploreCopy as copy } from './i18n/explore'
import { useLocale } from './i18n/use-locale'
import './explore.css'
import './explore-guide.css'

type ExploreState = {
  plannedIds: string[]
  // 三条「问题 → 小实验」的完成勾选（本地记录）。
  planDone: string[]
}

const storageKey = 'unseen:discover:v1'
const experienceIds = new Set(experiences.map((experience) => experience.id))
const promptIds = new Set<string>(editorPrompts.map((prompt) => prompt.id))
const emptyState: ExploreState = { plannedIds: [], planDone: [] }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function loadExploreState(): ExploreState {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
    if (!isRecord(saved)) return emptyState

    const plannedIds = Array.isArray(saved.plannedIds)
      ? saved.plannedIds.filter((id): id is string => typeof id === 'string' && experienceIds.has(id))
      : []
    const planDone = Array.isArray(saved.planDone)
      ? saved.planDone.filter((id): id is string => typeof id === 'string' && promptIds.has(id))
      : []
    return { plannedIds, planDone }
  } catch {
    return emptyState
  }
}

function loadDiscoverPreferences(): DiscoverPreferences {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(discoverPreferencesStorageKey) ?? 'null')
    return parseDiscoverPreferences(saved)
  } catch {
    return defaultDiscoverPreferences
  }
}

function ExperienceDetails({
  experience,
  isPlanned,
  onClose,
  onTogglePlan,
  onWriteRecord,
}: {
  experience: Experience
  isPlanned: boolean
  onClose: () => void
  onTogglePlan: (id: string) => void
  onWriteRecord: (experience: ExperienceDraft) => void
}) {
  const { t } = useLocale()

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="explore-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="explore-dialog" role="dialog" aria-modal="true" aria-labelledby="experience-dialog-title">
        <button className="explore-dialog-close" type="button" onClick={onClose} aria-label={t(copy.closeDetails)}><X size={19} /></button>
        <div className="explore-dialog-image"><img src={experience.image} alt={t(experience.imageAlt)} /></div>
        <div className="explore-dialog-content">
          <p className="explore-eyebrow">{t(experience.category)} <span>/</span> {t(copy.demoPick)}</p>
          <h2 id="experience-dialog-title">{t(experience.title)}</h2>
          <p className="explore-dialog-description">{t(experience.description)}</p>
          <div className="explore-detail-meta">
            <span><MapPin size={14} />{t(experience.location)}</span>
            <span><Clock3 size={14} />{t(experience.date)} · {t(experience.duration)}</span>
            <span><UsersRound size={14} />{t(experience.groupSize)} · {t(experience.budget)}</span>
          </div>
          <p className="explore-dialog-note">{t(copy.dialogNote)}</p>
          <div className="explore-dialog-actions">
            <button className={`explore-primary-action ${isPlanned ? 'is-selected' : ''}`} type="button" onClick={() => onTogglePlan(experience.id)}>
              {isPlanned ? <><Check size={17} /> {t(copy.addedToWeek)}</> : <>{t(copy.addToWeek)} <ArrowUpRight size={17} /></>}
            </button>
            <button
              className="explore-record-action"
              type="button"
              onClick={() => onWriteRecord({ id: experience.id, title: t(experience.title), location: t(experience.location), category: t(experience.category) })}
            >
              <BookOpen size={16} /> {t(copy.writeRecord)}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function ExploreView({
  onOpenContent,
  onOpenEvents,
  onOpenShop,
  onOpenSpace,
  onWriteRecord,
}: {
  onOpenContent: () => void
  onOpenEvents: () => void
  onOpenShop: () => void
  onOpenSpace: () => void
  onWriteRecord: (experience: ExperienceDraft) => void
}) {
  const [state, setState] = useState<ExploreState>(loadExploreState)
  const [preferences, setPreferences] = useState<DiscoverPreferences>(loadDiscoverPreferences)
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null)
  const { locale, t } = useLocale()
  const plannedCount = state.plannedIds.length

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } catch {
      // Keep the current session usable when browser storage is unavailable.
    }
  }, [state])

  useEffect(() => {
    try {
      localStorage.setItem(discoverPreferencesStorageKey, JSON.stringify(preferences))
    } catch {
      // Keep the current session usable when browser storage is unavailable.
    }
  }, [preferences])

  function togglePlan(id: string) {
    setState((current) => ({
      ...current,
      plannedIds: current.plannedIds.includes(id)
        ? current.plannedIds.filter((plannedId) => plannedId !== id)
        : [...current.plannedIds, id],
    }))
  }

  function togglePlanDone(id: EditorPromptId) {
    setState((current) => ({
      ...current,
      planDone: current.planDone.includes(id)
        ? current.planDone.filter((promptId) => promptId !== id)
        : [...current.planDone, id],
    }))
  }

  const preferenceLabels = activePreferenceLabels(preferences, locale)
  const matches = matchingExperiences(preferences)
  const exploreTopics = guideTopics(preferences, locale)
  const exploreShopPicks = guideShopPicks(preferences)
  const exploreSpaces = guideSpaces(preferences)
  const hasActivePreferences = preferenceLabels.length > 0

  // 三条「问题 → 小实验」依次生成，后一条尽量不再用前面已经用过的条目。
  const usedPlanIds: string[] = []
  const planRows = editorPrompts.map((prompt) => {
    const plan = planFor(preferences, prompt.id, locale, usedPlanIds)
    usedPlanIds.push(plan.id)
    return { prompt, plan }
  })

  return (
    <div className="explore-page">
      <section className="explore-profile" aria-labelledby="explore-profile-heading">
        <div className="explore-profile-heading">
          {t(copy.profileEyebrow) && <p className="explore-eyebrow"><SlidersHorizontal size={13} /> {t(copy.profileEyebrow)}</p>}
          <h2 id="explore-profile-heading">{t(copy.profileHeading)}</h2>
          <span>{t(copy.localNote)}</span>
        </div>
        <PreferenceControls preferences={preferences} onChange={(key, value) => setPreferences((current) => ({ ...current, [key]: value }))} />
        {hasActivePreferences && <button className="explore-profile-reset" type="button" onClick={() => setPreferences(defaultDiscoverPreferences)}>{t(copy.clearPreferences)}</button>}

        <p className="explore-guide-hint">{hasActivePreferences ? t(copy.hintActive)(preferenceLabels.join(' · ')) : t(copy.hintIdle)}</p>

        {/* 三条问题各自对应一条小实验：地点 / 时间 / 花费取自条目本身，右侧可勾选完成（本地记录）。 */}
        <div className="explore-plan">
          <p className="editor-greeting"><Sparkles size={15} aria-hidden="true" /><span>{plannedCount ? t(copy.greetingPlanned)(plannedCount) : t(copy.greetingIdle)}</span></p>
          <div className="plan-list">
            {planRows.map(({ prompt, plan }, index) => {
              const done = state.planDone.includes(prompt.id)
              const promptLabel = t(prompt.label)
              return (
                <article className="plan-entry" key={prompt.id}>
                  <span className="plan-entry-index">0{index + 1}</span>
                  <div className="plan-entry-main">
                    <p className="explore-eyebrow">{promptLabel}</p>
                    <h3>{plan.title}</h3>
                    <p className="plan-entry-text">{plan.text}</p>
                    <p className="plan-entry-meta">{plan.source} · {plan.next}{plan.fallback ? t(copy.planFallback) : ''}</p>
                  </div>
                  <div className="plan-entry-status">
                    <span>{done ? t(copy.planDone) : t(copy.planTodo)}</span>
                    <button
                      className={`plan-entry-check ${done ? 'is-done' : ''}`}
                      type="button"
                      aria-pressed={done}
                      aria-label={done ? t(copy.planDoneAria)(promptLabel) : t(copy.planTodoAria)(promptLabel)}
                      onClick={() => togglePlanDone(prompt.id)}
                    >
                      {done ? <Check size={17} aria-hidden="true" /> : <ArrowUpRight size={17} aria-hidden="true" />}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
          <p className="explore-plan-note">{t(copy.planNote)}</p>
        </div>
      </section>

      <section className="explore-guide" aria-labelledby="explore-content-heading">
        {/* 参考精选体验卡的排版：左侧图片，右侧标题 + 线上专题列表 + 入口。 */}
        <article className="explore-content-card">
          <figure className="explore-content-image">
            <img src={contentMeta.coverImage} alt={t(contentMeta.coverImageAlt)} loading="lazy" />
            <figcaption>{t(copy.contentFigureCaption)}</figcaption>
          </figure>
          <div className="explore-content-body">
            <p className="explore-eyebrow"><BookOpen size={13} aria-hidden="true" /> {t(copy.contentEyebrow)}</p>
            <h2 id="explore-content-heading">{t(contentMeta.title)}</h2>
            <ol className="explore-topic-list">
              {exploreTopics.map((topic, index) => (
                <li key={topic.id}><span>{String(index + 1).padStart(2, '0')}</span>{topic.label}</li>
              ))}
            </ol>
            <div className="explore-content-foot">
              <span className="explore-count">{t(copy.contentTopicsCount)(exploreTopics.length)}</span>
              <button className="explore-guide-action" type="button" onClick={onOpenContent}>{t(copy.readMore)} <ArrowUpRight size={15} aria-hidden="true" /></button>
            </div>
          </div>
        </article>
        <p className="explore-guide-note">{t(copy.contentGuideNote)(t(contentTopics.note))}</p>
      </section>

      <section className="explore-recommendations" aria-labelledby="recommendations-heading" id="explore-recommendations">
        <div className="explore-section-heading">
          <div><p className="explore-eyebrow">{t(copy.recommendationsEyebrow)}</p><h2 id="recommendations-heading">{t(copy.recommendationsHeading)}</h2></div>
          <div className="explore-section-actions">
            <span className="explore-count">{hasActivePreferences ? t(copy.matchCount)(matches.length, 3) : t(copy.curatedOnly)(3)}</span>
            <button className="explore-guide-action" type="button" onClick={onOpenEvents}>{t(copy.seeMoreEvents)} <ArrowUpRight size={15} aria-hidden="true" /></button>
          </div>
        </div>
        {matches.length ? matches.map((experience, index) => {
          const isPlanned = state.plannedIds.includes(experience.id)
          return index === 0 ? (
            <article className="explore-feature" key={experience.id}>
              <button className="explore-feature-image" type="button" onClick={() => setSelectedExperience(experience)} aria-label={t(copy.viewDetailsAria)(t(experience.title))}>
                <img src={experience.image} alt={t(experience.imageAlt)} />
                <span className="explore-photo-index">{t(copy.photoIndex)}</span>
                <span className="explore-match-mark"><Sparkles size={14} /> {t(experience.match)}</span>
              </button>
              <div className="explore-feature-copy">
                <p className="explore-eyebrow">{t(experience.category)}</p>
                <h3>{t(experience.title)}</h3>
                <p className="explore-reason">{t(experience.reason)}</p>
                <div className="explore-feature-meta"><span><MapPin size={13} />{t(experience.location)}</span><span><Clock3 size={13} />{t(experience.duration)}</span><span>{t(experience.budget)}</span></div>
                <div className="explore-feature-actions">
                  <button className={`explore-primary-action ${isPlanned ? 'is-selected' : ''}`} type="button" onClick={() => togglePlan(experience.id)}>
                    {isPlanned ? <><Check size={16} /> {t(copy.added)}</> : <>{t(copy.addToWeek)} <ArrowUpRight size={16} /></>}
                  </button>
                  <button className="explore-text-action" type="button" onClick={() => setSelectedExperience(experience)}>{t(copy.viewDetails)}</button>
                </div>
              </div>
            </article>
          ) : (
            <article className="explore-listing" key={experience.id}>
              <button className="explore-listing-image" type="button" onClick={() => setSelectedExperience(experience)} aria-label={t(copy.viewDetailsAria)(t(experience.title))}>
                <img src={experience.image} alt={t(experience.imageAlt)} />
              </button>
              <div className="explore-listing-copy">
                <p className="explore-eyebrow">0{index + 1} / {t(experience.category)}</p>
                <h3>{t(experience.title)}</h3>
                <p>{t(experience.location)} <span>·</span> {t(experience.duration)} <span>·</span> {t(experience.budget)}</p>
              </div>
              <button className={`explore-listing-action ${isPlanned ? 'is-selected' : ''}`} type="button" onClick={() => togglePlan(experience.id)} aria-label={isPlanned ? t(copy.removeFromPlanAria)(t(experience.title)) : t(copy.addToPlanAria)(t(experience.title))}>
                {isPlanned ? <Check size={17} /> : <ArrowUpRight size={17} />}
              </button>
            </article>
          )
        }) : (
          <div className="explore-no-match">
            <Sparkles size={18} />
            <h3>{t(copy.emptyHeading)}</h3>
            <p>{t(copy.emptyBody)}</p>
            <button type="button" onClick={() => setPreferences(defaultDiscoverPreferences)}>{t(copy.emptyAction)}</button>
          </div>
        )}
      </section>

      <section className="explore-guide" aria-labelledby="explore-shop-heading">
        <div className="explore-section-heading">
          <div>
            <p className="explore-eyebrow"><ShoppingBag size={13} aria-hidden="true" /> {t(copy.shopEyebrow)}</p>
            <h2 id="explore-shop-heading">{t(copy.shopHeading)}</h2>
          </div>
          <button className="explore-guide-action" type="button" onClick={onOpenShop}>{t(copy.goShop)} <ArrowUpRight size={15} aria-hidden="true" /></button>
        </div>
        <div className="explore-guide-grid">
          {exploreShopPicks.map((product) => (
            <article className="explore-guide-card" key={product.id}>
              <img src={product.image} alt={t(product.imageAlt)} loading="lazy" />
              <p className="explore-eyebrow">{t(shopGroupLabel(product.group))}</p>
              <h3>{t(product.title)}</h3>
              <p className="explore-guide-meta">{t(product.priceLabel)} · {t(copy.demoProductSuffix)}</p>
            </article>
          ))}
        </div>
        <p className="explore-guide-note">{t(copy.shopNote)}</p>
      </section>

      <section className="explore-guide" aria-labelledby="explore-space-heading">
        <div className="explore-section-heading">
          <div>
            <p className="explore-eyebrow"><MapPin size={13} aria-hidden="true" /> {t(copy.spaceEyebrow)}</p>
            <h2 id="explore-space-heading">{t(copy.spaceHeading)}</h2>
          </div>
          <button className="explore-guide-action" type="button" onClick={onOpenSpace}>{t(copy.browseSpaces)} <ArrowUpRight size={15} aria-hidden="true" /></button>
        </div>
        <div className="explore-guide-grid">
          {exploreSpaces.map((space) => (
            <article className="explore-guide-card" key={space.id}>
              <img src={space.image} alt={t(space.imageAlt)} loading="lazy" />
              <p className="explore-eyebrow">{t(space.district)}</p>
              <h3>{t(space.name)}</h3>
              <p className="explore-guide-meta">{t(space.category)} · {t(space.price)} · {t(copy.demoSpaceSuffix)}</p>
            </article>
          ))}
        </div>
        <p className="explore-guide-note">{t(copy.spaceNote)}</p>
      </section>

      {selectedExperience && (
        <ExperienceDetails
          experience={selectedExperience}
          isPlanned={state.plannedIds.includes(selectedExperience.id)}
          onClose={() => setSelectedExperience(null)}
          onTogglePlan={togglePlan}
          onWriteRecord={(experience) => { setSelectedExperience(null); onWriteRecord(experience) }}
        />
      )}
    </div>
  )
}

export default ExploreView