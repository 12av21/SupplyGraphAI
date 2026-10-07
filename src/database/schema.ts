/**
 * SupplyGraph AI Database DDL Schema (SQLite / SQL)
 */

export const SCHEMA_DDL = `
CREATE TABLE IF NOT EXISTS suppliers (
  supplier_id VARCHAR(20) PRIMARY KEY,
  supplier_name VARCHAR(100) NOT NULL,
  region VARCHAR(50) NOT NULL,
  supplier_tier VARCHAR(20) NOT NULL,
  risk_level VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS parts (
  part_id VARCHAR(20) PRIMARY KEY,
  part_name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  unit_cost NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS plants (
  plant_id VARCHAR(20) PRIMARY KEY,
  plant_name VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  capacity INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS customers (
  customer_id VARCHAR(20) PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  region VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS carriers (
  carrier_id VARCHAR(20) PRIMARY KEY,
  carrier_name VARCHAR(100) NOT NULL,
  transport_mode VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  order_id VARCHAR(20) PRIMARY KEY,
  customer_id VARCHAR(20) NOT NULL,
  part_id VARCHAR(20) NOT NULL,
  quantity INTEGER NOT NULL,
  order_date DATE NOT NULL,
  requested_date DATE NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  FOREIGN KEY (part_id) REFERENCES parts(part_id)
);

CREATE TABLE IF NOT EXISTS shipments (
  shipment_id VARCHAR(20) PRIMARY KEY,
  order_id VARCHAR(20) NOT NULL,
  supplier_id VARCHAR(20) NOT NULL,
  plant_id VARCHAR(20) NOT NULL,
  carrier_id VARCHAR(20) NOT NULL,
  promised_date DATE NOT NULL,
  ship_date DATE NOT NULL,
  actual_delivery_date DATE NOT NULL,
  quantity_ordered INTEGER NOT NULL,
  quantity_delivered INTEGER NOT NULL,
  freight_cost NUMERIC(10,2) NOT NULL,
  duty_cost NUMERIC(10,2) NOT NULL,
  handling_cost NUMERIC(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
  FOREIGN KEY (plant_id) REFERENCES plants(plant_id),
  FOREIGN KEY (carrier_id) REFERENCES carriers(carrier_id)
);

CREATE TABLE IF NOT EXISTS inventory (
  inventory_id VARCHAR(20) PRIMARY KEY,
  plant_id VARCHAR(20) NOT NULL,
  part_id VARCHAR(20) NOT NULL,
  inventory_quantity INTEGER NOT NULL,
  inventory_value NUMERIC(12,2) NOT NULL,
  snapshot_date DATE NOT NULL,
  FOREIGN KEY (plant_id) REFERENCES plants(plant_id),
  FOREIGN KEY (part_id) REFERENCES parts(part_id)
);

CREATE TABLE IF NOT EXISTS iot_events (
  event_id VARCHAR(20) PRIMARY KEY,
  plant_id VARCHAR(20) NOT NULL,
  shipment_id VARCHAR(20) NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  event_timestamp TIMESTAMP NOT NULL,
  severity VARCHAR(20) NOT NULL,
  FOREIGN KEY (plant_id) REFERENCES plants(plant_id),
  FOREIGN KEY (shipment_id) REFERENCES shipments(shipment_id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  audit_id VARCHAR(36) PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  persona VARCHAR(30) NOT NULL,
  question TEXT NOT NULL,
  metric VARCHAR(50) NOT NULL,
  semantic_query TEXT NOT NULL,
  generated_sql TEXT NOT NULL,
  result TEXT NOT NULL,
  execution_time_ms NUMERIC(8,2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  validation_trace TEXT NOT NULL
);

-- Governed Indexes for fast analytical performance
CREATE INDEX IF NOT EXISTS idx_shipments_supplier_plant ON shipments(supplier_id, plant_id);
CREATE INDEX IF NOT EXISTS idx_shipments_dates ON shipments(actual_delivery_date, promised_date);
CREATE INDEX IF NOT EXISTS idx_shipments_carrier ON shipments(carrier_id);
CREATE INDEX IF NOT EXISTS idx_inventory_plant ON inventory(plant_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
`;
