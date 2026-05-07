import { useState } from 'react'
import { ChevronRight, Globe, DollarSign, Check } from 'lucide-react'
import './SettingsPage.css'

/* ── Constants ──────────────────────────────────────────────────── */

const LANGUAGES = [
  { code: 'en', label: 'English',    flag: '🇬🇧' },
  { code: 'fr', label: 'Français',   flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch',    flag: '🇩🇪' },
  { code: 'es', label: 'Español',    flag: '🇪🇸' },
  { code: 'it', label: 'Italiano',   flag: '🇮🇹' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
]

const DATE_FORMATS = [
  { value: 'dd/mm/yyyy', label: 'DD/MM/YYYY', example: '28/10/2025' },
  { value: 'mm/dd/yyyy', label: 'MM/DD/YYYY', example: '10/28/2025' },
  { value: 'yyyy-mm-dd', label: 'YYYY-MM-DD', example: '2025-10-28' },
]

const CURRENCIES = [
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'CHF', symbol: '₣', label: 'Swiss Franc' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
  { code: 'SEK', symbol: 'kr', label: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', label: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', label: 'Danish Krone' },
]

const NUMBER_FORMATS = [
  { value: 'eu',  label: '1.234.567,89',  example: 'Space as thousands, comma as decimal' },
  { value: 'us',  label: '1,234,567.89',  example: 'Comma as thousands, dot as decimal' },
  { value: 'ch',  label: "1'234'567.89",  example: "Apostrophe as thousands, dot as decimal" },
]

const DISPLAY_MODES = [
  { value: 'code',   label: 'Currency code', example: '150 EUR' },
  { value: 'symbol', label: 'Symbol',         example: '€150' },
  { value: 'both',   label: 'Both',           example: '€150 EUR' },
]

function loadSettings() {
  try {
    const raw = localStorage.getItem('cockpit_settings')
    if (raw) return JSON.parse(raw)
  } catch {}
  return {
    language:       'en',
    dateFormat:     'dd/mm/yyyy',
    primaryCurrency: 'EUR',
    showSecondary:  false,
    secondaryCurrency: 'USD',
    numberFormat:   'eu',
    displayMode:    'code',
  }
}

function saveSettings(s) {
  localStorage.setItem('cockpit_settings', JSON.stringify(s))
}

/* ── Sub-components ─────────────────────────────────────────────── */

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="settings-section__header">
      <div className="settings-section__icon">
        <Icon size={18} strokeWidth={1.75} />
      </div>
      <div>
        <h2 className="settings-section__title">{title}</h2>
        <p className="settings-section__desc">{description}</p>
      </div>
    </div>
  )
}

function FieldRow({ label, hint, children }) {
  return (
    <div className="settings-field">
      <div className="settings-field__label-col">
        <span className="settings-field__label">{label}</span>
        {hint && <span className="settings-field__hint">{hint}</span>}
      </div>
      <div className="settings-field__control">
        {children}
      </div>
    </div>
  )
}

function RadioGroup({ options, value, onChange, renderLabel }) {
  return (
    <div className="settings-radio-group">
      {options.map(opt => (
        <label
          key={opt.value ?? opt.code}
          className={`settings-radio${value === (opt.value ?? opt.code) ? ' settings-radio--active' : ''}`}
        >
          <input
            type="radio"
            name={Math.random()}
            value={opt.value ?? opt.code}
            checked={value === (opt.value ?? opt.code)}
            onChange={() => onChange(opt.value ?? opt.code)}
          />
          <span className="settings-radio__check">
            {value === (opt.value ?? opt.code) && <Check size={10} strokeWidth={3} />}
          </span>
          {renderLabel ? renderLabel(opt) : (
            <span className="settings-radio__label">{opt.label}</span>
          )}
        </label>
      ))}
    </div>
  )
}

function CurrencySelect({ value, onChange, exclude }) {
  const options = exclude ? CURRENCIES.filter(c => c.code !== exclude) : CURRENCIES
  return (
    <select
      className="settings-select"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {options.map(c => (
        <option key={c.code} value={c.code}>
          {c.code} – {c.label}
        </option>
      ))}
    </select>
  )
}

/* ── Page ───────────────────────────────────────────────────────── */

