/**
 * SupplyGraph AI - Core Business Entities & Ontology Definitions
 */

export interface Supplier {
  supplier_id: string;
  supplier_name: string;
  region: string;
  supplier_tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  risk_level: 'Low' | 'Medium' | 'High';
}

export interface Part {
  part_id: string;
  part_name: string;
  category: string;
  unit_cost: number;
}

export interface Plant {
  plant_id: string;
  plant_name: string;
  location: string;
  capacity: number; // units/day
}

export interface Customer {
  customer_id: string;
  customer_name: string;
  region: string;
}

export interface Order {
  order_id: string;
  customer_id: string;
  part_id: string;
  quantity: number;
  order_date: string;
  requested_date: string;
}

export interface Shipment {
  shipment_id: string;
  order_id: string;
  supplier_id: string;
  plant_id: string;
  carrier_id: string;
  promised_date: string;
  ship_date: string;
  actual_delivery_date: string;
  quantity_ordered: number;
  quantity_delivered: number;
  freight_cost: number;
  duty_cost: number;
  handling_cost: number;
  // Derived/semantic fields
  is_on_time?: boolean;
}

export interface Inventory {
  inventory_id: string;
  plant_id: string;
  part_id: string;
  inventory_quantity: number;
  inventory_value: number;
  snapshot_date: string;
}

export interface Carrier {
  carrier_id: string;
  carrier_name: string;
  transport_mode: 'Air' | 'Ocean' | 'Rail' | 'Road';
}

export interface IoTEvent {
  event_id: string;
  plant_id: string;
  shipment_id: string;
  event_type: 'Temperature Spike' | 'Shock/Drop' | 'Route Deviation' | 'Port Congestion' | 'Customs Hold' | 'Normal Transit';
  event_timestamp: string;
  severity: 'Info' | 'Warning' | 'Critical';
}

export type EntityType = 
  | 'Supplier'
  | 'Part'
  | 'Plant'
  | 'Customer'
  | 'Order'
  | 'Shipment'
  | 'Inventory'
  | 'Carrier'
  | 'IoTEvent';

export interface OntologyRelationship {
  id: string;
  fromEntity: EntityType;
  relationshipName: string;
  toEntity: EntityType;
  cardinality: '1:1' | '1:N' | 'N:1' | 'N:M';
  description: string;
  foreignKey: string;
  primaryKey: string;
}

export interface OntologyNodeMetadata {
  entityType: EntityType;
  displayName: string;
  tableName: string;
  primaryKey: string;
  attributes: {
    name: string;
    dataType: string;
    description: string;
    semanticRole?: 'dimension' | 'measure' | 'timestamp' | 'identifier';
  }[];
  description: string;
  businessDomain: 'Procurement' | 'Logistics' | 'Manufacturing/Planning' | 'Customer Fulfillment';
}
