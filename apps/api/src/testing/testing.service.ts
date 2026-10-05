import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PDISchedule, TestingRequirement, TestingSearchFilter } from '@bis/shared-types';
import { SEED_PDI_SCHEDULES } from '@bis/seed-data';

@Injectable()
export class TestingService {
  constructor(private prisma: PrismaService) {}

  async getTestingRequirements(filter: TestingSearchFilter): Promise<TestingRequirement[]> {
    const defaultRequirements: TestingRequirement[] = [
      {
        id: 'test-4984-1',
        standardNumber: 'IS 4984:2016',
        testName: 'Hydrostatic Internal Pressure Proof Test (100h at 20°C & 165h at 80°C)',
        testMethod: 'IS 4984 Clause 8.1 & IS 12235 (Part 8)',
        clauseNumber: '8.1',
        description: 'End-capped HDPE pipe specimen filled with water under constant internal pressure in thermostatic water bath.',
        acceptanceCriteria: 'No burst, weeping, rupture, or failure during test period at test hoop stress 12.0 MPa (20°C) or 5.4 MPa (80°C).',
        samplingRequirements: '3 sample specimens per continuous extrusion production lot.',
        testingFrequency: 'Every production lot (Pre-Dispatch Acceptance Test).',
        requiredEquipment: ['Thermostatic Water Bath (20°C & 80°C ± 1°C)', 'End Caps Rig', 'Precision Pressure Transducer'],
        isDestructive: true,
        isMandatoryRoutineTest: true,
        applicableProducts: ['HDPE Potable Water Pipes PE 100 / PE 80'],
        sourceUrl: 'https://www.services.bis.gov.in/knowyourstandards/is4984'
      },
      {
        id: 'test-4984-2',
        standardNumber: 'IS 4984:2016',
        testName: 'Carbon Black Content & Dispersion Determination',
        testMethod: 'IS 4984 Clause 8.2 & 8.3 / IS 2530',
        clauseNumber: '8.2',
        description: 'Pyrolysis in inert nitrogen atmosphere to determine carbon black % and optical microtome slicing for particle dispersion grading.',
        acceptanceCriteria: 'Carbon black content strictly 2.0% to 2.5% by mass; dispersion rating Grade 3 or better.',
        samplingRequirements: '1 composite sample per raw material batch / lot.',
        testingFrequency: 'Every production lot & raw material entry.',
        requiredEquipment: ['Muffle Furnace / TGA Pyrolysis Unit', 'Optical Microscope with Micrometer Graticule'],
        isDestructive: true,
        isMandatoryRoutineTest: true,
        applicableProducts: ['All HDPE PE 100 Pipes'],
        sourceUrl: 'https://www.services.bis.gov.in/knowyourstandards/is4984'
      },
      {
        id: 'test-1786-1',
        standardNumber: 'IS 1786:2008',
        testName: 'Tensile Stress, 0.2% Proof Stress & Total Elongation Test',
        testMethod: 'IS 1608 (Part 1) & IS 1786 Clause 8 Table 3',
        clauseNumber: '8.1',
        description: 'Full cross-section bar undergoes axial tensile pull on Universal Testing Machine until rupture.',
        acceptanceCriteria: 'For Fe 500D: 0.2% proof stress min 500 N/mm², tensile strength min 565 N/mm² (TS/YS ratio ≥ 1.10), total elongation min 16.0%.',
        samplingRequirements: '2 test pieces for every 50 tonnes of each size and grade.',
        testingFrequency: 'Every rolling heat / cast (Mandatory Pre-Dispatch Test).',
        requiredEquipment: ['Universal Testing Machine (UTM) with Extensometer', 'Digital Vernier Caliper'],
        isDestructive: true,
        isMandatoryRoutineTest: true,
        applicableProducts: ['TMT Steel Rebars Fe 500D / Fe 550D'],
        sourceUrl: 'https://www.services.bis.gov.in/knowyourstandards/is1786'
      },
      {
        id: 'test-1786-2',
        standardNumber: 'IS 1786:2008',
        testName: '180° Bend & 20° Reverse Rebend Test for Seismic Ductility',
        testMethod: 'IS 1786 Clause 8.3 & 8.4',
        clauseNumber: '8.3',
        description: 'Bar is bent through 180° around specified mandrel diameter, followed by reverse bending after artificial aging in boiling water (100°C for 30 min).',
        acceptanceCriteria: 'No transverse cracks, fractures, or structural fissures visible on the bent zone without magnification.',
        samplingRequirements: '2 test pieces per 50 tonnes cast.',
        testingFrequency: 'Every production lot.',
        requiredEquipment: ['Hydraulic Rebar Bending Machine with Standard Mandrels', 'Boiling Water Aging Bath'],
        isDestructive: true,
        isMandatoryRoutineTest: true,
        applicableProducts: ['Fe 500D / Fe 550D Earthquake-Resistant Rebars'],
        sourceUrl: 'https://www.services.bis.gov.in/knowyourstandards/is1786'
      },
      {
        id: 'test-16221-1',
        standardNumber: 'IS 16221 (Part 2):2015',
        testName: 'Inverter Anti-Islanding Protection & Grid Disconnect Trip Time',
        testMethod: 'IS 16169:2014 / IEC 62116',
        clauseNumber: '5.4',
        description: 'Simulates sudden utility grid loss with RLC resonant load matched to inverter output power.',
        acceptanceCriteria: 'Inverter must automatically cease energizing the utility line and disconnect within 2.0 seconds.',
        samplingRequirements: '1 unit per inverter type / rating.',
        testingFrequency: 'Type testing and pre-dispatch sample verification.',
        requiredEquipment: ['Programmable Grid Simulator', 'RLC Tunable Load Bank', 'Digital Power Analyzer'],
        isDestructive: false,
        isMandatoryRoutineTest: true,
        applicableProducts: ['Solar Grid-Tied Inverters (1 kW to 500 kW)'],
        sourceUrl: 'https://www.services.bis.gov.in/knowyourstandards/is16221'
      },
      {
        id: 'test-10322-1',
        standardNumber: 'IS 10322 (Part 5/Sec 3):2012',
        testName: 'Ingress Protection (IP66) & Impact Resistance (IK08) Test',
        testMethod: 'IS/IEC 60529 & IS 10322 Clause 7',
        clauseNumber: '7.2',
        description: 'Luminaire enclosure subjected to dust chamber vacuum test (IP6X) and powerful water jet from 12.5mm nozzle at 100 kPa (IPX6), followed by 5 Joule spring hammer impact (IK08).',
        acceptanceCriteria: 'No dust ingress inside optical compartment; no harmful moisture ingress; no mechanical cracking compromising safety.',
        samplingRequirements: '2 luminaires per manufacturing batch.',
        testingFrequency: 'Type test & periodic acceptance test.',
        requiredEquipment: ['Talcum Dust Test Chamber', 'High Pressure Water Jet Rig', 'Spring Impact Hammer'],
        isDestructive: true,
        isMandatoryRoutineTest: false,
        applicableProducts: ['Outdoor LED Street Luminaires'],
        sourceUrl: 'https://www.services.bis.gov.in/knowyourstandards/is10322'
      },
      {
        id: 'test-10500-1',
        standardNumber: 'IS 10500:2012',
        testName: 'Total Dissolved Solids (TDS), Lead & Heavy Metal Limits Determination',
        testMethod: 'IS 3025 (Part 16) / IS 10500 Clause 4 Table 1 & 2',
        clauseNumber: '4.2',
        description: 'Gravimetric determination of dissolved solids after drying at 180°C, and ICP-MS quantification of toxic heavy metals (Pb, As, Cd, Cr).',
        acceptanceCriteria: 'TDS: Acceptable limit max 500 mg/L (permissible max 2000 mg/L). Lead (Pb): strictly max 0.01 mg/L.',
        samplingRequirements: '2 representative 1-litre sterile glass containers.',
        testingFrequency: 'Daily online monitoring & pre-dispatch batch test.',
        requiredEquipment: ['ICP-MS / Atomic Absorption Spectrometer', 'Calibrated pH Meter', 'Analytical Balance'],
        isDestructive: true,
        isMandatoryRoutineTest: true,
        applicableProducts: ['Drinking water supply projects', 'Municipal water'],
        sourceUrl: 'https://www.services.bis.gov.in/knowyourstandards/is10500'
      }
    ];

    if (!filter || (!filter.standardNumber && !filter.testName && !filter.productName)) {
      return defaultRequirements;
    }

    return defaultRequirements.filter(req => {
      const matchStd = !filter.standardNumber || req.standardNumber.toLowerCase().includes(filter.standardNumber.toLowerCase());
      const matchName = !filter.testName || req.testName.toLowerCase().includes(filter.testName.toLowerCase());
      const matchProd = !filter.productName || req.applicableProducts.some(p => p.toLowerCase().includes(filter.productName!.toLowerCase()));
      return matchStd && (matchName || matchProd);
    });
  }

