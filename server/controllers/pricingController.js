exports.estimatePrice = async (req, res) => {
    try {
        const { distance, weight, cropType } = req.body;

        // Basic validation
        if (!distance || !weight) {
            return res.status(400).json({ error: "Distance and weight are required" });
        }

        // AI Pricing Mock Logic
        // Base rate: $0.50 per kg per km
        // Bulky crops (like sugarcane) cost 1.2x more
        // Market dynamic modifier (randomly fluctuates between 0.9 and 1.1)

        const baseRatePerKgPerKm = 0.05; // Using a realistic smaller number for mock (e.g., $0.05 per kg per km)
        let bulkyModifier = 1.0;

        const bulkyCrops = ["sugarcane", "cotton", "wheat"];
        if (cropType && bulkyCrops.includes(cropType.toLowerCase())) {
            bulkyModifier = 1.2;
        }

        const dynamicDemandModifier = Math.random() * (1.1 - 0.9) + 0.9;

        const estimatedPrice = (distance * weight * baseRatePerKgPerKm * bulkyModifier * dynamicDemandModifier).toFixed(2);

        res.status(200).json({
            estimatedPrice: parseFloat(estimatedPrice),
            currency: "USD",
            breakdown: {
                baseRate: baseRatePerKgPerKm,
                bulkyModifier,
                dynamicDemandModifier: dynamicDemandModifier.toFixed(2)
            }
        });

    } catch (error) {
        console.error("Error in AI pricing estimation:", error);
        res.status(500).json({ error: "Server error during price estimation" });
    }
};
