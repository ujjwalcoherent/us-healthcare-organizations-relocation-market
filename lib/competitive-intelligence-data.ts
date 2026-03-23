/**
 * Competitive Intelligence Data Generator
 * Generates data for competitive dashboard and market share analysis
 * Last updated: 2024
 */

import { CHART_COLORS } from '@/lib/chart-theme'

export interface Proposition {
  title: string
  description: string
  category: string
}

export interface CompanyData {
  id: string
  name: string
  headquarters: string
  ceo: string
  yearEstablished: number
  portfolio: string
  strategies: string[]
  regionalStrength: string
  overallRevenue: number // in USD Mn
  segmentalRevenue: number // in USD Mn for 2024
  marketShare: number // percentage
  propositions?: Proposition[] // Dynamic propositions array
}

export interface MarketShareData {
  company: string
  marketShare: number
  color: string
}

export interface CompetitiveIntelligenceData {
  metadata: {
    market: string
    year: number
    currency: string
    revenue_unit: string
    total_companies: number
  }
  companies: CompanyData[]
  market_share_data: MarketShareData[]
}

let cachedData: CompetitiveIntelligenceData | null = null

/**
 * Parse competitive intelligence CSV row and extract propositions
 */
function parsePropositionsFromRow(row: Record<string, any>): Proposition[] {
  const propositions: Proposition[] = []
  
  // Look for proposition fields (Proposition 1 Title, Proposition 1 Description, etc.)
  let propIndex = 1
  while (true) {
    const titleKey = `Proposition ${propIndex} Title`
    const descKey = `Proposition ${propIndex} Description`
    const catKey = `Proposition ${propIndex} Category`
    
    const title = row[titleKey]?.toString().trim()
    const description = row[descKey]?.toString().trim()
    const category = row[catKey]?.toString().trim()
    
    // If no title, stop looking for more propositions
    if (!title || title === 'N/A' || title === '') {
      break
    }
    
    propositions.push({
      title,
      description: description || '',
      category: category || 'General'
    })
    
    propIndex++
    
    // Safety limit - prevent infinite loops
    if (propIndex > 10) break
  }
  
  return propositions
}

/**
 * Parse competitive intelligence data from CSV/JSON format
 */
export function parseCompetitiveIntelligenceFromData(rows: Record<string, any>[]): CompanyData[] {
  return rows.map((row, index) => {
    const marketShare = parseFloat(row['Market Share (%)']?.toString().replace('%', '') || '0')
    const revenue = generateRevenue(marketShare)
    
    // Parse propositions from row
    const propositions = parsePropositionsFromRow(row)
    
    // Get company name for color lookup
    const companyName = row['Company Name']?.toString() || ''
    const color = companyColors[companyName] || companyColors['Others'] || '#94a3b8'
    
    return {
      id: (row['Company ID'] || companyName.toLowerCase().replace(/\s+/g, '-') || `company-${index}`).toString(),
      name: companyName,
      headquarters: row['Headquarters']?.toString() || '',
      ceo: row['CEO']?.toString() || '',
      yearEstablished: parseInt(row['Year Established']?.toString() || '0'),
      portfolio: row['Product/Service Portfolio']?.toString() || '',
      strategies: (row['Strategies (comma-separated)']?.toString() || '').split(',').map((s: string) => s.trim()).filter(Boolean),
      regionalStrength: row['Regional Strength']?.toString() || '',
      overallRevenue: parseFloat(row['Overall Revenue (USD Mn)']?.toString() || revenue.overall.toString()),
      segmentalRevenue: parseFloat(row['Segmental Revenue (USD Mn)']?.toString() || revenue.segmental.toString()),
      marketShare: marketShare,
      propositions: propositions.length > 0 ? propositions : undefined,
      color: color
    }
  })
}

/**
 * Load competitive intelligence data from store or API
 */
