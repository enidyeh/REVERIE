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
} from './data/discover'
import PreferenceControls from './components/PreferenceControls'
import { contentMeta, contentTopics } from './data/content'
import { activePreferenceLabels, guideShopPicks, guideSpaces, guideTopics, matchingExperiences, planFor } from './data/explore-guides'
import './explore.css'
import './explore-guide.css'

type ExploreState = {
  plannedIds: string[]
  // 三条「问题 → 小实验」的完成勾选（本地记录）。
  planDone: string[]
}

type IdentityDraft = Pick<Experience, 'id' | 'title' | 'location' | 'category'>

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
  onWriteRecord: (experience: IdentityDraft) => void
}) {
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
        <button className="explore-dialog-close" type="button" onClick={onClose} aria-label="关闭体验详情"><X size={19} /></button>
        <div className="explore-dialog-image"><img src={experience.image} alt={experience.imageAlt} /></div>
        <div className="explore-dialog-content">
          <p className="explore-eyebrow">{experience.category} <span>/</span> 演示推荐</p>
          <h2 id="experience-dialog-title">{experience.title}</h2>
          <p className="explore-dialog-description">{experience.description}</p>
          <div className="explore-detail-meta">
            <span><MapPin size={14} />{experience.location}</span>
            <span><Clock3 size={14} />{experience.date} · {experience.duration}</span>
            <span><UsersRound size={14} />{experience.groupSize} · {experience.budget}</span>
          </div>
          <p className="explore-dialog-note">虚构演示体验 · 不代表真实活动或预约</p>
          <div className="explore-dialog-actions">
            <button className={`explore-primary-action ${isPlanned ? 'is-selected' : ''}`} type="button" onClick={() => onTogglePlan(experience.id)}>
              {isPlanned ? <><Check size={17} /> 已加入本周计划</> : <>加入本周计划 <ArrowUpRight size={17} /></>}
            </button>
            <button className="explore-record-action" type="button" onClick={() => onWriteRecord({ id: experience.id, title: experience.title, location: experience.location, category: experience.category })}>
              <BookOpen size={16} /> 写下这次体验
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
  onWriteRecord: (experience: IdentityDraft) => void
}) {
  const [state, setState] = useState<ExploreState>(loadExploreState)
  const [preferences, setPreferences] = useState<DiscoverPreferences>(loadDiscoverPreferences)
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null)
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

  const preferenceLabels = activePreferenceLabels(preferences)
  const matches = matchingExperiences(preferences)
  const exploreTopics = guideTopics(preferences)
  const exploreShopPicks = guideShopPicks(preferences)
  const exploreSpaces = guideSpaces(preferences)
  const hasActivePreferences = preferenceLabels.length > 0

  // 三条「问题 → 小实验」依次生成，后一条尽量不再用前面已经用过的条目。
  const usedPlanIds: string[] = []
  const planRows = editorPrompts.map((prompt) => {
    const plan = planFor(preferences, prompt.id, usedPlanIds)
    usedPlanIds.push(plan.id)
    return { prompt, plan }
  })

  return (
    <div className="explore-page">
      <section className="explore-profile" aria-labelledby="explore-profile-heading">
        <div className="explore-profile-heading">
          <p className="explore-eyebrow"><SlidersHorizontal size={13} /> LIFE PROFILE / THIS WEEK</p>
          <h2 id="explore-profile-heading">按你此刻的生活来筛选。</h2>
          <span>本地偏好 · 不会发送到外部服务</span>
        </div>
        <PreferenceControls preferences={preferences} onChange={(key, value) => setPreferences((current) => ({ ...current, [key]: value }))} />
        {hasActivePreferences && <button className="explore-profile-reset" type="button" onClick={() => setPreferences(defaultDiscoverPreferences)}>清除偏好</button>}

        <p className="explore-guide-hint">{hasActivePreferences ? `已按你的选择调整下面的内容：${preferenceLabels.join(' · ')}` : '选完条件后，下面的内容会跟着调整。'}</p>

        {/* 三条问题各自对应一条小实验：地点 / 时间 / 花费取自条目本身，右侧可勾选完成（本地记录）。 */}
        <div className="explore-plan">
          <p className="editor-greeting"><Sparkles size={15} aria-hidden="true" /><span>{plannedCount ? `你已为本周选好 ${plannedCount} 次出发。` : '今天的生活，想从哪里开始？'}</span></p>
          <div className="plan-list">
            {planRows.map(({ prompt, plan }, index) => {
              const done = state.planDone.includes(prompt.id)
              return (
                <article className="plan-entry" key={prompt.id}>
                  <span className="plan-entry-index">0{index + 1}</span>
                  <div className="plan-entry-main">
                    <p className="explore-eyebrow">{prompt.label}</p>
                    <h3>{plan.title}</h3>
                    <p className="plan-entry-text">{plan.text}</p>
                    <p className="plan-entry-meta">{plan.source} · {plan.next}{plan.fallback ? '（当前筛选下没有完全匹配的精选，先取这一条）' : ''}</p>
                  </div>
                  <div className="plan-entry-status">
                    <span>{done ? '已完成' : '待完成'}</span>
                    <button
                      className={`plan-entry-check ${done ? 'is-done' : ''}`}
                      type="button"
                      aria-pressed={done}
                      aria-label={done ? `取消完成：${prompt.label}` : `标记完成：${prompt.label}`}
                      onClick={() => togglePlanDone(prompt.id)}
                    >
                      {done ? <Check size={17} aria-hidden="true" /> : <ArrowUpRight size={17} aria-hidden="true" />}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
          <p className="explore-plan-note">预设规则演示 · 不发送数据到外部服务</p>
        </div>
      </section>

      <section className="explore-guide" aria-labelledby="explore-content-heading">
        {/* 参考精选体验卡的排版：左侧图片，右侧标题 + 线上专题列表 + 入口。 */}
        <article className="explore-content-card">
          <figure className="explore-content-image">
            <img src={contentMeta.coverImage} alt={contentMeta.coverImageAlt} loading="lazy" />
            <figcaption>ONLINE TOPICS / 线上专题</figcaption>
          </figure>
          <div className="explore-content-body">
            <p className="explore-eyebrow"><BookOpen size={13} aria-hidden="true" /> CONTENT / {contentMeta.kicker}</p>
            <h2 id="explore-content-heading">{contentMeta.title}</h2>
            <p className="explore-guide-en">{contentMeta.titleEn}</p>
            <ol className="explore-topic-list">
              {exploreTopics.map((topic, index) => (
                <li key={topic}><span>{String(index + 1).padStart(2, '0')}</span>{topic}</li>
              ))}
            </ol>
            <div className="explore-content-foot">
              <span className="explore-count">{contentTopics.eyebrow} · {String(exploreTopics.length).padStart(2, '0')} TOPICS</span>
              <button className="explore-guide-action" type="button" onClick={onOpenContent}>查看更多内容 <ArrowUpRight size={15} aria-hidden="true" /></button>
            </div>
          </div>
        </article>
        <p className="explore-guide-note">{contentTopics.note}点「查看更多内容」会切到 HOME › CONTENT；配图为占位素材。</p>
      </section>

      <section className="explore-recommendations" aria-labelledby="recommendations-heading" id="explore-recommendations">
        <div className="explore-section-heading">
          <div><p className="explore-eyebrow">01 / CHOOSE A POSSIBILITY</p><h2 id="recommendations-heading">这周，试试这些。</h2></div>
          <div className="explore-section-actions">
            <span className="explore-count">{hasActivePreferences ? `符合偏好 ${matches.length} / 03` : '仅精选 03 条'}</span>
            <button className="explore-guide-action" type="button" onClick={onOpenEvents}>查看更多活动 <ArrowUpRight size={15} aria-hidden="true" /></button>
          </div>
        </div>
        {matches.length ? matches.map((experience, index) => {
          const isPlanned = state.plannedIds.includes(experience.id)
          return index === 0 ? (
            <article className="explore-feature" key={experience.id}>
              <button className="explore-feature-image" type="button" onClick={() => setSelectedExperience(experience)} aria-label={`查看体验详情：${experience.title}`}>
                <img src={experience.image} alt={experience.imageAlt} />
                <span className="explore-photo-index">EXPERIENCE / 01</span>
                <span className="explore-match-mark"><Sparkles size={14} /> {experience.match}</span>
              </button>
              <div className="explore-feature-copy">
                <p className="explore-eyebrow">{experience.category}</p>
                <h3>{experience.title}</h3>
                <p className="explore-reason">{experience.reason}</p>
                <div className="explore-feature-meta"><span><MapPin size={13} />{experience.location}</span><span><Clock3 size={13} />{experience.duration}</span><span>{experience.budget}</span></div>
                <div className="explore-feature-actions">
                  <button className={`explore-primary-action ${isPlanned ? 'is-selected' : ''}`} type="button" onClick={() => togglePlan(experience.id)}>
                    {isPlanned ? <><Check size={16} /> 已加入计划</> : <>加入本周计划 <ArrowUpRight size={16} /></>}
                  </button>
                  <button className="explore-text-action" type="button" onClick={() => setSelectedExperience(experience)}>查看详情</button>
                </div>
              </div>
            </article>
          ) : (
            <article className="explore-listing" key={experience.id}>
              <button className="explore-listing-image" type="button" onClick={() => setSelectedExperience(experience)} aria-label={`查看体验详情：${experience.title}`}>
                <img src={experience.image} alt={experience.imageAlt} />
              </button>
              <div className="explore-listing-copy">
                <p className="explore-eyebrow">0{index + 1} / {experience.category}</p>
                <h3>{experience.title}</h3>
                <p>{experience.location} <span>·</span> {experience.duration} <span>·</span> {experience.budget}</p>
              </div>
              <button className={`explore-listing-action ${isPlanned ? 'is-selected' : ''}`} type="button" onClick={() => togglePlan(experience.id)} aria-label={isPlanned ? `从计划移除：${experience.title}` : `加入计划：${experience.title}`}>
                {isPlanned ? <Check size={17} /> : <ArrowUpRight size={17} />}
              </button>
            </article>
          )
        }) : (
          <div className="explore-no-match">
            <Sparkles size={18} />
            <h3>这组条件下还没有合适的体验。</h3>
            <p>目前只有 3 条精选演示内容，放宽一项偏好再看看。</p>
            <button type="button" onClick={() => setPreferences(defaultDiscoverPreferences)}>显示全部精选</button>
          </div>
        )}
      </section>

      <section className="explore-guide" aria-labelledby="explore-shop-heading">
        <div className="explore-section-heading">
          <div>
            <p className="explore-eyebrow"><ShoppingBag size={13} aria-hidden="true" /> SHOP / 异想商店</p>
            <h2 id="explore-shop-heading">给自己一个小礼物。</h2>
          </div>
          <button className="explore-guide-action" type="button" onClick={onOpenShop}>去异想商店 <ArrowUpRight size={15} aria-hidden="true" /></button>
        </div>
        <div className="explore-guide-grid">
          {exploreShopPicks.map((product) => (
            <article className="explore-guide-card" key={product.id}>
              <img src={product.image} alt={product.imageAlt} loading="lazy" />
              <p className="explore-eyebrow">{product.group}</p>
              <h3>{product.title}</h3>
              <p className="explore-guide-meta">{product.priceLabel} · 演示选品</p>
            </article>
          ))}
        </div>
        <p className="explore-guide-note">演示选品：名称与价格为占位，点入口会切到 HOME › SHOP 看全部商品。</p>
      </section>

      <section className="explore-guide" aria-labelledby="explore-space-heading">
        <div className="explore-section-heading">
          <div>
            <p className="explore-eyebrow"><MapPin size={13} aria-hidden="true" /> SPACE / 青年空间</p>
            <h2 id="explore-space-heading">探索有意思的空间。</h2>
          </div>
          <button className="explore-guide-action" type="button" onClick={onOpenSpace}>找找这些空间 <ArrowUpRight size={15} aria-hidden="true" /></button>
        </div>
        <div className="explore-guide-grid">
          {exploreSpaces.map((space) => (
            <article className="explore-guide-card" key={space.id}>
              <img src={space.image} alt={space.imageAlt} loading="lazy" />
              <p className="explore-eyebrow">{space.district}</p>
              <h3>{space.name}</h3>
              <p className="explore-guide-meta">{space.category} · {space.price} · 演示空间</p>
            </article>
          ))}
        </div>
        <p className="explore-guide-note">演示空间：地址、时间与价格为占位，到访意向也只在本地记录。</p>
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