export default function SettingsPage({ style, onNavigateHome }) {
  const [settings, setSettings] = useState(loadSettings)
  const [saved,    setSaved]    = useState(false)

  function update(key, val) {
    setSettings(prev => ({ ...prev, [key]: val }))
    setSaved(false)
  }

  function handleSave() {
    saveSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <main className="settings-page" style={style}>

      {/* Breadcrumb */}
      <div className="settings-page__breadcrumb">
        <button className="settings-page__bc-link" onClick={() => onNavigateHome?.()}>Home</button>
        <ChevronRight size={14} strokeWidth={2} className="settings-page__bc-sep" />
        <span className="settings-page__bc-current">Settings</span>
      </div>

      <div className="settings-page__content">

        <div className="settings-page__header">
          <h1 className="settings-page__title">Settings</h1>
          <p className="settings-page__subtitle">Manage your language, region and display preferences.</p>
        </div>

        {/* ── Language & Region ── */}
        <section className="settings-section">
          <SectionHeader
            icon={Globe}
            title="Language & region"
            description="Choose the language and date format used throughout the application."
          />
          <div className="settings-section__divider" />

          <div className="settings-fields">
            <FieldRow label="Language" hint="Interface language">
              <RadioGroup
                options={LANGUAGES}
                value={settings.language}
                onChange={v => update('language', v)}
                renderLabel={opt => (
                  <span className="settings-radio__label">
                    <span className="settings-radio__flag">{opt.flag}</span>
                    {opt.label}
                  </span>
                )}
              />
            </FieldRow>

            <div className="settings-fields__divider" />

            <FieldRow label="Date format" hint="How dates are displayed in tables and detail views">
              <RadioGroup
                options={DATE_FORMATS}
                value={settings.dateFormat}
                onChange={v => update('dateFormat', v)}
                renderLabel={opt => (
                  <span className="settings-radio__label">
                    <span className="settings-radio__main">{opt.label}</span>
                    <span className="settings-radio__example">{opt.example}</span>
                  </span>
                )}
              />
            </FieldRow>
          </div>
        </section>

        {/* ── Currency preferences ── */}
        <section className="settings-section">
          <SectionHeader
            icon={DollarSign}
            title="Currency preferences"
            description="Set how amounts and currencies are displayed across deals and reports."
          />
          <div className="settings-section__divider" />

          <div className="settings-fields">
            <FieldRow label="Primary currency" hint="Default currency for amounts">
              <CurrencySelect
                value={settings.primaryCurrency}
                onChange={v => update('primaryCurrency', v)}
                exclude={settings.showSecondary ? settings.secondaryCurrency : null}
              />
            </FieldRow>

            <div className="settings-fields__divider" />

            <FieldRow label="Secondary currency" hint="Show a second currency alongside the primary">
              <div className="settings-toggle-row">
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={settings.showSecondary}
                    onChange={e => update('showSecondary', e.target.checked)}
                  />
                  <span className="settings-toggle__track">
                    <span className="settings-toggle__thumb" />
                  </span>
                  <span className="settings-toggle__label">
                    {settings.showSecondary ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
                {settings.showSecondary && (
                  <CurrencySelect
                    value={settings.secondaryCurrency}
                    onChange={v => update('secondaryCurrency', v)}
                    exclude={settings.primaryCurrency}
                  />
                )}
              </div>
            </FieldRow>

            <div className="settings-fields__divider" />

            <FieldRow label="Number format" hint="Thousands and decimal separators">
              <RadioGroup
                options={NUMBER_FORMATS}
                value={settings.numberFormat}
                onChange={v => update('numberFormat', v)}
                renderLabel={opt => (
                  <span className="settings-radio__label">
                    <span className="settings-radio__main">{opt.label}</span>
                    <span className="settings-radio__example">{opt.example}</span>
                  </span>
                )}
              />
            </FieldRow>

            <div className="settings-fields__divider" />

            <FieldRow label="Currency display" hint="How the currency identifier is shown next to amounts">
              <RadioGroup
                options={DISPLAY_MODES}
                value={settings.displayMode}
                onChange={v => update('displayMode', v)}
                renderLabel={opt => (
                  <span className="settings-radio__label">
                    <span className="settings-radio__main">{opt.label}</span>
                    <span className="settings-radio__example">{opt.example}</span>
                  </span>
                )}
              />
            </FieldRow>
          </div>
        </section>

        {/* ── Save bar ── */}
        <div className="settings-save-bar">
          <button className="settings-save-bar__btn" onClick={handleSave}>
            {saved ? <><Check size={15} strokeWidth={2.5} /> Saved</> : 'Save preferences'}
          </button>
          {saved && <span className="settings-save-bar__confirm">Your preferences have been saved.</span>}
        </div>

      </div>
    </main>
  )
}
