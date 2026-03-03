export function predictionLabel(result: string) {
    if (result.toLowerCase() === "successed") {
        return "SUCCESS";
    }else {
        return "VULNERABLE";
    }
}