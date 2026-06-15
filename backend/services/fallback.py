def get_fallback_insight(activities: list, total_emissions: float) -> str:
    """Rule-based fallback engine if the Gemini API is unreachable."""
    
    # Simple rule-based logic
    has_cab = any(a.get("type") == "cab_travel" for a in activities)
    has_food = any(a.get("type") == "food_order" for a in activities)
    has_green = any(a.get("type") in ["walk", "bike"] for a in activities)
    
    if has_cab and total_emissions > 5.0:
        return "You've been taking a lot of cabs lately! Try switching just one ride to public transit or a bike to significantly cut your footprint."
    elif has_food:
        return "Food delivery adds up in packaging and transport. Cooking one extra meal at home this week can save up to 2.5 kg of CO₂."
    elif has_green:
        return "Great job choosing green transport! Keep walking or biking to maintain that zero-emission streak."
    else:
        return f"Your recent footprint is {total_emissions} kg CO₂. Small daily changes make a massive difference over time."
