# SupplyGraph AI — Governed Conversational Supply Chain Analytics

> **“One governed source of truth for supply-chain decisions.”**

SupplyGraph AI is an enterprise-grade supply-chain analytics platform demonstrating how a **Supply Chain Ontology + Governed Semantic Layer + Conversational Analytics** eliminates cross-functional metric drift across Planning, Procurement, and Logistics.

---

## 📌 Problem Statement

Supply chain telemetry is traditionally fragmented across disconnected systems: ERP for purchasing, MES for plant production, TMS for freight shipments, WMS for inventory counts, and IoT telematics devices.

Because different teams define and query metrics differently, organizational friction occurs:
- **Planning** measures fulfillment against production line buffer targets.
- **Procurement** measures vendor reliability against contractual promise dates.
- **Logistics** measures carrier on-time transit against carrier dispatch schedules.

This fragmentation causes conflicting answers for the exact same underlying business questions. SupplyGraph AI bridges this divide with an immutable **Supply Chain Ontology** and a **Governed Semantic Layer**, ensuring that the same question asked by different personas always produces the **same verified canonical answer**.

---

## 🏗 System Architecture

SupplyGraph AI executes queries through a strict, multi-stage governance pipeline. The LLM is strictly prohibited from inventing formulas or generating unverified SQL:

```
                            [ USER QUESTION ]
     ("What is Supplier S001's on-time delivery rate at Plant PL01?")
                                   │
                                   ▼
                    [ INTENT & VOCABULARY RESOLVER ]
         (Maps natural language into structured semantic AST)
                                   │
                                   ▼
                      [ ONTOLOGY KNOWLEDGE GRAPH ]
              (Entities: Supplier, Part, Plant, Shipment, etc.)
                                   │
                                   ▼
                     [ CANONICAL METRIC REGISTRY ]
               (Lookup: METRIC_SC_001 "On-Time Delivery")
                                   │
                                   ▼
                    [ GOVERNED COMPILATION & AST ]
                                   │
                ┌──────────────────┴──────────────────┐
                │                                     │
                ▼                                     ▼
       [ METRIC VALIDATION ]                 [ SAFETY & READ-ONLY CHECK ]
 (Verify formula, owner, version)       (Rejects DDL/DML, drops, inserts)
                │                                     │
                └──────────────────┬──────────────────┘
                                   │
                                   ▼
                     [ PARAMETERIZED SQL GENERATION ]
                                   │
                                   ▼
                   [ GOVERNED SQL DATABASE ENGINE ]
             (10,000 shipments, 25 suppliers, 10 plants)
                                   │
                                   ▼
                    [ TRUST & EXPLAINABILITY ENGINE ]
         (Answer + Metric + Formula + Filters + Data Lineage)
                                   │
                                   ▼
              [ 93.2% OTD RESULT - 100% CROSS-PERSONA PARITY ]
```

---

## 🌐 Supply Chain Ontology

The ontology is modeled as active application metadata governing relational join paths and dimensional grains:

- **Supplier** (`supplier_id`, `supplier_name`, `region`, `supplier_tier`, `risk_level`)
- **Part** (`part_id`, `part_name`, `category`, `unit_cost`)
- **Plant** (`plant_id`, `plant_name`, `location`, `capacity`)
- **Customer** (`customer_id`, `customer_name`, `region`)
- **Order** (`order_id`, `customer_id`, `part_id`, `quantity`, `order_date`, `requested_date`)
- **Shipment** (`shipment_id`, `order_id`, `supplier_id`, `plant_id`, `carrier_id`, `promised_date`, `ship_date`, `actual_delivery_date`, `quantity_ordered`, `quantity_delivered`, `freight_cost`, `duty_cost`, `handling_cost`)
- **Inventory** (`inventory_id`, `plant_id`, `part_id`, `inventory_quantity`, `inventory_value`, `snapshot_date`)
- **Carrier** (`carrier_id`, `carrier_name`, `transport_mode`)
- **IoTEvent** (`event_id`, `plant_id`, `shipment_id`, `event_type`, `event_timestamp`, `severity`)

### Governed Relationship Edges
1. `Supplier` → *supplies* → `Part`
2. `Part` → *supplied_to / used_at* → `Plant`
3. `Customer` → *places* → `Order`
4. `Order` → *contains* → `Part`
5. `Order` → *fulfilled_by* → `Shipment`
6. `Shipment` → *originates_from* → `Supplier`
7. `Shipment` → *delivered_to* → `Plant`
8. `Shipment` → *transported_by* → `Carrier`
9. `Plant` → *holds* → `Inventory`
10. `Shipment` → *generates* → `IoTEvent`

---

## 📊 Canonical Metric Registry

Every metric is governed by an immutable catalog entry with explicit SLA ownership:

