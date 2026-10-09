import { useEffect, useRef, useState, Fragment } from 'react'
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Compass,
  Handshake,
  House,
  MapPin,
  Newspaper,
  ShoppingBag,
  UserRound,
} from 'lucide-react'
import ExploreView from './ExploreView'
import ContentView from './ContentView'
import EventsView from './EventsView'
import MarketView from './MarketView'
import SpaceView from './SpaceView'
import IdentityView from './IdentityView'
import MonthlyThemeView from './MonthlyThemeView'
import CollaborateView from './CollaborateView'
import AboutView from './AboutView'
import LocationPicker from './components/LocationPicker'
import { MoreMenu, type MoreTarget } from './components/MoreMenu'
import { SocialMarks } from './components/SocialMarks'
import type { Experience } from './data/discover'
import './unseen.css'

type Section = 'discover' | 'home' | 'identity' | 'collaborate' | 'about'
type HomeSection = 'explore' | 'content' | 'events' | 'shop' | 'space'
type IdentityDraft = Pick<Experience, 'id' | 'title' | 'location' | 'category'>
type NavItem = { id: Section; label: string; icon: typeof Compass }

const homeSections: { id: HomeSection; label: string; icon: typeof CalendarDays }[] = [
  { id: 'explore', label: 'EXPLORE', icon: Compass },
  { id: 'content', label: 'CONTENT', icon: Newspaper },
  { id: 'events', label: 'EVENTS', icon: CalendarDays },
  { id: 'shop', label: 'SHOP', icon: ShoppingBag },
  { id: 'space', label: 'SPACE', icon: MapPin },
]

// 左侧三个入口：进入 REVERIE 世界。
const primaryNavigation: NavItem[] = [
  { id: 'discover', label: 'DISCOVER', icon: Compass },
  { id: 'home', label: 'HOME', icon: House },
  { id: 'identity', label: 'IDENTITY', icon: UserRound },
]

// 右侧两个入口：和 REVERIE 发生关系。桌面端在主航栏，手机端收进顶部 MORE 菜单。
// 原先的英文小字（Partners / Open Calls、Story / Contact）已按项目方要求删除。
const secondaryNavigation: NavItem[] = [
  { id: 'collaborate', label: 'COLLABORATE', icon: Handshake },
  { id: 'about', label: 'ABOUT', icon: BookOpen },
]

