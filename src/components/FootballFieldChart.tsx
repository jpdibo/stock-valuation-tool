import React from 'react';
import { Scenario } from '../types';
import { formatPrice } from '../utils/dcfCalculator';

interface FootballFieldChartProps {
  scenarios: Scenario[];
  currentPrice: number;
}

const FootballFieldChart: React.FC<FootballFieldChartProps> = ({ scenarios, currentPrice }) => {
  // Sort scenarios by fair value
  const sortedScenarios = [...scenarios].sort((a, b) => a.fairValue - b.fairValue);
  
  // Find min and max values for scaling
  const minValue = Math.min(currentPrice, ...scenarios.map(s => s.fairValue));
  const maxValue = Math.max(currentPrice, ...scenarios.map(s => s.fairValue));
  const range = maxValue - minValue;

  const getPosition = (value: number) => {
    if (range === 0) return 50;
    return ((value - minValue) / range) * 100;
  };

  const getColor = (scenarioName: string) => {
    switch (scenarioName.toLowerCase()) {
      case 'bear case':
        return '#dc3545';
      case 'base case':
        return '#ffc107';
      case 'bull case':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  const calculateUpsideDownside = (targetPrice: number) => {
    const percentage = ((targetPrice - currentPrice) / currentPrice) * 100;
    return percentage > 0 ? `+${percentage.toFixed(1)}%` : `${percentage.toFixed(1)}%`;
  };

  return (
    <div style={{ margin: '20px 0' }}>
      {/* Football field line */}
      <div style={{
        position: 'relative',
        height: '120px',
        background: 'linear-gradient(90deg, #dc3545 0%, #ffc107 50%, #28a745 100%)',
        borderRadius: '8px',
        marginBottom: '80px'
      }}>
        {/* Price line */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '0',
          right: '0',
          height: '2px',
          background: '#333',
          transform: 'translateY(-50%)'
        }} />
        
        {/* Current price marker */}
        <div style={{
          position: 'absolute',
          left: `${getPosition(currentPrice)}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 20
        }}>
          <div style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: '#333',
            border: '3px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }} />
          <div style={{
            position: 'absolute',
            top: '25px',
            left: '-40px',
            width: '80px',
            textAlign: 'center',
            background: '#333',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            Current
          </div>
          <div style={{
            position: 'absolute',
            top: '50px',
            left: '-40px',
            width: '80px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {formatPrice(currentPrice)}
          </div>
        </div>

        {/* Scenario markers */}
        {sortedScenarios.map((scenario, index) => (
          <div
            key={scenario.id}
            style={{
              position: 'absolute',
              left: `${getPosition(scenario.fairValue)}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 20
            }}
          >
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: getColor(scenario.name),
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }} />
            <div style={{
              position: 'absolute',
              top: '25px',
              left: '-50px',
              width: '100px',
              textAlign: 'center',
              background: getColor(scenario.name),
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {scenario.name}
            </div>
            <div style={{
              position: 'absolute',
              top: '50px',
              left: '-50px',
              width: '100px',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {formatPrice(scenario.fairValue)}
            </div>
            <div style={{
              position: 'absolute',
              top: '75px',
              left: '-50px',
              width: '100px',
              textAlign: 'center',
              fontSize: '12px',
              color: scenario.fairValue > currentPrice ? '#28a745' : '#dc3545',
              fontWeight: 'bold'
            }}>
              {calculateUpsideDownside(scenario.fairValue)}
            </div>
          </div>
        ))}
      </div>

      {/* Summary table */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginTop: '20px'
      }}>
        {sortedScenarios.map(scenario => (
          <div key={scenario.id} style={{
            padding: '15px',
            background: '#f8f9fa',
            borderRadius: '8px',
            textAlign: 'center',
            border: `2px solid ${getColor(scenario.name)}`
          }}>
            <div style={{ fontWeight: 'bold', color: getColor(scenario.name), marginBottom: '8px' }}>
              {scenario.name}
            </div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
              {formatPrice(scenario.fairValue)}
            </div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 'bold',
              color: scenario.fairValue > currentPrice ? '#28a745' : '#dc3545'
            }}>
              {calculateUpsideDownside(scenario.fairValue)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FootballFieldChart; 