# SupplyGraph AI — Governed Conversational Supply Chain Analytics

> **“One governed source of truth for supply-chain decisions.”**

SupplyGraph AI is an enterprise-grade AI prototype proving how a **Supply Chain Ontology + Governed Semantic Layer + Conversational Analytics** eliminates cross-functional metric drift across Planning, Procurement, and Logistics.

---

## 🏆 Key Capabilities Demonstrated

1. **Supply Chain Ontology**: Formal application metadata defining 9 core business entities (`Supplier`, `Part`, `Plant`, `Customer`, `Order`, `Shipment`, `Inventory`, `Carrier`, `IoTEvent`) and 10 active relationship edges.
2. **Governed Metric Registry**: Canonical centralized definitions for **OTD**, **Fill Rate**, **Days of Inventory**, and **Landed Cost** (with configurable formula simulator).
3. **Conversational Analytics ("Ask SupplyGraph")**: Natural language queries compiled through a strict pipeline:
   `User Question → Intent → Ontology → Metric Registry → Semantic AST → Validation → Safe SQL → Result`.
4. **Metric Consistency Lab**: The definitive proof that Planning, Procurement, and Logistics get the **exact same 93.2% answer** for vendor SLA queries through identical canonical resolution.
5. **Why-Analysis Factor Decomposition**: Root-cause diagnostic analyzing late shipment contributors across suppliers, carriers, and parts (e.g. S001 → 38 late, CAR04 → 21 late, P100 → 17 late).
6. **Data Lineage**: 6-tier vertical trace from question to metric, semantic rule, ontology entities, source tables, calculation, and final result.
7. **100% Passing Automated Test Suite**: Built-in interactive test runner verifying ontology integrity, metric formulas, governance gates, and persona parity.

---

## 🚀 Quick Start (Local & AI Studio)

### Dependencies
- Node.js 18+
- React 19 + TypeScript + Vite + Tailwind CSS

### Installation & Run
```bash
# Install packages
npm install

# Start local dev server (port 3000)
npm run dev

# Compile / verify TypeScript
npm run build
```

---

## ⏱ 3–5 Minute Hackathon Presentation Walkthrough

Click the **"3-Min Demo Tour"** button in the top navigation bar to open the guided walkthrough, or follow these 8 steps:

1. **Step 1: Executive Dashboard**
   - Review live KPIs: OTD (93.2%), Fill Rate (96.4%), Days Inventory (18.7), Landed Cost ($12.4M).
   - Point out that all cards are calculated from real database rows.
2. **Step 2: Ontology Explorer**
   - Explore the 9 entities and 10 relationships.
   - Click **Supplier S001** to view concrete instance data (559 shipments, 93.2% OTD).
3. **Step 3: Metric Registry**
   - Click into **OTD (On-Time Delivery)** to show its approved definition, formula (`on_time_shipments / eligible_shipments`), and SLA owner.
4. **Step 4: Ask SupplyGraph**
   - Click the **[Late Deliveries]** demo button.
   - Inspect the Trust Card: Answer, Metric ID, Applied Filters, and Expandable Safe SQL.
5. **Step 5: Change Persona to Procurement**
   - Switch persona to **Procurement** and ask: *“How reliable was Supplier S001 for Plant PL01?”*.
   - Show how the semantic layer translates "reliable" to canonical OTD.
6. **Step 6: Metric Consistency Lab (The Climax)**
   - Open **Consistency Lab**.
   - Show Planning (93.2%) == Procurement (93.2%) == Logistics (93.2%).
   - Highlight all 5 green checkmarks: Same concept, Same metric ID, Same formula, Same tables, Same result.
7. **Step 7: Why Did OTD Fall?**
   - Ask: *“Why did OTD fall at PL01?”*.
   - Show the factor breakdown: S001 (38 late), CAR04 (21 late), P100 (17 late), distinguishing calculated evidence from narrative.
8. **Step 8: Data Lineage & Wrap-Up**
   - Trace OTD down all 6 tiers: Metric → Semantic Definition → Entities → Source Tables → Calculation → Result.
   - Close with: *“Different questions. Different teams. One governed supply-chain truth.”*

---

## 🛡 AI Safety & Query Governance

The LLM is **never allowed to execute arbitrary SQL or invent business formulas**:
- **Strict Read-Only Verification**: Rejects any queries containing `INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, or `TRUNCATE`.
- **Registry Gate**: Unknown metrics (e.g., *"What is supplier happiness?"*) are stopped at the governance boundary with helpful suggestions for approved metrics.
- **Auditing**: Every inquiry is persisted into an immutable audit trail with execution latency, AST representation, and verification traces.

---

## 📁 Repository Structure

```
├── docs/                      # Technical specifications & architecture
│   ├── architecture.md        # Architecture & Governance Design
│   ├── database_schema.md     # Relational schema DDL & indexes
│   ├── ontology.md            # Ontology nodes & relationships
│   ├── metrics.md             # Canonical metric definitions
│   └── api.md                 # REST API endpoints
├── src/
│   ├── ai/                    # Conversational engine & intent resolution
│   ├── components/            # UI components (Dashboard, Ask, Consistency Lab, etc.)
│   ├── database/              # Schema, deterministic seed data & SQL engine
│   ├── metrics/               # Canonical metric registry
│   ├── ontology/              # Core business entities & relationship graph
│   ├── semantic/              # Semantic views & governed SQL compiler
│   ├── tests/                 # Automated test suite (Ontology, Metrics, Consistency)
│   ├── App.tsx                # Main view router
│   └── main.tsx               # Client entry point
├── metadata.json              # AI Studio app metadata
└── README.md                  # This file
```
