/**
 * Governed Semantic Compiler
 * Translates validated structured Semantic Queries into safe, governed SQL using canonical metric definitions.
 */

import { CANONICAL_METRICS, CanonicalMetric } from '../metrics/registry';
import { ONTOLOGY_NODES } from '../ontology/ontologyMetadata';

export interface SemanticQueryInput {
  metric: string; // e.g. 'OTD', 'FILL_RATE', 'DAYS_OF_INVENTORY', 'LANDED_COST', 'LATE_SHIPMENTS'
  supplier?: string;
  plant?: string;
  part?: string;
  carrier?: string;
  region?: string;
  time_range?: string; // e.g. 'Q3 2026', 'All', 'Last 90 Days'
  group_by?: string[]; // e.g. ['supplier'], ['carrier'], ['plant'], ['part']
  order_by?: 'ASC' | 'DESC';
  limit?: number;
  explanation_type?: 'standard' | 'why_analysis' | 'comparison';
  comparison_targets?: string[]; // e.g. ['S001', 'S002']
}

export interface MetricLineageTrace {
  metricId: string;
  metricName: string;
  canonicalDefinition: string;
  formula: string;
  version: string;
  owner: string;
  targetEntities: string[];
  sourceTables: string[];
  appliedFilters: Record<string, string>;
  calculationMethod: string;
  governanceStatus: string;
}

export interface GovernedCompilationResult {
  valid: boolean;
  validationErrors?: string[];
  semanticQuery: SemanticQueryInput;
  canonicalMetric?: CanonicalMetric;
  generatedSql: string;
  lineage: MetricLineageTrace;
}

const WRITE_KEYWORDS_REGEX = /\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|CREATE|REPLACE|ATTACH|DETACH|PRAGMA|EXEC|GRANT|REVOKE)\b/i;

export function validateSqlSafety(sql: string): { isSafe: boolean; reason?: string } {
  const trimmed = sql.trim();
  if (WRITE_KEYWORDS_REGEX.test(trimmed)) {
    return {
      isSafe: false,
      reason: 'Governance Violation: Non-read-only operation or DDL/DML keyword detected. Only SELECT queries are permitted.'
    };
  }
  if (!/^SELECT\b/i.test(trimmed) && !/^WITH\b/i.test(trimmed)) {
    return {
      isSafe: false,
      reason: 'Governance Violation: Query must start with a SELECT or CTE WITH statement.'
    };
  }
  if (trimmed.includes(';') && trimmed.indexOf(';') < trimmed.length - 1) {
    return {
      isSafe: false,
      reason: 'Governance Violation: Multiple semicolon-separated SQL statements are prohibited.'
    };
  }
  return { isSafe: true };
}

function cleanId(val?: string): string | undefined {
  if (!val) return undefined;
  // Allow letters, numbers, hyphens, underscores
  return val.replace(/[^A-Za-z0-9_-]/g, '').trim().toUpperCase();
}

