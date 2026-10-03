/**
 * Canonical Metric Registry
 * Defines governed supply-chain metrics with immutable audit references and configurable formulas.
 */

export interface CanonicalMetric {
  metric_id: string;
  name: string;
  short_code: string;
  description: string;
  business_definition: string;
  formula: string;
  sql_expression: string;
  unit: '%' | 'days' | 'USD' | 'count' | 'ratio';
  dimensions: string[];
  owner: string;
  version: string;
  status: 'Approved' | 'Draft' | 'Deprecated';
  source_entities: string[];
  source_tables: string[];
  precision: number;
  tags: string[];
  // For configurable metrics (e.g. Landed Cost components)
  configurable_components?: {
    key: string;
    label: string;
    included: boolean;
    weight: number;
    description: string;
  }[];
}

export const CANONICAL_METRICS: Record<string, CanonicalMetric> = {
  OTD: {
    metric_id: 'METRIC_SC_001',
    short_code: 'OTD',
    name: 'On-Time Delivery',
    description: 'Percentage of eligible shipments delivered on or before the agreed customer or plant promised delivery date.',
    business_definition: 'Delivered on or before promised delivery date. Shipments without a valid promised date are excluded from the eligible population.',
    formula: 'on_time_shipments / eligible_shipments',
    sql_expression: 'ROUND(100.0 * SUM(CASE WHEN DATE(actual_delivery_date) <= DATE(promised_date) THEN 1 ELSE 0 END) / COUNT(*), 1)',
    unit: '%',
    dimensions: ['supplier_id', 'plant_id', 'carrier_id', 'region', 'time_period'],
    owner: 'Supply Chain Governance Council & Logistics COE',
    version: '1.0',
    status: 'Approved',
    source_entities: ['Shipment', 'Supplier', 'Plant', 'Carrier'],
    source_tables: ['shipments', 'suppliers', 'plants'],
    precision: 1,
    tags: ['Core SLA', 'Logistics', 'Procurement', 'Planning']
  },
  FILL_RATE: {
    metric_id: 'METRIC_SC_002',
    short_code: 'Fill Rate',
    name: 'Order Fill Rate',
    description: 'The proportion of customer order demand fulfilled completely upon delivery versus ordered quantity.',
    business_definition: 'Total parts quantity delivered divided by total parts quantity ordered across matching consignment orders.',
    formula: 'quantity_delivered / quantity_ordered',
    sql_expression: 'ROUND(100.0 * SUM(quantity_delivered) / SUM(quantity_ordered), 1)',
    unit: '%',
    dimensions: ['supplier_id', 'plant_id', 'part_id', 'time_period'],
    owner: 'Supply Chain Operations & Order Fulfillment',
    version: '1.0',
    status: 'Approved',
    source_entities: ['Shipment', 'Order', 'Part', 'Supplier'],
    source_tables: ['shipments', 'orders'],
    precision: 1,
    tags: ['Order Fulfillment', 'Supplier Quality', 'Procurement']
  },
  DAYS_OF_INVENTORY: {
    metric_id: 'METRIC_SC_003',
    short_code: 'Days Inventory',
    name: 'Days of Inventory (DOI)',
    description: 'Number of operating days the current on-hand inventory will sustain manufacturing demand based on average daily burn rate.',
    business_definition: 'Current aggregate on-hand inventory quantity divided by the 90-day trailing average daily demand consumption.',
    formula: 'current_inventory / average_daily_demand',
    sql_expression: 'ROUND(CAST(SUM(i.inventory_quantity) AS FLOAT) / MAX(1.0, (SELECT SUM(o.quantity) / 90.0 FROM orders o)), 1)',
    unit: 'days',
    dimensions: ['plant_id', 'part_id', 'category'],
    owner: 'Integrated Business Planning (IBP)',
    version: '1.0',
    status: 'Approved',
    source_entities: ['Inventory', 'Plant', 'Part', 'Order'],
    source_tables: ['inventory', 'orders', 'plants'],
    precision: 1,
    tags: ['Working Capital', 'Planning', 'Buffer Stock']
  },
  LANDED_COST: {
    metric_id: 'METRIC_SC_004',
    short_code: 'Landed Cost',
    name: 'Total Landed Cost',
    description: 'Total comprehensive cost incurred to acquire, transport, duty, insure, and stage material into the receiving plant.',
    business_definition: 'Sum of unit purchase cost plus freight carriage, customs tariffs/duties, insurance margin, and dock handling charges.',
    formula: 'purchase_cost + freight_cost + duty_cost + insurance_cost + handling_cost',
    sql_expression: 'SUM((s.quantity_delivered * p.unit_cost) + s.freight_cost + s.duty_cost + (0.015 * s.quantity_delivered * p.unit_cost) + s.handling_cost)',
    unit: 'USD',
    dimensions: ['supplier_id', 'part_id', 'plant_id', 'carrier_id'],
    owner: 'Strategic Procurement & Corporate Finance',
    version: '1.2',
    status: 'Approved',
    source_entities: ['Part', 'Shipment', 'Supplier', 'Plant'],
    source_tables: ['shipments', 'parts', 'suppliers'],
    precision: 2,
    tags: ['Financial', 'Procurement', 'Cost Accounting'],
    configurable_components: [
      { key: 'purchase_cost', label: 'Purchase Cost (Part Unit Cost × Quantity)', included: true, weight: 1.0, description: 'Base PO invoice cost' },
      { key: 'freight_cost', label: 'Freight Carriage Cost', included: true, weight: 1.0, description: 'Carrier transportation invoice' },
      { key: 'duty_cost', label: 'Customs & Import Duties', included: true, weight: 1.0, description: 'Cross-border statutory customs' },
      { key: 'insurance_cost', label: 'Cargo In-Transit Insurance (1.5%)', included: true, weight: 1.0, description: 'Transit loss and damage risk indemnity' },
      { key: 'handling_cost', label: 'Terminal & Warehouse Handling', included: true, weight: 1.0, description: 'Dock staging, palletization, and demurrage fees' }
    ]
  },
  LATE_SHIPMENTS: {
    metric_id: 'METRIC_SC_005',
    short_code: 'Late Shipments',
    name: 'Late Shipments Count',
    description: 'Absolute volume of shipments delivered past the confirmed promised date.',
    business_definition: 'Count of shipments where actual_delivery_date > promised_date.',
    formula: 'COUNT(CASE WHEN actual_delivery_date > promised_date THEN 1 END)',
    sql_expression: 'SUM(CASE WHEN DATE(actual_delivery_date) > DATE(promised_date) THEN 1 ELSE 0 END)',
    unit: 'count',
    dimensions: ['supplier_id', 'plant_id', 'carrier_id'],
    owner: 'Logistics Operations',
    version: '1.0',
    status: 'Approved',
    source_entities: ['Shipment', 'Carrier', 'Supplier'],
    source_tables: ['shipments'],
    precision: 0,
    tags: ['Logistics', 'Exception Management']
  },
  AT_RISK_SUPPLIERS: {
    metric_id: 'METRIC_SC_006',
    short_code: 'At-Risk Suppliers',
    name: 'At-Risk Supplier Count',
    description: 'Number of active suppliers flagged with High Risk or OTD performance below the critical SLA threshold of 90%.',
    business_definition: 'Suppliers with assessed risk_level = High OR trailing OTD < 90%.',
    formula: 'COUNT(DISTINCT supplier_id WHERE risk_level = High OR OTD < 90%)',
    sql_expression: 'COUNT(DISTINCT s.supplier_id)',
    unit: 'count',
    dimensions: ['region', 'supplier_tier'],
    owner: 'Supplier Risk & Governance',
    version: '1.0',
    status: 'Approved',
    source_entities: ['Supplier', 'Shipment'],
    source_tables: ['suppliers', 'shipments'],
    precision: 0,
    tags: ['Risk', 'Procurement']
  }
};

export function getMetricByIdOrShortCode(query: string): CanonicalMetric | undefined {
  const normalized = query.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '');
  for (const key of Object.keys(CANONICAL_METRICS)) {
    const metric = CANONICAL_METRICS[key];
    if (
      metric.metric_id.toUpperCase() === normalized ||
      metric.short_code.toUpperCase().replace(/[^A-Z0-9_]/g, '') === normalized ||
      metric.name.toUpperCase().replace(/[^A-Z0-9_]/g, '') === normalized
    ) {
      return metric;
    }
  }
  return undefined;
}
