import { Search, Filter, ArrowUpDown } from 'lucide-react'

/**
 * The data-table primitives shared by ClientsPage and DealPage.
 *
 * These lived in ClientsPage.css as `.cp-table__*` and were borrowed by
 * DealPage through global CSS. Exporting them keeps the dependency explicit.
 */

export const TH     = 'whitespace-nowrap border-b border-line bg-page px-3 py-2 text-left text-xs font-semibold text-minor'
export const CELL   = 'whitespace-nowrap px-3 py-2.5 text-left align-middle text-sm text-major'
export const T_LINK = 'text-sm font-semibold text-primary underline transition-opacity hover:opacity-80'
export const ROW    = 'border-b border-line transition-colors duration-100 last:border-b-0 hover:bg-primary-subtle'
export const PRIMARY_BTN =
  'inline-flex h-8 cursor-pointer items-center gap-2 self-start rounded border border-primary bg-primary px-3 text-sm font-semibold text-white transition-opacity duration-150 hover:opacity-90'
export const TABLE_WRAP = 'flex flex-col overflow-x-auto rounded border border-line'
export const TABLE      = 'w-full border-collapse bg-surface'

export function SortableTh({ children, width }) {
  return (
    <th className={TH} style={{ width }}>
      <span className="inline-flex items-center gap-1.5">
        {children}
        <ArrowUpDown size={12} strokeWidth={1.75} className="shrink-0 text-minor" />
      </span>
    </th>
  )
}

export function SearchRow({ cols }) {
  return (
    <tr className="bg-surface">
      {cols.map((_, i) => (
        <td key={i} className="border-b border-line px-2 py-1.5">
          <div className="flex h-6 items-center gap-1.5 rounded border border-line bg-page px-2 text-minor">
            <Search size={12} strokeWidth={1.75} />
            <input
              type="text"
              placeholder="Search"
              className="min-w-0 flex-1 border-none bg-transparent text-xs text-major outline-none placeholder:text-minor"
            />
            <Filter size={12} strokeWidth={1.75} />
          </div>
        </td>
      ))}
    </tr>
  )
}

export function TableFooter({ children }) {
  return (
    <div className="flex items-center justify-between border-t border-line bg-page px-4 py-2.5 text-xs text-minor">
      {children}
    </div>
  )
}
