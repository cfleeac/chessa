# Gold Pricing Algorithm Calculator

An interactive web-based calculator for validating gold and watch pricing algorithms. Built with modern JavaScript and Svelte for optimal performance and ease of use.

## Quick Start

Simply open `pricing-calculator.html` in any modern web browser. No installation or build process required!

```bash
# Open directly in browser
open pricing-calculator.html
```

## Features

- **Real-time Calculations**: All prices update instantly as you modify inputs
- **Multiple Product Types**: Supports 18K, 21K, 22K, 24K gold and watches
- **Formula Display**: Toggle to see step-by-step calculations
- **Test Scenarios**: Pre-loaded scenarios for validation
- **Export Functionality**: Download results as JSON for analysis
- **Responsive Design**: Works on desktop, tablet, and mobile

## Pricing Algorithms

### Dashboard Gold Price
```
Dashboard Price = Max(Purchase Price, Today's Price) × Markup Rate
```
This price is displayed prominently and used in some calculations.

### 18K & 24K Gold (Simple Formula)
```
Cost = (Gold Price/g × Karat Factor + Labor/g) × Item Weight
Display Price = Cost × Markup Rate
Original Price = Cost × Markup Rate
Minimum Selling Price = Original Price × Discount Rate
```

### 21K & 22K Gold (Complex Formula)
These use a more sophisticated pricing model:

```
Cost = (Gold Price/g × Karat Factor + Labor/g) × Item Weight
Display Price = Dashboard Gold Rate × Item Weight + Labor

For Original Price (picks highest):
  Option 1 = ((Purchase Price × Karat × Markup) + Max Labor) × Weight
  Option 2 = ((Today's Price × Karat × Markup) + Max Labor) × Weight

For Minimum Selling Price (picks highest):
  Option 1 = ((Purchase Price × Karat × Markup) + Min Labor) × Weight
  Option 2 = ((Today's Price × Karat × Markup) + Min Labor) × Weight
```

### Watches
```
Cost = Item Cost (direct input)
Display Price = Cost × Markup Rate
Original Price = Cost × Markup Rate
Minimum Selling Price = Original Price - 200
```

## Karat Factors

- **18K**: 0.750 (75% pure gold)
- **21K**: 0.875 (87.5% pure gold)
- **22K**: 0.917 (91.7% pure gold)
- **24K**: 1.000 (100% pure gold)

## Input Parameters

### Gold Prices
- **24K Gold Price (Purchase Date)**: Historical price when item was purchased
- **24K Gold Price (Today)**: Current market price

### Item Details
- **Item Weight**: Weight in grams

### Labor Costs
- **Min Labor**: Minimum labor cost per gram
- **Max Labor**: Maximum labor cost per gram (used in 21K/22K calculations)

### Pricing Factors
- **Markup Rate**: Multiplier for profit margin (e.g., 1.15 = 15% markup)
- **Discount Rate**: Maximum discount allowed (e.g., 0.9 = 10% discount)

### Watch Specific
- **Item Cost**: Direct cost for watches

## Test Scenarios

The calculator includes pre-configured test scenarios:

1. **Scenario 1**: Standard market conditions
2. **Scenario 2**: High gold prices with lower weight
3. **Scenario 3**: Low gold prices with higher weight

Load any scenario to quickly test different market conditions.

## Validation

Use the included `test-scenarios.json` file for comprehensive testing:

```javascript
// Each scenario includes:
{
  "inputs": { /* all input parameters */ },
  "expectedResults": { /* expected calculations */ }
}
```

### Validation Tips

1. **Toggle Formulas**: Click "Toggle Formulas" to see detailed calculations
2. **Compare Results**: Export results and compare with expected values
3. **Test Edge Cases**: Try extreme values to ensure algorithm robustness
4. **Check Rounding**: All monetary values should round to 2 decimal places

## Export Format

Results can be exported as JSON with the following structure:

```json
{
  "inputs": { /* all current input values */ },
  "dashboardPrice": 3277.50,
  "results": {
    "18K": { "cost", "displayPrice", "originalPrice", "minSellingPrice" },
    "21K": { /* same fields */ },
    "22K": { /* same fields */ },
    "24K": { /* same fields */ },
    "Watch": { /* same fields */ }
  }
}
```

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Technology Stack

- **Framework**: Svelte 4 (via CDN)
- **Styling**: Modern CSS with Grid and Flexbox
- **Language**: Vanilla JavaScript ES6+
- **No Build Process**: Runs directly in browser

## Troubleshooting

### Calculator not updating?
- Ensure JavaScript is enabled in your browser
- Check browser console for any errors
- Try refreshing the page

### Export not working?
- Check browser permissions for downloads
- Try a different browser if issues persist

### Formulas seem incorrect?
- Verify karat factors are correct
- Check that labor costs are per gram, not total
- Ensure markup/discount rates are in decimal format (1.15 not 115%)

## Algorithm Verification Checklist

- [ ] Dashboard price uses highest gold price
- [ ] 18K/24K use simple formula with discount rate
- [ ] 21K/22K pick highest value for both original and min prices
- [ ] Watch minimum price subtracts fixed $200
- [ ] All calculations update in real-time
- [ ] Export includes all input and output values
- [ ] Test scenarios produce expected results

## License

Internal use only. Not for distribution.