export const LS_KEY = 'cockpit_fav_apps'

export const SECTIONS = [
  {
    id: 'atm',
    title: 'ATM+ Suite',
    chip: 'ATM+',
    apps: [
      { id: 'glass',    name: 'Glass',    figmaIcon: 'glass',    description: 'Management of Agency and Middle Office activities across the full value chain, tracking financing operations (contracts and tranches) through key characteristics such as lender pools. The system covers the complete deal lifecycle from pre-closing to termination, improving operational efficiency for all stakeholders.' },
      { id: 'comon',    name: 'Comon',    figmaIcon: 'comon',    description: 'The application provides an integrated, modular, and global system to monitor covenants.' },
      { id: 'mitigant', name: 'Mitigant', figmaIcon: 'mitigant', description: 'Tracking of all mitigants (real guarantees, sureties, pledges, credit insurance) across all credit portfolios, generates alerts in case of expiration or depreciation, and produces consolidated reports to facilitate decision-making and ensure regulatory compliance.' },
      { id: 'asset',    name: 'Asset',    figmaIcon: 'asset',    description: 'Comprehensive asset management module for tangible assets financed or pledged as collateral, centralizing asset records, valuations, and insurance tracking.' },
    ],
  },
  {
    id: 'documents',
    title: 'Documents',
    chip: 'Documents',
    apps: [
      { id: 'docmgmt',   name: 'Documents Management', figmaIcon: 'docmanagement', description: 'Centralized document management system with AI capabilities for data extraction and analysis, providing a reusable component for other applications.' },
      { id: 'reporting', name: 'Reporting',             figmaIcon: 'reporting',     description: 'Unified reporting platform that consolidates data across all Loanscape modules to generate regulatory, management, and operational reports.' },
    ],
  },
  {
    id: 'credit',
    title: 'Credit Committee',
    chip: 'ESG',
    subtitle: 'Solutions for preparing, reviewing, and submitting credit files, as well as tracking committee decisions.',
    apps: [
      { id: 'anadefi',    name: 'Anadefi',                   letter: 'A', iconColor: 'green', description: 'Description on 2 lines maximum.' },
      { id: 'bma',        name: 'BMA',                       letter: 'B', iconColor: 'green', description: 'Description on 2 lines maximum.' },
      { id: 'cliq',       name: 'CLIQ',                      letter: 'C', iconColor: 'green', description: 'Description on 2 lines maximum.' },
      { id: 'compliance', name: 'Compliance Grid',           letter: 'C', iconColor: 'green', description: 'Description on 2 lines maximum.' },
      { id: 'cct',        name: 'Credit Committee Template', letter: 'C', iconColor: 'green', description: 'Description on 2 lines maximum.' },
      { id: 'npvpi',      name: 'NPV PI',                    letter: 'N', iconColor: 'green', description: 'Description on 2 lines maximum.' },
      { id: 'phidias',    name: 'PHIDIAS',                   letter: 'P', iconColor: 'green', description: 'Description on 2 lines maximum.' },
      { id: 'korus',      name: 'Korus',                     letter: 'K', iconColor: 'green', description: 'Description on 2 lines maximum.' },
      { id: 'kiwis',      name: 'Kiwis',                     letter: 'K', iconColor: 'green', description: 'Description on 2 lines maximum.' },
    ],
  },
  {
    id: 'knowledge',
    title: 'Knowledge Bases',
    chip: 'Knowledge Bases',
    subtitle: 'Repositories of internal knowledge for policies, procedures, insights, and best practices.',
    apps: [
      { id: 'clf', name: 'CLF', letter: 'C', iconColor: 'teal', description: 'Description on 2 lines maximum.' },
      { id: 'era', name: 'ERA', letter: 'E', iconColor: 'teal', description: 'Description on 2 lines maximum.' },
      { id: 'itb', name: 'ITB', letter: 'I', iconColor: 'teal', description: 'Description on 2 lines maximum.' },
    ],
  },
]

export const ALL_APPS = SECTIONS.flatMap(s => s.apps)

export const CHIPS = ['All', 'ATM+', 'Documents', 'ESG', 'Knowledge Bases']

export function getFavoriteIds() {
  try { return new Set(JSON.parse(localStorage.getItem(LS_KEY)) ?? []) }
  catch { return new Set() }
}