export function compileSemanticQuery(query: SemanticQueryInput): GovernedCompilationResult {
  const errors: string[] = [];

  // Normalize metric lookup
  let canonicalMetric: CanonicalMetric | undefined;
  const metricKey = query.metric.toUpperCase().replace(/[^A-Z_]/g, '');

  if (CANONICAL_METRICS[metricKey]) {
    canonicalMetric = CANONICAL_METRICS[metricKey];
  } else {
    // Try matching short_code or name
    for (const key of Object.keys(CANONICAL_METRICS)) {
      const m = CANONICAL_METRICS[key];
      if (
        m.short_code.toUpperCase().replace(/[^A-Z_]/g, '') === metricKey ||
        m.name.toUpperCase().replace(/[^A-Z_]/g, '') === metricKey
      ) {
        canonicalMetric = m;
        break;
      }
    }
  }

  if (!canonicalMetric) {
    return {
      valid: false,
      validationErrors: [
        `Unknown metric '${query.metric}'. The LLM or semantic layer is not permitted to execute unapproved metrics. Approved canonical metrics are: ${Object.keys(
          CANONICAL_METRICS
        ).join(', ')}`
      ],
      semanticQuery: query,
      generatedSql: '',
      lineage: {
        metricId: 'UNKNOWN',
        metricName: query.metric,
        canonicalDefinition: 'Unapproved metric definition',
        formula: 'None',
        version: '0.0',
        owner: 'None',
        targetEntities: [],
        sourceTables: [],
        appliedFilters: {},
        calculationMethod: 'Rejected at semantic governance gate',
        governanceStatus: 'Rejected'
      }
    };
  }

  // Sanitize IDs
  const supplierId = cleanId(query.supplier);
  const plantId = cleanId(query.plant);
  const partId = cleanId(query.part);
  const carrierId = cleanId(query.carrier);
  const region = query.region ? query.region.replace(/[^A-Za-z0-9 _-]/g, '').trim() : undefined;

  const appliedFilters: Record<string, string> = {};
  const whereClauses: string[] = [];

  if (supplierId) {
    appliedFilters['Supplier'] = supplierId;
    whereClauses.push(`s.supplier_id = '${supplierId}'`);
  }
  if (plantId) {
    appliedFilters['Plant'] = plantId;
    whereClauses.push(`sh.plant_id = '${plantId}'`);
  }
  if (partId) {
    appliedFilters['Part'] = partId;
    whereClauses.push(`o.part_id = '${partId}'`);
  }
  if (carrierId) {
    appliedFilters['Carrier'] = carrierId;
    whereClauses.push(`sh.carrier_id = '${carrierId}'`);
  }
  if (region) {
    appliedFilters['Region'] = region;
    whereClauses.push(`s.region = '${region}'`);
  }

  // Handle comparison targets
  if (query.comparison_targets && query.comparison_targets.length > 0) {
    const cleanedTargets = query.comparison_targets.map(t => `'${cleanId(t)}'`).join(', ');
    whereClauses.push(`s.supplier_id IN (${cleanedTargets})`);
    appliedFilters['Comparison'] = query.comparison_targets.join(' vs ');
  }

  // Time range filter (e.g., Q3 2026: 2026-07-01 to 2026-09-30)
  if (query.time_range && query.time_range.toLowerCase().includes('q3')) {
    whereClauses.push(`DATE(sh.actual_delivery_date) >= '2026-07-01' AND DATE(sh.actual_delivery_date) <= '2026-09-30'`);
    appliedFilters['Time Window'] = 'Q3 2026 (2026-07-01 to 2026-09-30)';
  } else if (query.time_range && query.time_range.toLowerCase().includes('last quarter')) {
    whereClauses.push(`DATE(sh.actual_delivery_date) >= '2026-07-01' AND DATE(sh.actual_delivery_date) <= '2026-09-30'`);
    appliedFilters['Time Window'] = 'Last Quarter (Q3 2026)';
  }

  let generatedSql = '';
  const filterString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Handle "Why did OTD fall" - Root cause analysis
  if (query.explanation_type === 'why_analysis') {
    const targetPlant = plantId || 'PL01';
    generatedSql = `
      SELECT 
        'Supplier' as factor_category,
        s.supplier_id as factor_id,
        s.supplier_name as factor_name,
        COUNT(sh.shipment_id) as total_shipments,
        SUM(CASE WHEN DATE(sh.actual_delivery_date) > DATE(sh.promised_date) THEN 1 ELSE 0 END) as late_shipments,
        ROUND(100.0 * SUM(CASE WHEN DATE(sh.actual_delivery_date) <= DATE(sh.promised_date) THEN 1 ELSE 0 END) / COUNT(sh.shipment_id), 1) as otd_rate
      FROM shipments sh
      JOIN suppliers s ON sh.supplier_id = s.supplier_id
      WHERE sh.plant_id = '${targetPlant}'
      GROUP BY s.supplier_id, s.supplier_name
      HAVING late_shipments > 0
      ORDER BY late_shipments DESC
      LIMIT 5;
    `.trim();
  } else if (query.group_by && query.group_by.length > 0) {
    // Grouped analytics
    const group = query.group_by[0].toLowerCase();
    if (group === 'supplier') {
      generatedSql = `
        SELECT 
          s.supplier_id,
          s.supplier_name,
          s.region,
          s.risk_level,
          COUNT(sh.shipment_id) as shipment_count,
          SUM(CASE WHEN DATE(sh.actual_delivery_date) <= DATE(sh.promised_date) THEN 1 ELSE 0 END) as on_time_count,
          SUM(CASE WHEN DATE(sh.actual_delivery_date) > DATE(sh.promised_date) THEN 1 ELSE 0 END) as late_count,
          ROUND(100.0 * SUM(CASE WHEN DATE(sh.actual_delivery_date) <= DATE(sh.promised_date) THEN 1 ELSE 0 END) / COUNT(sh.shipment_id), 1) as otd,
          ROUND(100.0 * SUM(sh.quantity_delivered) / SUM(sh.quantity_ordered), 1) as fill_rate,
          ROUND(SUM((sh.quantity_delivered * p.unit_cost) + sh.freight_cost + sh.duty_cost + (0.015 * sh.quantity_delivered * p.unit_cost) + sh.handling_cost), 2) as landed_cost
        FROM shipments sh
        JOIN suppliers s ON sh.supplier_id = s.supplier_id
        JOIN orders o ON sh.order_id = o.order_id
        JOIN parts p ON o.part_id = p.part_id
        ${filterString}
        GROUP BY s.supplier_id, s.supplier_name, s.region, s.risk_level
        ORDER BY ${query.metric === 'FILL_RATE' ? 'fill_rate' : 'late_count'} ${query.order_by || 'DESC'}
        LIMIT ${query.limit || 10};
      `.trim();
    } else if (group === 'carrier') {
      generatedSql = `
        SELECT 
          c.carrier_id,
          c.carrier_name,
          c.transport_mode,
          COUNT(sh.shipment_id) as total_shipments,
          SUM(CASE WHEN DATE(sh.actual_delivery_date) > DATE(sh.promised_date) THEN 1 ELSE 0 END) as delayed_shipments,
          ROUND(100.0 * SUM(CASE WHEN DATE(sh.actual_delivery_date) > DATE(sh.promised_date) THEN 1 ELSE 0 END) / COUNT(sh.shipment_id), 1) as delay_rate,
          ROUND(100.0 * SUM(CASE WHEN DATE(sh.actual_delivery_date) <= DATE(sh.promised_date) THEN 1 ELSE 0 END) / COUNT(sh.shipment_id), 1) as otd
        FROM shipments sh
        JOIN carriers c ON sh.carrier_id = c.carrier_id
        ${filterString}
        GROUP BY c.carrier_id, c.carrier_name, c.transport_mode
        ORDER BY delay_rate DESC
        LIMIT ${query.limit || 10};
      `.trim();
    } else if (group === 'plant') {
      generatedSql = `
        SELECT 
          pl.plant_id,
          pl.plant_name,
          pl.location,
          COUNT(sh.shipment_id) as shipment_count,
          ROUND(100.0 * SUM(CASE WHEN DATE(sh.actual_delivery_date) <= DATE(sh.promised_date) THEN 1 ELSE 0 END) / COUNT(sh.shipment_id), 1) as otd,
          ROUND(100.0 * SUM(sh.quantity_delivered) / SUM(sh.quantity_ordered), 1) as fill_rate
        FROM shipments sh
        JOIN plants pl ON sh.plant_id = pl.plant_id
        ${filterString}
        GROUP BY pl.plant_id, pl.plant_name, pl.location
        ORDER BY otd ASC
        LIMIT ${query.limit || 10};
      `.trim();
    }
  } else {
    // Specific single metric calculation
    switch (canonicalMetric.short_code) {
      case 'OTD':
        generatedSql = `
          SELECT 
            COUNT(sh.shipment_id) as total_eligible_shipments,
            SUM(CASE WHEN DATE(sh.actual_delivery_date) <= DATE(sh.promised_date) THEN 1 ELSE 0 END) as on_time_shipments,
            SUM(CASE WHEN DATE(sh.actual_delivery_date) > DATE(sh.promised_date) THEN 1 ELSE 0 END) as late_shipments,
            ROUND(100.0 * SUM(CASE WHEN DATE(sh.actual_delivery_date) <= DATE(sh.promised_date) THEN 1 ELSE 0 END) / COUNT(sh.shipment_id), 1) as metric_result
          FROM shipments sh
          JOIN suppliers s ON sh.supplier_id = s.supplier_id
          ${filterString};
        `.trim();
        break;

      case 'Fill Rate':
        generatedSql = `
          SELECT 
            SUM(sh.quantity_ordered) as total_quantity_ordered,
            SUM(sh.quantity_delivered) as total_quantity_delivered,
            ROUND(100.0 * SUM(sh.quantity_delivered) / SUM(sh.quantity_ordered), 1) as metric_result
          FROM shipments sh
          JOIN suppliers s ON sh.supplier_id = s.supplier_id
          ${filterString};
        `.trim();
        break;

      case 'Days Inventory':
        const plantFilter = plantId ? `WHERE plant_id = '${plantId}'` : '';
        generatedSql = `
          SELECT 
            SUM(i.inventory_quantity) as total_on_hand_inventory,
            ROUND((SELECT SUM(quantity) / 90.0 FROM orders), 2) as average_daily_demand,
            ROUND(CAST(SUM(i.inventory_quantity) AS FLOAT) / (SELECT MAX(1.0, SUM(quantity) / 90.0) FROM orders), 1) as metric_result
          FROM inventory i
          ${plantFilter};
        `.trim();
        break;

      case 'Landed Cost':
        generatedSql = `
          SELECT 
            ROUND(SUM(sh.quantity_delivered * p.unit_cost), 2) as purchase_cost,
            ROUND(SUM(sh.freight_cost), 2) as freight_cost,
            ROUND(SUM(sh.duty_cost), 2) as duty_cost,
            ROUND(SUM(0.015 * sh.quantity_delivered * p.unit_cost), 2) as insurance_cost,
            ROUND(SUM(sh.handling_cost), 2) as handling_cost,
            ROUND(SUM((sh.quantity_delivered * p.unit_cost) + sh.freight_cost + sh.duty_cost + (0.015 * sh.quantity_delivered * p.unit_cost) + sh.handling_cost), 2) as metric_result
          FROM shipments sh
          JOIN orders o ON sh.order_id = o.order_id
          JOIN parts p ON o.part_id = p.part_id
          JOIN suppliers s ON sh.supplier_id = s.supplier_id
          ${filterString};
        `.trim();
        break;

      case 'Late Shipments':
        generatedSql = `
          SELECT 
            COUNT(sh.shipment_id) as total_shipments,
            SUM(CASE WHEN DATE(sh.actual_delivery_date) > DATE(sh.promised_date) THEN 1 ELSE 0 END) as metric_result
          FROM shipments sh
          JOIN suppliers s ON sh.supplier_id = s.supplier_id
          ${filterString};
        `.trim();
        break;

      case 'At-Risk Suppliers':
        generatedSql = `
          WITH supplier_metrics AS (
            SELECT 
              s.supplier_id,
              s.risk_level,
              ROUND(100.0 * SUM(CASE WHEN DATE(sh.actual_delivery_date) <= DATE(sh.promised_date) THEN 1 ELSE 0 END) / COUNT(sh.shipment_id), 1) as otd
            FROM suppliers s
            JOIN shipments sh ON s.supplier_id = sh.supplier_id
            GROUP BY s.supplier_id, s.risk_level
          )
          SELECT COUNT(*) as metric_result
          FROM supplier_metrics
          WHERE risk_level = 'High' OR otd < 90.0;
        `.trim();
        break;

      default:
        errors.push(`Compilation path not configured for ${canonicalMetric.short_code}`);
    }
  }

  // Safety check on compiled SQL
  const safety = validateSqlSafety(generatedSql);
  if (!safety.isSafe) {
    return {
      valid: false,
      validationErrors: [safety.reason || 'Unsafe SQL query'],
      semanticQuery: query,
      canonicalMetric,
      generatedSql: '',
      lineage: {
        metricId: canonicalMetric.metric_id,
        metricName: canonicalMetric.name,
        canonicalDefinition: canonicalMetric.business_definition,
        formula: canonicalMetric.formula,
        version: canonicalMetric.version,
        owner: canonicalMetric.owner,
        targetEntities: canonicalMetric.source_entities,
        sourceTables: canonicalMetric.source_tables,
        appliedFilters,
        calculationMethod: 'Rejected: Safety Check Failed',
        governanceStatus: 'Rejected'
      }
    };
  }

  return {
    valid: true,
    semanticQuery: query,
    canonicalMetric,
    generatedSql,
    lineage: {
      metricId: canonicalMetric.metric_id,
      metricName: canonicalMetric.name,
      canonicalDefinition: canonicalMetric.business_definition,
      formula: canonicalMetric.formula,
      version: canonicalMetric.version,
      owner: canonicalMetric.owner,
      targetEntities: canonicalMetric.source_entities,
      sourceTables: canonicalMetric.source_tables,
      appliedFilters,
      calculationMethod: canonicalMetric.sql_expression,
      governanceStatus: canonicalMetric.status
    }
  };
}
