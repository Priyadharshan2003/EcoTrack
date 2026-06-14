/**
 * Adjusts the confidence score of the detection engine based on user feedback.
 * @param currentConfidence The original confidence score (0 to 1).
 * @param isConfirmed Whether the user verified (true) or rejected (false) the activity.
 * @returns The new adjusted confidence score.
 */
export function adjustConfidence(currentConfidence: number, isConfirmed: boolean): number {
  const learningRate = 0.05;
  let newConfidence = currentConfidence;
  
  if (isConfirmed) {
    // Boost confidence if the user confirmed it was correct
    newConfidence = Math.min(0.99, currentConfidence + learningRate);
  } else {
    // Lower confidence significantly if the engine was wrong
    newConfidence = Math.max(0.10, currentConfidence - (learningRate * 2));
  }
  
  return Number(newConfidence.toFixed(2));
}
