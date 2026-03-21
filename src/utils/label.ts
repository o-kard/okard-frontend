export function predictionLabel(result: string) {
  if (result.toLowerCase() === "successful") {
    return "SUCCESSFUL";
  } else {
    return "VULNERABLE";
  }
}