# Stock Valuation Tool

A user-friendly DCF (Discounted Cash Flow) analysis tool for retail investors, featuring interactive scenario analysis and professional fan charts.

## Features

- **Interactive DCF Modeling**: Create multiple scenarios with different assumptions
- **Professional Fan Charts**: Visualize stock price projections with historical data
- **User-Friendly Interface**: Designed specifically for retail investors with helpful tooltips
- **Advanced Settings**: Toggle between basic and advanced DCF parameters
- **Real-time Calculations**: See fair value estimates update as you adjust assumptions
- **Scenario Management**: Add, remove, and compare multiple valuation scenarios
- **Detailed Breakdowns**: View comprehensive DCF calculations with percentages

## Technology

- **React + TypeScript** - Modern, type-safe frontend
- **Plotly.js** - Interactive, professional charts
- **CSS Grid/Flexbox** - Responsive, modern UI
- **Create React App** - Zero-configuration build setup

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jpdibo/stock-valuation-tool.git
   cd stock-valuation-tool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Basic Workflow

1. **Adjust Basic Assumptions**
   - Annual Sales Growth: Expected yearly revenue growth
   - Profit Margin: Operating profit as percentage of sales

2. **Create Scenarios**
   - Click "+ Scenario" to add new valuation scenarios
   - Rename scenarios to reflect different assumptions (e.g., "Bull Case", "Bear Case")

3. **Advanced Settings** (Optional)
   - Toggle "Show Advanced Settings" for detailed parameters
   - Hover over "?" icons for helpful explanations

4. **View Results**
   - See real-time fair value estimates for each scenario
   - Click "View Details" for comprehensive DCF breakdowns
   - Analyze the fan chart showing price projections

### Understanding the Charts

- **Historical Line**: Past stock price (monthly data)
- **Projection Lines**: Each scenario's price target
- **Fan Shading**: Range between highest and lowest scenarios
- **Bullets & Numbers**: Final price targets with exact values

### Key Assumptions Explained

- **Discount Rate**: How much future profits are reduced for risk/time
- **Capital Spending**: Investment in equipment/facilities as % of sales
- **Working Capital**: Cash needed for operations as % of sales
- **Tax Rate**: Corporate tax rate on profits
- **Long-term Growth**: Perpetual growth rate (should be conservative)

## Project Structure

```
src/
├── components/
│   ├── DCFInputs.tsx      # Input fields with tooltips
│   ├── FanChart.tsx       # Interactive price projection chart
│   └── FootballFieldChart.tsx
├── utils/
│   └── dcfCalculator.ts   # DCF calculation logic
├── types.ts               # TypeScript interfaces
└── App.tsx               # Main application component
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- Built for retail investors who want professional-grade valuation tools
- Inspired by institutional DCF models but designed for accessibility
- Uses industry-standard DCF methodology with user-friendly interface 
