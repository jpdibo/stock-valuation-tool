import React from 'react';
import { DCFAssumptions } from '../types';

interface DCFInputsProps {
  assumptions: DCFAssumptions;
  showAdvanced: boolean;
  onChange: (field: keyof DCFAssumptions, value: number) => void;
  consensus: Partial<DCFAssumptions & { peMultiple: number; ebitdaMultiple: number }>;
  historical: Partial<DCFAssumptions>;
}

const SLIDER_CONFIG = {
  revenueGrowthCAGR: { min: 0, max: 20, step: 0.1 },
  operatingProfitMargin: { min: 0, max: 40, step: 0.1 },
  discountRate: { min: 5, max: 20, step: 0.1 },
  capexIntensity: { min: 0, max: 20, step: 0.1 },
  workingCapitalIntensity: { min: 0, max: 20, step: 0.1 },
  taxRate: { min: 0, max: 50, step: 0.1 },
  terminalGrowthRate: { min: 0, max: 5, step: 0.1 }
};

const InputWithSlider = ({
  label,
  id,
  value,
  onChange,
  sliderConfig,
  consensus,
  historical,
  tooltip,
  showConsensus = true
}: {
  label: string;
  id: string;
  value: number;
  onChange: (v: number) => void;
  sliderConfig: { min: number; max: number; step: number };
  consensus?: number;
  historical?: number;
  tooltip?: string;
  showConsensus?: boolean;
}) => (
  <div className="input-group">
    <label htmlFor={id}>
      {label}
      {tooltip && (
        <span
          style={{ 
            cursor: 'pointer', 
            color: '#007bff', 
            fontSize: '1.2em', 
            marginLeft: 8,
            fontWeight: 'normal'
          }}
          title={tooltip}
        >
          ?
        </span>
      )}
    </label>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <input
        id={id}
        type="number"
        value={value}
        min={sliderConfig.min}
        max={sliderConfig.max}
        step={sliderConfig.step}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        style={{ width: 70 }}
      />
      <input
        type="range"
        min={sliderConfig.min}
        max={sliderConfig.max}
        step={sliderConfig.step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        style={{ flex: 1 }}
      />
      <span style={{ width: 40, textAlign: 'right', fontSize: 12 }}>{value.toFixed(1)}%</span>
    </div>
    {showConsensus && (
      <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
        Consensus: {consensus}%{historical !== undefined ? ` | 5y hist. avg: ${historical}%` : ''}
      </div>
    )}
  </div>
);

const DCFInputs: React.FC<DCFInputsProps> = ({ assumptions, showAdvanced, onChange, consensus, historical }) => {
  return (
    <div>
      <InputWithSlider
        label="Annual Sales Growth"
        id="revenue-growth"
        value={assumptions.revenueGrowthCAGR}
        onChange={v => onChange('revenueGrowthCAGR', v)}
        sliderConfig={SLIDER_CONFIG.revenueGrowthCAGR}
        consensus={consensus.revenueGrowthCAGR}
        historical={historical.revenueGrowthCAGR}
        tooltip="How fast the company's sales are expected to grow each year. Higher growth usually means higher stock value, but also more risk."
      />
      <InputWithSlider
        label="Profit Margin"
        id="operating-margin"
        value={assumptions.operatingProfitMargin}
        onChange={v => onChange('operatingProfitMargin', v)}
        sliderConfig={SLIDER_CONFIG.operatingProfitMargin}
        consensus={consensus.operatingProfitMargin}
        historical={historical.operatingProfitMargin}
        tooltip="This is the operating profit margin - profit after operating expenses but before interest and taxes. Higher margins mean the company keeps more profit from each dollar of sales."
      />
      {/* Advanced Assumptions - Only visible when toggle is on */}
      {showAdvanced && <>
        <InputWithSlider
          label="Discount Rate"
          id="discount-rate"
          value={assumptions.discountRate}
          onChange={v => onChange('discountRate', v)}
          sliderConfig={SLIDER_CONFIG.discountRate}
          tooltip="How much we reduce future profits to account for risk and time. Higher rates mean we value future profits less. Typically based on the company's cost of capital."
          showConsensus={false}
        />
        <InputWithSlider
          label="Capital Spending (% of Sales)"
          id="capex-intensity"
          value={assumptions.capexIntensity}
          onChange={v => onChange('capexIntensity', v)}
          sliderConfig={SLIDER_CONFIG.capexIntensity}
          consensus={consensus.capexIntensity}
          historical={historical.capexIntensity}
          tooltip="How much the company spends on equipment, buildings, and other long-term investments as a percentage of sales. Higher spending means less cash available for shareholders."
        />
        <InputWithSlider
          label="Working Capital (% of Sales)"
          id="working-capital"
          value={assumptions.workingCapitalIntensity}
          onChange={v => onChange('workingCapitalIntensity', v)}
          sliderConfig={SLIDER_CONFIG.workingCapitalIntensity}
          consensus={consensus.workingCapitalIntensity}
          historical={historical.workingCapitalIntensity}
          tooltip="Cash the company needs to keep for day-to-day operations (inventory, receivables, etc.) as a percentage of sales. Higher needs mean less cash available."
        />
        <InputWithSlider
          label="Tax Rate"
          id="tax-rate"
          value={assumptions.taxRate}
          onChange={v => onChange('taxRate', v)}
          sliderConfig={SLIDER_CONFIG.taxRate}
          consensus={consensus.taxRate}
          historical={historical.taxRate}
          tooltip="The effective corporate tax rate the company pays on its profits. Lower tax rates mean more profit stays with the company."
        />
        <InputWithSlider
          label="Long-term Growth Rate"
          id="terminal-growth"
          value={assumptions.terminalGrowthRate}
          onChange={v => onChange('terminalGrowthRate', v)}
          sliderConfig={SLIDER_CONFIG.terminalGrowthRate}
          consensus={consensus.terminalGrowthRate}
          historical={historical.terminalGrowthRate}
          tooltip="How fast the company is expected to grow forever after the 5-year forecast. Should be conservative and typically below GDP growth (2-3%)."
        />
      </>}
    </div>
  );
};

export default DCFInputs; 