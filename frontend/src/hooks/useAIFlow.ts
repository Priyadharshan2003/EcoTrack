import { useState } from "react";
import { useCarbonStore } from "@/store/useCarbonStore";
import { useCarbonCalculation } from "@/hooks/useCarbonCalculation";

export type FlowStep = "intro" | "commute" | "food" | "additional" | "summary";

export function useAIFlow() {
  const [step, setStep] = useState<FlowStep>("intro");
  const [answers, setAnswers] = useState({
    commute: "",
    food: "",
    additional: ""
  });
  const [calculatedEmissions, setCalculatedEmissions] = useState(0);
  const { setEmissions, totalEmissions, addCredits } = useCarbonStore();
  const { calculateTransportEmissions, calculateDietEmissions } = useCarbonCalculation();

  const handleNext = (key: keyof typeof answers, value: string, nextStep: FlowStep) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setStep(nextStep);
  };

  const handleFinish = () => {
    let dailyEmissions = 0;
    
    if (answers.commute === "Car") dailyEmissions += calculateTransportEmissions("car_petrol", 15);
    else if (answers.commute === "Metro") dailyEmissions += calculateTransportEmissions("metro", 15);
    
    if (answers.food === "Ordered") dailyEmissions += calculateDietEmissions("meat_heavy");
    else if (answers.food === "Home-cooked") dailyEmissions += calculateDietEmissions("vegetarian");

    if (answers.additional === "Cab") dailyEmissions += calculateTransportEmissions("car_petrol", 10);
    else if (answers.additional === "Flight") dailyEmissions += calculateTransportEmissions("flight_short_haul", 500);

    const roundedEmissions = parseFloat(dailyEmissions.toFixed(2));
    setCalculatedEmissions(roundedEmissions);
    
    // Update store
    setEmissions(totalEmissions + roundedEmissions);
    addCredits(10);
    
    setStep("summary");
  };

  const resetFlow = () => {
    setStep("intro");
  };

  return {
    step,
    setStep,
    answers,
    setAnswers,
    calculatedEmissions,
    handleNext,
    handleFinish,
    resetFlow
  };
}
