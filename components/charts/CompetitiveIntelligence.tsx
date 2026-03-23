'use client'

import { useState } from 'react'

interface OEMData {
  companyName: string
  hqLocation: string
  primaryServiceFocus: string
  facilityTypeFocus: string
  technologyCapabilities: string
  keyEndUseFocus: string
  goToMarketChannels: string
  serviceStrength: string
  typicalPositioning: string
  keyPartnerApproach: string
  keyInsights: string
}

interface DistributorData {
  partnerName: string
  parentGroup: string
  hqLocation: string
  regionsCovered: string
  keyServicesOffered: string
  channelType: string
  facilityTypesCovered: string
  complianceCapability: string
  endUseFocus: string
  keyContactPerson: string
  designation: string
  email: string
  phone: string
  linkedIn: string
  website: string
  competitiveStrengths: string
  gapsWeaknesses: string
}

const oemData: OEMData[] = [
  {
    companyName: 'Stericycle (MedSolutions)',
    hqLocation: 'Bannockburn, IL, USA',
    primaryServiceFocus: 'Full-service Healthcare Relocation, Equipment Logistics',
    facilityTypeFocus: 'Hospitals, Imaging Centers, Specialty Clinics',
    technologyCapabilities: 'RFID Asset Tracking, Chain of Custody, Climate-Controlled Transport',
    keyEndUseFocus: 'Large Hospital Systems, Academic Medical Centers',
    goToMarketChannels: 'Direct Sales, Strategic Partnerships with GPOs',
    serviceStrength: 'Strong - Nationwide Coverage, 24/7 Support',
    typicalPositioning: 'Premium',
    keyPartnerApproach: 'Exclusive Contracts, Integrated Service Agreements',
    keyInsights: 'Market leader leveraging waste management network for healthcare logistics'
  },
  {
    companyName: 'UniGroup (United Van Lines Healthcare)',
    hqLocation: 'Fenton, MO, USA',
    primaryServiceFocus: 'Full-service Relocation, IT & Data Migration',
    facilityTypeFocus: 'Hospitals, MOBs, ASCs',
    technologyCapabilities: 'Project Management Software, Inventory Management Systems',
    keyEndUseFocus: 'Multi-site Health Systems, VA Hospitals',
    goToMarketChannels: 'Direct Sales, Agent Network, Government Contracts',
    serviceStrength: 'Strong - Extensive Agent Network, Government Clearances',
    typicalPositioning: 'Mid to Premium',
    keyPartnerApproach: 'Agent-based Model, GSA Schedule Contracts',
    keyInsights: 'Strong government healthcare relocation expertise via GSA contracts'
  },
  {
    companyName: 'PODS Healthcare Division',
    hqLocation: 'Clearwater, FL, USA',
    primaryServiceFocus: 'Equipment-only Relocation, Temporary Storage',
    facilityTypeFocus: 'ASCs, Specialty Clinics, Rehab Centers',
    technologyCapabilities: 'Container Tracking, On-demand Scheduling Platform',
    keyEndUseFocus: 'Small to Mid-size Practices, Renovation Projects',
    goToMarketChannels: 'Direct Sales, Online Platform, Channel Partners',
    serviceStrength: 'Moderate - Flexible but Limited Specialized Healthcare',
    typicalPositioning: 'Value to Mid',
    keyPartnerApproach: 'Franchise Model, Technology Platform Partnerships',
    keyInsights: 'Growing healthcare segment leveraging consumer brand strength'
  },
  {
    companyName: 'Medxcel Facilities Management',
    hqLocation: 'Indianapolis, IN, USA',
    primaryServiceFocus: 'Compliance-led Relocation, Facility Reconfiguration',
    facilityTypeFocus: 'Hospitals, Imaging Centers',
    technologyCapabilities: 'BIM Integration, Compliance Management Systems, IoT Monitoring',
    keyEndUseFocus: 'Catholic Health Systems, Large Hospital Networks',
    goToMarketChannels: 'Direct Sales, Long-term Service Contracts',
    serviceStrength: 'Strong - Deep Healthcare Facility Expertise',
    typicalPositioning: 'Premium',
    keyPartnerApproach: 'Integrated Facility Management Contracts',
    keyInsights: 'Ascension Health spin-off with deep hospital operations knowledge'
  },
  {
    companyName: 'JLL Healthcare',
    hqLocation: 'Chicago, IL, USA',
    primaryServiceFocus: 'New Facility Relocation, Project Management',
    facilityTypeFocus: 'Hospitals, MOBs, Imaging Centers',
    technologyCapabilities: 'Digital Twin Technology, Space Planning Software',
    keyEndUseFocus: 'Large Health Systems, Real Estate Transactions',
    goToMarketChannels: 'Direct Sales, Consulting Engagements',
    serviceStrength: 'Strong - Global Platform, Deep Advisory Capability',
    typicalPositioning: 'Premium',
    keyPartnerApproach: 'Advisory-led, Long-term Facility Management',
    keyInsights: 'Leverages real estate expertise for healthcare facility transitions'
  },
  {
    companyName: 'CBRE Healthcare',
    hqLocation: 'Dallas, TX, USA',
    primaryServiceFocus: 'New Facility Relocation, Renovation Planning',
    facilityTypeFocus: 'MOBs, ASCs, Specialty Clinics',
    technologyCapabilities: 'Space Utilization Analytics, Project Management Tools',
    keyEndUseFocus: 'Ambulatory Care Networks, Physician Groups',
    goToMarketChannels: 'Direct Sales, Advisory Services',
    serviceStrength: 'Strong - Extensive Real Estate Network',
    typicalPositioning: 'Mid to Premium',
    keyPartnerApproach: 'Bundled Real Estate + Relocation Services',
    keyInsights: 'Strong in outpatient facility relocations tied to real estate deals'
  },
  {
    companyName: 'Sodexo Healthcare',
    hqLocation: 'Gaithersburg, MD, USA',
    primaryServiceFocus: 'Internal Reconfiguration, Equipment Relocation',
    facilityTypeFocus: 'Hospitals, Rehab Centers',
    technologyCapabilities: 'Workflow Optimization, Asset Management Systems',
    keyEndUseFocus: 'Integrated Health Systems, Long-term Care',
    goToMarketChannels: 'Direct Sales, Existing Facility Management Contracts',
    serviceStrength: 'Moderate - Strong in Operations but Limited Move Specialization',
    typicalPositioning: 'Mid',
    keyPartnerApproach: 'Cross-sell from Existing FM Contracts',
    keyInsights: 'Leverages facility management presence for relocation upsell'
  },
  {
    companyName: 'ABM Healthcare',
    hqLocation: 'New York, NY, USA',
    primaryServiceFocus: 'Equipment-only Relocation, Compliance-led Moves',
    facilityTypeFocus: 'Hospitals, Imaging Centers, ASCs',
    technologyCapabilities: 'Compliance Tracking, Environmental Monitoring',
    keyEndUseFocus: 'Regional Hospital Systems, Community Hospitals',
    goToMarketChannels: 'Direct Sales, Government Contracts',
    serviceStrength: 'Moderate - Regional Focus, Growing Healthcare Division',
    typicalPositioning: 'Value to Mid',
    keyPartnerApproach: 'Integrated Facility Services, Multi-year Contracts',
    keyInsights: 'Expanding healthcare relocation from facilities services base'
  }
]

