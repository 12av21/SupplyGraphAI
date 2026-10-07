/**
 * Semantic Layer Definitions & Business-Friendly Concepts
 * Shields conversational layer and end-users from raw database schema details.
 */

export interface SemanticField {
  semanticName: string;
  businessTitle: string;
  entity: string;
  underlyingColumn: string;
  description: string;
  dataType: string;
}

export interface SemanticView {
  viewName: string;
  businessTitle: string;
  description: string;
  targetEntities: string[];
  canonicalMetricsSupported: string[];
  fields: SemanticField[];
  sqlDefinition: string;
}

export const SEMANTIC_FIELDS: SemanticField[] = [
  {
    semanticName: 'shipment.delivery_status',
    businessTitle: 'Delivery Status',
    entity: 'Shipment',
    underlyingColumn: "CASE WHEN DATE(actual_delivery_date) <= DATE(promised_date) THEN 'On-Time' ELSE 'Delayed' END",
    description: 'Governed delivery evaluation indicating whether consignment satisfied promised SLA deadline.',
    dataType: 'STRING'
  },
  {
    semanticName: 'shipment.delay_days',
    businessTitle: 'Transit Delay in Days',
    entity: 'Shipment',
    underlyingColumn: "MAX(0, CAST((JULIANDAY(actual_delivery_date) - JULIANDAY(promised_date)) AS INTEGER))",
    description: 'Variance in days past committed delivery date.',
    dataType: 'INTEGER'
  },
  {
    semanticName: 'metric.on_time_delivery',
    businessTitle: 'On-Time Delivery Rate (OTD)',
    entity: 'Shipment',
    underlyingColumn: "ROUND(100.0 * SUM(CASE WHEN DATE(actual_delivery_date) <= DATE(promised_date) THEN 1 ELSE 0 END) / COUNT(*), 1)",
    description: 'Canonical SLA percentage of orders fulfilled on or before target date.',
    dataType: 'PERCENT'
  },
  {
    semanticName: 'metric.fill_rate',
    businessTitle: 'Quantity Fill Rate',
    entity: 'Shipment',
    underlyingColumn: "ROUND(100.0 * SUM(quantity_delivered) / SUM(quantity_ordered), 1)",
    description: 'Canonical order volume completeness ratio.',
    dataType: 'PERCENT'
  },
  {
    semanticName: 'metric.total_landed_cost',
    businessTitle: 'Consolidated Landed Cost',
    entity: 'Shipment',
    underlyingColumn: "SUM((quantity_delivered * unit_cost) + freight_cost + duty_cost + (0.015 * quantity_delivered * unit_cost) + handling_cost)",
    description: 'Canonical total acquisition cost across acquisition, transport, customs, and logistics.',
    dataType: 'CURRENCY'
  },
  {
    semanticName: 'inventory.stock_cover_days',
    businessTitle: 'Days of Inventory Coverage',
    entity: 'Inventory',
    underlyingColumn: "ROUND(CAST(SUM(i.inventory_quantity) AS FLOAT) / MAX(1.0, (SELECT SUM(o.quantity) / 90.0 FROM orders o)), 1)",
    description: 'Canonical inventory runway calculated against daily burn rate.',
    dataType: 'DAYS'
  }
];

