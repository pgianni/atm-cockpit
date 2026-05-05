import { FileText, Handshake, Layers, Building2, ShieldCheck, Lock, File } from 'lucide-react'

export const TYPE_ICON = {
  deal:     Handshake,
  contrat:  FileText,
  tranche:  Layers,
  asset:    Building2,
  covenant: ShieldCheck,
  surete:   Lock,
  document: File,
}

export const TYPE_LABEL = {
  deal:     'Deal',
  contrat:  'Contrat',
  tranche:  'Tranche',
  asset:    'Asset',
  covenant: 'Covenant',
  surete:   'Sûreté',
  document: 'Document',
}

export const RESULTS = [
  {
    id: 1, type: 'deal', dealId: 1,
    title: 'Silverpath Infra – Senior Secured',
    meta: ['Signé le 28/10/2025', '150 M EUR'],
    tags: ['Infrastructure', 'Senior'],
    clients: ['Atlas Energy', 'Gaia Infrastructure'],
  },
  {
    id: 2, type: 'deal', dealId: 2,
    title: 'Energy Project – Refinancement',
    meta: ['En cours', '75 M EUR'],
    tags: ['Énergie'],
    clients: ['Helios Aviation Partners'],
  },
  {
    id: 3, type: 'contrat',
    title: 'Contrat de prêt – Silverpath Infra #1',
    meta: ['Signé le 12/09/2025', 'Ref. CTR-2025-0091'],
    tags: ['Prêt syndiqué'],
    clients: ['Atlas Energy'],
  },
  {
    id: 4, type: 'tranche',
    title: 'Tranche A – Silverpath Infra',
    meta: ['100 M EUR', 'Taux fixe 4,25 %', 'Maturité 2032'],
    tags: ['Senior', 'Fixe'],
    clients: ['Atlas Energy', 'Gaia Infrastructure'],
  },
  {
    id: 5, type: 'tranche',
    title: 'Tranche B – Silverpath Infra',
    meta: ['50 M EUR', 'Taux variable EURIBOR+150', 'Maturité 2030'],
    tags: ['Senior', 'Variable'],
    clients: ['Atlas Energy'],
  },
  {
    id: 6, type: 'asset',
    title: 'Centrale solaire Provence-Est',
    meta: ['Valorisée au 01/01/2025', '48 M EUR'],
    tags: ['Énergie renouvelable'],
    clients: ['Gaia Infrastructure'],
  },
  {
    id: 7, type: 'covenant',
    title: 'Ratio Levier – Silverpath Infra',
    meta: ['Seuil : ≤ 4,5x', 'Fréquence : trimestrielle', 'Prochain test : 31/03/2026'],
    tags: ['Financier'],
    clients: ['Atlas Energy'],
  },
  {
    id: 8, type: 'covenant',
    title: 'DSCR – Energy Project',
    meta: ['Seuil : ≥ 1,20x', 'Fréquence : semestrielle'],
    tags: ['Financier'],
    clients: ['Helios Aviation Partners'],
  },
  {
    id: 9, type: 'surete',
    title: 'Nantissement de parts – Silverpath Holding',
    meta: ['Rang : 1er', 'Enregistrée le 15/09/2025'],
    tags: ['Nantissement'],
    clients: ['Atlas Energy'],
  },
  {
    id: 10, type: 'document',
    title: 'Term Sheet – Silverpath Infra v3.pdf',
    meta: ['Ajouté le 05/08/2025', '2,1 Mo'],
    tags: ['Term Sheet', 'PDF'],
    clients: ['Atlas Energy'],
  },
  {
    id: 11, type: 'document',
    title: 'Rapport de gestion Q3 2025 – Energy Project.xlsx',
    meta: ['Ajouté le 22/10/2025', '890 Ko'],
    tags: ['Rapport', 'Excel'],
    clients: ['Helios Aviation Partners'],
  },
  {
    id: 12, type: 'asset',
    title: 'Parc éolien offshore BlueHarbor',
    meta: ['Valorisé au 15/09/2025', '120 M EUR'],
    tags: ['Énergie renouvelable'],
    clients: ['Gaia Infrastructure'],
  },
  {
    id: 13, type: 'contrat',
    title: 'Contrat de garantie – Energy Project',
    meta: ['Signé le 03/07/2025', 'Ref. CTR-2025-0044'],
    tags: ['Garantie'],
    clients: ['Helios Aviation Partners'],
  },
  {
    id: 14, type: 'document',
    title: 'Memo crédit – Northwind Mobility.pdf',
    meta: ['Ajouté le 01/11/2025', '1,4 Mo'],
    tags: ['Memo', 'PDF'],
    clients: ['Atlas Energy'],
  },
]

export function searchResults(query) {
  if (!query || query.length < 2) return []
  const q = query.toLowerCase()
  return RESULTS.filter(r =>
    [r.title, ...r.meta, ...r.tags, ...r.clients]
      .some(s => s.toLowerCase().includes(q))
  )
}