export async function loadCompetitiveIntelligenceData(): Promise<CompetitiveIntelligenceData | null> {
  if (cachedData) {
    return cachedData
  }

  // Try to get data from store first (if uploaded via dashboard builder)
  // Only try this in browser environment (client-side)
  if (typeof window !== 'undefined') {
    try {
      const { useDashboardStore } = require('./store')
      const store = useDashboardStore.getState()
      
      if (store.competitiveIntelligenceData && store.competitiveIntelligenceData.rows && store.competitiveIntelligenceData.rows.length > 0) {
        console.log('Using competitive intelligence data from store')
        // Parse the store data
        const companies = parseCompetitiveIntelligenceFromData(store.competitiveIntelligenceData.rows)
        
        // Calculate market share data
        const marketShareData = companies.map((company, index) => ({
          company: company.name,
          marketShare: company.marketShare,
          color: CHART_COLORS.primary[index % CHART_COLORS.primary.length]
        }))
        
        const data: CompetitiveIntelligenceData = {
          metadata: {
            market: 'Competitive Intelligence Market',
            year: 2024,
            currency: 'USD',
            revenue_unit: 'Mn',
            total_companies: companies.length
          },
          companies,
          market_share_data: marketShareData
        }
        
        // Cache the data
        cachedData = data
        return cachedData
      }
    } catch (error) {
      console.warn('Could not access store for competitive intelligence data:', error)
    }
  }

  try {
    // Try to load from API endpoint
    const response = await fetch('/api/load-competitive-intelligence', {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      // If file not found, return null to use fallback data
      if (response.status === 404) {
        console.log('Competitive intelligence CSV not found, using fallback data')
        return null
      }
      throw new Error(`Failed to load competitive intelligence: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // Cache the data
    cachedData = data as CompetitiveIntelligenceData
    
    return cachedData
  } catch (error) {
    console.error('Error loading competitive intelligence data:', error)
    // Return null to use fallback data
    return null
  }
}

// Top healthcare organizations relocation companies in U.S. market
const companies = [
  'Stericycle (MedSolutions)',
  'UniGroup (United Van Lines Healthcare)',
  'PODS Healthcare Division',
  'Medxcel Facilities Management',
  'JLL Healthcare',
  'CBRE Healthcare',
  'Sodexo Healthcare',
  'ABM Healthcare',
  'Others'
]

// Company colors using the enterprise palette
const companyColors: Record<string, string> = {
  'Stericycle (MedSolutions)': '#52B69A',
  'UniGroup (United Van Lines Healthcare)': '#34A0A4',
  'PODS Healthcare Division': '#D9ED92',
  'Medxcel Facilities Management': '#184E77',
  'JLL Healthcare': '#B5E48C',
  'CBRE Healthcare': '#1E6091',
  'Sodexo Healthcare': '#168AAD',
  'ABM Healthcare': '#1A759F',
  'Others': '#99D98C'
}

// Headquarters locations
const headquarters: Record<string, string> = {
  'Stericycle (MedSolutions)': 'Bannockburn, IL, USA',
  'UniGroup (United Van Lines Healthcare)': 'Fenton, MO, USA',
  'PODS Healthcare Division': 'Clearwater, FL, USA',
  'Medxcel Facilities Management': 'Indianapolis, IN, USA',
  'JLL Healthcare': 'Chicago, IL, USA',
  'CBRE Healthcare': 'Dallas, TX, USA',
  'Sodexo Healthcare': 'Gaithersburg, MD, USA',
  'ABM Healthcare': 'New York, NY, USA',
  'Others': 'Various'
}

// CEOs
const ceos: Record<string, string> = {
  'Stericycle (MedSolutions)': 'Cindy J. Miller',
  'UniGroup (United Van Lines Healthcare)': 'Marc Rogers',
  'PODS Healthcare Division': 'William Strickland',
  'Medxcel Facilities Management': 'Mike Wilson',
  'JLL Healthcare': 'Christian Ulbrich',
  'CBRE Healthcare': 'Bob Sulentic',
  'Sodexo Healthcare': 'Sophie Bellon',
  'ABM Healthcare': 'Scott Salmirs',
  'Others': 'Multiple'
}

// Year established
const yearEstablished: Record<string, number> = {
  'Stericycle (MedSolutions)': 1989,
  'UniGroup (United Van Lines Healthcare)': 1928,
  'PODS Healthcare Division': 1998,
  'Medxcel Facilities Management': 2014,
  'JLL Healthcare': 1783,
  'CBRE Healthcare': 1906,
  'Sodexo Healthcare': 1966,
  'ABM Healthcare': 1909,
  'Others': 0
}

// Product portfolios
const portfolios: Record<string, string> = {
  'Stericycle (MedSolutions)': 'Medical Equipment Moving, Compliance Relocation, Biomedical Transport',
  'UniGroup (United Van Lines Healthcare)': 'Full-service Hospital Moves, Lab Relocation, IT Migration',
  'PODS Healthcare Division': 'Modular Storage, Phased Relocation, Temporary Facilities',
  'Medxcel Facilities Management': 'Facility Management, Renovation Coordination, Equipment Install',
  'JLL Healthcare': 'Strategic Planning, Project Management, Space Optimization',
  'CBRE Healthcare': 'Real Estate Advisory, Move Management, Facility Transition',
  'Sodexo Healthcare': 'Integrated Facilities, Equipment Logistics, Staff Transition',
  'ABM Healthcare': 'Facility Services, Technical Solutions, Infrastructure Support',
  'Others': 'Various Healthcare Relocation Services'
}

// Regional strengths
const regionalStrengths: Record<string, string> = {
  'Stericycle (MedSolutions)': 'Midwest, Northeast',
  'UniGroup (United Van Lines Healthcare)': 'Nationwide U.S.',
  'PODS Healthcare Division': 'Southeast, West',
  'Medxcel Facilities Management': 'Midwest, Southeast',
  'JLL Healthcare': 'Northeast, West',
  'CBRE Healthcare': 'Southwest, West',
  'Sodexo Healthcare': 'Northeast, Southeast',
  'ABM Healthcare': 'Nationwide U.S.',
  'Others': 'U.S. Regional'
}

// Market share percentages (must sum to 100)
const marketShares: Record<string, number> = {
  'Stericycle (MedSolutions)': 18.0,
  'UniGroup (United Van Lines Healthcare)': 15.0,
  'PODS Healthcare Division': 12.0,
  'Medxcel Facilities Management': 11.0,
  'JLL Healthcare': 10.0,
  'CBRE Healthcare': 9.0,
  'Sodexo Healthcare': 7.0,
  'ABM Healthcare': 5.0,
  'Others': 13.0
}

// Generate strategies based on company type
function generateStrategies(company: string): string[] {
  const strategyMap: Record<string, string[]> = {
    'Stericycle (MedSolutions)': ['Compliance-first Approach', 'Biomedical Specialization', 'Regulatory Expertise'],
    'UniGroup (United Van Lines Healthcare)': ['Full-service Model', 'National Coverage', 'Healthcare Vertical Expansion'],
    'PODS Healthcare Division': ['Modular Solutions', 'Cost Optimization', 'Phased Move Approach'],
    'Medxcel Facilities Management': ['Facility Integration', 'Post-move Support', 'Catholic Health Partnership'],
    'JLL Healthcare': ['Strategic Advisory', 'Technology-driven Planning', 'Portfolio Optimization'],
    'CBRE Healthcare': ['Real Estate Integration', 'Data Analytics', 'End-to-end Project Management'],
    'Sodexo Healthcare': ['Integrated Services', 'Staff Transition Support', 'Quality of Life Focus'],
    'ABM Healthcare': ['Technical Expertise', 'Infrastructure Focus', 'Scalable Solutions'],
    'Others': ['Regional Specialization', 'Niche Services', 'Local Market Focus']
  }
  
  return strategyMap[company] || ['Market Development', 'Product Innovation', 'Strategic Partnerships']
}

// Generate propositions based on company type
function generatePropositions(company: string): Proposition[] {
  const propositionMap: Record<string, Proposition[]> = {
    'Stericycle (MedSolutions)': [
      { title: 'Compliance-first Relocation', description: 'FDA and OSHA compliant medical equipment transport with chain-of-custody documentation', category: 'Regulatory Excellence' },
      { title: 'Biomedical Equipment Expertise', description: 'Specialized handling of MRI, CT, and imaging equipment with certified technicians', category: 'Technical Capability' },
      { title: 'Zero-downtime Move Planning', description: 'Phased relocation ensuring continuous patient care during facility transitions', category: 'Service Excellence' }
    ],
    'UniGroup (United Van Lines Healthcare)': [
      { title: 'Nationwide Hospital Moves', description: 'Full-service hospital relocations covering 48 states with dedicated healthcare crews', category: 'National Coverage' },
      { title: 'IT Infrastructure Migration', description: 'Secure EHR and medical data migration with HIPAA-compliant protocols', category: 'Technology' },
      { title: 'Lab Relocation Services', description: 'Specialized lab equipment packing, transport, and recalibration services', category: 'Specialty Services' }
    ],
    'PODS Healthcare Division': [
      { title: 'Modular Storage Solutions', description: 'On-site portable storage enabling phased moves with minimal disruption', category: 'Flexibility' },
      { title: 'Cost-effective Relocation', description: '30% cost savings vs traditional moves through modular approach', category: 'Cost Advantage' },
      { title: 'Temporary Facility Support', description: 'Interim storage and staging during renovation projects', category: 'Renovation Support' }
    ],
    'Medxcel Facilities Management': [
      { title: 'Integrated Facility Transition', description: 'End-to-end facility management from planning through post-move commissioning', category: 'Full Service' },
      { title: 'Catholic Health Network', description: 'Preferred partner for 160+ Catholic healthcare facilities nationwide', category: 'Network Strength' },
      { title: 'Equipment Installation', description: 'Post-move medical equipment installation and validation services', category: 'Technical Services' }
    ],
    'JLL Healthcare': [
      { title: 'Strategic Space Planning', description: 'Data-driven healthcare facility planning optimizing patient flow and staff efficiency', category: 'Strategic Advisory' },
      { title: 'Technology-driven Moves', description: 'Digital twin modeling for move simulation before execution', category: 'Innovation' },
      { title: 'Portfolio Optimization', description: 'Multi-site healthcare portfolio rationalization and consolidation advisory', category: 'Consulting' }
    ],
    'CBRE Healthcare': [
      { title: 'Real Estate Advisory', description: 'Healthcare-specific real estate strategy including site selection and lease negotiation', category: 'Real Estate' },
      { title: 'Move Management Platform', description: 'Proprietary project management software for complex multi-phase healthcare moves', category: 'Technology' },
      { title: 'Sustainability Focus', description: 'Green relocation practices including equipment recycling and energy-efficient setup', category: 'Sustainability' }
    ],
    'Sodexo Healthcare': [
      { title: 'Staff Transition Programs', description: 'Comprehensive workforce relocation support including housing and orientation', category: 'Human Capital' },
      { title: 'Integrated Facility Services', description: 'Combined relocation with ongoing facility management for seamless transitions', category: 'Integrated Services' },
      { title: 'Patient Experience Focus', description: 'Move planning centered on minimizing patient disruption and maintaining care quality', category: 'Patient Care' }
    ],
    'ABM Healthcare': [
      { title: 'Infrastructure Readiness', description: 'Pre-move infrastructure assessment and upgrade services for destination facilities', category: 'Technical Preparation' },
      { title: 'Scalable Move Teams', description: 'Flexible workforce deployment from 10 to 500+ personnel based on project scope', category: 'Scalability' },
      { title: 'Post-move Support', description: '90-day post-relocation facility support ensuring operational stability', category: 'Ongoing Support' }
    ],
    'Others': [
      { title: 'Regional Specialization', description: 'Deep expertise in local healthcare regulations and facility requirements', category: 'Local Expertise' },
      { title: 'Niche Equipment Handling', description: 'Specialized services for unique medical equipment categories', category: 'Specialty Services' },
      { title: 'Flexible Engagement Models', description: 'Customizable service packages for smaller healthcare organizations', category: 'Flexibility' }
    ]
  }
  
  return propositionMap[company] || [
    { title: 'Market Development', description: 'Expanding into new markets and segments', category: 'Market Strategy' },
    { title: 'Product Innovation', description: 'Continuous R&D and product development', category: 'Innovation' },
    { title: 'Strategic Partnerships', description: 'Building alliances for market expansion', category: 'Partnerships' }
  ]
}

// Generate revenue based on market share
function generateRevenue(marketShare: number): { overall: number, segmental: number } {
  // Total market size approximately 1287.5 USD Mn (2025)
  const totalMarketSize = 1287.5
  const segmentalRevenue = (marketShare / 100) * totalMarketSize
  
  // Overall revenue is typically 3-5x the segmental revenue (company has other products)
  const multiplier = 3 + Math.random() * 2
  const overallRevenue = segmentalRevenue * multiplier
  
  return {
    overall: Math.round(overallRevenue),
    segmental: Math.round(segmentalRevenue)
  }
}

/**
 * Generate competitive intelligence data for all companies
 * Now loads from store, JSON file, or fallback to hardcoded data
 * Can also accept parsed CSV data
 */
export async function generateCompetitiveData(csvData?: Record<string, any>[]): Promise<CompanyData[]> {
  // If CSV data is provided, parse it
  if (csvData && csvData.length > 0) {
    return parseCompetitiveIntelligenceFromData(csvData)
  }
  
  // Try to get data from store first (only in browser environment)
  if (typeof window !== 'undefined') {
    try {
      const { useDashboardStore } = require('./store')
      const store = useDashboardStore.getState()
      
      if (store.competitiveIntelligenceData && store.competitiveIntelligenceData.rows && store.competitiveIntelligenceData.rows.length > 0) {
        console.log('Using competitive intelligence data from store for generateCompetitiveData')
        return parseCompetitiveIntelligenceFromData(store.competitiveIntelligenceData.rows)
      }
    } catch (error) {
      console.warn('Could not access store for competitive intelligence data:', error)
    }
  }
  
  const jsonData = await loadCompetitiveIntelligenceData()
  
  if (jsonData && jsonData.companies) {
    return jsonData.companies
  }
  
  // Fallback to hardcoded data
  return companies.map(company => {
    const revenue = generateRevenue(marketShares[company])
    
    // Generate sample propositions based on company
    const propositions: Proposition[] = generatePropositions(company)
    
    return {
      id: company.toLowerCase().replace(/\s+/g, '-'),
      name: company,
      headquarters: headquarters[company],
      ceo: ceos[company],
      yearEstablished: yearEstablished[company],
      portfolio: portfolios[company],
      strategies: generateStrategies(company),
      regionalStrength: regionalStrengths[company],
      overallRevenue: revenue.overall,
      segmentalRevenue: revenue.segmental,
      marketShare: marketShares[company],
      propositions,
      color: companyColors[company]
    }
  })
}

/**
 * Generate market share data for pie chart
 * Now loads from JSON file, with fallback to hardcoded data
 * Groups smaller companies into "Others" to reduce clutter
 */
export async function generateMarketShareData(showTopN: number = 10): Promise<MarketShareData[]> {
  const jsonData = await loadCompetitiveIntelligenceData()
  
  let allData: MarketShareData[]
  
  if (jsonData && jsonData.market_share_data) {
    allData = jsonData.market_share_data
  } else {
    // Fallback to hardcoded data
    allData = companies.map(company => ({
      company,
      marketShare: marketShares[company],
      color: companyColors[company]
    }))
  }
  
  // Sort by market share (descending)
  const sorted = [...allData].sort((a, b) => b.marketShare - a.marketShare)
  
  // Take top N companies
  const topCompanies = sorted.slice(0, showTopN)
  
  // Group the rest into "Others"
  const othersShare = sorted.slice(showTopN).reduce((sum, c) => sum + c.marketShare, 0)
  
  if (othersShare > 0) {
    topCompanies.push({
      company: 'Others',
      marketShare: othersShare,
      color: '#94a3b8' // Gray color for Others
    })
  }
  
  return topCompanies
}

/**
 * Get top companies by market share
 */
export async function getTopCompanies(limit: number = 5): Promise<CompanyData[]> {
  const allCompanies = await generateCompetitiveData()
  return allCompanies
    .filter(c => c.name !== 'Others')
    .sort((a, b) => b.marketShare - a.marketShare)
    .slice(0, limit)
}

/**
 * Calculate market concentration (HHI - Herfindahl-Hirschman Index)
 */
export function calculateMarketConcentration(): { hhi: number; concentration: string } {
  const shares = Object.values(marketShares)
  const hhi = shares.reduce((sum, share) => sum + Math.pow(share, 2), 0)
  
  let concentration = 'Competitive'
  if (hhi < 1500) {
    concentration = 'Competitive'
  } else if (hhi < 2500) {
    concentration = 'Moderately Concentrated'
  } else {
    concentration = 'Highly Concentrated'
  }
  
  return { hhi: Math.round(hhi), concentration }
}

/**
 * Get company comparison data for competitive dashboard
 * Now includes propositions with parent/child header structure
 */
export async function getCompanyComparison(): Promise<{
  headers: string[];
  rows: { 
    label: string; 
    values: (string | number)[]; 
    section?: string; // Parent section header
    isProposition?: boolean; // Flag for proposition rows
  }[];
  sections?: string[]; // List of section headers
}> {
  const companies = (await generateCompetitiveData()).slice(0, 10) // Top 10 companies
  
  const headers = companies.map(c => c.name)
  
  // Find maximum number of propositions across all companies
  const maxPropositions = Math.max(
    ...companies.map(c => c.propositions?.length || 0),
    3 // Default to 3 if no propositions
  )
  
  const rows: { 
    label: string; 
    values: (string | number)[]; 
    section?: string;
    isProposition?: boolean;
  }[] = [
    {
      label: "Headquarters",
      values: companies.map(c => c.headquarters),
      section: "COMPANY INFORMATION"
    },
    {
      label: "Key Management (CEO)",
      values: companies.map(c => c.ceo),
      section: "COMPANY INFORMATION"
    },
    {
      label: "Year of Establishment",
      values: companies.map(c => c.yearEstablished || 'N/A'),
      section: "COMPANY INFORMATION"
    },
    {
      label: "Product/Service Portfolio",
      values: companies.map(c => c.portfolio),
      section: "PRODUCT & SERVICES"
    },
    {
      label: "Strategies/Recent Developments",
      values: companies.map(c => c.strategies.join(', ')),
      section: "STRATEGY & DEVELOPMENT"
    },
    {
      label: "Regional Strength",
      values: companies.map(c => c.regionalStrength),
      section: "MARKET PRESENCE"
    },
    {
      label: "Overall Revenue (USD Mn)",
      values: companies.map(c => c.overallRevenue.toLocaleString()),
      section: "FINANCIAL METRICS"
    },
    {
      label: "Segmental Revenue (USD Mn), 2024",
      values: companies.map(c => c.segmentalRevenue.toLocaleString()),
      section: "FINANCIAL METRICS"
    },
    {
      label: "Market Share (%)",
      values: companies.map(c => c.marketShare.toFixed(1) + '%'),
      section: "FINANCIAL METRICS"
    }
  ]
  
  // Add proposition rows dynamically
  if (maxPropositions > 0) {
    for (let i = 0; i < maxPropositions; i++) {
      const propIndex = i + 1
      
      // Proposition Title row
      rows.push({
        label: `Proposition ${propIndex} - Title`,
        values: companies.map(c => {
          const prop = c.propositions?.[i]
          return prop?.title || 'N/A'
        }),
        section: "VALUE PROPOSITIONS",
        isProposition: true
      })
      
      // Proposition Description row
      rows.push({
        label: `Proposition ${propIndex} - Description`,
        values: companies.map(c => {
          const prop = c.propositions?.[i]
          return prop?.description || 'N/A'
        }),
        section: "VALUE PROPOSITIONS",
        isProposition: true
      })
      
      // Proposition Category row
      rows.push({
        label: `Proposition ${propIndex} - Category`,
        values: companies.map(c => {
          const prop = c.propositions?.[i]
          return prop?.category || 'N/A'
        }),
        section: "VALUE PROPOSITIONS",
        isProposition: true
      })
    }
  }
  
  // Extract unique sections
  const sections = Array.from(new Set(rows.map(r => r.section).filter(Boolean))) as string[]
  
  return { headers, rows, sections }
}
