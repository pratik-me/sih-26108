import { BOQItem, PDISchedule, TenderSpecification, GFRViolationClause } from '@bis/shared-types';

export const SEED_SAMPLE_TENDERS: TenderSpecification[] = [
  {
    tenderId: 'GEM/2026/B/894120',
    tenderTitle: 'Supply, Installation & Commissioning of Grid-Connected Solar Inverters & Bifacial Mono-PERC Solar PV Modules (500 kWp)',
    procuringEntity: 'National Thermal Power Corporation (NTPC) Renewables Division',
    department: 'Ministry of New & Renewable Energy / PSU Procurement',
    category: 'Solar Power Equipment & Inverters',
    estimatedValue: '₹ 2,45,00,000',
    rawSpecificationText: `Scope of Work: Supply of 500 kWp Solar PV Power Plant Equipment.
Technical Specifications:
1. Solar PV Modules: 540Wp+ Bifacial Mono-PERC Solar Modules with minimum module efficiency 21.2%. Must comply with IS 14286 / IEC 61215 and IS/IEC 61730 (Part 1 & 2). Modules must be listed in ALMM (Approved List of Models and Manufacturers) issued by MNRE.
2. String Inverters: 100 kW Grid-Tied Solar Inverters with IP65 enclosure, minimum European efficiency 98.4%, THD < 3%, Power Factor adjustable 0.8 leading to 0.8 lagging. Must strictly comply with BIS CRS Scheme II under IS 16221 (Part 2):2015 and IS 16169:2014 for anti-islanding protection. Preferred Make: ABB / Sungrow / SMA only.
3. DC Cables: 1x4 sqmm & 1x6 sqmm Solar DC Cables, electron-beam cross-linked polyolefin insulated & sheathed, UV resistant, rated for 1500V DC conforming to IS 17293:2020.
4. AC Distribution Panel with SPD Type II and MCCB conforming to IS/IEC 60947-2.`,
    boqItems: [
      {
        itemNumber: 1,
        title: 'Bifacial Mono-PERC Solar PV Modules (540 Wp+)',
        description: 'Bifacial Mono-PERC Solar Photovoltaic Modules with minimum efficiency 21.2%, tempered glass, anodized aluminum alloy frame, IP68 junction box with MC4 compatible connectors.',
        quantity: 926,
        unit: 'Nos',
        category: 'Solar PV Modules',
        materialSpecification: 'Mono-crystalline silicon cells, anodized aluminum 35mm frame, anti-reflective coated glass',
        operatingConditions: '-10°C to +85°C ambient, 1000 W/m² irradiance, wind load 2400 Pa, snow load 5400 Pa',
        extractedParameters: [
          { name: 'Nominal Power (Pmax)', specifiedValue: '540 Wp', unit: 'W', isRestrictedOrBiased: false, confidence: 0.98 },
          { name: 'Module Efficiency', specifiedValue: '≥ 21.2%', unit: '%', isRestrictedOrBiased: false, confidence: 0.95 },
          { name: 'Standard Compliance', specifiedValue: 'IS 14286:2010, IS/IEC 61730-1 & 2', standardReference: 'IS 14286', isRestrictedOrBiased: false, confidence: 0.99 }
        ],
        applicableStandardNumbers: ['IS 14286:2010', 'IS/IEC 61730 (Part 1):2016', 'IS/IEC 61730 (Part 2):2016']
      },
      {
        itemNumber: 2,
        title: 'Grid-Tied Three-Phase Solar String Inverter (100 kW)',
        description: '100 kW Three-Phase MPPT Grid-Tied Solar Inverter with RS485 / Ethernet monitoring, IP65 enclosure, total harmonic distortion < 3%.',
        quantity: 5,
        unit: 'Nos',
        category: 'Solar Power Inverters',
        materialSpecification: 'Die-cast aluminum enclosure IP65, integrated DC disconnect switch, Type II SPD on DC & AC',
        operatingConditions: 'Grid Voltage 415V ± 10%, 50 Hz ± 5%, Operating temperature -25°C to +60°C',
        extractedParameters: [
          { name: 'Rated Output Power', specifiedValue: '100 kW', unit: 'kW', isRestrictedOrBiased: false, confidence: 0.98 },
          { name: 'Enclosure Protection', specifiedValue: 'IP65', unit: '', isRestrictedOrBiased: false, confidence: 0.96 },
          { name: 'Preferred Brands Restriction', specifiedValue: 'ABB / Sungrow / SMA only', isRestrictedOrBiased: true, biasReason: 'Brand restriction violates GFR 2017 Rule 144(i) (Anti-Discriminatory specifications)', suggestedNeutralValue: 'Conforming to IS 16221 (Part 2) & IS 16169 with BIS CRS R-Number or equivalent national standard from any eligible manufacturer.', confidence: 0.99 },
          { name: 'Anti-Islanding Compliance', specifiedValue: 'IS 16169 / IEC 62116', standardReference: 'IS 16169:2014', isRestrictedOrBiased: false, confidence: 0.97 }
        ],
        applicableStandardNumbers: ['IS 16221 (Part 2):2015', 'IS 16169:2014']
      },
      {
        itemNumber: 3,
        title: 'Cross-Linked Solar DC Cable (1x4 sqmm & 1x6 sqmm, 1500V DC)',
        description: 'Cross-linked halogen-free polyolefin insulated single core flexible tinned copper solar cable rated 1.5 kV DC.',
        quantity: 8500,
        unit: 'Meters',
        category: 'Wires & Cables',
        materialSpecification: 'Electrolytic tinned copper Class 5 conductor, XLPO insulation, UV stabilized XLPO sheath',
        operatingConditions: '-40°C to +120°C max conductor temp, 20,000 hours thermal endurance as per IS 17293',
        extractedParameters: [
          { name: 'Voltage Rating', specifiedValue: '1500 V DC', unit: 'V', isRestrictedOrBiased: false, confidence: 0.95 },
          { name: 'Standard Compliance', specifiedValue: 'IS 17293:2020 (superseding TÜV 2 Pfg 1169)', standardReference: 'IS 17293:2020', isRestrictedOrBiased: false, confidence: 0.98 }
        ],
        applicableStandardNumbers: ['IS 17293:2020', 'IS 8130:2013']
      }
    ]
  },
  {
    tenderId: 'CPP/MUNICIPAL/2026/HDPE-883',
    tenderTitle: 'Procurement of High-Density Polyethylene (HDPE) Pipes (DN 110mm to DN 315mm, PN 10 & PN 16) for Urban Water Distribution Network',
    procuringEntity: 'Public Health Engineering Department (PHED) / Jal Jeevan Mission',
    department: 'State Urban Infrastructure Development Corporation',
    category: 'Water Supply & Piping',
    estimatedValue: '₹ 5,80,00,000',
    rawSpecificationText: `Specifications for HDPE Potable Water Pipes:
Supply of PE 100 Grade High Density Polyethylene pipes conforming to IS 4984:1995 (superseded) / IS 4984:2016 for drinking water conveyance.
Dimensions & Pressure Ratings:
1. DN 110mm OD, SDR 11 (PN 16) - 15,000 meters
2. DN 200mm OD, SDR 17 (PN 10) - 8,000 meters
3. DN 315mm OD, SDR 13.6 (PN 12.5) - 3,500 meters
Requirements: Virgin PE 100 food-grade resin with carbon black dispersion 2.0 - 2.5%, hydrostatic strength at 80°C for 165 hours (Clause 8.1), slow crack growth resistance, and color coded with blue co-extruded stripes.
Must bear BIS Standard ISI Mark under Scheme I. Pipes must be manufactured solely on European KraussMaffei extrusion lines.`,
    boqItems: [
      {
        itemNumber: 1,
        title: 'HDPE Water Pipe DN 110mm, SDR 11, PN 16, PE 100',
        description: 'High Density Polyethylene pipe OD 110mm, wall thickness min 10.0mm, pressure rating 16 bar, PE 100 virgin grade polymer with blue stripes for drinking water.',
        quantity: 15000,
        unit: 'Meters',
        category: 'Pipes & Fittings',
        materialSpecification: 'PE 100 virgin polymer, Minimum Required Strength MRS 10.0 MPa, Carbon black 2.25%',
        operatingConditions: 'Working pressure 16 kg/cm², design temperature 27°C, 50-year service life',
        extractedParameters: [
          { name: 'Nominal Outside Diameter', specifiedValue: '110 mm', unit: 'mm', isRestrictedOrBiased: false, confidence: 0.98 },
          { name: 'Standard Dimension Ratio', specifiedValue: 'SDR 11', unit: '', isRestrictedOrBiased: false, confidence: 0.96 },
          { name: 'Pressure Rating', specifiedValue: 'PN 16 (1.6 MPa)', unit: 'bar', isRestrictedOrBiased: false, confidence: 0.97 },
          { name: 'Superseded Standard Cited', specifiedValue: 'IS 4984:1995', standardReference: 'IS 4984:1995', isRestrictedOrBiased: true, biasReason: 'IS 4984:1995 is superseded by IS 4984:2016 which introduces mandatory PE 100 resin class, SCG notch testing, and DPIIT Quality Control Order compliance.', suggestedNeutralValue: 'IS 4984:2016 (High Density Polyethylene Pipes for Water Supply - Specification, Fourth Revision)', confidence: 0.99 },
          { name: 'Manufacturing Machinery Bias', specifiedValue: 'KraussMaffei extrusion lines only', isRestrictedOrBiased: true, biasReason: 'Restricting manufacturing to specific European brand machinery violates GFR 2017 Rule 144(i).', suggestedNeutralValue: 'Manufactured on automated extrusion line meeting dimensional tolerances and hydrostatic quality parameters specified in IS 4984:2016.', confidence: 0.99 }
        ],
        applicableStandardNumbers: ['IS 4984:2016', 'IS 7328:2020', 'IS 2530:1963']
      },
      {
        itemNumber: 2,
        title: 'HDPE Water Pipe DN 200mm, SDR 17, PN 10, PE 100',
        description: 'HDPE Pipe OD 200mm, PN 10 bar rating, SDR 17, PE 100 resin, ISI embossed with CM/L number.',
        quantity: 8000,
        unit: 'Meters',
        category: 'Pipes & Fittings',
        materialSpecification: 'Virgin PE 100 resin conforming to IS 7328',
        operatingConditions: 'Working pressure 10 bar, potable water conveyance',
        extractedParameters: [
          { name: 'Nominal Outside Diameter', specifiedValue: '200 mm', unit: 'mm', isRestrictedOrBiased: false, confidence: 0.98 },
          { name: 'Standard Dimension Ratio', specifiedValue: 'SDR 17', unit: '', isRestrictedOrBiased: false, confidence: 0.96 },
          { name: 'Pressure Rating', specifiedValue: 'PN 10', unit: 'bar', isRestrictedOrBiased: false, confidence: 0.97 }
        ],
        applicableStandardNumbers: ['IS 4984:2016']
      }
    ]
  },
  {
    tenderId: 'PWD/BRIDGES/2026/STEEL-104',
    tenderTitle: 'Supply of Thermo-Mechanically Treated (TMT) High-Strength Deformed Steel Bars for Flyover and Metro Viaduct Infrastructure',
    procuringEntity: 'Public Works Department (PWD) / Metro Rail Corporation',
    department: 'Civil Infrastructure & Transport Engineering',
    category: 'Structural Steel & Reinforcement',
    estimatedValue: '₹ 14,20,00,000',
    rawSpecificationText: `Supply of TMT Reinforcement Steel Bars:
1. Grade: Fe 500D / Fe 550D High-Ductility TMT Rebars conforming to IS 1786:1985 (obsolete) or IS 1786:2008.
2. Diameter ranges: 12mm, 16mm, 20mm, 25mm, 32mm.
3. Mechanical parameters: Minimum Yield Strength 500 N/mm², Tensile to Yield ratio (TS/YS) >= 1.12, percentage elongation min 16.0%, bend and rebend test without fracture.
4. Chemical parameters: Carbon max 0.25%, Sulphur max 0.040%, Phosphorus max 0.040%, S+P combined max 0.075%.
5. Producer clause: Must be sourced exclusively from Primary Steel Producers having integrated blast furnace (SAIL / TATA Steel / JSW only). Secondary re-rollers strictly disqualified even if possessing BIS ISI Mark.`,
    boqItems: [
      {
        itemNumber: 1,
        title: 'TMT Reinforcement Steel Bars Fe 500D (12mm to 32mm)',
        description: 'High Ductility Thermo-Mechanically Treated steel rebar grade Fe 500D for seismic-resistant RCC structures, conforming to IS 1786:2008 with BIS Standard Mark.',
        quantity: 2200,
        unit: 'Metric Tonnes',
        category: 'Structural Steel',
        materialSpecification: 'Low carbon micro-alloyed steel with strictly controlled P and S impurities',
        operatingConditions: 'Earthquake Zone IV/V bridge foundations and viaduct superstructures',
        extractedParameters: [
          { name: 'Steel Grade', specifiedValue: 'Fe 500D', unit: '', isRestrictedOrBiased: false, confidence: 0.99 },
          { name: 'Yield Strength', specifiedValue: '≥ 500 N/mm²', unit: 'MPa', isRestrictedOrBiased: false, confidence: 0.98 },
          { name: 'TS/YS Ratio', specifiedValue: '≥ 1.10 (Clause 8.1)', unit: '', isRestrictedOrBiased: false, confidence: 0.95 },
          { name: 'Primary Producer Only Restriction', specifiedValue: 'SAIL / TATA / JSW only (Disqualifying secondary BIS licensed re-rollers)', isRestrictedOrBiased: true, biasReason: 'Mandating "Primary Producers Only" violates Ministry of Finance / DPIIT GFR 144(i) and Competition Commission directives when all bidders possess valid BIS IS 1786 licenses meeting chemical & mechanical parameters.', suggestedNeutralValue: 'Procurement open to all manufacturers possessing valid BIS Certification Marks Licence (CM/L) for IS 1786:2008 Fe 500D/550D, supported by NABL accredited test certificates.', confidence: 0.99 },
          { name: 'Obsolete Standard Cited', specifiedValue: 'IS 1786:1985', standardReference: 'IS 1786:1985', isRestrictedOrBiased: true, biasReason: 'IS 1786:1985 lacks Fe 500D high-ductility earthquake resistance grade definitions and is legally superseded under the Steel QCO.', suggestedNeutralValue: 'IS 1786:2008 (High Strength Deformed Steel Bars and Wires for Concrete Reinforcement, Fourth Revision)', confidence: 0.99 }
        ],
        applicableStandardNumbers: ['IS 1786:2008', 'IS 2062:2011', 'IS 1608 (Part 1):2018']
      }
    ]
  },
  {
    tenderId: 'CPWD/ELECT/2026/LED-449',
    tenderTitle: 'Supply & Installation of High-Efficiency Smart Commercial LED Street & Area Luminaires (90W, 120W, 150W)',
    procuringEntity: 'Central Public Works Department (CPWD) / Smart City Mission',
    department: 'Electrical Engineering Division',
    category: 'LED Lighting & Smart Fixtures',
    estimatedValue: '₹ 1,85,00,000',
    rawSpecificationText: `Specifications for Outdoor LED Street Lighting:
1. Luminaire Type: Pressure die-cast aluminum housing IP66, IK08 impact resistance, integrated SPD 10 kV/10 kA, CCT 5700K (Cool White), CRI > 70.
2. Electrical & Optical: System luminous efficacy >= 130 lm/W, Power Factor >= 0.95, Total Harmonic Distortion (THD) < 10% under full load, driver efficiency >= 90%.
3. Standards: Must comply with IS 10322 (Part 5/Sec 3):2012 for Street Lighting Safety, IS 16103 (Part 1) for LED Modules, IS 15885 (Part 2/Sec 13) for Electronic Control Gear, and IS 16107 (Part 2/Sec 1) for Luminaire Performance.
4. Mandatory BIS Compulsory Registration Scheme (CRS) Registration under Scheme II for LED luminaires and drivers.`,
    boqItems: [
      {
        itemNumber: 1,
        title: 'Outdoor LED Street Light Luminaire 120W (IP66, 130 lm/W)',
        description: '120W Smart LED Street Luminaire with NEMA 7-pin socket, optical lens for Type II medium road distribution, 10kV surge protection.',
        quantity: 1200,
        unit: 'Nos',
        category: 'LED Lighting',
        materialSpecification: 'High-pressure die-cast aluminum housing ADC12, toughened clear glass diffuser',
        operatingConditions: 'Operating voltage 140V to 300V AC, 50 Hz, ambient temp up to 50°C',
        extractedParameters: [
          { name: 'System Wattage', specifiedValue: '120 W ± 5%', unit: 'W', isRestrictedOrBiased: false, confidence: 0.98 },
          { name: 'System Efficacy', specifiedValue: '≥ 130 lm/W', unit: 'lm/W', isRestrictedOrBiased: false, confidence: 0.97 },
          { name: 'Enclosure & Impact', specifiedValue: 'IP66, IK08', unit: '', isRestrictedOrBiased: false, confidence: 0.96 },
          { name: 'Surge Protection', specifiedValue: '10 kV / 10 kA', unit: 'kV', isRestrictedOrBiased: false, confidence: 0.95 }
        ],
        applicableStandardNumbers: ['IS 10322 (Part 5/Sec 3):2012', 'IS 15885 (Part 2/Sec 13):2012', 'IS 16107 (Part 2/Sec 1):2012', 'IS 16102 (Part 1 & 2):2017']
      }
    ]
  }
];

