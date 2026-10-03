import { OntologyNodeMetadata, OntologyRelationship } from './types';

export const ONTOLOGY_NODES: Record<string, OntologyNodeMetadata> = {
  Supplier: {
    entityType: 'Supplier',
    displayName: 'Supplier',
    tableName: 'suppliers',
    primaryKey: 'supplier_id',
    businessDomain: 'Procurement',
    description: 'External vendor or manufacturer that supplies parts and components into the production network.',
    attributes: [
      { name: 'supplier_id', dataType: 'VARCHAR(20)', description: 'Unique identifier for the supplier (e.g. S001)', semanticRole: 'identifier' },
      { name: 'supplier_name', dataType: 'VARCHAR(100)', description: 'Legal trading name of the supplier', semanticRole: 'dimension' },
      { name: 'region', dataType: 'VARCHAR(50)', description: 'Geographic location / territory (APAC, EMEA, Americas)', semanticRole: 'dimension' },
      { name: 'supplier_tier', dataType: 'VARCHAR(20)', description: 'Classification tier: Tier 1, Tier 2, Tier 3', semanticRole: 'dimension' },
      { name: 'risk_level', dataType: 'VARCHAR(20)', description: 'Assessed operational/financial risk level (Low, Medium, High)', semanticRole: 'dimension' }
    ]
  },
  Part: {
    entityType: 'Part',
    displayName: 'Part / Component',
    tableName: 'parts',
    primaryKey: 'part_id',
    businessDomain: 'Manufacturing/Planning',
    description: 'Component, sub-assembly, or raw material used in finished production or inventory stock.',
    attributes: [
      { name: 'part_id', dataType: 'VARCHAR(20)', description: 'Unique item master SKU (e.g. P100)', semanticRole: 'identifier' },
      { name: 'part_name', dataType: 'VARCHAR(100)', description: 'Descriptive title of the component', semanticRole: 'dimension' },
      { name: 'category', dataType: 'VARCHAR(50)', description: 'Commodity group (Electronics, Mechanical, Chemical, Fasteners)', semanticRole: 'dimension' },
      { name: 'unit_cost', dataType: 'NUMERIC(10,2)', description: 'Standard base unit cost in USD', semanticRole: 'measure' }
    ]
  },
  Plant: {
    entityType: 'Plant',
    displayName: 'Manufacturing Plant',
    tableName: 'plants',
    primaryKey: 'plant_id',
    businessDomain: 'Manufacturing/Planning',
    description: 'Manufacturing facility, warehouse, or assembly center within the operating network.',
    attributes: [
      { name: 'plant_id', dataType: 'VARCHAR(20)', description: 'Plant facility code (e.g. PL01)', semanticRole: 'identifier' },
      { name: 'plant_name', dataType: 'VARCHAR(100)', description: 'Facility title / location identity', semanticRole: 'dimension' },
      { name: 'location', dataType: 'VARCHAR(100)', description: 'Geographic location (City, State, Country)', semanticRole: 'dimension' },
      { name: 'capacity', dataType: 'INTEGER', description: 'Maximum daily processing capacity in units', semanticRole: 'measure' }
    ]
  },
  Customer: {
    entityType: 'Customer',
    displayName: 'Customer',
    tableName: 'customers',
    primaryKey: 'customer_id',
    businessDomain: 'Customer Fulfillment',
    description: 'End customer, OEM client, or distributor purchasing finished assemblies.',
    attributes: [
      { name: 'customer_id', dataType: 'VARCHAR(20)', description: 'Customer master identification code', semanticRole: 'identifier' },
      { name: 'customer_name', dataType: 'VARCHAR(100)', description: 'Company or enterprise client name', semanticRole: 'dimension' },
      { name: 'region', dataType: 'VARCHAR(50)', description: 'Customer market region', semanticRole: 'dimension' }
    ]
  },
  Order: {
    entityType: 'Order',
    displayName: 'Customer Order',
    tableName: 'orders',
    primaryKey: 'order_id',
    businessDomain: 'Customer Fulfillment',
    description: 'Commercial sales order or production requisition for specific parts and requested deadlines.',
    attributes: [
      { name: 'order_id', dataType: 'VARCHAR(20)', description: 'Unique order identifier', semanticRole: 'identifier' },
      { name: 'customer_id', dataType: 'VARCHAR(20)', description: 'Reference to ordering customer', semanticRole: 'identifier' },
      { name: 'part_id', dataType: 'VARCHAR(20)', description: 'Target part requested', semanticRole: 'identifier' },
      { name: 'quantity', dataType: 'INTEGER', description: 'Total units demanded in purchase order', semanticRole: 'measure' },
      { name: 'order_date', dataType: 'DATE', description: 'Date the order was committed', semanticRole: 'timestamp' },
      { name: 'requested_date', dataType: 'DATE', description: 'Customer requested dock delivery date', semanticRole: 'timestamp' }
    ]
  },
  Shipment: {
    entityType: 'Shipment',
    displayName: 'Shipment Consignment',
    tableName: 'shipments',
    primaryKey: 'shipment_id',
    businessDomain: 'Logistics',
    description: 'Physical transport consignment moving parts from supplier to plant or distribution hub.',
    attributes: [
      { name: 'shipment_id', dataType: 'VARCHAR(20)', description: 'Consignment / Bill of Lading ID', semanticRole: 'identifier' },
      { name: 'order_id', dataType: 'VARCHAR(20)', description: 'Associated customer/purchase order', semanticRole: 'identifier' },
      { name: 'supplier_id', dataType: 'VARCHAR(20)', description: 'Dispatching vendor ID', semanticRole: 'identifier' },
      { name: 'plant_id', dataType: 'VARCHAR(20)', description: 'Receiving manufacturing plant ID', semanticRole: 'identifier' },
      { name: 'carrier_id', dataType: 'VARCHAR(20)', description: 'Freight logistics service provider', semanticRole: 'identifier' },
      { name: 'promised_date', dataType: 'DATE', description: 'Agreed target delivery date (SLA committed)', semanticRole: 'timestamp' },
      { name: 'ship_date', dataType: 'DATE', description: 'Physical dispatch date from supplier dock', semanticRole: 'timestamp' },
      { name: 'actual_delivery_date', dataType: 'DATE', description: 'Date goods arrived and received at plant', semanticRole: 'timestamp' },
      { name: 'quantity_ordered', dataType: 'INTEGER', description: 'Target delivery quantity', semanticRole: 'measure' },
      { name: 'quantity_delivered', dataType: 'INTEGER', description: 'Actual quantity received undamaged', semanticRole: 'measure' },
      { name: 'freight_cost', dataType: 'NUMERIC(10,2)', description: 'Incurred freight carrier invoice cost', semanticRole: 'measure' },
      { name: 'duty_cost', dataType: 'NUMERIC(10,2)', description: 'Customs, tariffs, and cross-border duties', semanticRole: 'measure' },
      { name: 'handling_cost', dataType: 'NUMERIC(10,2)', description: 'Port terminal and warehouse handling fees', semanticRole: 'measure' }
    ]
  },
  Inventory: {
    entityType: 'Inventory',
    displayName: 'Inventory Snapshot',
    tableName: 'inventory',
    primaryKey: 'inventory_id',
    businessDomain: 'Manufacturing/Planning',
    description: 'Daily stock snapshot representing quantity and monetary valuation at each plant.',
    attributes: [
      { name: 'inventory_id', dataType: 'VARCHAR(20)', description: 'Snapshot unique identifier', semanticRole: 'identifier' },
      { name: 'plant_id', dataType: 'VARCHAR(20)', description: 'Holding plant facility', semanticRole: 'identifier' },
      { name: 'part_id', dataType: 'VARCHAR(20)', description: 'Stocked part SKU', semanticRole: 'identifier' },
      { name: 'inventory_quantity', dataType: 'INTEGER', description: 'On-hand physical stock quantity', semanticRole: 'measure' },
      { name: 'inventory_value', dataType: 'NUMERIC(12,2)', description: 'Total capitalized value of on-hand inventory', semanticRole: 'measure' },
      { name: 'snapshot_date', dataType: 'DATE', description: 'Date of inventory cycle count or snapshot', semanticRole: 'timestamp' }
    ]
  },
  Carrier: {
    entityType: 'Carrier',
    displayName: 'Logistics Carrier',
    tableName: 'carriers',
    primaryKey: 'carrier_id',
    businessDomain: 'Logistics',
    description: 'Third-party logistics, freight forwarder, or intermodal shipping provider.',
    attributes: [
      { name: 'carrier_id', dataType: 'VARCHAR(20)', description: 'Carrier code (e.g. CAR01)', semanticRole: 'identifier' },
      { name: 'carrier_name', dataType: 'VARCHAR(100)', description: 'Freight forwarder company name', semanticRole: 'dimension' },
      { name: 'transport_mode', dataType: 'VARCHAR(20)', description: 'Modal routing: Air, Ocean, Rail, Road', semanticRole: 'dimension' }
    ]
  },
  IoTEvent: {
    entityType: 'IoTEvent',
    displayName: 'IoT Telemetry Event',
    tableName: 'iot_events',
    primaryKey: 'event_id',
    businessDomain: 'Logistics',
    description: 'Sensor reading or transit disruption alert streamed from connected shipment trackers.',
    attributes: [
      { name: 'event_id', dataType: 'VARCHAR(20)', description: 'Event uuid / reading sequence', semanticRole: 'identifier' },
      { name: 'plant_id', dataType: 'VARCHAR(20)', description: 'Destination plant impacted', semanticRole: 'identifier' },
      { name: 'shipment_id', dataType: 'VARCHAR(20)', description: 'Monitored shipment tracker ID', semanticRole: 'identifier' },
      { name: 'event_type', dataType: 'VARCHAR(50)', description: 'Triggered alert type (Temperature, Shock, Route Deviation, Port Congestion)', semanticRole: 'dimension' },
      { name: 'event_timestamp', dataType: 'TIMESTAMP', description: 'Timestamp recorded by edge telematics device', semanticRole: 'timestamp' },
      { name: 'severity', dataType: 'VARCHAR(20)', description: 'Risk tier: Info, Warning, Critical', semanticRole: 'dimension' }
    ]
  }
};

