import { useState, useId } from 'react'
import { ChevronRight, Globe, DollarSign, Check } from 'lucide-react'
import { breadcrumbBanner, breadcrumbLink, breadcrumbCurrent } from '../ui'

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

/* The chevron is painted as a background image so the native arrow can go. */
const SELECT_CHEVRON = "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235e6a71' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")] bg-[right_10px_center] bg-no-repeat"
const SELECT = `h-9 min-w-[220px] cursor-pointer appearance-none rounded border-[1.5px] border-line bg-page py-0 pl-3 pr-8 text-sm text-major transition-colors duration-100 focus:border-primary focus:outline-none ${SELECT_CHEVRON}`
const ROW_DIVIDER = 'mx-6 h-px bg-line'
const EXAMPLE = 'ml-1 text-xs text-minor'

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
    <div className="flex items-start gap-3 px-6 pb-4 pt-5">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded bg-primary-subtle text-primary">
        <Icon size={18} strokeWidth={1.75} />
      </div>
      <div>
        <h2 className="m-0 mb-1 text-lg font-semibold leading-[1.3] text-major">{title}</h2>
        <p className="m-0 text-[13px] leading-[1.5] text-minor">{description}</p>
      </div>
    </div>
  )
}

function FieldRow({ label, hint, children }) {
  return (
    <div className="flex flex-col items-start gap-3 px-6 py-5 md:flex-row md:gap-6">
      <div className="flex w-full flex-col gap-1 pt-0.5 md:w-auto md:flex-[0_0_200px]">
        <span className="text-sm font-semibold text-major">{label}</span>
        {hint && <span className="text-xs leading-[1.4] text-minor">{hint}</span>}
      </div>
      <div className="w-full min-w-0 flex-1">
        {children}
      </div>
    </div>
  )
}

function RadioGroup({ options, value, onChange, renderLabel }) {
  // One stable group name per mounted RadioGroup.
  const name = useId()
  return (
    <div className="flex flex-col gap-2">
      {options.map(opt => {
        const optValue = opt.value ?? opt.code
        const active = value === optValue
        return (
          <label
            key={optValue}
            className={[
              'flex cursor-pointer items-center gap-2.5 rounded border-[1.5px] px-3 py-2 transition-[border-color,background-color] duration-100',
              'hover:border-primary hover:bg-primary-subtle',
              active ? 'border-primary bg-primary-subtle' : 'border-line bg-page',
            ].join(' ')}
          >
            <input
              type="radio"
              className="hidden"
              name={name}
              value={optValue}
              checked={active}
              onChange={() => onChange(optValue)}
            />
            <span
              className={[
                'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.5px] text-white transition-[border-color,background-color] duration-100',
                active ? 'border-primary bg-primary' : 'border-line bg-surface',
              ].join(' ')}
            >
              {active && <Check size={10} strokeWidth={3} />}
            </span>
            {renderLabel ? renderLabel(opt) : (
              <span className="flex flex-1 items-center gap-2 text-sm text-major">{opt.label}</span>
            )}
          </label>
        )
      })}
    </div>
  )
}

