import React, { useState, useEffect } from 'react';
import { DCFAssumptions, Scenario } from './types';
import { calculateDCF, formatPrice } from './utils/dcfCalculator';
import DCFInputs from './components/DCFInputs';
import FootballFieldChart from './components/FootballFieldChart';
import FanChart from './components/FanChart';
import './App.css';

const DEFAULT_ASSUMPTIONS: DCFAssumptions = {
  revenueGrowthCAGR: 8.0,
  operatingProfitMargin: 15.0,
  discountRate: 10.0,
  capexIntensity: 8.0,
  workingCapitalIntensity: 12.0,
  taxRate: 25.0,
  terminalGrowthRate: 2.5
};

const CONSENSUS = {
  revenueGrowthCAGR: 7.5,
  operatingProfitMargin: 14.2,
  discountRate: 9.8,
  capexIntensity: 7.9,
  workingCapitalIntensity: 11.5,
  taxRate: 24.5,
  terminalGrowthRate: 2.2,
  peMultiple: 18,
  ebitdaMultiple: 12
};
const HISTORICAL = {
  revenueGrowthCAGR: 6.2,
  operatingProfitMargin: 13.1
};

const DEFAULT_SCENARIOS: Scenario[] = [
  {
    id: 'base',
    name: 'Base Case',
    assumptions: { ...DEFAULT_ASSUMPTIONS },
    fairValue: 0
  }
];

const TERMINAL_METHODS = [
  {
    value: 'gordon',
    label: 'Gordon Growth',
    tooltip: 'We estimate the company\'s value after 5 years and bring it back to today\'s dollars using a long-term growth rate. This is a 5-year DCF model with terminal value calculated at Year 5.'
  },
  {
    value: 'multiple',
    label: 'Exit Multiple',
    tooltip: "We estimate the company's value after 5 years using industry price ratios (like P/E or EV/EBITDA). This is a 5-year DCF model with terminal value calculated at Year 5."
  }
];

