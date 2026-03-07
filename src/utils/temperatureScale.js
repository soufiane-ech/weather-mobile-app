export const TEMPERATURE_COLORS = [
    "#67BCEB", // bleu fort
  "#86C8E8", // bleu
  "#A8D5E8", // bleu clair
  "#C3DDE8", // bleu très clair
  "#D5E1E8", // gris bleuté clair
  "#DDDCCF", // beige clair
  "#E6DF7A", // jaune pâle
  "#EBCB57", // jaune chaud
  "#F6A13A", // orange
  "#FF8A33", // orange fort
];

export function getTemperaturePosition(temp) {
  const minTemp = -10;
  const maxTemp = 45;

  const clamped = Math.max(minTemp, Math.min(temp, maxTemp));
  return ((clamped - minTemp) / (maxTemp - minTemp)) * 100;
}