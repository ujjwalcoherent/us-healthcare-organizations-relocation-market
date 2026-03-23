/**
 * Customer Intelligence Data Generator
 * Generates realistic customer data for End User segments across regions
 */

export interface Customer {
  id: string
  name: string
  region: string
  endUserSegment: string
  type: 'residential' | 'commercial' | 'utility'  // kept for interface compat
}

export interface CustomerIntelligenceData {
  region: string
  endUserSegment: string
  customerCount: number
  customers: Customer[]
}

// Realistic healthcare facility names by type
const hospitalNames = [
  'Memorial Hospital', 'Regional Medical Center', 'General Hospital', 'Community Hospital',
  'University Hospital', 'Methodist Hospital', 'Baptist Medical Center', 'Presbyterian Hospital',
  'St. Mary Medical Center', 'Providence Health'
]

const ascNames = [
  'SurgiCenter', 'Outpatient Surgery Center', 'Ambulatory Care Center', 'Day Surgery Center',
  'Advanced Surgical Center', 'Premier Surgical Center', 'MedStar ASC', 'CarePoint ASC'
]

const mobNames = [
  'Medical Office Plaza', 'Healthcare Pavilion', 'Physician Center', 'Medical Arts Building',
  'Professional Medical Center', 'Health Services Building', 'Medical Tower', 'Clinic Center'
]

const imagingNames = [
  'Diagnostic Imaging Center', 'Radiology Associates', 'Advanced Imaging', 'MRI & CT Center',
  'Digital Imaging Center', 'Medical Imaging Solutions', 'Premier Radiology', 'Imaging Partners'
]

const specialtyNames = [
  'Cardiology Associates', 'Orthopedic Specialists', 'Dermatology Center', 'ENT Clinic',
  'Oncology Center', 'Pain Management Clinic', 'Neurology Associates', 'Pulmonary Care Center'
]

const rehabNames = [
  'Rehabilitation Center', 'Physical Therapy Center', 'Recovery Center', 'Wellness & Rehab',
  'Sports Medicine Rehab', 'Post-Acute Care Center', 'Skilled Nursing Rehab', 'Neuro Rehab Center'
]

const locationSuffixes = [
  'North', 'South', 'East', 'West', 'Central', 'Metro', 'Downtown', 'Uptown',
  'Riverside', 'Parkview', 'Hillside', 'Valley', 'Coastal', 'Mountain'
]

// Region-specific prefixes
const regionPrefixes: Record<string, string[]> = {
  'Northeast': ['Boston', 'Hartford', 'New York', 'Philadelphia', 'Pittsburgh'],
  'Southeast': ['Atlanta', 'Charlotte', 'Tampa', 'Miami', 'Nashville'],
  'Midwest': ['Chicago', 'Cleveland', 'Detroit', 'Minneapolis', 'Columbus'],
  'West': ['Los Angeles', 'Denver', 'Seattle', 'Portland', 'San Francisco'],
  'Southwest': ['Dallas', 'Houston', 'Phoenix', 'Austin', 'San Antonio']
}

function generateCustomerName(region: string, endUserSegment: string, index: number): string {
  const prefixes = regionPrefixes[region] || ['Regional', 'National']
  const prefix = prefixes[index % prefixes.length]
  const location = locationSuffixes[index % locationSuffixes.length]

  let baseName = ''
  if (endUserSegment === 'Hospitals') {
    baseName = hospitalNames[index % hospitalNames.length]
  } else if (endUserSegment === 'ASCs') {
    baseName = ascNames[index % ascNames.length]
  } else if (endUserSegment === 'MOBs') {
    baseName = mobNames[index % mobNames.length]
  } else if (endUserSegment === 'Imaging Centers') {
    baseName = imagingNames[index % imagingNames.length]
  } else if (endUserSegment === 'Specialty Clinics') {
    baseName = specialtyNames[index % specialtyNames.length]
  } else {
    baseName = rehabNames[index % rehabNames.length]
  }

  return `${prefix} ${baseName} ${location}`
}

/**
 * Generate realistic customer counts based on region and end user segment
 * Residential typically has more installations in developed regions
 * Utility-scale is more concentrated in large markets
 */
