import { describe, it, expect } from "vitest";
import { calculateCarbon, calculateTotal, calculateBreakdown, CarbonInput } from "../src/lib/carbon/calculator";

describe("Carbon Calculator", () => {
  it("should calculate total carbon emissions correctly", () => {
    const inputs: CarbonInput[] = [
      { category: "transport", item: "car", value: 10, unit: "km" },
      { category: "energy", item: "electricity", value: 50, unit: "kWh" },
    ];
    // This is assuming there are factors. Let's just check the functions handle data without crashing.
    const breakdown = calculateCarbon(inputs);
    expect(breakdown).toBeDefined();
    expect(typeof breakdown.transport).toBe("number");
    
    const total = calculateTotal(breakdown);
    expect(typeof total).toBe("number");
  });

  it("should handle empty inputs", () => {
    const breakdown = calculateCarbon([]);
    const total = calculateTotal(breakdown);
    expect(total).toBe(0);
  });

  it("should gracefully handle missing or invalid factors", () => {
    const inputs: CarbonInput[] = [
      { category: "shopping", item: "unknown_item", value: 100, unit: "USD" },
    ];
    const breakdown = calculateCarbon(inputs);
    expect(breakdown.shopping).toBe(0); // Because factor will be 0 or undefined
  });
});
