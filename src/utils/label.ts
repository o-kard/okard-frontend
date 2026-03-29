export function predictionLabel(result: string) {
  if (result.toLowerCase() === "successful") {
    return "Tend To Success";
  } else {
    return "Tend To Vulnerable";
  }
}