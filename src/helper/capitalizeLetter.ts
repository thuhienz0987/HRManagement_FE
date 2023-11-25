function capitalizeFLetter(string?: string | null) {
    if (string) return string.charAt(0).toUpperCase() + string.slice(1);
    return null;
}

export default capitalizeFLetter;