function App() {
  const [scenarios, setScenarios] = useState<Scenario[]>(DEFAULT_SCENARIOS);
  const [currentPrice, setCurrentPrice] = useState<number>(45.00);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [activeScenario, setActiveScenario] = useState<string>('base');
  const [terminalMethod, setTerminalMethod] = useState<'gordon' | 'multiple'>('gordon');
  const [exitMultiple, setExitMultiple] = useState<number>(18);
  const [exitMultipleType, setExitMultipleType] = useState<'pe' | 'ebitda'>('pe');
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Calculate fair values for all scenarios
  useEffect(() => {
    const updatedScenarios = scenarios.map(scenario => {
      // If using multiple, override terminal value logic
      const result = calculateDCF({
        ...scenario.assumptions,
        terminalMethod,
        exitMultiple,
        exitMultipleType
      });
      return {
        ...scenario,
        fairValue: result.fairValuePerShare
      };
    });
    setScenarios(updatedScenarios);
  }, [scenarios, terminalMethod, exitMultiple, exitMultipleType]);

  const handleAssumptionChange = (scenarioId: string, field: keyof DCFAssumptions, value: number) => {
    setScenarios(prev => prev.map(scenario => {
      if (scenario.id === scenarioId) {
        return {
          ...scenario,
          assumptions: {
            ...scenario.assumptions,
            [field]: value
          }
        };
      }
      return scenario;
    }));
  };

  const addScenario = () => {
    const newScenario: Scenario = {
      id: `scenario-${Date.now()}`,
      name: `Scenario ${scenarios.length + 1}`,
      assumptions: { ...DEFAULT_ASSUMPTIONS },
      fairValue: 0
    };
    setScenarios(prev => [...prev, newScenario]);
  };

  const removeScenario = (scenarioId: string) => {
    if (scenarios.length > 1) {
      setScenarios(prev => prev.filter(s => s.id !== scenarioId));
    }
  };

  const updateScenarioName = (scenarioId: string, name: string) => {
    setScenarios(prev => prev.map(scenario => 
      scenario.id === scenarioId ? { ...scenario, name } : scenario
    ));
  };

  const activeScenarioData = scenarios.find(s => s.id === activeScenario);
  const dcfResult = activeScenarioData ? calculateDCF({
    ...activeScenarioData.assumptions,
    terminalMethod,
    exitMultiple,
    exitMultipleType
  }) : null;

  return (
    <div className="container">
      <header className="card" style={{ marginBottom: 0 }}>
        <h1>Stock Valuation Tool</h1>
        <div style={{ fontSize: '1.2em', color: '#555', marginTop: 4, marginBottom: 0 }}>
          Apple <span style={{ color: '#888', fontWeight: 600 }}>(AAPL)</span>
        </div>
      </header>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Scenarios</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
            <button 
              className="button secondary" 
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={{ fontSize: '14px', padding: '8px 16px' }}
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
            </button>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>+ Scenario</div>
              <button className="button" onClick={addScenario} style={{ fontSize: '18px', width: '40px', height: '40px', borderRadius: '50%', padding: '0' }}>
                +
              </button>
            </div>
          </div>
        </div>

        {/* Terminal Value Method Selector */}
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontWeight: 500 }}>Terminal Value Method:</span>
          <select
            value={terminalMethod}
            onChange={e => setTerminalMethod(e.target.value as 'gordon' | 'multiple')}
            style={{ fontSize: '1em', padding: '4px 12px', borderRadius: 4 }}
            onMouseEnter={() => setShowTooltip(terminalMethod)}
            onMouseLeave={() => setShowTooltip(null)}
          >
            {TERMINAL_METHODS.map(method => (
              <option key={method.value} value={method.value}>{method.label}</option>
            ))}
          </select>
          <span
            style={{ cursor: 'pointer', color: '#007bff', fontSize: '1.2em', marginLeft: 8 }}
            onMouseEnter={() => setShowTooltip(terminalMethod)}
            onMouseLeave={() => setShowTooltip(null)}
          >
            ℹ️
          </span>
          {showTooltip && (
            <div style={{
              position: 'absolute',
              background: '#fff',
              color: '#222',
              border: '1px solid #ccc',
              borderRadius: 6,
              padding: '10px 16px',
              top: 80,
              left: 320,
              zIndex: 1000,
              width: 320,
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
            }}>
              {TERMINAL_METHODS.find(m => m.value === terminalMethod)?.tooltip}
            </div>
          )}
        </div>
        {terminalMethod === 'multiple' && (
          <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>Type:</span>
            <select
              value={exitMultipleType}
              onChange={e => setExitMultipleType(e.target.value as 'pe' | 'ebitda')}
              style={{ fontSize: '1em', padding: '4px 12px', borderRadius: 4 }}
            >
              <option value="pe">P/E</option>
              <option value="ebitda">EV/EBITDA</option>
            </select>
            <span>Exit Multiple:</span>
            <input
              type="range"
              min={exitMultipleType === 'pe' ? 8 : 4}
              max={exitMultipleType === 'pe' ? 30 : 20}
              step={0.1}
              value={exitMultiple}
              onChange={e => setExitMultiple(Number(e.target.value))}
              style={{ width: 120 }}
            />
            <span style={{ minWidth: 40, textAlign: 'center' }}>{exitMultiple}x</span>
          </div>
        )}

        {/* Advanced Settings Explanation Chat Box */}
        {showAdvanced && (
          <div style={{
            background: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            <strong>💡 Advanced Settings in Stock Valuation:</strong><br/>
            <strong>Discount Rate:</strong> How much we reduce future profits to account for risk and time. Typically based on the company's cost of capital (WACC).<br/>
            <strong>CAPEX Intensity:</strong> Capital expenditures as a percentage of revenue. Higher values indicate more capital-intensive business.<br/>
            <strong>Working Capital Intensity:</strong> Working capital requirements as a percentage of revenue. Affects cash flow timing.<br/>
            <strong>Tax Rate:</strong> Effective corporate tax rate applied to operating profits.<br/>
            <strong>Long-term Growth Rate:</strong> Perpetual growth rate for terminal value calculation (Gordon Growth method). Should be conservative and typically below GDP growth.
          </div>
        )}

        <div className="grid">
          {scenarios.map((scenario) => (
            <div key={scenario.id} className="card" style={{ position: 'relative', minWidth: 320 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <input
                  type="text"
                  value={scenario.name}
                  onChange={(e) => updateScenarioName(scenario.id, e.target.value)}
                  style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    border: 'none', 
                    background: 'transparent',
                    width: '60%'
                  }}
                />
                {scenarios.length > 1 && (
                  <button 
                    className="button secondary" 
                    onClick={() => removeScenario(scenario.id)}
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                  >
                    Remove
                  </button>
                )}
              </div>

              <DCFInputs
                assumptions={scenario.assumptions}
                showAdvanced={showAdvanced}
                onChange={(field, value) => handleAssumptionChange(scenario.id, field, value)}
                consensus={CONSENSUS}
                historical={HISTORICAL}
              />

              <div style={{ 
                marginTop: '15px', 
                padding: '10px', 
                background: '#f8f9fa', 
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                <strong>Estimated Stock Price: {formatPrice(scenario.fairValue)}</strong>
                <br />
                <small style={{ color: '#666' }}>
                  {scenario.fairValue > currentPrice ? '↑' : '↓'} 
                  {Math.abs(((scenario.fairValue - currentPrice) / currentPrice) * 100).toFixed(1)}% vs current
                </small>
                <br />
                <button 
                  className="button secondary" 
                  onClick={() => {
                    const dcfResult = calculateDCF({
                      ...scenario.assumptions,
                      terminalMethod,
                      exitMultiple,
                      exitMultipleType
                    });
                    
                    // Format numbers with proper units
                    const formatWithUnit = (value: number) => {
                      if (value >= 1000000000) {
                        return `$${(value / 1000000000).toFixed(2)}B`;
                      } else if (value >= 1000000) {
                        return `$${(value / 1000000).toFixed(2)}M`;
                      } else if (value >= 1000) {
                        return `$${(value / 1000).toFixed(2)}K`;
                      } else {
                        return `$${value.toFixed(2)}`;
                      }
                    };
                    
                    // Calculate percentages
                    const totalValue = dcfResult.fairValue;
                    const pvFcfPercent = ((dcfResult.totalPresentValue / totalValue) * 100).toFixed(1);
                    const terminalPercent = ((dcfResult.presentValueTerminalValue / totalValue) * 100).toFixed(1);
                    
                    alert(`DCF Details for ${scenario.name}:\n\n` +
                          `Enterprise Value: ${formatWithUnit(dcfResult.fairValue)}\n` +
                          `Fair Value per Share: ${formatPrice(dcfResult.fairValuePerShare)}\n\n` +
                          `Present Value of FCF (5 years): ${formatWithUnit(dcfResult.totalPresentValue)} (${pvFcfPercent}% of total)\n` +
                          `Terminal Value (PV): ${formatWithUnit(dcfResult.presentValueTerminalValue)} (${terminalPercent}% of total)\n\n` +
                          `Assumptions:\n` +
                          `Revenue Growth CAGR: ${dcfResult.assumptions.revenueGrowthCAGR}%\n` +
                          `Operating Margin: ${dcfResult.assumptions.operatingProfitMargin}%\n` +
                          `Discount Rate: ${dcfResult.assumptions.discountRate}%\n` +
                          `Terminal Growth: ${dcfResult.assumptions.terminalGrowthRate}%`);
                  }}
                  style={{ marginTop: '8px', fontSize: '12px', padding: '4px 8px' }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>Stock Price Forecast</h2>
        {/* Prepare data for FanChart using actual scenarios */}
        {
          (() => {
            const monthsHist = 36; // 3 years of monthly data
            const yearsProj = 5;   // 5 years of annual projections
            const historical = Array.from({ length: monthsHist }, (_, i) => 30 + Math.sin(i / 6) * 2 + i * 0.2);
            const lastHist = historical[historical.length - 1];
            
            // Use actual scenarios from the app state
            const fanScenarios = scenarios.map(scenario => ({
              name: scenario.name,
              projection: Array.from({ length: yearsProj + 1 }, (_, i) => {
                if (i === 0) return lastHist; // Start from last historical point
                // Interpolate from last historical to scenario's fairValue
                const progress = i / yearsProj;
                return lastHist + (scenario.fairValue - lastHist) * progress;
              })
            }));
            
            return <FanChart historical={historical} scenarios={fanScenarios} yearsProj={yearsProj} />;
          })()
        }
      </div>
    </div>
  );
}

export default App; 