const distributorData: DistributorData[] = [
  {
    partnerName: 'Healthcare Logistics Solutions',
    parentGroup: 'HLS Group',
    hqLocation: 'Atlanta, GA, USA',
    regionsCovered: 'Southeast, Southwest',
    keyServicesOffered: 'Full-service Relocation, Equipment Logistics, IT Migration',
    channelType: 'Specialized Healthcare Mover',
    facilityTypesCovered: 'Hospitals, ASCs, Imaging Centers',
    complianceCapability: 'Full - HIPAA, Joint Commission, OSHA',
    endUseFocus: 'Hospital Systems, Ambulatory Networks',
    keyContactPerson: 'Michael Torres',
    designation: 'VP Operations',
    email: 'mtorres@hlsgroup.com',
    phone: '+1 (404) 555-0142',
    linkedIn: 'linkedin.com/in/michaeltorres-hls',
    website: 'www.hlsgroup.com',
    competitiveStrengths: 'Deep healthcare compliance, Fast deployment, Regional expertise',
    gapsWeaknesses: 'Limited West Coast coverage'
  },
  {
    partnerName: 'MedMove Partners',
    parentGroup: 'Independent',
    hqLocation: 'Boston, MA, USA',
    regionsCovered: 'Northeast, Midwest',
    keyServicesOffered: 'Equipment-only Relocation, Imaging Equipment Specialists',
    channelType: 'Equipment Specialist',
    facilityTypesCovered: 'Imaging Centers, Hospitals, Specialty Clinics',
    complianceCapability: 'Full - FDA, Joint Commission, State Regulations',
    endUseFocus: 'Radiology Networks, Academic Medical Centers',
    keyContactPerson: 'Sarah Chen',
    designation: 'Managing Director',
    email: 'schen@medmovepartners.com',
    phone: '+1 (617) 555-0198',
    linkedIn: 'linkedin.com/in/sarahchen-medmove',
    website: 'www.medmovepartners.com',
    competitiveStrengths: 'Imaging equipment expertise, OEM partnerships, Compliance focus',
    gapsWeaknesses: 'Limited capacity for large hospital moves'
  },
  {
    partnerName: 'National Healthcare Transitions',
    parentGroup: 'NHT Holdings',
    hqLocation: 'Chicago, IL, USA',
    regionsCovered: 'Midwest, Northeast, West',
    keyServicesOffered: 'Full-service Relocation, IT & Data Migration, Compliance Consulting',
    channelType: 'Full-service Provider',
    facilityTypesCovered: 'Hospitals, MOBs, Rehab Centers',
    complianceCapability: 'Full - HIPAA, CMS, State Health Dept',
    endUseFocus: 'Large Hospital Systems, Government Healthcare',
    keyContactPerson: 'David Park',
    designation: 'CEO',
    email: 'dpark@nhttransitions.com',
    phone: '+1 (312) 555-0267',
    linkedIn: 'linkedin.com/in/davidpark-nht',
    website: 'www.nhttransitions.com',
    competitiveStrengths: 'National coverage, Government contracts, Turn-key solutions',
    gapsWeaknesses: 'Higher pricing vs regional players'
  },
  {
    partnerName: 'Pacific Health Movers',
    parentGroup: 'Independent',
    hqLocation: 'San Francisco, CA, USA',
    regionsCovered: 'West, Southwest',
    keyServicesOffered: 'New Facility Relocation, Renovation Support, Equipment Logistics',
    channelType: 'Regional Specialist',
    facilityTypesCovered: 'ASCs, MOBs, Specialty Clinics',
    complianceCapability: 'Full - California DPH, HIPAA, Seismic Compliance',
    endUseFocus: 'Ambulatory Networks, Physician Groups, Dental Chains',
    keyContactPerson: 'Jennifer Wu',
    designation: 'President',
    email: 'jwu@pacifichealthmovers.com',
    phone: '+1 (415) 555-0334',
    linkedIn: 'linkedin.com/in/jenniferwu-phm',
    website: 'www.pacifichealthmovers.com',
    competitiveStrengths: 'California regulatory expertise, Seismic compliance, Fast turnaround',
    gapsWeaknesses: 'Limited East Coast operations'
  },
  {
    partnerName: 'Southern Medical Logistics',
    parentGroup: 'SML Corp',
    hqLocation: 'Houston, TX, USA',
    regionsCovered: 'Southwest, Southeast',
    keyServicesOffered: 'Equipment-only Relocation, Climate-Controlled Transport',
    channelType: 'Specialized Logistics',
    facilityTypesCovered: 'Imaging Centers, Hospitals, Rehab Centers',
    complianceCapability: 'Moderate - HIPAA, Basic State Compliance',
    endUseFocus: 'Regional Hospitals, Imaging Networks',
    keyContactPerson: 'Robert Martinez',
    designation: 'Director of Operations',
    email: 'rmartinez@southernmedlog.com',
    phone: '+1 (713) 555-0421',
    linkedIn: 'linkedin.com/in/robertmartinez-sml',
    website: 'www.southernmedlog.com',
    competitiveStrengths: 'Competitive pricing, Climate-controlled fleet, Quick deployment',
    gapsWeaknesses: 'Limited IT migration capability'
  },
  {
    partnerName: 'Compliance First Healthcare Moving',
    parentGroup: 'Independent',
    hqLocation: 'Washington, DC, USA',
    regionsCovered: 'Northeast, Southeast',
    keyServicesOffered: 'Compliance-led Relocation, HIPAA Consulting, IT Decommissioning',
    channelType: 'Compliance Specialist',
    facilityTypesCovered: 'Hospitals, Specialty Clinics, MOBs',
    complianceCapability: 'Full - HIPAA, HITECH, Joint Commission, CMS',
    endUseFocus: 'Government Healthcare, Academic Medical Centers',
    keyContactPerson: 'Amanda Foster',
    designation: 'Chief Compliance Officer',
    email: 'afoster@compliancefirsthm.com',
    phone: '+1 (202) 555-0578',
    linkedIn: 'linkedin.com/in/amandafoster-cfhm',
    website: 'www.compliancefirsthm.com',
    competitiveStrengths: 'Compliance expertise, Government clearances, Data security focus',
    gapsWeaknesses: 'Premium pricing, Limited equipment handling'
  }
]