function App() {
  const [section, setSection] = useState<Section>('discover')
  const [homeSection, setHomeSection] = useState<HomeSection>('explore')
  const [identityDraft, setIdentityDraft] = useState<IdentityDraft | null>(null)
  // 从 DISCOVER 的「查看票夹」进来时，IDENTITY 打开「我的票据」；关闭后消费掉这个请求。
  const [identityTickets, setIdentityTickets] = useState(false)
  // 手机端顶部 MORE 菜单：COLLABORATE 与 ABOUT 的子项都在这里。
  const [moreOpen, setMoreOpen] = useState(false)
  const moreButtonRef = useRef<HTMLButtonElement | null>(null)

  // 切换顶层栏目时回到页首，避免选择地点后落到新页面的中间位置。
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [section])

  // 从 MORE 菜单选子项：先切栏目，等视图渲染后再滚到对应区块。
  function openFromMore(target: MoreTarget) {
    setMoreOpen(false)
    setSection(target.section)
    if (!target.anchor) return
    window.setTimeout(() => {
      document.querySelector(target.anchor as string)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 140)
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="wordmark" href="#top" onClick={() => setSection('discover')} aria-label="REVERIE 首页">REVERIE<span>®</span></a>
        <LocationPicker onSelect={() => { setSection('home'); setHomeSection('explore') }} />
        <button className="avatar-button" type="button" onClick={() => setSection('identity')} aria-label="打开个人档案">E<span>01</span></button>
        <button className="header-more" type="button" ref={moreButtonRef} onClick={() => setMoreOpen(true)} aria-label="打开更多入口" aria-haspopup="dialog" aria-expanded={moreOpen}>
          MORE<ArrowUpRight size={14} aria-hidden="true" />
        </button>
      </header>

      <nav className="main-nav" aria-label="主导航">
        {[primaryNavigation, secondaryNavigation].map((group, groupIndex) => (
          <Fragment key={groupIndex === 0 ? 'primary' : 'secondary'}>
            <div className={`main-nav-group ${groupIndex === 1 ? 'main-nav-group-end' : ''}`}>
              {group.map(({ id, label, icon: Icon }) => (
                <button
                  className={`main-nav-item ${section === id ? 'is-active' : ''}`}
                  key={id}
                  type="button"
                  aria-current={section === id ? 'page' : undefined}
                  onClick={() => setSection(id)}
                >
                  <Icon size={16} strokeWidth={1.7} aria-hidden="true" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
            {groupIndex === 0 && <SocialMarks />}
          </Fragment>
        ))}
      </nav>

      <main className="page-content" id="top">
        {section === 'discover' && (
          <MonthlyThemeView
            onOpenShop={() => { setSection('home'); setHomeSection('shop') }}
            onOpenTickets={() => { setIdentityTickets(true); setSection('identity') }}
            onOpenContent={() => { setSection('home'); setHomeSection('content') }}
          />
        )}

        {section === 'home' && (
          <section className="home-view" aria-labelledby="home-title">
            <div className="section-meta"><span>THE CITY, IN REAL LIFE</span><span>上海 / SHANGHAI</span></div>
            <div className="home-heading">
              <div><h1 id="home-title">在现场，<br /><span>遇见更多。</span></h1></div>
              <p className="heading-aside">城市不是背景，<br />它是正在发生的事。</p>
            </div>
            <div className="home-tabs" role="tablist" aria-label="城市栏目">
              {homeSections.map(({ id, label, icon: Icon }) => (
                <button
                  className={`home-tab ${homeSection === id ? 'is-active' : ''}`}
                  id={`tab-${id}`}
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={homeSection === id}
                  onClick={() => setHomeSection(id)}
                >
                  <Icon size={15} aria-hidden="true" /><span>{label}</span>
                </button>
              ))}
            </div>
            {homeSection === 'explore' ? (
              <ExploreView
                onOpenContent={() => setHomeSection('content')}
                onOpenEvents={() => setHomeSection('events')}
                onOpenShop={() => setHomeSection('shop')}
                onOpenSpace={() => setHomeSection('space')}
                onWriteRecord={(experience) => { setIdentityDraft(experience); setSection('identity') }}
              />
            ) : homeSection === 'content' ? <ContentView /> : homeSection === 'events' ? <EventsView /> : homeSection === 'shop' ? <MarketView /> : <SpaceView />}
          </section>
        )}

        {section === 'identity' && (
          <IdentityView
            onFindEvents={() => { setSection('home'); setHomeSection('events') }}
            onFindExplore={() => { setSection('home'); setHomeSection('explore') }}
            onFindSpace={() => { setSection('home'); setHomeSection('space') }}
            experienceDraft={identityDraft}
            onExperienceDraftConsumed={() => setIdentityDraft(null)}
            ticketsRequested={identityTickets}
            onTicketsRequestedConsumed={() => setIdentityTickets(false)}
          />
        )}

        {section === 'collaborate' && <CollaborateView />}

        {section === 'about' && <AboutView />}
      </main>

      <footer className="app-footer"><span>AS WE WANDER, WE BECOME.</span><span>UNSEEN® / SHANGHAI</span></footer>
      <nav className="mobile-nav" aria-label="移动端主导航">
        {primaryNavigation.map(({ id, label, icon: Icon }) => (
          <button className={section === id ? 'is-active' : ''} key={id} type="button" aria-current={section === id ? 'page' : undefined} onClick={() => setSection(id)}>
            <Icon size={19} strokeWidth={1.7} aria-hidden="true" /><span>{label}</span>
          </button>
        ))}
      </nav>

      {moreOpen && <MoreMenu onClose={() => { setMoreOpen(false); window.requestAnimationFrame(() => moreButtonRef.current?.focus()) }} onSelect={openFromMore} />}
    </div>
  )
}

export default App