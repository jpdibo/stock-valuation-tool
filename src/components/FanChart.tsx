// @ts-ignore
import Plot from 'react-plotly.js';
import React from 'react';

interface Scenario {
  name: string;
  projection: number[];
}

interface FanChartProps {
  historical: number[];
  scenarios: Scenario[];
  yearsProj: number;
}

const FanChart: React.FC<FanChartProps> = ({ historical, scenarios, yearsProj }) => {
  const xHist = Array.from({ length: historical.length }, (_, i) => i);
  const xProj = Array.from({ length: yearsProj + 1 }, (_, i) => xHist.length - 1 + i);

  // Fan shading
  const projMatrix = scenarios.map(s => s.projection);
  const fanMin = projMatrix[0].map((_, i) => Math.min(...projMatrix.map(row => row[i])));
  const fanMax = projMatrix[0].map((_, i) => Math.max(...projMatrix.map(row => row[i])));

  const traces: any[] = [
    {
      x: [...xHist, xProj[1]],
      y: [...historical, scenarios[0].projection[0]],
      mode: 'lines',
      name: 'Past Stock Price',
      line: { color: 'gray', width: 3 }
    },
    // Fan shading
    {
      x: [...xProj, ...xProj.slice().reverse()],
      y: [...fanMax, ...fanMin.slice().reverse()],
      fill: 'toself',
      fillcolor: 'rgba(0,123,255,0.15)',
      line: { color: 'rgba(0,0,0,0)' },
      hoverinfo: 'skip',
      name: 'Possible Price Range',
      type: 'scatter'
    },
    // Scenario lines with bullets at the end
    ...scenarios.map((s, idx) => ({
      x: xProj,
      y: s.projection,
      mode: 'lines+markers',
      name: s.name,
      line: { width: 2, dash: 'dash' },
      marker: { 
        size: [0, 0, 0, 0, 0, 8], // Only show marker at the end (last point)
        color: ['#ffc107', '#28a745', '#dc3545', '#007bff', '#6f42c1'][idx % 5]
      }
    }))
  ];

  // Add text annotations for the fair values at the end of each line
  const annotations = scenarios.map((s, idx) => ({
    x: xProj[xProj.length - 1],
    y: s.projection[s.projection.length - 1],
    text: `$${s.projection[s.projection.length - 1].toFixed(2)}`,
    showarrow: false,
    xanchor: 'left',
    yanchor: 'middle',
    xshift: 10,
    font: { size: 12, color: ['#ffc107', '#28a745', '#dc3545', '#007bff', '#6f42c1'][idx % 5] }
  }));

  return (
    <Plot
      data={traces}
      layout={{
        title: 'Stock Price Forecast',
        xaxis: {
          title: 'Date',
          showgrid: true,
          tickvals: [0, 12, 24, 36, 48, 60],
          ticktext: ['3y ago', '2y ago', '1y ago', 'Now', '+2y', '+3y']
        },
        yaxis: { title: 'Price', showgrid: true },
        legend: { x: 0.01, y: 0.99 },
        hovermode: 'x unified',
        autosize: true,
        annotations
      }}
      style={{ width: '100%', height: '500px' }}
      useResizeHandler
      config={{ responsive: true }}
    />
  );
};

export default FanChart; 