// Deterministic seed function for consistent data generation
function seededRandom(seed: number): () => number {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

function generateCustomerCount(region: string, endUserSegment: string): number {
  // Base multipliers by region (reflecting market size)
  const regionMultipliers: Record<string, number> = {
    'Northeast': 0.9,
    'Southeast': 1.3,
    'Midwest': 1.0,
    'West': 1.2,
    'Southwest': 0.8
  }

  // Base multipliers by end user type
  const segmentMultipliers: Record<string, number> = {
    'Hospitals': 0.3,
    'ASCs': 0.8,
    'MOBs': 1.5,
    'Imaging Centers': 0.6,
    'Specialty Clinics': 1.4,
    'Rehab Centers': 0.4
  }

  // Base count range
  const baseMin = 50
  const baseMax = 300

  const regionMulti = regionMultipliers[region] || 1.0
  const segmentMulti = segmentMultipliers[endUserSegment] || 1.0

  // Calculate realistic range
  const min = Math.floor(baseMin * regionMulti * segmentMulti)
  const max = Math.floor(baseMax * regionMulti * segmentMulti)

  // Create deterministic seed based on region and segment
  const seed = (region.charCodeAt(0) * 1000 + endUserSegment.charCodeAt(0) * 100) % 10000
  const random = seededRandom(seed)

  // Generate consistent count
  const count = Math.floor(random() * (max - min + 1)) + min

  return Math.max(10, count) // Minimum 10 customers
}

/**
 * Generate all customer intelligence data
 */
export function generateCustomerIntelligenceData(): CustomerIntelligenceData[] {
  const regions = [
    'Northeast',
    'Southeast',
    'Midwest',
    'West',
    'Southwest'
  ]

  const endUserSegments = [
    'Hospitals',
    'ASCs',
    'MOBs',
    'Imaging Centers',
    'Specialty Clinics',
    'Rehab Centers'
  ]

  const data: CustomerIntelligenceData[] = []

  regions.forEach(region => {
    endUserSegments.forEach(endUserSegment => {
      const customerCount = generateCustomerCount(region, endUserSegment)
      const customers: Customer[] = []

      // Generate customer names (deterministic based on region, segment, and index)
      for (let i = 0; i < customerCount; i++) {
        customers.push({
          id: `${region}-${endUserSegment}-${i}`,
          name: generateCustomerName(region, endUserSegment, i),
          region,
          endUserSegment,
          type: endUserSegment === 'Hospitals' ? 'residential'
                : endUserSegment === 'Specialty Clinics' || endUserSegment === 'ASCs' ? 'commercial'
                : 'utility'
        })
      }

      data.push({
        region,
        endUserSegment,
        customerCount,
        customers
      })
    })
  })

  return data
}

/**
 * Get customers for a specific region and end user segment
 */
export function getCustomersForCell(
  data: CustomerIntelligenceData[],
  region: string,
  endUserSegment: string
): Customer[] {
  const cell = data.find(
    d => d.region === region && d.endUserSegment === endUserSegment
  )
  return cell?.customers || []
}

/**
 * Get customer count for a specific region and end user segment
 */
export function getCustomerCountForCell(
  data: CustomerIntelligenceData[],
  region: string,
  endUserSegment: string
): number {
  const cell = data.find(
    d => d.region === region && d.endUserSegment === endUserSegment
  )
  return cell?.customerCount || 0
}

/**
 * Parse customer intelligence data from Excel rows
 * Extracts customer information and groups by region and end user segment
 */
export function parseCustomerIntelligenceFromData(rows: Record<string, any>[]): CustomerIntelligenceData[] {
  // Map to store customers by region and end user segment
  const customerMap = new Map<string, Customer[]>()

  // Common column name variations
  const getColumnValue = (row: Record<string, any>, possibleNames: string[]): string | null => {
    for (const name of possibleNames) {
      // Try exact match
      if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
        const value = String(row[name]).trim()
        if (value && value !== 'xx' && value.toLowerCase() !== 'n/a') {
          return value
        }
      }
      // Try case-insensitive match
      const lowerName = name.toLowerCase().trim()
      for (const key in row) {
        if (key && key.toLowerCase().trim() === lowerName && row[key] !== undefined && row[key] !== null && row[key] !== '') {
          const value = String(row[key]).trim()
          if (value && value !== 'xx' && value.toLowerCase() !== 'n/a') {
            return value
          }
        }
      }
      // Try partial match (contains)
      for (const key in row) {
        if (key && key.toLowerCase().includes(lowerName) && row[key] !== undefined && row[key] !== null && row[key] !== '') {
          const value = String(row[key]).trim()
          if (value && value !== 'xx' && value.toLowerCase() !== 'n/a') {
            return value
          }
        }
      }
    }
    return null
  }

  // Log first row structure for debugging
  if (rows.length > 0) {
    console.log('Parser - First row keys:', Object.keys(rows[0]))
    console.log('Parser - First row sample:', rows[0])
  }

  let processedCount = 0
  let skippedCount = 0

  // Process each row
  rows.forEach((row, index) => {
    // Try to extract customer name/company (most important field)
    let customerName = getColumnValue(row, [
      'Company Name', 'Company', 'Customer Name', 'Customer',
      'End User Name', 'Client Name', 'Organization Name',
      'Name', 'Organization', 'Institution', 'End User', 'Client'
    ])

    // If no customer name found with standard names, try to find any field that looks like a name
    if (!customerName) {
      // Look for the first non-empty field that doesn't look like metadata
      for (const key in row) {
        // Skip metadata fields
        if (key.startsWith('_') ||
            key.toLowerCase().includes('sheet') ||
            key.toLowerCase().includes('index') ||
            key.toLowerCase().includes('row')) {
          continue
        }

        const value = row[key]
        if (value && typeof value === 'string') {
          const trimmed = value.trim()
          // If it's a reasonable length and not a placeholder, use it as name
          if (trimmed &&
              trimmed.length > 2 &&
              trimmed.length < 200 &&
              trimmed !== 'xx' &&
              trimmed.toLowerCase() !== 'n/a' &&
              !trimmed.match(/^\d+$/) && // Not just numbers
              !trimmed.toLowerCase().includes('region') &&
              !trimmed.toLowerCase().includes('segment') &&
              !trimmed.toLowerCase().includes('type')) {
            customerName = trimmed
            break
          }
        }
      }
    }

    // Skip rows without customer name
    if (!customerName) {
      skippedCount++
      if (skippedCount <= 3) {
        console.log(`Parser - Skipping row ${index + 1}: No customer name found. Available keys:`, Object.keys(row))
      }
      return
    }

    processedCount++

    // Try to extract region
    const region = getColumnValue(row, [
      'Region', 'Geography', 'Geographic Region', 'Market Region',
      'Country', 'Location', 'Territory', 'Market', 'Area'
    ])

    // Try to extract end user segment/type
    const endUserSegment = getColumnValue(row, [
      'End User Type', 'End User Segment', 'Industry Category',
      'Industry Type', 'Segment', 'Customer Type', 'End User Category',
      'Industry', 'Category', 'Type', 'Segment Type'
    ])

    // Normalize region - try to match common region names
    let normalizedRegion = region || null
    if (region) {
      const lowerRegion = region.toLowerCase()
      if (lowerRegion.includes('north america') || lowerRegion.includes('usa') || lowerRegion.includes('united states') || lowerRegion.includes('u.s.')) {
        normalizedRegion = 'North America'
      } else if (lowerRegion.includes('latin america') || lowerRegion.includes('south america')) {
        normalizedRegion = 'Latin America'
      } else if (lowerRegion.includes('europe')) {
        normalizedRegion = 'Europe'
      } else if (lowerRegion.includes('asia') || lowerRegion.includes('pacific')) {
        normalizedRegion = 'Asia Pacific'
      } else if (lowerRegion.includes('middle east') || lowerRegion.includes('africa')) {
        normalizedRegion = 'Middle East & Africa'
      } else {
        normalizedRegion = region
      }
    }

    // If still no region, try to find it in other columns or use "Unknown"
    if (!normalizedRegion) {
      for (const key in row) {
        if (key.startsWith('_')) continue
        const value = String(row[key] || '').toLowerCase()
        if (value.includes('north america') || value.includes('usa') || value.includes('united states')) {
          normalizedRegion = 'North America'
          break
        } else if (value.includes('latin america') || value.includes('south america')) {
          normalizedRegion = 'Latin America'
          break
        } else if (value.includes('europe')) {
          normalizedRegion = 'Europe'
          break
        } else if (value.includes('asia') || value.includes('pacific')) {
          normalizedRegion = 'Asia Pacific'
          break
        } else if (value.includes('middle east') || value.includes('africa')) {
          normalizedRegion = 'Middle East & Africa'
          break
        }
      }
      if (!normalizedRegion) {
        normalizedRegion = 'Unknown'
      }
    }

    // Normalize end user segment
    let normalizedSegment = endUserSegment || null
    if (endUserSegment) {
      const lowerSegment = endUserSegment.toLowerCase()
      if (lowerSegment.includes('residential') || lowerSegment.includes('home')) {
        normalizedSegment = 'Residential'
      } else if (lowerSegment.includes('commercial') || lowerSegment.includes('industrial')) {
        normalizedSegment = 'Commercial and Industrial'
      } else if (lowerSegment.includes('utility') || lowerSegment.includes('grid')) {
        normalizedSegment = 'Utility-scale'
      } else {
        normalizedSegment = endUserSegment
      }
    }

    // If still no segment, try to find it in other columns or use "Unknown"
    if (!normalizedSegment) {
      for (const key in row) {
        if (key.startsWith('_')) continue
        const value = String(row[key] || '').toLowerCase()
        if (value.includes('residential') || value.includes('home')) {
          normalizedSegment = 'Residential'
          break
        } else if (value.includes('commercial') || value.includes('industrial')) {
          normalizedSegment = 'Commercial and Industrial'
          break
        } else if (value.includes('utility') || value.includes('grid')) {
          normalizedSegment = 'Utility-scale'
          break
        }
      }
      if (!normalizedSegment) {
        normalizedSegment = 'Unknown'
      }
    }

    // Create customer object
    const customer: Customer = {
      id: `customer-${index}-${Date.now()}`,
      name: customerName,
      region: normalizedRegion,
      endUserSegment: normalizedSegment,
      type: normalizedSegment === 'Residential' ? 'residential'
            : normalizedSegment === 'Commercial and Industrial' ? 'commercial'
            : 'utility'
    }

    // Group by region and segment
    const key = `${normalizedRegion}|||${normalizedSegment}`
    if (!customerMap.has(key)) {
      customerMap.set(key, [])
    }
    customerMap.get(key)!.push(customer)
  })

  // Convert map to CustomerIntelligenceData array
  const result: CustomerIntelligenceData[] = []
  customerMap.forEach((customers, key) => {
    const [region, endUserSegment] = key.split('|||')
    result.push({
      region,
      endUserSegment,
      customerCount: customers.length,
      customers
    })
  })

  console.log(`Parser - Summary:`)
  console.log(`  Total rows: ${rows.length}`)
  console.log(`  Processed: ${processedCount}`)
  console.log(`  Skipped: ${skippedCount}`)
  console.log(`  Unique region/segment combinations: ${result.length}`)
  console.log(`  Total customers: ${result.reduce((sum, cell) => sum + cell.customerCount, 0)}`)

  // Log the breakdown by region and segment
  if (result.length > 0) {
    console.log('Parser - Breakdown by region/segment:')
    result.forEach(cell => {
      console.log(`  ${cell.region} / ${cell.endUserSegment}: ${cell.customerCount} customers`)
    })
  }

  if (result.length === 0 && rows.length > 0) {
    console.warn('Parser - No customers extracted. Sample row:', rows[0])
  }

  return result
}