export const SEMANTIC_VIEWS: SemanticView[] = [
  {
    viewName: 'v_governed_supplier_performance',
    businessTitle: 'Governed Supplier Performance View',
    description: 'Standardized operational metrics aggregated by supplier across plants and freight carriers.',
    targetEntities: ['Supplier', 'Shipment', 'Plant'],
    canonicalMetricsSupported: ['OTD', 'FILL_RATE', 'LANDED_COST', 'LATE_SHIPMENTS'],
    fields: [
      { semanticName: 'supplier.code', businessTitle: 'Supplier ID', entity: 'Supplier', underlyingColumn: 's.supplier_id', description: 'Supplier primary key', dataType: 'STRING' },
      { semanticName: 'supplier.name', businessTitle: 'Supplier Name', entity: 'Supplier', underlyingColumn: 's.supplier_name', description: 'Supplier company name', dataType: 'STRING' },
      { semanticName: 'supplier.region', businessTitle: 'Operating Region', entity: 'Supplier', underlyingColumn: 's.region', description: 'Origin region', dataType: 'STRING' },
      { semanticName: 'supplier.risk_tier', businessTitle: 'Risk Level', entity: 'Supplier', underlyingColumn: 's.risk_level', description: 'Risk categorization', dataType: 'STRING' },
      { semanticName: 'plant.code', businessTitle: 'Destination Plant', entity: 'Plant', underlyingColumn: 'sh.plant_id', description: 'Plant recipient code', dataType: 'STRING' }
    ],
    sqlDefinition: `
      CREATE VIEW IF NOT EXISTS v_governed_supplier_performance AS
      SELECT 
        s.supplier_id,
        s.supplier_name,
        s.region,
        s.supplier_tier,
        s.risk_level,
        sh.plant_id,
        COUNT(sh.shipment_id) as total_shipments,
        SUM(CASE WHEN DATE(sh.actual_delivery_date) <= DATE(sh.promised_date) THEN 1 ELSE 0 END) as on_time_shipments,
        SUM(CASE WHEN DATE(sh.actual_delivery_date) > DATE(sh.promised_date) THEN 1 ELSE 0 END) as late_shipments,
        ROUND(100.0 * SUM(CASE WHEN DATE(sh.actual_delivery_date) <= DATE(sh.promised_date) THEN 1 ELSE 0 END) / COUNT(sh.shipment_id), 1) as otd_percentage,
        ROUND(100.0 * SUM(sh.quantity_delivered) / SUM(sh.quantity_ordered), 1) as fill_rate_percentage,
        SUM(sh.freight_cost + sh.duty_cost + sh.handling_cost) as total_logistics_cost
      FROM suppliers s
      JOIN shipments sh ON s.supplier_id = sh.supplier_id
      GROUP BY s.supplier_id, s.supplier_name, s.region, s.supplier_tier, s.risk_level, sh.plant_id;
    `
  },
  {
    viewName: 'v_governed_carrier_reliability',
    businessTitle: 'Carrier Transit & Logistics Reliability View',
    description: 'On-time delivery and delayed consignments benchmarked across intermodal carriers.',
    targetEntities: ['Carrier', 'Shipment'],
    canonicalMetricsSupported: ['OTD', 'LATE_SHIPMENTS'],
    fields: [
      { semanticName: 'carrier.id', businessTitle: 'Carrier ID', entity: 'Carrier', underlyingColumn: 'c.carrier_id', description: 'Carrier code', dataType: 'STRING' },
      { semanticName: 'carrier.name', businessTitle: 'Carrier Name', entity: 'Carrier', underlyingColumn: 'c.carrier_name', description: 'Carrier corporate name', dataType: 'STRING' },
      { semanticName: 'carrier.transport_mode', businessTitle: 'Transport Mode', entity: 'Carrier', underlyingColumn: 'c.transport_mode', description: 'Logistics mode', dataType: 'STRING' }
    ],
    sqlDefinition: `
      CREATE VIEW IF NOT EXISTS v_governed_carrier_reliability AS
      SELECT 
        c.carrier_id,
        c.carrier_name,
        c.transport_mode,
        COUNT(sh.shipment_id) as total_shipments,
        SUM(CASE WHEN DATE(sh.actual_delivery_date) <= DATE(sh.promised_date) THEN 1 ELSE 0 END) as on_time_count,
        SUM(CASE WHEN DATE(sh.actual_delivery_date) > DATE(sh.promised_date) THEN 1 ELSE 0 END) as late_count,
        ROUND(100.0 * SUM(CASE WHEN DATE(sh.actual_delivery_date) <= DATE(sh.promised_date) THEN 1 ELSE 0 END) / COUNT(sh.shipment_id), 1) as carrier_otd,
        ROUND(100.0 * SUM(CASE WHEN DATE(sh.actual_delivery_date) > DATE(sh.promised_date) THEN 1 ELSE 0 END) / COUNT(sh.shipment_id), 1) as carrier_delay_rate
      FROM carriers c
      JOIN shipments sh ON c.carrier_id = sh.carrier_id
      GROUP BY c.carrier_id, c.carrier_name, c.transport_mode;
    `
  }
];
