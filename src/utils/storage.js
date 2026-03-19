const STORAGE_KEY = 'badminton_matches';

export const saveMatch = (match) => {
    const matches = getMatches();
    const updatedMatches = [match, ...matches].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMatches));
    return updatedMatches;
};

export const getMatches = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const deleteMatch = (id) => {
    const matches = getMatches();
    const updatedMatches = matches.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMatches));
    return updatedMatches;
};

export const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    return [];
};