interface CompetitiveIntelligenceProps {
  height?: number
}

export function CompetitiveIntelligence({ height }: CompetitiveIntelligenceProps) {
  const [activeTable, setActiveTable] = useState<'oem' | 'distributor'>('oem')

  const renderOEMTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th colSpan={6} className="bg-[#E8C4A0] border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-black">
              Company Information
            </th>
            <th colSpan={4} className="bg-[#87CEEB] border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-black">
              Channel & Support
            </th>
            <th colSpan={1} className="bg-[#87CEEB] border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-black">
              CMI Insights
            </th>
          </tr>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[140px]">Company Name</th>
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[120px]">HQ Location</th>
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[180px]">Primary Service Focus</th>
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[150px]">Facility Type Focus</th>
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[180px]">Technology Capabilities</th>
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[150px]">Key End-use Focus</th>
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[150px]">Go-to-Market Channels</th>
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[160px]">Service Strength</th>
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[100px]">
              <div>Typical Positioning</div>
              <div>(Value/Mid/Premium)</div>
            </th>
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[160px]">Key Partner Approach</th>
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[200px]">Key Insights</th>
          </tr>
        </thead>
        <tbody>
          {oemData.map((oem, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border border-gray-300 px-3 py-2 text-sm font-medium text-black">{oem.companyName}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-black">{oem.hqLocation}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-black">{oem.primaryServiceFocus}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-black">{oem.facilityTypeFocus}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-black">{oem.technologyCapabilities}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-black">{oem.keyEndUseFocus}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-black">{oem.goToMarketChannels}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-black">{oem.serviceStrength}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-black">{oem.typicalPositioning}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-black">{oem.keyPartnerApproach}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-black">{oem.keyInsights}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderDistributorTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th colSpan={9} className="bg-[#E8C4A0] border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-black">
              Partner Profile
            </th>
            <th colSpan={6} className="bg-[#90EE90] border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-black">
              Contact Details
            </th>
            <th colSpan={2} className="bg-[#87CEEB] border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-black">
              Fit & Opportunity
            </th>
          </tr>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[160px]">Partner Name</th>
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[120px]">Parent Group</th>
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[120px]">HQ Location</th>
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[130px]">Regions Covered</th>
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[180px]">Key Services Offered</th>
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[130px]">Channel Type</th>
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[160px]">Facility Types Covered</th>
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[150px]">Compliance Capability</th>
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[150px]">End-use Focus</th>
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[120px]">Key Contact</th>
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[120px]">Designation</th>
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[180px]">Email</th>
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[120px]">Phone</th>
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[150px]">LinkedIn</th>
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[150px]">Website</th>
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[200px]">Competitive Strengths</th>
            <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-black text-left min-w-[180px]">Gaps / Weaknesses</th>
          </tr>
        </thead>
        <tbody>
          {distributorData.map((dist, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border border-gray-300 px-3 py-2 text-sm font-medium text-black">{dist.partnerName}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-black">{dist.parentGroup}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-black">{dist.hqLocation}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-black">{dist.regionsCovered}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-black">{dist.keyServicesOffered}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-black">{dist.channelType}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-black">{dist.facilityTypesCovered}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-black">{dist.complianceCapability}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-black">{dist.endUseFocus}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-black">{dist.keyContactPerson}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-black">{dist.designation}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-black">{dist.email}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-black">{dist.phone}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-black">{dist.linkedIn}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-black">{dist.website}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-black">{dist.competitiveStrengths}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm text-black">{dist.gapsWeaknesses}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div style={{ minHeight: height || 600 }}>
      <h2 className="text-xl font-bold text-black mb-4">Competitive Intelligence</h2>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTable('oem')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTable === 'oem'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-black hover:bg-gray-200'
          }`}
        >
          Company Intelligence
        </button>
        <button
          onClick={() => setActiveTable('distributor')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTable === 'distributor'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-black hover:bg-gray-200'
          }`}
        >
          Partner Intelligence
        </button>
      </div>
      {activeTable === 'oem' ? renderOEMTable() : renderDistributorTable()}
    </div>
  )
}
