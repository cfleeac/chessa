// Test script to verify gold pricing calculations
const state = {
  goldPricePurchase: 2800,
  goldPriceToday: 2850,
  itemWeight: 10,
  laborMin: 50,
  laborMax: 100,
  markupRate: 1.15,
  discountRate: 0.9,
  itemCost: 5000
};

const karatFactors = {
  '18K': 0.75,
  '21K': 0.875,
  '22K': 0.917,
  '24K': 1.0
};

console.log('=== Testing Gold Pricing Calculations ===\n');

// Dashboard Price
const dashboardPrice = Math.max(state.goldPricePurchase, state.goldPriceToday) * state.markupRate;
console.log(`Dashboard Gold Price: $${dashboardPrice.toFixed(2)}`);
console.log(`  Formula: max(${state.goldPricePurchase}, ${state.goldPriceToday}) × ${state.markupRate}`);
console.log(`  = ${Math.max(state.goldPricePurchase, state.goldPriceToday)} × ${state.markupRate} = ${dashboardPrice.toFixed(2)}\n`);

// Test 21K calculations (most complex)
console.log('=== 21K Gold Calculations ===');
const factor21K = karatFactors['21K'];

// Cost
const cost21K = (state.goldPricePurchase * factor21K + state.laborMin) * state.itemWeight;
console.log(`Cost: $${cost21K.toFixed(2)}`);
console.log(`  Formula: (goldPrice × karat + laborMin) × weight`);
console.log(`  = (${state.goldPricePurchase} × ${factor21K} + ${state.laborMin}) × ${state.itemWeight}`);
console.log(`  = (${(state.goldPricePurchase * factor21K).toFixed(2)} + ${state.laborMin}) × ${state.itemWeight}`);
console.log(`  = ${(state.goldPricePurchase * factor21K + state.laborMin).toFixed(2)} × ${state.itemWeight} = ${cost21K.toFixed(2)}\n`);

// Display Price (FIXED: using laborMax and multiplied by weight)
const displayGoldRate21K = dashboardPrice * factor21K;
const displayPrice21K = (displayGoldRate21K + state.laborMax) * state.itemWeight; // Fixed: using laborMax multiplied by weight
console.log(`Display Price: $${displayPrice21K.toFixed(2)}`);
console.log(`  Formula: (dashboardPrice × karat + laborMax) × weight`);
console.log(`  Display Gold Rate = ${dashboardPrice.toFixed(2)} × ${factor21K} = ${displayGoldRate21K.toFixed(2)}`);
console.log(`  = (${displayGoldRate21K.toFixed(2)} + ${state.laborMax}) × ${state.itemWeight}`);
console.log(`  = ${(displayGoldRate21K + state.laborMax).toFixed(2)} × ${state.itemWeight} = ${displayPrice21K.toFixed(2)}\n`);

// Original Price
const option1Max = ((state.goldPricePurchase * factor21K * state.markupRate) + state.laborMax) * state.itemWeight;
const option2Max = ((state.goldPriceToday * factor21K * state.markupRate) + state.laborMax) * state.itemWeight;
const originalPrice21K = Math.max(option1Max, option2Max);
console.log(`Original Price: $${originalPrice21K.toFixed(2)}`);
console.log(`  Formula: MAX(purchase-based, today-based)`);
console.log(`  Purchase-based: ((${state.goldPricePurchase} × ${factor21K} × ${state.markupRate}) + ${state.laborMax}) × ${state.itemWeight}`);
console.log(`    = ((${(state.goldPricePurchase * factor21K).toFixed(2)} × ${state.markupRate}) + ${state.laborMax}) × ${state.itemWeight}`);
console.log(`    = (${(state.goldPricePurchase * factor21K * state.markupRate).toFixed(2)} + ${state.laborMax}) × ${state.itemWeight}`);
console.log(`    = ${((state.goldPricePurchase * factor21K * state.markupRate) + state.laborMax).toFixed(2)} × ${state.itemWeight} = ${option1Max.toFixed(2)}`);
console.log(`  Today-based: ((${state.goldPriceToday} × ${factor21K} × ${state.markupRate}) + ${state.laborMax}) × ${state.itemWeight}`);
console.log(`    = ${option2Max.toFixed(2)}`);
console.log(`  MAX(${option1Max.toFixed(2)}, ${option2Max.toFixed(2)}) = ${originalPrice21K.toFixed(2)}\n`);

// Minimum Selling Price
const option1Min = ((state.goldPricePurchase * factor21K * state.markupRate) + state.laborMin) * state.itemWeight;
const option2Min = ((state.goldPriceToday * factor21K * state.markupRate) + state.laborMin) * state.itemWeight;
const minSellingPrice21K = Math.max(option1Min, option2Min);
console.log(`Minimum Selling Price: $${minSellingPrice21K.toFixed(2)}`);
console.log(`  Formula: MAX(purchase-based, today-based) with Min Labour`);
console.log(`  Purchase-based: ((${state.goldPricePurchase} × ${factor21K} × ${state.markupRate}) + ${state.laborMin}) × ${state.itemWeight}`);
console.log(`    = ${option1Min.toFixed(2)}`);
console.log(`  Today-based: ((${state.goldPriceToday} × ${factor21K} × ${state.markupRate}) + ${state.laborMin}) × ${state.itemWeight}`);
console.log(`    = ${option2Min.toFixed(2)}`);
console.log(`  MAX(${option1Min.toFixed(2)}, ${option2Min.toFixed(2)}) = ${minSellingPrice21K.toFixed(2)}\n`);

// Compare old vs new display price calculation
console.log('=== Display Price Comparison (21K) ===');
const oldDisplayPrice21K = displayGoldRate21K * state.itemWeight + state.laborMin; // Old: labour not multiplied by weight and used laborMin
console.log(`OLD (incorrect): ${displayGoldRate21K.toFixed(2)} × ${state.itemWeight} + ${state.laborMin} = $${oldDisplayPrice21K.toFixed(2)}`);
console.log(`NEW (correct):   (${displayGoldRate21K.toFixed(2)} + ${state.laborMax}) × ${state.itemWeight} = $${displayPrice21K.toFixed(2)}`);
console.log(`Difference: $${(displayPrice21K - oldDisplayPrice21K).toFixed(2)}`);