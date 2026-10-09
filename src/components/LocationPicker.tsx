import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, MapPin, Search, X } from 'lucide-react'
import { countries, defaultLocationId, locationLabel, resolveLocation, type SelectedLocation } from '../data/locations'
import './location-picker.css'

const storageKey = 'unseen:location:v1'

function loadCityId() {
  try {
    const saved = localStorage.getItem(storageKey)
    if (!saved) return defaultLocationId
    return countries.some((country) => country.cities.some((city) => city.id === saved)) ? saved : defaultLocationId
  } catch {
    return defaultLocationId
  }
}

function LocationPicker({ onSelect }: { onSelect?: () => void }) {
  const [cityId, setCityId] = useState(loadCityId)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const triggerRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const location: SelectedLocation = resolveLocation(cityId)

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, cityId)
    } catch {
      // 本地存储不可用时只保留本次会话的选择。
    }
  }, [cityId])

  useEffect(() => {
    if (!open) return
    searchRef.current?.focus()
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      triggerRef.current?.focus()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open])

  function togglePicker() {
    setQuery('')
    setOpen((current) => !current)
  }

  const keyword = query.trim().toLowerCase()
  const groups = countries
    .map((country) => ({
      ...country,
      cities: keyword
        ? country.cities.filter((city) =>
            city.zh.toLowerCase().includes(keyword) ||
            city.en.toLowerCase().includes(keyword) ||
            country.zh.toLowerCase().includes(keyword) ||
            country.en.toLowerCase().includes(keyword))
        : country.cities,
    }))
    .filter((country) => country.cities.length > 0)

  function choose(nextCityId: string) {
    setCityId(nextCityId)
    setOpen(false)
    triggerRef.current?.focus()
    onSelect?.()
  }

  return (
    <>
      <button
        className="location-trigger"
        type="button"
        ref={triggerRef}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={togglePicker}
      >
        <MapPin size={13} aria-hidden="true" />
        <span>{locationLabel(location)}</span>
        <ChevronDown size={12} aria-hidden="true" />
      </button>

      {open && (
        <div className="location-overlay" role="presentation" onClick={() => { setOpen(false); triggerRef.current?.focus() }}>
          <section
            className="location-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="location-panel-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="location-panel-head">
              <div>
                <p className="location-panel-eyebrow">SELECT REGION / 选择国家地区</p>
                <h2 id="location-panel-title">你要从哪里开始？</h2>
              </div>
              <button className="location-close" type="button" onClick={() => { setOpen(false); triggerRef.current?.focus() }} aria-label="关闭地点选择">
                <X size={17} aria-hidden="true" />
              </button>
            </header>

            <div className="location-search">
              <Search size={14} aria-hidden="true" />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索国家或城市"
                aria-label="搜索国家或城市"
              />
            </div>

            <p className="location-current">当前：{location.city} · {location.country}</p>

            <div className="location-scroll" role="list">
              {groups.map((country) => (
                <div className="location-group" key={country.id}>
                  <p className="location-group-head">
                    <span>{country.zh}</span>
                    <b>{country.en} / {country.code}</b>
                  </p>
                  <ul>
                    {country.cities.map((city) => {
                      const selected = city.id === cityId
                      return (
                        <li key={city.id}>
                          <button
                            className={`location-city ${selected ? 'is-selected' : ''}`}
                            type="button"
                            role="listitem"
                            aria-current={selected ? 'true' : undefined}
                            onClick={() => choose(city.id)}
                          >
                            <span className="location-city-zh">{city.zh}</span>
                            <span className="location-city-en">{city.en}</span>
                            {selected && <Check size={14} aria-hidden="true" />}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
              {!groups.length && <p className="location-empty">没有匹配的国家或城市。</p>}
            </div>

            <p className="location-note">当前只有上海的演示内容；其他城市的体验、活动、商品与空间尚未上线。国家与城市列表为演示数据。</p>
          </section>
        </div>
      )}
    </>
  )
}

export default LocationPicker