/**
 * Load customer intelligence data from API
 * Falls back to generated data if API fails
 */
let cachedData: CustomerIntelligenceData[] | null = null

export async function loadCustomerIntelligenceData(filePath?: string): Promise<CustomerIntelligenceData[]> {
  // Ensure we're on the client side
  if (typeof window === 'undefined') {
    return generateCustomerIntelligenceData()
  }

  // If we have cached data and no new file path, return cached
  if (cachedData && !filePath) {
    return Promise.resolve(cachedData)
  }

  try {
    // Try to load from API endpoint
    const url = filePath
      ? `/api/load-customer-intelligence?filePath=${encodeURIComponent(filePath)}`
      : '/api/load-customer-intelligence'

    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      if (!controller.signal.aborted) {
        controller.abort()
      }
    }, 30000) // 30 second timeout

    try {
      const response = await fetch(url, {
        cache: 'no-store',
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        // If file not found, fall back to generated data
        if (response.status === 404) {
          console.log('Customer intelligence Excel file not found, using generated data')
          return generateCustomerIntelligenceData()
        }

        // Try to get error details from response
        let errorMessage = response.statusText
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || response.statusText
          console.error('API Error details:', errorData)
        } catch {
          // If JSON parsing fails, use status text
        }

        console.warn(`Failed to load customer intelligence: ${errorMessage}, using generated data`)
        return generateCustomerIntelligenceData()
      }

      const data = await response.json()

      console.log('API Response received:', {
        hasData: !!data.data,
        dataType: Array.isArray(data.data) ? 'array' : typeof data.data,
        dataLength: Array.isArray(data.data) ? data.data.length : 'N/A',
        metadata: data.metadata,
        error: data.error,
        message: data.message
      })

      // Transform the API response to match CustomerIntelligenceData structure
      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        console.log(`Successfully loaded ${data.data.length} customer intelligence cells`)
        cachedData = data.data as CustomerIntelligenceData[]
        return cachedData
      }

      // If data structure is unexpected, fall back to generated data
      console.warn('Unexpected data structure from API:', data)
      console.warn('Falling back to generated data')
      return generateCustomerIntelligenceData()
    } catch (fetchError) {
      clearTimeout(timeoutId)

      // Handle abort errors gracefully
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.log('Customer intelligence data fetch was aborted')
        return generateCustomerIntelligenceData()
      }

      throw fetchError
    }
  } catch (error) {
    console.error('Error loading customer intelligence data:', error)
    // Fall back to generated data on error
    return generateCustomerIntelligenceData()
  }
}
