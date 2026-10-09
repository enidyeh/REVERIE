import type { DiscoverPreferences } from '../data/discover'
import { preferenceOptions } from '../data/explore-guides'
import { exploreCopy } from '../i18n/explore'
import { useLocale } from '../i18n/use-locale'
import './preference-controls.css'

type PreferenceControlsProps = {
  preferences: DiscoverPreferences
  onChange: <Key extends keyof DiscoverPreferences>(key: Key, value: DiscoverPreferences[Key]) => void
}

// 选项文案统一放在 src/i18n/explore.ts，筛选提示也用同一份。
function PreferenceControls({ preferences, onChange }: PreferenceControlsProps) {
  const { t } = useLocale()

  return (
    <div className="preference-controls">
      <label>{t(exploreCopy.preferenceLabels.interest)}
        <select value={preferences.interest} onChange={(event) => onChange('interest', event.target.value as DiscoverPreferences['interest'])}>
          {preferenceOptions.interest.map((option) => <option value={option.value} key={option.value}>{t(option.label)}</option>)}
        </select>
      </label>
      <label>{t(exploreCopy.preferenceLabels.timeLimit)}
        <select value={preferences.timeLimit} onChange={(event) => onChange('timeLimit', event.target.value as DiscoverPreferences['timeLimit'])}>
          {preferenceOptions.timeLimit.map((option) => <option value={option.value} key={option.value}>{t(option.label)}</option>)}
        </select>
      </label>
      <label>{t(exploreCopy.preferenceLabels.company)}
        <select value={preferences.company} onChange={(event) => onChange('company', event.target.value as DiscoverPreferences['company'])}>
          {preferenceOptions.company.map((option) => <option value={option.value} key={option.value}>{t(option.label)}</option>)}
        </select>
      </label>
    </div>
  )
}

export default PreferenceControls