  async getPDISchedule(standardNumber: string): Promise<PDISchedule> {
    const found = SEED_PDI_SCHEDULES.find(s =>
      s.standardNumber.toLowerCase().includes(standardNumber.toLowerCase()) ||
      standardNumber.toLowerCase().includes(s.standardNumber.toLowerCase().split(':')[0])
    );

    if (found) {
      return found;
    }

    // Default dynamic PDI schedule
    return {
      standardNumber: standardNumber || 'IS 4984:2016',
      productName: 'Standard Public Procurement Industrial Goods',
      lotInspectionCriteria: 'Lot size defined per IS 2500 (Part 1):2000. Homogeneous continuous production batch.',
      samplingStandard: 'IS 2500 (Part 1):2000 / Acceptance Quality Limit (AQL) 1.5',
      recommendedTPIAs: ['RITES Ltd.', 'CEIL (Certification Engineers International)', 'DNV GL', 'SGS India', 'TÜV Rheinland'],
      preDispatchChecklist: [
        `Verification of valid BIS Certification Licence (CM/L or CRS) for ${standardNumber}`,
        'Raw material Mill Test Certificates (MTC) and supplier traceability audit',
        'Visual examination of surface finish and dimensional tolerance verification',
        'Witnessing of mandatory routine and acceptance tests on selected lot samples',
        'Verification of indelible BIS Standard Mark, manufacturer identification, and lot batch number'
      ],
      testItems: [
        {
          parameter: 'Visual & Workmanship Verification',
          standardClause: 'Clause 4',
          testMethod: 'Visual inspection under adequate illumination',
          testType: 'ROUTINE',
          samplingPlan: '100% visual inspection; 5 random samples per lot',
          acceptanceCriteria: 'Free from flaws, cracks, deformities, or surface blemishes',
          isDestructive: false,
          witnessAgency: 'Buyer QA / TPIA'
        },
        {
          parameter: 'Dimensional Tolerances & Physical Properties',
          standardClause: 'Clause 5',
          testMethod: 'Calibrated vernier calipers, micrometers, and gauges',
          testType: 'ACCEPTANCE',
          samplingPlan: 'Sample size as per IS 2500 Table 1 (Level II)',
          acceptanceCriteria: 'Dimensions must conform strictly to prescribed standard tolerances',
          isDestructive: false,
          witnessAgency: 'Buyer QA / TPIA'
        },
        {
          parameter: 'Mechanical / Performance Acceptance Test',
          standardClause: 'Clause 6',
          testMethod: 'Standard test method prescribed in Indian Standard',
          testType: 'ACCEPTANCE',
          samplingPlan: '3 representative specimens per lot',
          acceptanceCriteria: 'Must satisfy prescribed limits without failure or distortion',
          isDestructive: true,
          witnessAgency: 'NABL Testing Laboratory / TPIA Witness'
        }
      ]
    };
  }

  async getAllPDISchedules(): Promise<PDISchedule[]> {
    return SEED_PDI_SCHEDULES;
  }
}
