import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, Area } from 'recharts';
import { Scenario } from '../types';
import { formatPrice, calculateDCF } from '../utils/dcfCalculator';

interface PriceProjectionChartProps {
  scenarios: Scenario[];
  currentPrice: number;
}

const PriceProjectionChart: React.FC<PriceProjectionChartProps> = ({ scenarios, currentPrice }) => {
  // Generate historical data for the last 3 years (monthly data for better visualization)
  const currentYear = new Date().getFullYear();
  const historicalData: Array<{ date: string; price: number }> = [];
  let lastHistPrice = currentPrice;
  for (let y = currentYear - 3; y <= currentYear; y++) {
    for (let m = 1; m <= 12; m++) {
      if (y === currentYear && m > 6) break; // up to mid-year for demo
      const base = currentPrice * (0.7 + (y - (currentYear - 3)) * 0.1);
      const volatility = Math.sin((y * 12 + m) * 0.3) * 0.08 + Math.random() * 0.04;
      const price = base * (1 + volatility);
      historicalData.push({ 
        date: `${y}-${m.toString().padStart(2, '0')}`,
        price
      });
      if (y === currentYear && m === 6) lastHistPrice = price;
    }
  }

  // Projection years (5 years ahead)
  const projectionYears = Array.from({ length: 5 }, (_, i) => currentYear + i + 0.5); // e.g., 2024.5, 2025.5, ...

  // Build chart data: merge historical and projections
  const chartData: Array<any> = [...historicalData];
  // Add projection points for each year for each scenario
  projectionYears.forEach((yearIdx, i) => {
    const date = `${Math.floor(yearIdx)}-12`;
    const entry: any = { date };
    chartData.push(entry);
  });

  // For each scenario, calculate the projected price path
  scenarios.forEach((scenario, sIdx) => {
    // Get DCF calculations for this scenario
    const dcf = calculateDCF({ ...scenario.assumptions });
    // Start from last historical price
    let prevPrice = lastHistPrice;
    // For each projection year, interpolate price from lastHistPrice to scenario.fairValue
    for (let i = 0; i < 5; i++) {
      // Use DCF year-by-year present value as a proxy for price path
      const dcfYear = dcf.calculations[i];
      const price = dcfYear ? (dcfYear.presentValue / dcf.sharesOutstanding) : scenario.fairValue;
      // Find the corresponding entry in chartData
      const date = `${currentYear + i + 1}-12`;
      let entry = chartData.find(d => d.date === date);
      if (!entry) {
        entry = { date };
        chartData.push(entry);
      }
      entry[scenario.name] = price;
      prevPrice = price;
    }
  });

  // Calculate min/max for shading (fan area)
  chartData.forEach(row => {
    const scenarioPrices = scenarios.map(s => row[s.name]).filter(v => typeof v === 'number');
    if (scenarioPrices.length > 0) {
      row.fanMin = Math.min(...scenarioPrices);
      row.fanMax = Math.max(...scenarioPrices);
    } else {
      row.fanMin = null;
      row.fanMax = null;
    }
  });

  // Colors for different scenarios
  const colors = ['#ffc107', '#28a745', '#dc3545', '#007bff', '#6f42c1'];

  // Calculate Y-axis domain
  const allPrices = [
    ...historicalData.map(d => d.price),
    ...scenarios.flatMap(s => {
      const dcf = calculateDCF({ ...s.assumptions });
      return dcf.calculations.map(c => c.presentValue / dcf.sharesOutstanding);
    })
  ];
  const minY = Math.min(...allPrices) * 0.9;
  const maxY = Math.max(...allPrices) * 1.1;

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => {
              const [year, month] = value.split('-');
              return `${month}/${year.slice(-2)}`;
            }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            domain={[minY, maxY]}
            tickFormatter={formatPrice}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value: number) => [formatPrice(value), 'Price']}
            labelFormatter={(label) => {
              const [year, month] = label.split('-');
              return `${month}/${year}`;
            }}
          />
          <Legend />
          <ReferenceLine 
            x={historicalData[historicalData.length - 1]?.date} 
            stroke="#888" 
            strokeDasharray="3 3" 
            label={{ value: 'Now', position: 'top' }} 
          />
          {/* Historical price line */}
          <Line
            type="monotone"
            dataKey="price"
            stroke="#6c757d"
            strokeWidth={3}
            dot={false}
            name="Historical Price"
            isAnimationActive={false}
          />
          {/* Fan area shading */}
          <Area
            type="monotone"
            dataKey="fanMax"
            stroke={undefined}
            fill="#007bff"
            fillOpacity={0.10}
            isAnimationActive={false}
            connectNulls
          />
          <Area
            type="monotone"
            dataKey="fanMin"
            stroke={undefined}
            fill="#fff"
            fillOpacity={1}
            isAnimationActive={false}
            connectNulls
          />
          {/* Projection lines for each scenario */}
          {scenarios.map((scenario, idx) => (
            <Line
              key={scenario.id}
              type="monotone"
              dataKey={scenario.name}
              stroke={colors[idx % colors.length]}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
              name={`${scenario.name} Projection`}
              isAnimationActive={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      {/* Summary table */}
      <div style={{ marginTop: '30px' }}>
        <h4>Price Projections (FYE-Dec {currentYear + 5})</h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '25px',
          marginTop: '25px'
        }}>
          {scenarios.map((scenario, idx) => {
            const dcf = calculateDCF({ ...scenario.assumptions });
            const price = dcf.calculations[dcf.calculations.length - 1]?.presentValue / dcf.sharesOutstanding;
            const percentage = ((price - currentPrice) / currentPrice) * 100;
            const color = colors[idx % colors.length];
            return (
              <div key={scenario.id} style={{
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '8px',
                textAlign: 'center',
                border: `2px solid ${color}`,
                minHeight: '120px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ 
                  fontWeight: 'bold', 
                  color: color,
                  fontSize: '16px',
                  marginBottom: '12px'
                }}>
                  {scenario.name}
                </div>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold',
                  marginBottom: '12px'
                }}>
                  {formatPrice(price)}
                </div>
                <div style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold',
                  color: percentage > 0 ? '#28a745' : '#dc3545'
                }}>
                  {percentage > 0 ? '+' : ''}{percentage.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PriceProjectionChart; 