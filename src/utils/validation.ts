
export function validateUsername(u: string) {
    const v = u.trim();
    if (v.length < 4 || v.length > 64)
        return "Username must be between 4 and 64 characters long.";
    if (!/^[a-zA-Z0-9._]+$/.test(v))
        return "Use only letters, numbers, dot or underscore";
    return null;
}

export function validateEmail(s: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export function validatePwdPair(newPw: string, confirmPw: string) {
    if (!newPw && !confirmPw) return null; // Not intending to change
    if (!newPw || !confirmPw) return "Please fill both password fields";
    if (newPw.length < 8) return "Password must be at least 8 characters";
    if (newPw !== confirmPw) return "Passwords do not match";
    return null;
}
