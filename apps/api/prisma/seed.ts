import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // idempotent seed for a sample user
  await prisma.user.upsert({
    where: {email: 'demo@carboniq.local'},
    update: {},
    create: {email: 'demo@carboniq.local', name: 'Demo User'}
  });

  // minimal emission factors (demo values only)
  let factors: any[] = [
    // Electricity market-based (example values)
    {
      code: 'ELEC_PT_MB_2025', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.20, version: '2025'
    },
    {
      code: 'ELEC_EU_MB_2025', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.28, version: '2025'
    },
    {
      code: 'ELEC_UK_MB_2025', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.21, version: '2025'
    },
    {
      code: 'ELEC_PT_MB_2024',
      region: 'PT',
      scope: 'SCOPE2',
      source: 'Demo dataset',
      unit: 'kWh',
      co2ePerUnit: 0.22,
      version: '2024'
    },
    {
      code: 'ELEC_EU_MB_2024',
      region: 'EU',
      scope: 'SCOPE2',
      source: 'Demo dataset',
      unit: 'kWh',
      co2ePerUnit: 0.30,
      version: '2024'
    },
    {
      code: 'ELEC_UK_MB_2024',
      region: 'UK',
      scope: 'SCOPE2',
      source: 'Demo dataset',
      unit: 'kWh',
      co2ePerUnit: 0.23,
      version: '2024'
    },
    {
      code: 'ELEC_PT_MB_2023',
      region: 'PT',
      scope: 'SCOPE2',
      source: 'Demo dataset',
      unit: 'kWh',
      co2ePerUnit: 0.24,
      version: '2023'
    },
    {
      code: 'ELEC_EU_MB_2023',
      region: 'EU',
      scope: 'SCOPE2',
      source: 'Demo dataset',
      unit: 'kWh',
      co2ePerUnit: 0.31,
      version: '2023'
    },
    {
      code: 'ELEC_UK_MB_2023',
      region: 'UK',
      scope: 'SCOPE2',
      source: 'Demo dataset',
      unit: 'kWh',
      co2ePerUnit: 0.24,
      version: '2023'
    },
    {
      code: 'ELEC_PT_MB_2022',
      region: 'PT',
      scope: 'SCOPE2',
      source: 'Demo dataset',
      unit: 'kWh',
      co2ePerUnit: 0.25,
      version: '2022'
    },
    {
      code: 'ELEC_EU_MB_2022',
      region: 'EU',
      scope: 'SCOPE2',
      source: 'Demo dataset',
      unit: 'kWh',
      co2ePerUnit: 0.32,
      version: '2022'
    },
    {
      code: 'ELEC_UK_MB_2022',
      region: 'UK',
      scope: 'SCOPE2',
      source: 'Demo dataset',
      unit: 'kWh',
      co2ePerUnit: 0.25,
      version: '2022'
    },
    // Older years for completeness
    {
      code: 'ELEC_PT_MB_2021', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.26, version: '2021'
    },
    {
      code: 'ELEC_EU_MB_2021', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.33, version: '2021'
    },
    {
      code: 'ELEC_UK_MB_2021', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.26, version: '2021'
    },
    {
      code: 'ELEC_PT_MB_2020', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.27, version: '2020'
    },
    {
      code: 'ELEC_EU_MB_2020', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.34, version: '2020'
    },
    {
      code: 'ELEC_UK_MB_2020', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.27, version: '2020'
    },
    {
      code: 'DIESEL_S1_2024',
      region: 'EU',
      scope: 'SCOPE1',
      source: 'Demo dataset',
      unit: 'L',
      co2ePerUnit: 2.68,
      version: '2024'
    },
    {
      code: 'GASOLINE_S1_2024',
      region: 'EU',
      scope: 'SCOPE1',
      source: 'Demo dataset',
      unit: 'L',
      co2ePerUnit: 2.31,
      version: '2024'
    },
    {
      code: 'NATGAS_S1_2024',
      region: 'EU',
      scope: 'SCOPE1',
      source: 'Demo dataset',
      unit: 'kWh',
      co2ePerUnit: 0.202,
      version: '2024'
    },
    {
      code: 'LPG_S1_2024',
      region: 'EU',
      scope: 'SCOPE1',
      source: 'Demo dataset',
      unit: 'kg',
      co2ePerUnit: 3.0,
      version: '2024'
    },
    // PT/UK variants for common fuels (for better regional filtering)
    { code: 'DIESEL_PT_S1_2024', region: 'PT', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.68, version: '2024' },
    { code: 'DIESEL_UK_S1_2024', region: 'UK', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.68, version: '2024' },
    { code: 'GASOLINE_PT_S1_2024', region: 'PT', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.31, version: '2024' },
    { code: 'GASOLINE_UK_S1_2024', region: 'UK', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.31, version: '2024' },
    { code: 'NATGAS_PT_KWH_S1_2024', region: 'PT', scope: 'SCOPE1', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.202, version: '2024' },
    { code: 'NATGAS_UK_KWH_S1_2024', region: 'UK', scope: 'SCOPE1', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.202, version: '2024' },
    { code: 'NATGAS_PT_SM3_S1_2024', region: 'PT', scope: 'SCOPE1', source: 'Demo dataset', unit: 'Sm3', co2ePerUnit: 1.9, version: '2024' },
    { code: 'NATGAS_UK_SM3_S1_2024', region: 'UK', scope: 'SCOPE1', source: 'Demo dataset', unit: 'Sm3', co2ePerUnit: 1.9, version: '2024' },
    // More SCOPE1 variants by region and year
    { code: 'DIESEL_PT_S1_2023', region: 'PT', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.70, version: '2023' },
    { code: 'DIESEL_UK_S1_2023', region: 'UK', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.70, version: '2023' },
    { code: 'GASOLINE_PT_S1_2023', region: 'PT', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.32, version: '2023' },
    { code: 'GASOLINE_UK_S1_2023', region: 'UK', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.32, version: '2023' },
    { code: 'LPG_PT_S1_2024', region: 'PT', scope: 'SCOPE1', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 3.0, version: '2024' },
    { code: 'LPG_UK_S1_2024', region: 'UK', scope: 'SCOPE1', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 3.0, version: '2024' },
    {
      code: 'CAR_KM_S3_2024',
      region: 'EU',
      scope: 'SCOPE3',
      source: 'Demo dataset',
      unit: 'km',
      co2ePerUnit: 0.171,
      version: '2024'
    },
    {
      code: 'TRAIN_KM_S3_2024',
      region: 'EU',
      scope: 'SCOPE3',
      source: 'Demo dataset',
      unit: 'km',
      co2ePerUnit: 0.028,
      version: '2024'
    },
    {
      code: 'FLIGHT_SHORT_KM_S3_2024',
      region: 'EU',
      scope: 'SCOPE3',
      source: 'Demo dataset',
      unit: 'km',
      co2ePerUnit: 0.15,
      version: '2024'
    },
    {
      code: 'FLIGHT_LONG_KM_S3_2024',
      region: 'EU',
      scope: 'SCOPE3',
      source: 'Demo dataset',
      unit: 'km',
      co2ePerUnit: 0.09,
      version: '2024'
    },
    {
      code: 'SHIP_KM_S3_2024',
      region: 'EU',
      scope: 'SCOPE3',
      source: 'Demo dataset',
      unit: 'km',
      co2ePerUnit: 0.040,
      version: '2024'
    },
    // Freight factors by tonne-km
    { code: 'FREIGHT_ROAD_TKM_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'tkm', co2ePerUnit: 0.10, version: '2024' },
    { code: 'FREIGHT_AIR_TKM_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'tkm', co2ePerUnit: 0.60, version: '2024' },
    { code: 'FREIGHT_SEA_TKM_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'tkm', co2ePerUnit: 0.015, version: '2024' },
    // Waste and services
    { code: 'WASTE_MIX_KG_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 0.45, version: '2024' },
    { code: 'HOTEL_NIGHT_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'night', co2ePerUnit: 26.0, version: '2024' },
    { code: 'MEAL_UNIT_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'meal', co2ePerUnit: 2.5, version: '2024' },
    // Spend generic multipliers
    { code: 'SPEND_GEN_2024',
      region: 'EU',
      scope: 'SCOPE3',
      source: 'Demo dataset',
      unit: 'EUR',
      co2ePerUnit: 0.00035,
      version: '2024'
    },
    // Electricity location-based (example values)
    { code: 'ELEC_PT_LB_2025', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.27, version: '2025' },
    { code: 'ELEC_EU_LB_2025', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.33, version: '2025' },
    { code: 'ELEC_UK_LB_2025', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.28, version: '2025' },

    // SCOPE3 – commuting and business travel
    { code: 'BUS_KM_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.105, version: '2024' },
    { code: 'TAXI_KM_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.180, version: '2024' },

    // SCOPE3 – materials & waste streams
    { code: 'WASTE_PAPER_KG_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 0.90, version: '2024' },
    { code: 'WASTE_PLASTIC_KG_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 1.80, version: '2024' },
    { code: 'WATER_M3_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'm3', co2ePerUnit: 0.34, version: '2024' },

    // SCOPE3 – courier/shipping by kg·km
    { code: 'COURIER_KGKM_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kgkm', co2ePerUnit: 0.50, version: '2024' },

    // IT/Cloud proxy per kWh
    { code: 'CLOUD_KWH_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.30, version: '2024' },
    // Electricity location-based historical
    { code: 'ELEC_PT_LB_2024', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.29, version: '2024' },
    { code: 'ELEC_EU_LB_2024', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.35, version: '2024' },
    { code: 'ELEC_UK_LB_2024', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.30, version: '2024' },
    { code: 'ELEC_PT_LB_2023', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.31, version: '2023' },
    { code: 'ELEC_EU_LB_2023', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.36, version: '2023' },
    { code: 'ELEC_UK_LB_2023', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.31, version: '2023' },
    { code: 'ELEC_PT_LB_2022', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.33, version: '2022' },
    { code: 'ELEC_EU_LB_2022', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.37, version: '2022' },
    { code: 'ELEC_UK_LB_2022', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.33, version: '2022' },

    // Transmission & Distribution losses
    { code: 'ELEC_TD_LOSS_PT_2025', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.03, version: '2025' },
    { code: 'ELEC_TD_LOSS_EU_2025', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.035, version: '2025' },
    { code: 'ELEC_TD_LOSS_UK_2025', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.028, version: '2025' },

    // Flights by class/distance
    { code: 'FLIGHT_SHORT_ECO_KM_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.12, version: '2024' },
    { code: 'FLIGHT_SHORT_BUS_KM_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.18, version: '2024' },
    { code: 'FLIGHT_LONG_ECO_KM_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.08, version: '2024' },
    { code: 'FLIGHT_LONG_BUS_KM_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.11, version: '2024' },

    // Waste flows
    { code: 'WASTE_GLASS_KG_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 0.21, version: '2024' },
    { code: 'WASTE_METAL_KG_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 0.50, version: '2024' },
    { code: 'WASTE_ORGANIC_KG_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 1.20, version: '2024' },

    // Electricity LB 2021–2020
    { code: 'ELEC_PT_LB_2021', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.34, version: '2021' },
    { code: 'ELEC_EU_LB_2021', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.38, version: '2021' },
    { code: 'ELEC_UK_LB_2021', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.34, version: '2021' },
    { code: 'ELEC_PT_LB_2020', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.35, version: '2020' },
    { code: 'ELEC_EU_LB_2020', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.39, version: '2020' },
    { code: 'ELEC_UK_LB_2020', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.35, version: '2020' },

    // T&D losses 2020–2024
    { code: 'ELEC_TD_LOSS_PT_2024', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.031, version: '2024' },
    { code: 'ELEC_TD_LOSS_EU_2024', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.036, version: '2024' },
    { code: 'ELEC_TD_LOSS_UK_2024', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.029, version: '2024' },
    { code: 'ELEC_TD_LOSS_PT_2023', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.032, version: '2023' },
    { code: 'ELEC_TD_LOSS_EU_2023', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.037, version: '2023' },
    { code: 'ELEC_TD_LOSS_UK_2023', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.030, version: '2023' },
    { code: 'ELEC_TD_LOSS_PT_2022', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.033, version: '2022' },
    { code: 'ELEC_TD_LOSS_EU_2022', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.038, version: '2022' },
    { code: 'ELEC_TD_LOSS_UK_2022', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.031, version: '2022' },
    { code: 'ELEC_TD_LOSS_PT_2021', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.034, version: '2021' },
    { code: 'ELEC_TD_LOSS_EU_2021', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.039, version: '2021' },
    { code: 'ELEC_TD_LOSS_UK_2021', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.032, version: '2021' },
    { code: 'ELEC_TD_LOSS_PT_2020', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.035, version: '2020' },
    { code: 'ELEC_TD_LOSS_EU_2020', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.040, version: '2020' },
    { code: 'ELEC_TD_LOSS_UK_2020', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.033, version: '2020' },

    // SCOPE1 – combustíveis adicionais
    { code: 'FUELOIL_HEAVY_PT_S1_2024', region: 'PT', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 3.10, version: '2024' },
    { code: 'FUELOIL_LIGHT_PT_S1_2024', region: 'PT', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.68, version: '2024' },
    { code: 'PROPANE_PT_S1_2024', region: 'PT', scope: 'SCOPE1', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 3.00, version: '2024' },
    { code: 'BUTANE_PT_S1_2024', region: 'PT', scope: 'SCOPE1', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 3.05, version: '2024' },

    // SCOPE3 – mobilidade adicional
    { code: 'METRO_KM_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.025, version: '2024' },
    { code: 'TRAM_KM_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.020, version: '2024' },
    { code: 'VAN_DIESEL_KM_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.25, version: '2024' },

    // SCOPE3 – spend por categoria
    { code: 'SPEND_IT_EUR_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'EUR', co2ePerUnit: 0.0007, version: '2024' },
    { code: 'SPEND_CONSTRUCTION_EUR_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'EUR', co2ePerUnit: 0.0018, version: '2024' },
    { code: 'SPEND_FURNITURE_EUR_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'EUR', co2ePerUnit: 0.0011, version: '2024' },
    // Older LB years (2019–2018)
    { code: 'ELEC_PT_LB_2019', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.36, version: '2019' },
    { code: 'ELEC_EU_LB_2019', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.40, version: '2019' },
    { code: 'ELEC_UK_LB_2019', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.36, version: '2019' },
    { code: 'ELEC_PT_LB_2018', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.37, version: '2018' },
    { code: 'ELEC_EU_LB_2018', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.41, version: '2018' },
    { code: 'ELEC_UK_LB_2018', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.37, version: '2018' },

    // T&D 2019–2018
    { code: 'ELEC_TD_LOSS_PT_2019', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.036, version: '2019' },
    { code: 'ELEC_TD_LOSS_EU_2019', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.041, version: '2019' },
    { code: 'ELEC_TD_LOSS_UK_2019', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.034, version: '2019' },
    { code: 'ELEC_TD_LOSS_PT_2018', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.037, version: '2018' },
    { code: 'ELEC_TD_LOSS_EU_2018', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.042, version: '2018' },
    { code: 'ELEC_TD_LOSS_UK_2018', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.035, version: '2018' },

    // Diesel/Gasolina blends
    { code: 'DIESEL_B7_PT_S1_2024', region: 'PT', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.65, version: '2024' },
    { code: 'DIESEL_B10_PT_S1_2024', region: 'PT', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.60, version: '2024' },
    { code: 'GASOLINE_E5_PT_S1_2024', region: 'PT', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.30, version: '2024' },
    { code: 'GASOLINE_E10_PT_S1_2024', region: 'PT', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.25, version: '2024' },

    // Natural gas WTT (Scope 3 upstream) + Combustion (Scope 1)
    { code: 'NATGAS_WTT_PT_KWH_S3_2024', region: 'PT', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.05, version: '2024' },
    { code: 'NATGAS_COMB_PT_KWH_S1_2024', region: 'PT', scope: 'SCOPE1', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.152, version: '2024' },

    // Resíduos por método
    { code: 'WASTE_PAPER_REC_KG_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 0.20, version: '2024' },
    { code: 'WASTE_PAPER_LDF_KG_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 1.10, version: '2024' },
    { code: 'WASTE_PAPER_INC_KG_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 0.70, version: '2024' },
    { code: 'WASTE_PLASTIC_REC_KG_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 0.60, version: '2024' },
    { code: 'WASTE_PLASTIC_LDF_KG_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 2.50, version: '2024' },
    { code: 'WASTE_GLASS_REC_KG_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 0.12, version: '2024' },

    // Voos detalhados
    { code: 'FLIGHT_VSHORT_ECO_KM_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.17, version: '2024' },
    { code: 'FLIGHT_MEDIUM_ECO_KM_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.10, version: '2024' },
    { code: 'FLIGHT_LONG_FIRST_KM_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.20, version: '2024' },
    // LB 2017–2016
    { code: 'ELEC_PT_LB_2017', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.38, version: '2017' },
    { code: 'ELEC_EU_LB_2017', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.42, version: '2017' },
    { code: 'ELEC_UK_LB_2017', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.38, version: '2017' },
    { code: 'ELEC_PT_LB_2016', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.39, version: '2016' },
    { code: 'ELEC_EU_LB_2016', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.43, version: '2016' },
    { code: 'ELEC_UK_LB_2016', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.39, version: '2016' },

    // T&D 2017–2016
    { code: 'ELEC_TD_LOSS_PT_2017', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.038, version: '2017' },
    { code: 'ELEC_TD_LOSS_EU_2017', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.043, version: '2017' },
    { code: 'ELEC_TD_LOSS_UK_2017', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.036, version: '2017' },
    { code: 'ELEC_TD_LOSS_PT_2016', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.039, version: '2016' },
    { code: 'ELEC_TD_LOSS_EU_2016', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.044, version: '2016' },
    { code: 'ELEC_TD_LOSS_UK_2016', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.037, version: '2016' },

    // Blends e variantes regionais (UK/EU)
    { code: 'DIESEL_B7_UK_S1_2024', region: 'UK', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.66, version: '2024' },
    { code: 'DIESEL_B10_UK_S1_2024', region: 'UK', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.61, version: '2024' },
    { code: 'GASOLINE_E5_UK_S1_2024', region: 'UK', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.29, version: '2024' },
    { code: 'GASOLINE_E10_UK_S1_2024', region: 'UK', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.24, version: '2024' },

    // NG WTT/Combustion UK
    { code: 'NATGAS_WTT_UK_KWH_S3_2024', region: 'UK', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.048, version: '2024' },
    { code: 'NATGAS_COMB_UK_KWH_S1_2024', region: 'UK', scope: 'SCOPE1', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.150, version: '2024' },

    // Veículos por tipo (proxies gCO2e/km)
    { code: 'CAR_PETROL_KM_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.180, version: '2024' },
    { code: 'CAR_DIESEL_KM_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.160, version: '2024' },
    { code: 'CAR_HYBRID_KM_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.120, version: '2024' },
    { code: 'CAR_EV_KM_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.050, version: '2024' },
    { code: 'RIDE_HAILING_KM_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.190, version: '2024' },

    // WEEE e orgânicos adicionais
    { code: 'WEEE_KG_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 2.80, version: '2024' },
    { code: 'WASTE_ORGANIC_LDF_KG_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 1.80, version: '2024' },

    // LB 2015–2010 (PT/EU/UK)
    { code: 'ELEC_PT_LB_2015', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.40, version: '2015' },
    { code: 'ELEC_EU_LB_2015', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.44, version: '2015' },
    { code: 'ELEC_UK_LB_2015', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.40, version: '2015' },
    { code: 'ELEC_PT_LB_2014', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.41, version: '2014' },
    { code: 'ELEC_EU_LB_2014', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.45, version: '2014' },
    { code: 'ELEC_UK_LB_2014', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.41, version: '2014' },
    { code: 'ELEC_PT_LB_2013', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.42, version: '2013' },
    { code: 'ELEC_EU_LB_2013', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.46, version: '2013' },
    { code: 'ELEC_UK_LB_2013', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.42, version: '2013' },
    { code: 'ELEC_PT_LB_2012', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.43, version: '2012' },
    { code: 'ELEC_EU_LB_2012', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.47, version: '2012' },
    { code: 'ELEC_UK_LB_2012', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.43, version: '2012' },
    { code: 'ELEC_PT_LB_2011', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.44, version: '2011' },
    { code: 'ELEC_EU_LB_2011', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.48, version: '2011' },
    { code: 'ELEC_UK_LB_2011', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.44, version: '2011' },
    { code: 'ELEC_PT_LB_2010', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.45, version: '2010' },
    { code: 'ELEC_EU_LB_2010', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.49, version: '2010' },
    { code: 'ELEC_UK_LB_2010', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.45, version: '2010' },

    // T&D 2015–2010
    { code: 'ELEC_TD_LOSS_PT_2015', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.041, version: '2015' },
    { code: 'ELEC_TD_LOSS_EU_2015', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.045, version: '2015' },
    { code: 'ELEC_TD_LOSS_UK_2015', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.039, version: '2015' },
    { code: 'ELEC_TD_LOSS_PT_2014', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.042, version: '2014' },
    { code: 'ELEC_TD_LOSS_EU_2014', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.046, version: '2014' },
    { code: 'ELEC_TD_LOSS_UK_2014', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.040, version: '2014' },
    { code: 'ELEC_TD_LOSS_PT_2013', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.043, version: '2013' },
    { code: 'ELEC_TD_LOSS_EU_2013', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.047, version: '2013' },
    { code: 'ELEC_TD_LOSS_UK_2013', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.041, version: '2013' },
    { code: 'ELEC_TD_LOSS_PT_2012', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.044, version: '2012' },
    { code: 'ELEC_TD_LOSS_EU_2012', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.048, version: '2012' },
    { code: 'ELEC_TD_LOSS_UK_2012', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.042, version: '2012' },
    { code: 'ELEC_TD_LOSS_PT_2011', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.045, version: '2011' },
    { code: 'ELEC_TD_LOSS_EU_2011', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.049, version: '2011' },
    { code: 'ELEC_TD_LOSS_UK_2011', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.043, version: '2011' },
    { code: 'ELEC_TD_LOSS_PT_2010', region: 'PT', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.046, version: '2010' },
    { code: 'ELEC_TD_LOSS_EU_2010', region: 'EU', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.050, version: '2010' },
    { code: 'ELEC_TD_LOSS_UK_2010', region: 'UK', scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.044, version: '2010' },

    // NG WTT/Comb EU e PT (além de UK já adicionado)
    { code: 'NATGAS_WTT_EU_KWH_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.052, version: '2024' },
    { code: 'NATGAS_COMB_EU_KWH_S1_2024', region: 'EU', scope: 'SCOPE1', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.151, version: '2024' },
    { code: 'NATGAS_WTT_PT_KWH_S3_2023', region: 'PT', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.051, version: '2023' },
    { code: 'NATGAS_COMB_PT_KWH_S1_2023', region: 'PT', scope: 'SCOPE1', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.153, version: '2023' },

    // Flights adicionais (premium/premium economy)
    { code: 'FLIGHT_SHORT_PREM_KM_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.16, version: '2024' },
    { code: 'FLIGHT_MEDIUM_PREM_KM_S3_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.13, version: '2024' },

    // Spend adicionais
    { code: 'SPEND_FOOD_EUR_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'EUR', co2ePerUnit: 0.0012, version: '2024' },
    { code: 'SPEND_PRO_SERVICES_EUR_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'EUR', co2ePerUnit: 0.0006, version: '2024' },
    { code: 'SPEND_LOGISTICS_EUR_2024', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'EUR', co2ePerUnit: 0.0009, version: '2024' },

    // Blends PT/UK/EU por ano 2020–2025 (exemplos)
    { code: 'DIESEL_B7_PT_S1_2025', region: 'PT', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.64, version: '2025' },
    { code: 'DIESEL_B10_PT_S1_2025', region: 'PT', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.59, version: '2025' },
    { code: 'GASOLINE_E5_PT_S1_2025', region: 'PT', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.29, version: '2025' },
    { code: 'GASOLINE_E10_PT_S1_2025', region: 'PT', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.24, version: '2025' },
    { code: 'DIESEL_B7_UK_S1_2025', region: 'UK', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.65, version: '2025' },
    { code: 'DIESEL_B10_UK_S1_2025', region: 'UK', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.60, version: '2025' },
    { code: 'GASOLINE_E5_UK_S1_2025', region: 'UK', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.28, version: '2025' },
    { code: 'GASOLINE_E10_UK_S1_2025', region: 'UK', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.23, version: '2025' },
    { code: 'DIESEL_B7_EU_S1_2025', region: 'EU', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.66, version: '2025' },
    { code: 'GASOLINE_E10_EU_S1_2025', region: 'EU', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.26, version: '2025' },

    { code: 'DIESEL_B7_PT_S1_2020', region: 'PT', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.67, version: '2020' },
    { code: 'GASOLINE_E10_PT_S1_2020', region: 'PT', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.27, version: '2020' },
    { code: 'DIESEL_B7_UK_S1_2020', region: 'UK', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.68, version: '2020' },
    { code: 'GASOLINE_E10_UK_S1_2020', region: 'UK', scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.28, version: '2020' },

    // NG WTT 2020–2025 + Comb (PT/EU/UK)
    { code: 'NATGAS_WTT_PT_KWH_S3_2025', region: 'PT', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.052, version: '2025' },
    { code: 'NATGAS_COMB_PT_KWH_S1_2025', region: 'PT', scope: 'SCOPE1', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.151, version: '2025' },
    { code: 'NATGAS_WTT_EU_KWH_S3_2025', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.053, version: '2025' },
    { code: 'NATGAS_COMB_EU_KWH_S1_2025', region: 'EU', scope: 'SCOPE1', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.150, version: '2025' },
    { code: 'NATGAS_WTT_UK_KWH_S3_2025', region: 'UK', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.049, version: '2025' },
    { code: 'NATGAS_COMB_UK_KWH_S1_2025', region: 'UK', scope: 'SCOPE1', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.149, version: '2025' },

    // Flights classes & RF (RF como multiplicador "mult")
    { code: 'FLIGHT_VSHORT_ECO_KM_S3_2025', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.18, version: '2025' },
    { code: 'FLIGHT_VSHORT_BUS_KM_S3_2025', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.26, version: '2025' },
    { code: 'FLIGHT_SHORT_PREM_KM_S3_2025', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.17, version: '2025' },
    { code: 'FLIGHT_MEDIUM_BUS_KM_S3_2025', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.14, version: '2025' },
    { code: 'FLIGHT_LONG_ECO_KM_S3_2025', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.09, version: '2025' },
    { code: 'FLIGHT_LONG_BUS_KM_S3_2025', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.12, version: '2025' },
    { code: 'FLIGHT_LONG_FIRST_KM_S3_2025', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.21, version: '2025' },
    { code: 'FLIGHT_RF_MULT_1_9_S3_2025', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'mult', co2ePerUnit: 1.9, version: '2025' },
    { code: 'FLIGHT_RF_MULT_2_0_S3_2025', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'mult', co2ePerUnit: 2.0, version: '2025' },

    // Resíduos por método e região (PT/UK/EU) — exemplos
    { code: 'WASTE_METAL_REC_PT_KG_S3_2024', region: 'PT', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 0.35, version: '2024' },
    { code: 'WASTE_METAL_INC_PT_KG_S3_2024', region: 'PT', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 0.80, version: '2024' },
    { code: 'WASTE_GLASS_REC_UK_KG_S3_2024', region: 'UK', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 0.10, version: '2024' },
    { code: 'WASTE_PLASTIC_LDF_UK_KG_S3_2024', region: 'UK', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 2.70, version: '2024' },
    { code: 'WASTE_PAPER_REC_PT_KG_S3_2025', region: 'PT', scope: 'SCOPE3', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 0.19, version: '2025' },

    // Spend: SaaS/Cloud, furniture by year, maintenance, cleaning
    { code: 'SPEND_SAAS_EUR_2025', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'EUR', co2ePerUnit: 0.0005, version: '2025' },
    { code: 'SPEND_CLOUD_EUR_2025', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'EUR', co2ePerUnit: 0.00055, version: '2025' },
    { code: 'SPEND_FURNITURE_EUR_2025', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'EUR', co2ePerUnit: 0.0010, version: '2025' },
    { code: 'SPEND_MAINTENANCE_EUR_2025', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'EUR', co2ePerUnit: 0.0007, version: '2025' },
    { code: 'SPEND_CLEANING_EUR_2025', region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'EUR', co2ePerUnit: 0.00065, version: '2025' },
  ];

  // Programmatic expansions to cover many recent variants
  const regions = ['PT','EU','UK'] as const;
  const years = [2020,2021,2022,2023,2024,2025] as const;

  // Blends 2020–2025 (Diesel B7, Gasoline E10)
  for (const y of years) {
    for (const r of regions) {
      factors.push({ code: `DIESEL_B7_${r}_S1_${y}`, region: r, scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.65 - (y-2020)*0.005, version: String(y)});
      factors.push({ code: `GASOLINE_E10_${r}_S1_${y}`, region: r, scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.28 - (y-2020)*0.005, version: String(y)});
    }
  }

  // Natural gas WTT/Comb 2020–2025 por região
  for (const y of years) {
    for (const r of regions) {
      factors.push({ code: `NATGAS_WTT_${r}_KWH_S3_${y}`, region: r, scope: 'SCOPE3', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.048 + (r==='EU'?0.004:(r==='PT'?0.002:0)), version: String(y)});
      factors.push({ code: `NATGAS_COMB_${r}_KWH_S1_${y}`, region: r, scope: 'SCOPE1', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.149 + (r==='EU'?0.002:(r==='PT'?0.003:0)), version: String(y)});
    }
  }

  // Flights classes/distâncias (valores exemplificativos por km)
  const dists = ['VSHORT','SHORT','MEDIUM','LONG'] as const;
  const classes = ['ECO','PREM','BUS','FIRST'] as const;
  const base: Record<typeof dists[number], number> = {VSHORT:0.18, SHORT:0.14, MEDIUM:0.11, LONG:0.09};
  const classAdj: Record<typeof classes[number], number> = {ECO:0, PREM:0.03, BUS:0.04, FIRST:0.11};
  for (const y of [2024,2025] as const) {
    for (const r of regions) {
      for (const d of dists) {
        for (const c of classes) {
          const per = base[d] + classAdj[c];
          factors.push({ code: `FLIGHT_${d}_${c}_KM_S3_${y}`, region: r, scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: per, version: String(y)});
        }
      }
      // RF multipliers
      factors.push({ code: `FLIGHT_RF_MULT_1_7_S3_${y}`, region: r, scope: 'SCOPE3', source: 'Demo dataset', unit: 'mult', co2ePerUnit: 1.7, version: String(y)});
      factors.push({ code: `FLIGHT_RF_MULT_2_0_S3_${y}`, region: r, scope: 'SCOPE3', source: 'Demo dataset', unit: 'mult', co2ePerUnit: 2.0, version: String(y)});
    }
  }

  // Resíduos por método e material (PT/UK/EU) para 2024
  const materials = ['METAL','PLASTIC','GLASS','PAPER'] as const;
  const methods = ['REC','INC','LDF'] as const;
  const wastePer: Record<string, number> = {REC: 0.25, INC: 0.9, LDF: 1.6};
  for (const r of regions) {
    for (const m of materials) {
      for (const meth of methods) {
        const key = `${m}_${meth}_${r}_KG_S3_2024`;
        factors.push({ code: `WASTE_${key}`, region: r, scope: 'SCOPE3', source: 'Demo dataset', unit: 'kg', co2ePerUnit: wastePer[meth], version: '2024'});
      }
    }
  }

  // Água e ETAR (m3) por região (2024)
  for (const r of regions) {
    factors.push({ code: `WATER_${r}_M3_S3_2024`, region: r, scope: 'SCOPE3', source: 'Demo dataset', unit: 'm3', co2ePerUnit: 0.34, version: '2024'});
    factors.push({ code: `WASTEWATER_${r}_M3_S3_2024`, region: r, scope: 'SCOPE3', source: 'Demo dataset', unit: 'm3', co2ePerUnit: 0.42, version: '2024'});
  }

  // Spend adicionais
  for (const y of [2024,2025] as const) {
    factors.push({ code: `SPEND_MARKETING_EUR_${y}`, region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'EUR', co2ePerUnit: 0.0008, version: String(y)});
    factors.push({ code: `SPEND_CLEANING_M2_${y}`, region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'm2', co2ePerUnit: 0.002, version: String(y)});
    factors.push({ code: `SPEND_MAINTENANCE_HOUR_${y}`, region: 'EU', scope: 'SCOPE3', source: 'Demo dataset', unit: 'hour', co2ePerUnit: 0.4, version: String(y)});
  }

  // Scope 2 adicionais: steam/heat/cooling adquiridos
  for (const r of regions) {
    for (const y of [2024,2025] as const) {
      factors.push({ code: `STEAM_${r}_MWh_S2_${y}`, region: r, scope: 'SCOPE2', source: 'Demo dataset', unit: 'MWh', co2ePerUnit: 200, version: String(y)});
      factors.push({ code: `HEAT_${r}_MWh_S2_${y}`, region: r, scope: 'SCOPE2', source: 'Demo dataset', unit: 'MWh', co2ePerUnit: 180, version: String(y)});
      factors.push({ code: `COOLING_${r}_kWh_S2_${y}`, region: r, scope: 'SCOPE2', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.15, version: String(y)});
    }
  }

  // Scope 1 categorias específicas
  for (const r of regions) {
    for (const y of [2024,2025] as const) {
      // Combustão estacionária genérica
      factors.push({ code: `S1_STATIONARY_${r}_kWh_${y}`, region: r, scope: 'SCOPE1', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.18, version: String(y)});
      // Combustão móvel — litro (diesel)
      factors.push({ code: `S1_MOBILE_DIESEL_${r}_L_${y}`, region: r, scope: 'SCOPE1', source: 'Demo dataset', unit: 'L', co2ePerUnit: 2.66, version: String(y)});
      // Processos industriais — proxy por kg de produto
      factors.push({ code: `S1_PROCESS_GENERIC_${r}_kg_${y}`, region: r, scope: 'SCOPE1', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 1.2, version: String(y)});
      // Emissões fugitivas — refrigerantes
      factors.push({ code: `S1_FUG_R134A_${r}_kg_${y}`, region: r, scope: 'SCOPE1', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 1430, version: String(y)});
      factors.push({ code: `S1_FUG_R410A_${r}_kg_${y}`, region: r, scope: 'SCOPE1', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 2088, version: String(y)});
    }
  }

  // Scope 3 – categorias 1..15 genéricas por região (2024)
  for (const r of regions) {
    factors.push({ code: `S3_CAT01_PG_${r}_EUR_2024`, region: r, scope: 'SCOPE3', source: 'Demo dataset', unit: 'EUR', co2ePerUnit: 0.0009, version: '2024'});
    factors.push({ code: `S3_CAT02_CG_${r}_EUR_2024`, region: r, scope: 'SCOPE3', source: 'Demo dataset', unit: 'EUR', co2ePerUnit: 0.0015, version: '2024'});
    factors.push({ code: `S3_CAT03_FE_${r}_kWh_2024`, region: r, scope: 'SCOPE3', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.05, version: '2024'});
    factors.push({ code: `S3_CAT04_UP_${r}_tkm_2024`, region: r, scope: 'SCOPE3', source: 'Demo dataset', unit: 'tkm', co2ePerUnit: 0.10, version: '2024'});
    factors.push({ code: `S3_CAT05_WASTE_${r}_kg_2024`, region: r, scope: 'SCOPE3', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 0.45, version: '2024'});
    factors.push({ code: `S3_CAT06_BT_${r}_km_2024`, region: r, scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.15, version: '2024'});
    factors.push({ code: `S3_CAT07_COMMUTE_${r}_km_2024`, region: r, scope: 'SCOPE3', source: 'Demo dataset', unit: 'km', co2ePerUnit: 0.12, version: '2024'});
    factors.push({ code: `S3_CAT08_LEASED_${r}_EUR_2024`, region: r, scope: 'SCOPE3', source: 'Demo dataset', unit: 'EUR', co2ePerUnit: 0.0007, version: '2024'});
    factors.push({ code: `S3_CAT09_DOWN_${r}_tkm_2024`, region: r, scope: 'SCOPE3', source: 'Demo dataset', unit: 'tkm', co2ePerUnit: 0.12, version: '2024'});
    factors.push({ code: `S3_CAT10_PROCESS_${r}_EUR_2024`, region: r, scope: 'SCOPE3', source: 'Demo dataset', unit: 'EUR', co2ePerUnit: 0.0013, version: '2024'});
    factors.push({ code: `S3_CAT11_USE_${r}_kWh_2024`, region: r, scope: 'SCOPE3', source: 'Demo dataset', unit: 'kWh', co2ePerUnit: 0.20, version: '2024'});
    factors.push({ code: `S3_CAT12_EOL_${r}_kg_2024`, region: r, scope: 'SCOPE3', source: 'Demo dataset', unit: 'kg', co2ePerUnit: 0.60, version: '2024'});
    factors.push({ code: `S3_CAT13_LEASED_${r}_EUR_2024`, region: r, scope: 'SCOPE3', source: 'Demo dataset', unit: 'EUR', co2ePerUnit: 0.0006, version: '2024'});
    factors.push({ code: `S3_CAT14_FRANCHISE_${r}_EUR_2024`, region: r, scope: 'SCOPE3', source: 'Demo dataset', unit: 'EUR', co2ePerUnit: 0.0010, version: '2024'});
    factors.push({ code: `S3_CAT15_INVEST_${r}_EUR_2024`, region: r, scope: 'SCOPE3', source: 'Demo dataset', unit: 'EUR', co2ePerUnit: 0.0025, version: '2024'});
  }

  for (const f of factors) {
    await prisma.emissionFactor.upsert({
      where: {code: f.code},
      update: {},
      create: f as any
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Seed completed');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
