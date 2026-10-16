/**
 * Shared class strings.
 *
 * These used to live in MyApplicationsPage.css but were consumed by
 * ControlsPage and NotificationsPage too. Keeping them here makes the
 * sharing explicit instead of relying on stylesheet load order.
 */

/** Pill filter. */
export const chip = (active) => [
  'inline-flex h-6 cursor-pointer items-center justify-center whitespace-nowrap rounded-full border px-3 text-base font-semibold transition-[background-color,border-color,color] duration-150',
  active
    ? 'border-primary bg-primary text-reverse'
    : 'border-[#8e979c] bg-surface text-primary hover:border-primary hover:bg-primary-subtle',
].join(' ')

/** Borderless primary-coloured action button. */
export const ghostButton =
  'flex h-10 cursor-pointer items-center gap-2 rounded px-2.5 text-base font-semibold text-primary transition-colors duration-150 hover:bg-primary-subtle'

/** Green gradient breadcrumb banner that tops every inner page. */
export const breadcrumbBanner =
  'flex h-10 items-center gap-1 bg-[linear-gradient(135deg,#005740_0%,#007d57_50%,#00956a_100%)] px-4 md:px-8'

/** A breadcrumb entry that navigates. */
export const breadcrumbLink =
  'cursor-pointer whitespace-nowrap text-base font-semibold text-reverse underline decoration-white/60 underline-offset-2 transition-colors hover:decoration-white'

/** The trailing, non-clickable breadcrumb entry. */
export const breadcrumbCurrent =
  'whitespace-nowrap text-base font-semibold text-reverse'

/** Letter-tile colours for apps without a logo asset. Shared by My apps + Dashboard. */
export const APP_ICON_COLOR = {
  green:  'bg-[#007d57]',
  orange: 'bg-[#c0580e]',
  teal:   'bg-[#0e7b61]',
}

export const appIconBase =
  'flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sm font-bold text-white'
