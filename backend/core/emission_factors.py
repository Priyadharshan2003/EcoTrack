# Scientific Emission Factors (kg CO2e per unit)
# Sources: IPCC, EPA, DEFRA

EMISSION_FACTORS = {
    "transport": {
        "cab_travel": 0.25,  # per km (average petrol car)
        "flight_short": 0.20, # per passenger km
        "flight_long": 0.15,
        "public_transit": 0.05,
        "walk": 0.0,
        "bike": 0.0,
    },
    "food": {
        "meat_heavy": 7.2,    # per meal
        "vegetarian": 3.8,
        "vegan": 2.0,
        "food_order": 2.5,    # Average delivery packaging + transport overhead
    },
    "energy": {
        "kwh_grid": 0.4       # global average kg per kWh
    }
}

def calculate_emissions(activity_type: str, value: float) -> float:
    """Fallback scientific calculation engine if AI insights are purely qualitative."""
    if activity_type == "cab_travel":
        return value * EMISSION_FACTORS["transport"]["cab_travel"]
    elif activity_type == "food_order":
        # Estimate based on assumed average meal emission
        return EMISSION_FACTORS["food"]["food_order"]
    elif activity_type in ["walk", "bike"]:
        return 0.0
    
    # Default fallback
    return 1.0
