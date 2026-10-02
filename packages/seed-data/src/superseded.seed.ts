import { SupersededStandardMapping } from '@bis/shared-types';

export const SEED_SUPERSEDED_STANDARDS: SupersededStandardMapping[] = [
  {
    obsoleteStandard: 'IS 800:1984',
    activeStandard: 'IS 800:2007',
    title: 'General Construction in Steel - Code of Practice',
    yearWithdrawn: 1984,
    yearActive: 2007,
    gazetteReference: 'BIS/CED 7/2007/G.S.R. 412',
    keyChanges: [
      'Transitioned from Working Stress Method (WSM) to Limit State Method (LSM) as primary design methodology',
      'Introduced seismic load combinations in accordance with IS 1893 (Part 1)',
      'Added comprehensive section on fire-resistant steel design and durability classifications (Clause 15)',
      'Updated partial safety factors for materials and load combinations (Table 4 & 5)'
    ],
    transitionGuidance: 'Tender specifications citing IS 800:1984 must be updated to IS 800:2007 (Limit State Design). Using IS 800:1984 leads to over-conservative, uneconomic steel sections and fails modern seismic safety compliance under the National Building Code (NBC 2016).'
  },
  {
    obsoleteStandard: 'IS 456:1978',
    activeStandard: 'IS 456:2000',
    title: 'Plain and Reinforced Concrete - Code of Practice',
    yearWithdrawn: 1978,
    yearActive: 2000,
    gazetteReference: 'BIS/CED 2/2000/SO-1120',
    keyChanges: [
      'Limit State Method mandated as standard design procedure; Working Stress Method relegated to Annex B',
      'Minimum cementitious material content and maximum water-cement ratio specified for durability under 5 exposure environments (Mild, Moderate, Severe, Very Severe, Extreme - Table 5)',
      'Incorporated use of fly ash (IS 3812), GGBS (IS 12089), and silica fume (IS 15388) in concrete mixes',
      'Standardized concrete grades up to M80 (previously M40 maximum in 1978 version)'
    ],
    transitionGuidance: 'Replace all occurrences of IS 456:1978 with IS 456:2000 (Fourth Revision, reaffirmation 2021). Specify environmental exposure condition (Table 5) and concrete grade strictly as per LSM provisions.'
  },
  {
    obsoleteStandard: 'IS 1786:1985',
    activeStandard: 'IS 1786:2008',
    title: 'High Strength Deformed Steel Bars and Wires for Concrete Reinforcement - Specification',
    yearWithdrawn: 1985,
    yearActive: 2008,
    gazetteReference: 'Steel and Steel Products (Quality Control) Order 2020 / S.O. 1673(E)',
    keyChanges: [
      'Introduced high-ductility earthquake-resistant grades: Fe 415D, Fe 500D, Fe 550D, and Fe 600',
      'Strict phosphorus (P) and sulphur (S) limits restricted to max 0.040% individually and 0.075% combined for "D" grades to ensure superior weldability and seismic ductility',
      'Mandated TS/YS (Tensile Strength to Yield Stress) ratio >= 1.10 for Fe 500D',
      'Included bend and rebend test mandate around mandrel of reduced diameter without crack formation'
    ],
    transitionGuidance: 'IS 1786:1985 is strictly obsolete. Under the Steel QCO, procurement must specify IS 1786:2008 (Fe 500D or Fe 550D) with mandatory BIS CM/L licence mark and mill test certificates.'
  },
  {
    obsoleteStandard: 'IS 4984:1995',
    activeStandard: 'IS 4984:2016',
    title: 'High Density Polyethylene Pipes for Water Supply - Specification',
    yearWithdrawn: 1995,
    yearActive: 2016,
    gazetteReference: 'DPIIT Pipes and Fittings (Quality Control) Order 2023',
    keyChanges: [
      'Incorporated virgin PE 100 raw material classification with Minimum Required Strength (MRS) of 10.0 MPa at 20°C for 50 years',
      'Added Carbon Black dispersion and content testing limits (2.0% to 2.5% by mass)',
      'Introduced Slow Crack Growth (SCG) resistance test (PENT test / Notch pipe test under Clause 8.4)',
      'Updated Standard Dimension Ratio (SDR) tables from SDR 6 up to SDR 41 for pressure ratings PN 2.5 to PN 16'
    ],
    transitionGuidance: 'Tenders specifying IS 4984:1995 must be upgraded to IS 4984:2016. Ensure pipe class is specified using PE 100 grade resin and SDR designation matching internal working pressure.'
  },
  {
    obsoleteStandard: 'IS 10500:1991',
    activeStandard: 'IS 10500:2012',
    title: 'Drinking Water - Specification',
    yearWithdrawn: 1991,
    yearActive: 2012,
    gazetteReference: 'Drinking Water (Quality Control) Order / FSSAI & BIS Joint Notification',
    keyChanges: [
      'Removed "desirable limit" terminology; adopted "Acceptable Limit" and "Permissible Limit in the absence of alternate source"',
      'Tightened pesticide residue limits in Table 5 (individual max 0.0001 mg/L, total max 0.0005 mg/L)',
      'Added strict heavy metal limits: Lead (0.01 mg/L max), Arsenic (0.01 mg/L max), Cadmium (0.003 mg/L max)',
      'Integrated virological testing requirements and mandatory absence of E. coli and total coliforms in 100 ml sample'
    ],
    transitionGuidance: 'Update tender drinking water compliance clauses from IS 10500:1991 to IS 10500:2012 (Second Revision, with Amendment No. 1, 2, 3). Required for all Jal Jeevan Mission and municipal water supply tenders.'
  },
  {
    obsoleteStandard: 'IS 732:1989',
    activeStandard: 'IS 732:2019',
    title: 'Code of Practice for Electrical Wiring Installations',
    yearWithdrawn: 1989,
    yearActive: 2019,
    gazetteReference: 'Central Electricity Authority (Measures relating to Safety and Electric Supply) Regulations',
    keyChanges: [
      'Harmonized with international standard IEC 60364 series for Low Voltage Electrical Installations',
      'Mandated Residual Current Devices (RCD / RCCB) with 30mA trip sensitivity for all socket outlets up to 32A',
      'Introduced Arc Fault Detection Devices (AFDD) and Surge Protective Devices (SPD Type 1 & 2) requirements',
      'Enhanced earthing arrangements (TN-S, TN-C-S, TT systems) and insulation resistance verification'
    ],
    transitionGuidance: 'Electrical tenders must reference IS 732:2019. Specifications referencing IS 732:1989 omit mandatory RCCB 30mA life-safety protection and SPD surge suppression mandated by CEA safety regulations.'
  },
  {
    obsoleteStandard: 'IS 16102:2012',
    activeStandard: 'IS 16102 (Part 1 & 2):2017',
    title: 'Self-Ballasted LED Lamps for General Lighting Services - Safety & Performance',
    yearWithdrawn: 2012,
    yearActive: 2017,
    gazetteReference: 'MeitY Electronics and IT Goods (Requirement for Compulsory Registration) Order',
    keyChanges: [
      'Split into Part 1 (Safety Requirements) and Part 2 (Performance Requirements - Luminous Efficacy, CCT, CRI, Lumen Maintenance)',
      'Mandated minimum luminous efficacy of 100 lm/W for procurement and CRI >= 80',
      'Added Power Factor requirement >= 0.90 for ratings above 5W and Total Harmonic Distortion (THD) <= 15%',
      'Mandatory CRS Registration under Scheme II with Bureau of Indian Standards'
    ],
    transitionGuidance: 'All GeM lighting tenders must cite IS 16102 (Part 1):2017 for Safety and IS 16102 (Part 2):2017 for Performance along with mandatory R-number under BIS CRS.'
  },
  {
    obsoleteStandard: 'IS 12269:1987',
    activeStandard: 'IS 269:2015',
    title: 'Ordinary Portland Cement, 53 Grade - Specification',
    yearWithdrawn: 1987,
    yearActive: 2015,
    gazetteReference: 'Cement (Quality Control) Order / S.O. 1299(E)',
    keyChanges: [
      'Amalgamated IS 269 (33 Grade), IS 8112 (43 Grade), and IS 12269 (53 Grade) into a unified single standard IS 269:2015',
      'Added performance parameters for chloride content (max 0.10%) and SO3 content limits',
      'Standardized uniform packaging specifications with eco-friendly HDPE/PP woven bags',
      'Mandatory BIS Scheme I (ISI Mark) certification under Cement QCO'
    ],
    transitionGuidance: 'IS 12269:1987 is officially withdrawn and consolidated under IS 269:2015 (Clause 6 for 53 Grade). Tenders specifying IS 12269 must be revised to IS 269:2015 (53 Grade).'
  },
  {
    obsoleteStandard: 'IS 1554 (Part 1):1988',
    activeStandard: 'IS 7098 (Part 1):2018 / IS 1554 (Part 1):2020',
    title: 'PVC / XLPE Insulated Electric Cables for Working Voltages up to and including 1100 V',
    yearWithdrawn: 1988,
    yearActive: 2020,
    gazetteReference: 'DPIIT Wires and Cables (Quality Control) Order 2023',
    keyChanges: [
      'Mandated higher thermal withstand capacity of Cross-Linked Polyethylene (XLPE) 90°C over conventional PVC 70°C',
      'Specified halogen-free flame retardant (FRLS / LSZH) sheath options for public building tenders',
      'Added Armour resistance and conductor resistance tables aligned with IS 8130:2013 Class 2 copper/aluminium',
      'Mandatory ISI Mark under Scheme I'
    ],
    transitionGuidance: 'Upgrade electrical cable tenders to IS 7098 (Part 1) for XLPE insulated cables or IS 1554 (Part 1):2020 for PVC cables. Always verify BIS CM/L licence status on BIS Care portal.'
  }
];

export function findSupersededStandard(standardNumber: string): SupersededStandardMapping | null {
  const norm = standardNumber.toUpperCase().replace(/\s+/g, ' ').trim();
  return SEED_SUPERSEDED_STANDARDS.find(s => {
    const sNorm = s.obsoleteStandard.toUpperCase().replace(/\s+/g, ' ').trim();
    const baseCode = sNorm.split(':')[0];
    return norm.includes(sNorm) || norm === sNorm || (norm.includes(baseCode) && norm.includes(String(s.yearWithdrawn)));
  }) || null;
}