export const SEED_PDI_SCHEDULES: PDISchedule[] = [
  {
    standardNumber: 'IS 4984:2016',
    productName: 'High Density Polyethylene (HDPE) Pipes for Water Supply',
    lotInspectionCriteria: 'Lot size as per Table 8 of IS 4984:2016. All pipes of same nominal diameter, pressure rating, and resin grade manufactured continuously.',
    samplingStandard: 'IS 2500 (Part 1):2000 / IS 4984:2016 Clause 10',
    recommendedTPIAs: ['RITES Ltd.', 'CEIL (Certification Engineers International)', 'DNV GL', 'SGS India', 'TÜV Rheinland'],
    preDispatchChecklist: [
      'Verification of manufacturer valid BIS CM/L licence for IS 4984:2016 and PE 100 grade scope',
      'Raw material manufacturer test certificates (MTC) verifying virgin PE 100 polymer density and Melt Flow Index (MFI)',
      'Visual inspection of pipe outer surface for smoothness, absence of waviness, voids, or carbon agglomerates',
      'Continuous indelible marking check: BIS Standard Mark, CM/L No., IS 4984, PE 100, SDR, PN rating, lot batch number, and manufacturer name at 1-meter intervals',
      'Hydrostatic pressure proof test witnessed on selected sample specimens at 20°C and 80°C',
      'Dimensional wall thickness check across 8 perimeter points per pipe sample'
    ],
    testItems: [
      {
        parameter: 'Visual Appearance & Surface Finish',
        standardClause: 'Clause 6.1',
        testMethod: 'Visual examination under daylight',
        testType: 'ROUTINE',
        samplingPlan: '100% inspection for defects; 10 samples per lot for dimensional check',
        acceptanceCriteria: 'Smooth internal and external surface, free from blisters, shrinkage cavities, or foreign inclusions',
        isDestructive: false,
        witnessAgency: 'Buyer QA / TPIA Inspection Engineer'
      },
      {
        parameter: 'Dimensional Verification (Outside Diameter, Ovality & Wall Thickness)',
        standardClause: 'Clause 7.1, Table 1-7',
        testMethod: 'Circometer tape (diameter) and ultrasonic / ball-ended micrometer (wall thickness) as per IS 12235 (Part 1)',
        testType: 'ACCEPTANCE',
        samplingPlan: 'Sample size per Table 8 (min 5 samples per lot)',
        acceptanceCriteria: 'Outside diameter tolerance ± 0.3% of nominal OD; wall thickness within minimum and maximum limits of specified SDR table',
        isDestructive: false,
        witnessAgency: 'Buyer QA / TPIA'
      },
      {
        parameter: 'Hydrostatic Internal Pressure Test (Short-Term: 100 hours at 20°C & 165 hours at 80°C)',
        standardClause: 'Clause 8.1, Table 9',
        testMethod: 'End-capped pipe specimen filled with water under constant hydrostatic pressure in thermostatic water bath as per IS 12235 (Part 8)',
        testType: 'ACCEPTANCE',
        samplingPlan: '3 pipe samples per production batch / lot',
        acceptanceCriteria: 'No burst, weeping, rupture, or failure during the test duration at test hoop stress of 12.0 MPa (20°C / 100h) or 5.4 MPa (80°C / 165h)',
        isDestructive: true,
        witnessAgency: 'NABL Lab / Witnessed at Manufacturer Test Bench'
      },
      {
        parameter: 'Carbon Black Content & Dispersion',
        standardClause: 'Clause 8.2 & 8.3',
        testMethod: 'Thermogravimetric / muffle furnace pyrolysis as per IS 2530 and microtome slicing under optical microscope (IS 4984 Annex B)',
        testType: 'ACCEPTANCE',
        samplingPlan: '1 test per lot or raw material batch',
        acceptanceCriteria: 'Carbon black content 2.0% to 2.5% by mass; dispersion grade rating <= 3',
        isDestructive: true,
        witnessAgency: 'NABL Accredited In-House / Third-Party Lab'
      },
      {
        parameter: 'Reversion Test (Thermal Stability)',
        standardClause: 'Clause 8.5',
        testMethod: 'Specimens placed in air-circulating oven at 110°C ± 2°C for specified duration as per IS 12235 (Part 5)',
        testType: 'ACCEPTANCE',
        samplingPlan: '3 specimens per lot',
        acceptanceCriteria: 'Longitudinal dimensional change (shrinkage) <= 3.0%',
        isDestructive: true,
        witnessAgency: 'TPIA Witness'
      }
    ]
  },
  {
    standardNumber: 'IS 1786:2008',
    productName: 'High Strength Deformed Steel Bars for Concrete Reinforcement (Fe 500D / Fe 550D)',
    lotInspectionCriteria: 'Each heat/cast comprising up to 50 tonnes of bars of same nominal size and grade.',
    samplingStandard: 'IS 1786:2008 Clause 11 & IS 2500',
    recommendedTPIAs: ['RITES Ltd.', 'Bureau Veritas', 'TUV SUD India', 'Intertek India'],
    preDispatchChecklist: [
      'Verification of active BIS CM/L licence under Steel Quality Control Order (Steel QCO)',
      'Heat-wise Ladle Chemical Analysis Test Certificate verifying P <= 0.040%, S <= 0.040%, C <= 0.25%',
      'Check for clear hot-rolled or cold-embossed manufacturer logo, Fe grade (500D), and nominal diameter on rebar surface at < 1.5m intervals',
      'Weight per meter (nominal mass) verification on 3 cut specimens per lot with permissible variation within IS 1786 Table 1 limits',
      'Tensile and 180-degree bend & rebend test witnessed on calibrated Universal Testing Machine (UTM)'
    ],
    testItems: [
      {
        parameter: '0.2% Proof Stress / Yield Stress (YS)',
        standardClause: 'Clause 8.1, Table 3',
        testMethod: 'Tensile test on calibrated UTM using extensometer conforming to IS 1608 (Part 1)',
        testType: 'ACCEPTANCE',
        samplingPlan: '2 test pieces per 50 tonnes or part thereof per cast',
        acceptanceCriteria: 'Min 500.0 N/mm² for Fe 500D; Min 550.0 N/mm² for Fe 550D',
        isDestructive: true,
        witnessAgency: 'TPIA / Buyer QA'
      },
      {
        parameter: 'Tensile Strength (TS) & TS/YS Ratio',
        standardClause: 'Clause 8.1, Table 3',
        testMethod: 'Tensile test on UTM as per IS 1608 (Part 1)',
        testType: 'ACCEPTANCE',
        samplingPlan: '2 test pieces per 50 tonnes',
        acceptanceCriteria: 'Tensile Strength min 565 N/mm²; TS/YS ratio >= 1.10 (mandatory for earthquake resistance)',
        isDestructive: true,
        witnessAgency: 'TPIA / Buyer QA'
      },
      {
        parameter: 'Total Elongation at Maximum Force & Gauge Elongation',
        standardClause: 'Clause 8.1, Table 3',
        testMethod: 'Gauge length measurement as per IS 1608',
        testType: 'ACCEPTANCE',
        samplingPlan: '2 test pieces per 50 tonnes',
        acceptanceCriteria: 'Minimum elongation 16.0% for Fe 500D on gauge length 5.65 * sqrt(So)',
        isDestructive: true,
        witnessAgency: 'TPIA / Buyer QA'
      },
      {
        parameter: 'Bend & Rebend Test',
        standardClause: 'Clause 8.3 & 8.4',
        testMethod: 'Bend through 180° around mandrel diameter per Table 4; reverse bend through 20° after aging in boiling water for 30 minutes',
        testType: 'ACCEPTANCE',
        samplingPlan: '2 test pieces per 50 tonnes',
        acceptanceCriteria: 'No transverse rupture, cracking, or surface fissures visible on bent portion',
        isDestructive: true,
        witnessAgency: 'TPIA Witness'
      },
      {
        parameter: 'Nominal Mass (Weight per Meter) Tolerance',
        standardClause: 'Clause 6.2, Table 1',
        testMethod: 'Accurate weighing of cut bar specimen of minimum 0.5 meter length on calibrated digital balance',
        testType: 'ACCEPTANCE',
        samplingPlan: '3 specimens per 50-tonne batch',
        acceptanceCriteria: 'Tolerance: ± 7% for <=10mm; ± 5% for 12mm-16mm; ± 3% for >=20mm diameter',
        isDestructive: false,
        witnessAgency: 'TPIA Witness'
      }
    ]
  }
];
