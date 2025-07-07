# DCF Valuation Tool

A professional Discounted Cash Flow (DCF) valuation tool with football field analysis and price projection charts.

## Features

### Core DCF Functionality
- **5-year forecast period** with terminal value calculation
- **Two interface modes**:
  - **Basic Mode**: Only revenue growth CAGR and operating profit margin
  - **Advanced Mode**: All assumptions including discount rate, CAPEX intensity, working capital, tax rate, and terminal growth rate
- **Fair value calculation** targeting end of FY25

### Scenario Management
- **Multiple scenarios**: Base Case, Bull Case, Bear Case (customizable)
- **Add/Remove scenarios**: Dynamic scenario creation and deletion
- **Custom scenario names**: Editable scenario labels
- **Real-time calculations**: Instant fair value updates

### Visualizations
- **Football Field Analysis**: Visual comparison of scenario valuations vs current price
- **Price Projection Chart**: Historical prices (3 years) + future projections in triangle format
- **Interactive charts**: Hover tooltips and responsive design

### Example Data
The tool comes pre-loaded with example scenarios:
- **Base Case**: 8% revenue growth, 15% operating margin, 10% discount rate
- **Bull Case**: 12% revenue growth, 18% operating margin, 9% discount rate  
- **Bear Case**: 4% revenue growth, 12% operating margin, 11% discount rate

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## Usage

### Basic Mode
1. Set the current stock price
2. Adjust the two basic assumptions:
   - Revenue Growth CAGR (Year 1-5)
   - Operating Profit Margin
3. View fair value calculations and visualizations

### Advanced Mode
1. Toggle "Show Advanced Assumptions"
2. Adjust all DCF parameters:
   - Revenue Growth CAGR
   - Operating Profit Margin
   - Discount Rate
   - CAPEX Intensity (% of Revenue)
   - Working Capital Intensity (% of Revenue)
   - Tax Rate
   - Terminal Growth Rate

### Scenario Management
1. **Add scenarios**: Click "Add Scenario" to create new valuation scenarios
2. **Rename scenarios**: Click on scenario names to edit them
3. **Remove scenarios**: Click "Remove" button (minimum 1 scenario required)
4. **Compare results**: View all scenarios in the football field and projection charts

### Visualizations
- **Football Field**: Shows relative positioning of all scenario valuations compared to current price
- **Price Projection**: Displays historical price trend and future projections for each scenario
- **Summary Tables**: Quick comparison of fair values and percentage changes

## Technical Details

### DCF Calculation
- **Forecast Period**: 5 years with explicit cash flow projections
- **Terminal Value**: Gordon Growth Model with perpetual growth
- **Discount Rate**: Applied to both forecast period and terminal value
- **Free Cash Flow**: NOPAT + Depreciation - CAPEX - Working Capital Changes

### Assumptions
- **Base Revenue**: $1B starting revenue
- **Base Depreciation**: $50M (scales with revenue)
- **Shares Outstanding**: 100M shares
- **Tax Treatment**: Applied to operating profit

### Technologies Used
- **React 18** with TypeScript
- **Recharts** for data visualization
- **CSS Grid/Flexbox** for responsive layout
- **Modern ES6+** JavaScript features

## File Structure

```
src/
├── components/
│   ├── DCFInputs.tsx          # Input form component
│   ├── FootballFieldChart.tsx # Football field visualization
│   └── PriceProjectionChart.tsx # Price projection chart
├── utils/
│   └── dcfCalculator.ts       # DCF calculation engine
├── types.ts                   # TypeScript interfaces
├── App.tsx                    # Main application component
├── index.tsx                  # React entry point
└── index.css                  # Global styles
```

## Customization

### Adding New Assumptions
1. Update the `DCFAssumptions` interface in `types.ts`
2. Add input fields in `DCFInputs.tsx`
3. Update the calculation logic in `dcfCalculator.ts`

### Modifying Visualizations
- **Football Field**: Edit `FootballFieldChart.tsx` for layout and styling
- **Price Projection**: Modify `PriceProjectionChart.tsx` for chart behavior
- **Colors**: Update color schemes in both chart components

### Changing Default Values
- Edit `DEFAULT_ASSUMPTIONS` in `App.tsx`
- Modify `DEFAULT_SCENARIOS` for different starting scenarios
- Update base company data in `dcfCalculator.ts`

## Example Use Case

This tool is perfect for:
- **Investment analysis** and due diligence
- **Client presentations** with professional visualizations
- **Scenario planning** and sensitivity analysis
- **Educational purposes** for DCF methodology

The pre-loaded example demonstrates a company with $1B revenue, showing how different growth and margin assumptions affect valuation across bear, base, and bull scenarios. 