| Metric ID | Short Code | Metric Name | Canonical Formula | Unit | Owner | Version | Status |
|---|---|---|---|---|---|---|---|
| `METRIC_SC_001` | **OTD** | On-Time Delivery | `on_time_shipments / eligible_shipments` | `%` | Logistics COE | 1.0 | Approved |
| `METRIC_SC_002` | **Fill Rate** | Order Fill Rate | `quantity_delivered / quantity_ordered` | `%` | Order Operations | 1.0 | Approved |
| `METRIC_SC_003` | **Days Inventory** | Days of Inventory (DOI) | `current_inventory / average_daily_demand` | `days` | Integrated Planning | 1.0 | Approved |
| `METRIC_SC_004` | **Landed Cost** | Total Landed Cost | `purchase + freight + duty + insurance + handling` | `USD` | Strategic Procurement | 1.2 | Approved |
| `METRIC_SC_005` | **Late Shipments** | Late Shipments Count | `COUNT(actual_delivery > promised)` | `count` | Logistics Operations | 1.0 | Approved |
| `METRIC_SC_006` | **At-Risk Suppliers** | At-Risk Supplier Count | `COUNT(risk = High OR OTD < 90%)` | `count` | Supplier Risk | 1.0 | Approved |

---

## 🎯 Cross-Persona Consistency Lab

The core demonstration feature proves that three distinct business personas asking different questions resolve to the exact same canonical definition and compute the identical mathematical result:

- **Planning**: *“What is Supplier S001's on-time delivery performance at Plant PL01?”*
- **Procurement**: *“How reliable was Supplier S001 for Plant PL01?”*
- **Logistics**: *“What percentage of Supplier S001 shipments reached Plant PL01 on time?”*

### Resolution Parity
- **Ontology Concept**: `Shipment.is_on_time`
- **Canonical Metric**: `METRIC_SC_001` (On-Time Delivery)
- **Formula**: `on_time_shipments / eligible_shipments`
- **Source Tables**: `shipments`, `suppliers`, `plants`
- **Computed Result**: **93.2%**

---

## 🔍 Why-Analysis & Root Cause Diagnostics

When users ask *“Why did OTD fall at PL01?”*, the system decomposes contributing factors from relational joins and distinguishes calculated database evidence from AI narrative:

- **Supplier S001 (Apex MicroElectronics)**: 38 late consignments
- **Carrier CAR04 (Union Pacific Intermodal Rail)**: 21 late consignments
- **Part SKU-P100 (Microcontroller MCU-64 Core)**: 17 late consignments

---

## 🛡 AI Safety & Query Governance

- **Zero Hallucinated Metrics**: Inquiries for unapproved concepts (e.g. *“What is supplier happiness?”*) are rejected at the governance boundary with suggestions for canonical metrics.
- **Strict Read-Only SQL**: Any DDL/DML write statements (`INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `TRUNCATE`) are blocked immediately.
- **Audit Console**: Complete immutable query logging tracking execution latency, AST representation, and verification traces.

---

## 🧪 Synthetic Data Notice

To guarantee deterministic, reproducible evaluations without external network dependencies, the current prototype uses a seeded in-memory SQL database with **10,000 shipments**, **25 suppliers**, **100 parts**, **10 manufacturing plants**, and **5 carriers**. This seed data is structured with calibrated real-world anomalies (high-risk vendors, carrier rail delays, plant buffer constraints) to make analytics meaningful.

*Note: This prototype does not connect to live production ERP/TMS systems.*

---

## 🚀 Local Development

```bash
# 1. Clone repository
git clone https://github.com/12av21/SupplyGraphAI.git
cd SupplyGraphAI

# 2. Install dependencies
npm install

# 3. Run type check / linting
npm run lint

# 4. Build application
npm run build

# 5. Start development server (port 3000)
npm run dev
```

---

## 🌐 GitHub Pages Deployment

The repository includes an automated GitHub Actions deployment workflow:
`.github/workflows/deploy-pages.yml`

### Configuration
In `vite.config.ts`, the base path dynamically detects GitHub Actions:
```ts
base: process.env.GITHUB_ACTIONS === 'true' ? '/SupplyGraphAI/' : '/'
```

### Expected Deployment URL
```
https://12av21.github.io/SupplyGraphAI/
```
*(The URL is active once the GitHub Actions deployment workflow executes successfully on the repository).*

---

## ⏱ 3–5 Minute Presentation Walkthrough

Use the **"Demo Guide"** modal in the top navigation bar to execute the 8-step presentation sequence:

1. **Executive Dashboard**: Review OTD (93.2%), Fill Rate (96.4%), DOI (18.7), and Landed Cost ($12.4M).
2. **Ontology Explorer**: Inspect the 9 entities, 10 edges, and instance data for Supplier S001.
3. **Metric Registry**: Review the approved definition and formula components for OTD.
4. **Ask SupplyGraph**: Run *“Which suppliers caused the most late deliveries to PL01?”*. Show answer card, lineage AST, and safe read-only SQL.
5. **Procurement Persona**: Ask *“How reliable was Supplier S001 for Plant PL01?”*. Show mapping to canonical OTD.
6. **Consistency Lab**: Demonstrate side-by-side parity across Planning, Procurement, and Logistics (all 93.2%).
7. **Why Did OTD Fall?**: Decompose root-cause factors (S001, CAR04, P100).
8. **Data Lineage**: Trace the 8-tier vertical path from natural question to the 93.2% result.

---

*“Different questions. Different teams. One governed supply-chain truth.”*
