// Test script to verify the new pricing calculations
// This simulates the calculation logic from the backend

// Karat factors
const KARAT_FACTORS = {
    '18K': 0.75,    // 75% pure gold
    '21K': 0.875,   // 87.5% pure gold  
    '22K': 0.917,   // 91.7% pure gold
    '24K': 1.0,     // 100% pure gold
    'WATCH': 0      // Watches don't use karat factors
};

// Helper function to safely parse floats from strings or return 0
const safeParseFloat = (val) => {
    if (val === null || val === undefined || val === '') return 0;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
};

// Replicate the calculateInventoryFields function
const calculateInventoryFields = (item, todaysGoldPrice, purchaseGoldPrice) => {
    const weight = safeParseFloat(item.weight);
    const goldCostPerGram = safeParseFloat(item.goldCostPerGram);
    const labourCostPerGram = safeParseFloat(item.labourCostPerGram);
    const markupRate = item.markupMultiplier ?? 1.15; // Default markup 1.15
    const maxDiscountAmount = item.maxDiscountAmount ?? 0;
    const discountRate = item.discountRate ?? 0.9; // Default discount rate 0.9 (10% discount)
    
    // Use item's goldCostPerGram as purchase price if no separate purchaseGoldPrice provided
    const goldPricePurchase = purchaseGoldPrice || goldCostPerGram;
    const goldPriceToday = todaysGoldPrice;
    
    // Get karat factor based on gold type
    const goldType = (item.goldType || '24K').toString().toUpperCase();
    const karatFactor = KARAT_FACTORS[goldType] ?? KARAT_FACTORS['24K'];
    
    // For labour costs - use existing values or defaults
    const labourMin = labourCostPerGram; // Min labour per gram
    const labourMax = item.listLabourPricePerGram ? safeParseFloat(item.listLabourPricePerGram) : labourCostPerGram; // Max labour per gram
    
    // Calculate dashboard gold price: MAX(purchase price, today's price) × markup × karat factor
    const dashboardGoldPrice = Math.max(goldPricePurchase, goldPriceToday) * markupRate * karatFactor;
    
    let cost, displayPrice, originalPrice, minimumSellingPrice;
    
    if (goldType === 'WATCH') {
        // Watch pricing algorithm
        const itemCost = item.unitCost || goldCostPerGram * weight; // Use unitCost if available, otherwise calculate
        
        cost = itemCost;
        displayPrice = cost * markupRate;
        originalPrice = cost * markupRate;
        minimumSellingPrice = originalPrice - 200;
        
    } else if (goldType === '18K' || goldType === '24K') {
        // Simple formula for 18K and 24K
        cost = (goldPricePurchase * karatFactor + labourCostPerGram) * weight;
        displayPrice = cost * markupRate;
        originalPrice = cost * markupRate;
        minimumSellingPrice = originalPrice * discountRate;
        
    } else if (goldType === '21K' || goldType === '22K') {
        // Complex formula for 21K and 22K
        
        // Cost = (Gold Price/g × adjustable karat + labour/g) × item gram
        cost = (goldPricePurchase * karatFactor + labourCostPerGram) * weight;
        
        // Display Price = Dashboard Gold rate × Item gram + labour (labour not multiplied by weight)
        const displayGoldRate = Math.max(goldPricePurchase, goldPriceToday) * markupRate * karatFactor;
        displayPrice = displayGoldRate * weight + labourMin;
        
        // Original Price = MAX of two options (with Max Labour)
        const option1Max = ((goldPricePurchase * karatFactor * markupRate) + labourMax) * weight;
        const option2Max = ((goldPriceToday * karatFactor * markupRate) + labourMax) * weight;
        originalPrice = Math.max(option1Max, option2Max);
        
        // Minimum Selling Price = MAX of two options (with Min Labour)  
        const option1Min = ((goldPricePurchase * karatFactor * markupRate) + labourMin) * weight;
        const option2Min = ((goldPriceToday * karatFactor * markupRate) + labourMin) * weight;
        minimumSellingPrice = Math.max(option1Min, option2Min);
        
    } else {
        // Default to 24K calculation for unknown gold types
        cost = (goldPricePurchase + labourCostPerGram) * weight;
        displayPrice = cost * markupRate;
        originalPrice = cost * markupRate;
        minimumSellingPrice = originalPrice * discountRate;
    }
    
    return {
        cost,
        displayPrice,
        originalPrice,
        minimumSellingPrice,
        dashboardGoldPrice,
        karatFactor,
        goldType
    };
};

// Test cases
const testCases = [
    {
        name: '18K Gold Ring',
        item: {
            goldType: '18K',
            weight: '10',
            goldCostPerGram: '2800',
            labourCostPerGram: '50',
            listLabourPricePerGram: '100',
            markupMultiplier: 1.15,
            discountRate: 0.9
        },
        todaysGoldPrice: 2850,
        purchaseGoldPrice: 2800
    },
    {
        name: '21K Gold Chain',
        item: {
            goldType: '21K',
            weight: '15',
            goldCostPerGram: '2800',
            labourCostPerGram: '60',
            listLabourPricePerGram: '120',
            markupMultiplier: 1.15,
            discountRate: 0.9
        },
        todaysGoldPrice: 2850,
        purchaseGoldPrice: 2800
    },
    {
        name: '24K Gold Pendant',
        item: {
            goldType: '24K',
            weight: '8',
            goldCostPerGram: '2800',
            labourCostPerGram: '40',
            listLabourPricePerGram: '80',
            markupMultiplier: 1.15,
            discountRate: 0.9
        },
        todaysGoldPrice: 2850,
        purchaseGoldPrice: 2800
    },
    {
        name: 'Watch',
        item: {
            goldType: 'WATCH',
            weight: '50',
            goldCostPerGram: '100', // This becomes item cost for watches
            labourCostPerGram: '0',
            markupMultiplier: 1.15,
            unitCost: 5000 // Direct watch cost
        },
        todaysGoldPrice: 2850,
        purchaseGoldPrice: 2800
    }
];

console.log('=== PRICING ALGORITHM TEST RESULTS ===\n');

testCases.forEach(testCase => {
    console.log(`🧪 Testing: ${testCase.name}`);
    console.log('='.repeat(50));
    
    const result = calculateInventoryFields(
        testCase.item, 
        testCase.todaysGoldPrice, 
        testCase.purchaseGoldPrice
    );
    
    console.log(`Gold Type: ${result.goldType}`);
    console.log(`Karat Factor: ${result.karatFactor}`);
    console.log(`Weight: ${testCase.item.weight}g`);
    console.log(`Purchase Gold Price: HK$${testCase.purchaseGoldPrice}/g`);
    console.log(`Today's Gold Price: HK$${testCase.todaysGoldPrice}/g`);
    console.log(`Labour Cost: HK$${testCase.item.labourCostPerGram}/g`);
    console.log(`Markup Rate: ${testCase.item.markupMultiplier}`);
    console.log('');
    console.log('📊 CALCULATED PRICES:');
    console.log(`💰 Cost: HK$${result.cost.toFixed(2)}`);
    console.log(`📺 Display Price: HK$${result.displayPrice.toFixed(2)}`);
    console.log(`🏆 Original Price: HK$${result.originalPrice.toFixed(2)}`);
    console.log(`🔻 Minimum Selling Price: HK$${result.minimumSellingPrice.toFixed(2)}`);
    console.log(`📈 Dashboard Gold Price: HK$${result.dashboardGoldPrice.toFixed(2)}`);
    console.log('');
    console.log('─'.repeat(50));
    console.log('');
});

console.log('✅ All test calculations completed successfully!');