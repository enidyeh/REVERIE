import { useEffect, useState } from 'react'
import { ArrowUpRight, CalendarDays, Check, Clock3, MapPin, X } from 'lucide-react'
import { defaultDiscoverPreferences, discoverPreferencesStorageKey, parseDiscoverPreferences, type DiscoverPreferences } from './data/discover'
import { youthSpaces, type SpaceVisitSlot, type YouthSpace } from './data/spaces'
import PreferenceControls from './components/PreferenceControls'
import './space.css'

type ReservationIntent = { spaceId: string; slotId: string }

const storageKey = 'unseen:space:v1'
const spacesById = new Map(youthSpaces.map((space) => [space.id, space]))

function loadReservationIntents(): ReservationIntent[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
    if (!Array.isArray(saved)) return []

    const seenSpaces = new Set<string>()
    const reservations: ReservationIntent[] = []
    for (const item of saved) {
      if (typeof item !== 'object' || item === null) continue
      const candidate = item as Record<string, unknown>
      if (typeof candidate.spaceId !== 'string' || typeof candidate.slotId !== 'string') continue
      const space = spacesById.get(candidate.spaceId)
      if (!space || seenSpaces.has(space.id) || !space.visitSlots.some((slot) => slot.id === candidate.slotId)) continue
      seenSpaces.add(space.id)
      reservations.push({ spaceId: space.id, slotId: candidate.slotId })
    }
    return reservations
  } catch {
    return []
  }
}

function loadDiscoverPreferences(): DiscoverPreferences {
  try {
    return parseDiscoverPreferences(JSON.parse(localStorage.getItem(discoverPreferencesStorageKey) ?? 'null'))
  } catch {
    return defaultDiscoverPreferences
  }
}

function getSpaceFitLabels(space: YouthSpace, preferences: DiscoverPreferences) {
  const labels: string[] = []
  if (preferences.interest !== 'all') labels.push('兴趣匹配')
  if (preferences.timeLimit !== 'any') labels.push('停留时长适配')
  if (preferences.company !== 'any') labels.push(space.socialFit === 'both' ? '独自/同行都可' : '出行方式匹配')
  return labels.length ? labels : [space.interest === 'city' ? '城市探索' : space.interest === 'make' ? '动手创作' : '聆听时刻']
}

