import React, { useState } from 'react';
import {
  Network,
  Database,
  Link2,
  Info,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Box,
  Truck,
  Building,
  Users,
  Cpu
} from 'lucide-react';
import { ONTOLOGY_NODES, ONTOLOGY_RELATIONSHIPS } from '../ontology/ontologyMetadata';
import { EntityType, OntologyNodeMetadata, OntologyRelationship } from '../ontology/types';
import { dbEngine } from '../database/sqlEngine';

export const OntologyExplorer: React.FC = () => {
  const [selectedEntity, setSelectedEntity] = useState<EntityType>('Supplier');
  const [selectedRelationship, setSelectedRelationship] = useState<OntologyRelationship | null>(null);

  const rawData = dbEngine.getRawData();

  // Record counts from real database
  const recordCounts: Record<EntityType, number> = {
    Supplier: rawData.suppliers.length,
    Part: rawData.parts.length,
    Plant: rawData.plants.length,
    Customer: rawData.customers.length,
    Order: rawData.orders.length,
    Shipment: rawData.shipments.length,
    Inventory: rawData.inventory.length,
    Carrier: rawData.carriers.length,
    IoTEvent: rawData.iotEvents.length
  };

  const entityIcons: Record<EntityType, React.ReactNode> = {
    Supplier: <Building className="w-5 h-5 text-indigo-600" />,
    Part: <Box className="w-5 h-5 text-cyan-600" />,
    Plant: <Layers className="w-5 h-5 text-emerald-600" />,
    Customer: <Users className="w-5 h-5 text-purple-600" />,
    Order: <Activity className="w-5 h-5 text-amber-600" />,
    Shipment: <Truck className="w-5 h-5 text-rose-600" />,
    Inventory: <Database className="w-5 h-5 text-blue-600" />,
    Carrier: <Truck className="w-5 h-5 text-teal-600" />,
    IoTEvent: <Cpu className="w-5 h-5 text-orange-600" />
  };

  const currentNode: OntologyNodeMetadata = ONTOLOGY_NODES[selectedEntity];

  const outgoingRels = ONTOLOGY_RELATIONSHIPS.filter(r => r.fromEntity === selectedEntity);
  const incomingRels = ONTOLOGY_RELATIONSHIPS.filter(r => r.toEntity === selectedEntity);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
              <Network className="w-3.5 h-3.5 text-indigo-600" /> Supply Chain Ontology Model
            </span>
            <span className="text-xs text-slate-500">9 Core Entities • 10 Active Governed Edges</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Supply Chain Ontology Explorer</h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Formal graph representation defining business entity structures, primary keys, cardinalities, and relationship paths.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          <Database className="w-3.5 h-3.5 text-indigo-600" />
          <span>Active Warehouse Rows: <strong className="text-slate-900 font-mono">18,340</strong></span>
        </div>
      </div>

      {/* Grid: Graph Grid on Left, Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Topology Canvas & Entity Cards */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Entity Topology & Hierarchy</h2>
              <p className="text-xs text-slate-500">Select any entity to inspect attributes, primary keys, and relations</p>
            </div>
            <span className="text-[11px] font-mono text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Interactive Schema
            </span>
          </div>

          {/* Topology Canvas */}
          <div className="relative bg-slate-50 rounded-xl border border-slate-200 p-5 min-h-[460px] flex flex-col justify-between">
            {/* SVG Connecting Paths */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-300" xmlns="http://www.w3.org/2000/svg">
              <line x1="20%" y1="18%" x2="50%" y2="18%" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="50%" y1="18%" x2="80%" y2="18%" strokeWidth="2" />
              <line x1="20%" y1="50%" x2="50%" y2="50%" strokeWidth="2" />
              <line x1="50%" y1="50%" x2="80%" y2="50%" strokeWidth="2" />
              <line x1="20%" y1="82%" x2="50%" y2="82%" strokeWidth="2" />
              <line x1="50%" y1="82%" x2="80%" y2="82%" strokeWidth="2" />
              <line x1="50%" y1="18%" x2="50%" y2="50%" strokeWidth="2" />
              <line x1="80%" y1="18%" x2="80%" y2="50%" strokeWidth="2" />
            </svg>

            {/* Row 1: Customer -> Order -> Part */}
            <div className="grid grid-cols-3 gap-3 relative z-10">
              {(['Customer', 'Order', 'Part'] as EntityType[]).map((e) => {
                const isSelected = selectedEntity === e;
                return (
                  <button
                    key={e}
                    onClick={() => {
                      setSelectedEntity(e);
                      setSelectedRelationship(null);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all shadow-xs ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-100'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      {entityIcons[e]}
                      <span className="font-mono text-[10px] text-slate-500 font-medium">{recordCounts[e]}</span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs">{e}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">{ONTOLOGY_NODES[e].businessDomain}</div>
                  </button>
                );
              })}
            </div>

            {/* Row 2: Carrier -> Shipment -> Plant */}
            <div className="grid grid-cols-3 gap-3 relative z-10 my-4">
              {(['Carrier', 'Shipment', 'Plant'] as EntityType[]).map((e) => {
                const isSelected = selectedEntity === e;
                return (
                  <button
                    key={e}
                    onClick={() => {
                      setSelectedEntity(e);
                      setSelectedRelationship(null);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all shadow-xs ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-100'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      {entityIcons[e]}
                      <span className="font-mono text-[10px] text-slate-500 font-medium">{recordCounts[e]}</span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs">{e}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">{ONTOLOGY_NODES[e].businessDomain}</div>
                  </button>
                );
              })}
            </div>

            {/* Row 3: Supplier -> Inventory -> IoTEvent */}
            <div className="grid grid-cols-3 gap-3 relative z-10">
              {(['Supplier', 'Inventory', 'IoTEvent'] as EntityType[]).map((e) => {
                const isSelected = selectedEntity === e;
                return (
                  <button
                    key={e}
                    onClick={() => {
                      setSelectedEntity(e);
                      setSelectedRelationship(null);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all shadow-xs ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-100'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      {entityIcons[e]}
                      <span className="font-mono text-[10px] text-slate-500 font-medium">{recordCounts[e]}</span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs">{e}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">{ONTOLOGY_NODES[e].businessDomain}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Relationship Buttons */}
          <div>
            <div className="text-xs font-semibold text-slate-600 mb-2">Governed Semantic Relationships:</div>
            <div className="flex flex-wrap gap-1.5">
              {ONTOLOGY_RELATIONSHIPS.map((rel) => {
                const isEdgeSelected = selectedRelationship?.id === rel.id;
                return (
                  <button
                    key={rel.id}
                    onClick={() => setSelectedRelationship(rel)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md border transition-colors flex items-center space-x-1 ${
                      isEdgeSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <span>{rel.fromEntity}</span>
                    <span className={isEdgeSelected ? 'text-indigo-200' : 'text-indigo-600'}>→ {rel.relationshipName} →</span>
                    <span>{rel.toEntity}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Detailed Entity Inspector */}
        <div className="lg:col-span-5 space-y-4">
          {/* Selected Relationship Detail (if clicked) */}
          {selectedRelationship ? (
            <div className="bg-white border border-indigo-200 rounded-xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center space-x-2 text-indigo-700 text-xs font-semibold">
                <Link2 className="w-4 h-4" />
                <span>Selected Graph Relationship</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedRelationship.fromEntity} → {selectedRelationship.relationshipName} → {selectedRelationship.toEntity}
                </h3>
                <p className="text-xs text-slate-600 mt-1">{selectedRelationship.description}</p>
              </div>

              <div className="space-y-1.5 text-xs border-t border-slate-100 pt-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Cardinality:</span>
                  <span className="font-mono text-emerald-700 font-bold">{selectedRelationship.cardinality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Primary Key Reference:</span>
                  <span className="font-mono text-slate-800">{selectedRelationship.primaryKey}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Foreign Key Join Column:</span>
                  <span className="font-mono text-indigo-700 font-semibold">{selectedRelationship.foreignKey}</span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Selected Entity Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
                  {entityIcons[selectedEntity]}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{currentNode.displayName}</h3>
                  <div className="text-xs text-slate-500">
                    Table: <code className="text-indigo-700 font-semibold font-mono">{currentNode.tableName}</code>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Primary Key</div>
                <div className="text-xs font-mono font-bold text-slate-900">{currentNode.primaryKey}</div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{currentNode.description}</p>

            {/* Concrete Instance S001 Lookup */}
            {selectedEntity === 'Supplier' && (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-indigo-700 font-semibold text-[11px]">
                  <span>Concrete Instance: Supplier S001</span>
                  <span className="font-mono">Apex MicroElectronics</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="text-slate-600">Connected Parts: <strong className="text-slate-900">P100, P102, P108</strong></div>
                  <div className="text-slate-600">Connected Plants: <strong className="text-slate-900">PL01, PL03</strong></div>
                  <div className="text-slate-600">Shipments: <strong className="text-slate-900">559</strong></div>
                  <div className="text-slate-600">Canonical OTD: <strong className="text-emerald-700 font-mono font-bold">93.2%</strong></div>
                </div>
              </div>
            )}

            {/* Attributes Schema Table */}
            <div>
              <div className="text-xs font-bold text-slate-800 mb-2">Governed Schema Attributes</div>
              <div className="border border-slate-200 rounded-lg overflow-hidden max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="p-2 font-medium">Attribute</th>
                      <th className="p-2 font-medium">Type</th>
                      <th className="p-2 font-medium">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentNode.attributes.map((attr) => (
                      <tr key={attr.name} className="hover:bg-slate-50/80">
                        <td className="p-2 font-mono text-indigo-700 font-medium">{attr.name}</td>
                        <td className="p-2 text-slate-500 text-[11px]">{attr.dataType}</td>
                        <td className="p-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            attr.semanticRole === 'identifier' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                            attr.semanticRole === 'measure' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {attr.semanticRole}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Outgoing & Incoming Relationships */}
            <div className="space-y-1.5 text-xs pt-1">
              <div className="text-slate-600 font-medium">Relationships:</div>
              <div className="space-y-1">
                {outgoingRels.map(r => (
                  <div key={r.id} className="flex items-center text-slate-700 text-[11px]">
                    <span className="text-indigo-600 font-semibold mr-1.5">→ {r.relationshipName}</span>
                    <span className="text-slate-500">to {r.toEntity} ({r.cardinality})</span>
                  </div>
                ))}
                {incomingRels.map(r => (
                  <div key={r.id} className="flex items-center text-slate-700 text-[11px]">
                    <span className="text-emerald-600 font-semibold mr-1.5">← {r.relationshipName}</span>
                    <span className="text-slate-500">from {r.fromEntity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