function CurrencySelect({ value, onChange, exclude }) {
  const options = exclude ? CURRENCIES.filter(c => c.code !== exclude) : CURRENCIES
  return (
    <select
      className={SELECT}
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

export default function SettingsPage({ offsetClass = '', onNavigateHome }) {
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
    <main className={`min-h-screen bg-page pt-16 ${offsetClass}`}>

      {/* Breadcrumb */}
      <div className={breadcrumbBanner}>
        <button className={breadcrumbLink} onClick={() => onNavigateHome?.()}>Home</button>
        <ChevronRight size={14} strokeWidth={2} className="shrink-0 text-white/70" />
        <span className={breadcrumbCurrent}>Settings</span>
      </div>

      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 p-4 md:px-10 md:pb-20 md:pt-8">

        <div className="mb-1">
          <h1 className="m-0 mb-1.5 text-2xl font-bold text-major">Settings</h1>
          <p className="m-0 text-sm text-minor">Manage your language, region and display preferences.</p>
        </div>

        {/* ── Language & Region ── */}
        <section className="overflow-hidden rounded-lg border border-line bg-surface">
          <SectionHeader
            icon={Globe}
            title="Language & region"
            description="Choose the language and date format used throughout the application."
          />
          <div className="h-px bg-line" />

          <div>
            <FieldRow label="Language" hint="Interface language">
              <RadioGroup
                options={LANGUAGES}
                value={settings.language}
                onChange={v => update('language', v)}
                renderLabel={opt => (
                  <span className="flex flex-1 items-center gap-2 text-sm text-major">
                    <span className="text-lg leading-none">{opt.flag}</span>
                    {opt.label}
                  </span>
                )}
              />
            </FieldRow>

            <div className={ROW_DIVIDER} />

            <FieldRow label="Date format" hint="How dates are displayed in tables and detail views">
              <RadioGroup
                options={DATE_FORMATS}
                value={settings.dateFormat}
                onChange={v => update('dateFormat', v)}
                renderLabel={opt => (
                  <span className="flex flex-1 items-center gap-2 text-sm text-major">
                    <span className="font-semibold text-major">{opt.label}</span>
                    <span className={EXAMPLE}>{opt.example}</span>
                  </span>
                )}
              />
            </FieldRow>
          </div>
        </section>

        {/* ── Currency preferences ── */}
        <section className="overflow-hidden rounded-lg border border-line bg-surface">
          <SectionHeader
            icon={DollarSign}
            title="Currency preferences"
            description="Set how amounts and currencies are displayed across deals and reports."
          />
          <div className="h-px bg-line" />

          <div>
            <FieldRow label="Primary currency" hint="Default currency for amounts">
              <CurrencySelect
                value={settings.primaryCurrency}
                onChange={v => update('primaryCurrency', v)}
                exclude={settings.showSecondary ? settings.secondaryCurrency : null}
              />
            </FieldRow>

            <div className={ROW_DIVIDER} />

            <FieldRow label="Secondary currency" hint="Show a second currency alongside the primary">
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex cursor-pointer select-none items-center gap-2.5">
                  <input
                    type="checkbox"
                    className="peer hidden"
                    checked={settings.showSecondary}
                    onChange={e => update('showSecondary', e.target.checked)}
                  />
                  <span className="relative h-[22px] w-10 shrink-0 rounded-full bg-line transition-colors duration-200 peer-checked:bg-primary peer-checked:[&>span]:translate-x-[18px]">
                    <span className="absolute left-[3px] top-[3px] h-4 w-4 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,.2)] transition-transform duration-200" />
                  </span>
                  <span className="min-w-[60px] text-sm text-major">
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

            <div className={ROW_DIVIDER} />

            <FieldRow label="Number format" hint="Thousands and decimal separators">
              <RadioGroup
                options={NUMBER_FORMATS}
                value={settings.numberFormat}
                onChange={v => update('numberFormat', v)}
                renderLabel={opt => (
                  <span className="flex flex-1 items-center gap-2 text-sm text-major">
                    <span className="font-semibold text-major">{opt.label}</span>
                    <span className={EXAMPLE}>{opt.example}</span>
                  </span>
                )}
              />
            </FieldRow>

            <div className={ROW_DIVIDER} />

            <FieldRow label="Currency display" hint="How the currency identifier is shown next to amounts">
              <RadioGroup
                options={DISPLAY_MODES}
                value={settings.displayMode}
                onChange={v => update('displayMode', v)}
                renderLabel={opt => (
                  <span className="flex flex-1 items-center gap-2 text-sm text-major">
                    <span className="font-semibold text-major">{opt.label}</span>
                    <span className={EXAMPLE}>{opt.example}</span>
                  </span>
                )}
              />
            </FieldRow>
          </div>
        </section>

        {/* ── Save bar ── */}
        <div className="flex items-center gap-4">
          <button
            className="inline-flex h-[38px] cursor-pointer items-center gap-2 rounded bg-primary px-5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-hover"
            onClick={handleSave}
          >
            {saved ? <><Check size={15} strokeWidth={2.5} /> Saved</> : 'Save preferences'}
          </button>
          {saved && <span className="text-[13px] font-semibold text-primary">Your preferences have been saved.</span>}
        </div>

      </div>
    </main>
  )
}