export const ONTOLOGY_RELATIONSHIPS: OntologyRelationship[] = [
  {
    id: 'rel_supplier_part',
    fromEntity: 'Supplier',
    relationshipName: 'supplies',
    toEntity: 'Part',
    cardinality: 'N:M',
    description: 'Supplier supplies catalog of manufactured parts and raw materials.',
    foreignKey: 'supplier_parts.part_id',
    primaryKey: 'suppliers.supplier_id'
  },
  {
    id: 'rel_part_plant',
    fromEntity: 'Part',
    relationshipName: 'supplied_to / used_at',
    toEntity: 'Plant',
    cardinality: 'N:M',
    description: 'Part is supplied to and utilized in manufacturing operations at Plant.',
    foreignKey: 'inventory.plant_id',
    primaryKey: 'parts.part_id'
  },
  {
    id: 'rel_customer_order',
    fromEntity: 'Customer',
    relationshipName: 'places',
    toEntity: 'Order',
    cardinality: '1:N',
    description: 'Customer places purchase orders into the supply chain.',
    foreignKey: 'orders.customer_id',
    primaryKey: 'customers.customer_id'
  },
  {
    id: 'rel_order_part',
    fromEntity: 'Order',
    relationshipName: 'contains',
    toEntity: 'Part',
    cardinality: 'N:1',
    description: 'Order specifies requirements for particular part SKU.',
    foreignKey: 'orders.part_id',
    primaryKey: 'parts.part_id'
  },
  {
    id: 'rel_order_shipment',
    fromEntity: 'Order',
    relationshipName: 'fulfilled_by',
    toEntity: 'Shipment',
    cardinality: '1:N',
    description: 'Order demand is fulfilled through one or more delivery shipments.',
    foreignKey: 'shipments.order_id',
    primaryKey: 'orders.order_id'
  },
  {
    id: 'rel_shipment_supplier',
    fromEntity: 'Shipment',
    relationshipName: 'originates_from',
    toEntity: 'Supplier',
    cardinality: 'N:1',
    description: 'Shipment physical freight originates from Supplier dock.',
    foreignKey: 'shipments.supplier_id',
    primaryKey: 'suppliers.supplier_id'
  },
  {
    id: 'rel_shipment_plant',
    fromEntity: 'Shipment',
    relationshipName: 'delivered_to',
    toEntity: 'Plant',
    cardinality: 'N:1',
    description: 'Shipment is consigned and received at designated manufacturing Plant.',
    foreignKey: 'shipments.plant_id',
    primaryKey: 'plants.plant_id'
  },
  {
    id: 'rel_shipment_carrier',
    fromEntity: 'Shipment',
    relationshipName: 'transported_by',
    toEntity: 'Carrier',
    cardinality: 'N:1',
    description: 'Shipment is hauled and tracked by logistics Carrier.',
    foreignKey: 'shipments.carrier_id',
    primaryKey: 'carriers.carrier_id'
  },
  {
    id: 'rel_plant_inventory',
    fromEntity: 'Plant',
    relationshipName: 'holds',
    toEntity: 'Inventory',
    cardinality: '1:N',
    description: 'Plant holds physical warehouse inventory of parts.',
    foreignKey: 'inventory.plant_id',
    primaryKey: 'plants.plant_id'
  },
  {
    id: 'rel_shipment_iotevent',
    fromEntity: 'Shipment',
    relationshipName: 'generates',
    toEntity: 'IoTEvent',
    cardinality: '1:N',
    description: 'In-transit telemetry sensors on Shipment generate real-time IoT events.',
    foreignKey: 'iot_events.shipment_id',
    primaryKey: 'shipments.shipment_id'
  }
];
