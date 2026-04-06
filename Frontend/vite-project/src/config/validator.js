export const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

export const validatePassword = (password) => {
    return password.length >= 6;
};




export const getEmailError = (email) => {
    if (!email) return 'Email is required';
    if (!validateEmail(email)) return 'Invalid email format';
    return '';
};

export const getPasswordError = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
};

export const getConfirmPasswordError = (password, confirmPassword) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
};

export const getUsernameError = (username) => {
    if (!username.trim()) return "Username is required";
    if (username.trim().length < 3) return "Username must be at least 3 characters";
    return "";
};