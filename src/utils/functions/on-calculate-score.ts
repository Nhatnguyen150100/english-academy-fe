export function calculateScore(correctAnswers: number, totalQuestions: number): number {
  if (totalQuestions === 0) return 0;
  const score = (correctAnswers / totalQuestions) * 10;
  return roundToOneDecimal(score);
}

function roundToOneDecimal(num: number): number {
  return parseFloat(num.toFixed(1));
}