function SpaceDetails({
  space,
  reservation,
  selectedSlotId,
  onSelectSlot,
  onClose,
  onReserve,
  onCancel,
}: {
  space: YouthSpace
  reservation: ReservationIntent | undefined
  selectedSlotId: string
  onSelectSlot: (slotId: string) => void
  onClose: () => void
  onReserve: (slot: SpaceVisitSlot) => void
  onCancel: () => void
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const selectedSlot = space.visitSlots.find((slot) => slot.id === selectedSlotId) ?? space.visitSlots[0]
  const reservedSlot = space.visitSlots.find((slot) => slot.id === reservation?.slotId)

  return (
    <div className="space-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="space-dialog" role="dialog" aria-modal="true" aria-labelledby="space-dialog-title">
        <button className="space-dialog-close" type="button" onClick={onClose} aria-label="关闭空间详情"><X size={19} /></button>
        <div className="space-dialog-image"><img src={space.image} alt={space.imageAlt} /></div>
        <div className="space-dialog-content">
          <p className="space-eyebrow">{space.category} <span>/</span> SHANGHAI</p>
          <h2 id="space-dialog-title">{space.name}</h2>
          <p className="space-description">{space.description}</p>
          <div className="space-detail-meta">
            <span><MapPin size={14} />{space.address} · {space.district}</span>
            <span><Clock3 size={14} />{space.hours}</span>
            <span>{space.price}</span>
          </div>
          <div className="space-activities"><p className="space-eyebrow">HERE, YOU CAN</p><div>{space.activities.map((activity) => <span key={activity}>{activity}</span>)}</div></div>
          <div className="space-visit-guide"><p className="space-eyebrow">BEFORE YOU GO / 到访前</p><strong>{space.visitDuration}</strong><p>{space.visitGuide}</p></div>

          {reservation && reservedSlot ? (
            <div className="space-reservation-result" role="status">
              <p className="space-eyebrow"><Check size={13} /> 本地预约意向已记录</p>
              <strong>{reservedSlot.label}</strong>
              <p>此确认仅保存在演示页面，不会通知空间或生成真实预约。</p>
              <button className="space-cancel-action" type="button" onClick={onCancel}>取消预约意向</button>
            </div>
          ) : (
            <div className="space-reservation-form">
              <div className="space-time-heading"><div><p className="space-eyebrow">CHOOSE A VISIT TIME</p><h3>预约参观意向</h3></div><CalendarDays size={17} /></div>
              <div className="space-time-options" role="group" aria-label="选择参观时间">
                {space.visitSlots.map((slot) => (
                  <button className={selectedSlotId === slot.id ? 'is-selected' : ''} type="button" key={slot.id} aria-pressed={selectedSlotId === slot.id} onClick={() => onSelectSlot(slot.id)}>{slot.label}</button>
                ))}
              </div>
              <button className="space-primary-action" type="button" disabled={!selectedSlot} onClick={() => selectedSlot && onReserve(selectedSlot)}>模拟提交预约意向 <ArrowUpRight size={16} /></button>
              <p className="space-demo-note">虚构空间与时段 · 不连接真实预约服务</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function SpaceView() {
  const [reservations, setReservations] = useState<ReservationIntent[]>(loadReservationIntents)
  const [preferences, setPreferences] = useState<DiscoverPreferences>(loadDiscoverPreferences)
  const [selectedSpace, setSelectedSpace] = useState<YouthSpace | null>(null)
  const [selectedSlotId, setSelectedSlotId] = useState('')
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(reservations))
    } catch {
      // Keep the current session usable when browser storage is unavailable.
    }
  }, [reservations])

  useEffect(() => {
    try {
      localStorage.setItem(discoverPreferencesStorageKey, JSON.stringify(preferences))
    } catch {
      // Keep the current session usable when browser storage is unavailable.
    }
  }, [preferences])

  const matchingSpaces = youthSpaces.filter((space) => {
    if (preferences.interest !== 'all' && space.interest !== preferences.interest) return false
    if (preferences.timeLimit !== 'any' && space.durationMinutes > Number(preferences.timeLimit)) return false
    if (preferences.company !== 'any' && space.socialFit !== 'both' && space.socialFit !== preferences.company) return false
    return true
  })
  const hasActivePreferences = Object.entries(preferences).some(([key, value]) => value !== defaultDiscoverPreferences[key as keyof DiscoverPreferences])
  const reservedSpaces = reservations.flatMap((reservation) => {
    const space = youthSpaces.find((item) => item.id === reservation.spaceId)
    const slot = space?.visitSlots.find((item) => item.id === reservation.slotId)
    return space && slot ? [{ space, slot }] : []
  })

  function openDetails(space: YouthSpace) {
    setSelectedSpace(space)
    setSelectedSlotId(space.visitSlots[0]?.id ?? '')
  }

  function reserveVisit(slot: SpaceVisitSlot) {
    if (!selectedSpace) return
    setReservations((current) => current.some((reservation) => reservation.spaceId === selectedSpace.id)
      ? current
      : [...current, { spaceId: selectedSpace.id, slotId: slot.id }])
    setAnnouncement(`${selectedSpace.name}的预约意向已记录，仅用于演示`)
  }

  function cancelVisit(spaceId: string) {
    setReservations((current) => current.filter((reservation) => reservation.spaceId !== spaceId))
    setAnnouncement('预约意向已从本地演示中取消')
  }

  return (
    <div className="space-page">
      <section className="space-preferences" aria-label="空间偏好筛选">
        <div className="space-preferences-heading"><p className="space-eyebrow">YOUR WEEK / 本地偏好</p>{hasActivePreferences && <button type="button" onClick={() => setPreferences(defaultDiscoverPreferences)}>清除筛选</button>}</div>
        <PreferenceControls preferences={preferences} onChange={(key, value) => setPreferences((current) => ({ ...current, [key]: value }))} />
      </section>

      {reservedSpaces.length > 0 && (
        <section className="space-visit-return" aria-label="我的预约意向">
          <div><p className="space-eyebrow">YOUR VISIT INTENTS / 本地演示</p><span>已选 {reservedSpaces.length} 处空间</span></div>
          <div className="space-visit-return-list">
            {reservedSpaces.map(({ space, slot }) => <button key={space.id} type="button" onClick={() => openDetails(space)}><span>{space.name}</span><b>{slot.label}</b><ArrowUpRight size={14} /></button>)}
          </div>
        </section>
      )}

      <section className="space-list" aria-label="上海青年空间精选">
        {matchingSpaces.map((space, index) => {
          const reservation = reservations.find((entry) => entry.spaceId === space.id)
          const slot = space.visitSlots.find((entry) => entry.id === reservation?.slotId)
          const fitLabels = getSpaceFitLabels(space, preferences)
          return index === 0 ? (
            <article className="space-feature" key={space.id}>
              <button className="space-feature-image" type="button" onClick={() => openDetails(space)} aria-label={`查看空间详情：${space.name}`}>
                <img src={space.image} alt={space.imageAlt} />
                <span>SPACE / 01</span>
                <b>OPEN TO YOUR NEXT IDEA</b>
              </button>
              <div className="space-feature-copy">
                <p className="space-eyebrow">{space.category}</p>
                <h3>{space.name}</h3>
                <p className="space-feature-description">{space.description}</p>
                <div className="space-fit-tags">{fitLabels.map((label) => <span key={label}>{label}</span>)}</div>
                <div className="space-feature-meta"><span><MapPin size={14} />{space.district}</span><span><Clock3 size={14} />{space.hours}</span></div>
                {reservation && slot ? <p className="space-booked-label"><Check size={14} />意向已记录 · {slot.label}</p> : <p className="space-price-label">{space.price}</p>}
                <button className="space-primary-action" type="button" onClick={() => openDetails(space)}>{reservation ? '查看预约意向' : '查看空间与时段'} <ArrowUpRight size={16} /></button>
              </div>
            </article>
          ) : (
            <article className="space-listing" key={space.id}>
              <button className="space-listing-image" type="button" onClick={() => openDetails(space)} aria-label={`查看空间详情：${space.name}`}>
                <img src={space.image} alt={space.imageAlt} /><span>0{index + 1}</span>
              </button>
              <div className="space-listing-copy">
                <p className="space-eyebrow">{space.category}</p>
                <h3>{space.name}</h3>
                <p>{space.district} <i /> {space.price}</p>
                <span className="space-listing-fit">{fitLabels.slice(0, 2).join(' · ')}</span>
                {reservation && slot && <span className="space-listing-reserved"><Check size={12} />意向已记录 · {slot.label}</span>}
              </div>
              <button className="space-listing-action" type="button" onClick={() => openDetails(space)} aria-label={`查看时段：${space.name}`}><ArrowUpRight size={18} /></button>
            </article>
          )
        })}
        {matchingSpaces.length === 0 && (
          <div className="space-no-match">
            <MapPin size={19} />
            <h3>这组偏好下还没有合适空间。</h3>
            <p>演示空间数量有限，调整偏好或查看全部空间。</p>
            <button type="button" onClick={() => setPreferences(defaultDiscoverPreferences)}>显示全部空间</button>
          </div>
        )}
      </section>
      <p className="space-footnote">空间、地址、时段与活动均为虚构演示数据 · 不代表真实营业或预约情况</p>
      <p className="space-announcement" aria-live="polite">{announcement}</p>

      {selectedSpace && (
        <SpaceDetails
          space={selectedSpace}
          reservation={reservations.find((entry) => entry.spaceId === selectedSpace.id)}
          selectedSlotId={selectedSlotId}
          onSelectSlot={setSelectedSlotId}
          onClose={() => setSelectedSpace(null)}
          onReserve={reserveVisit}
          onCancel={() => cancelVisit(selectedSpace.id)}
        />
      )}
    </div>
  )
}

export default SpaceView