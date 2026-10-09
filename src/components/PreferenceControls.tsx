import type { DiscoverPreferences } from '../data/discover'
import { preferenceOptions } from '../data/explore-guides'
import './preference-controls.css'

type PreferenceControlsProps = {
  preferences: DiscoverPreferences
  onChange: <Key extends keyof DiscoverPreferences>(key: Key, value: DiscoverPreferences[Key]) => void
}

// 选项文案统一放在 src/data/explore-guides.ts，筛选提示也用同一份。
function PreferenceControls({ preferences, onChange }: PreferenceControlsProps) {
  return (
    <div className="preference-controls">
      <label>兴趣方向
        <select value={preferences.interest} onChange={(event) => onChange('interest', event.target.value as DiscoverPreferences['interest'])}>
          {preferenceOptions.interest.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
        </select>
      </label>
      <label>可用时长
        <select value={preferences.timeLimit} onChange={(event) => onChange('timeLimit', event.target.value as DiscoverPreferences['timeLimit'])}>
          {preferenceOptions.timeLimit.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
        </select>
      </label>
      <label>出行方式
        <select value={preferences.company} onChange={(event) => onChange('company', event.target.value as DiscoverPreferences['company'])}>
          {preferenceOptions.company.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
        </select>
      </label>
    </div>
  )
}

export default PreferenceControls