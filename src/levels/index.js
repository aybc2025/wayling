import { LEVELS } from './data/index.js';

export { LEVELS };
export const RATINGS = ['fun', 'tricky', 'taxing', 'mayhem'];

export const levelById = (id) => LEVELS.find((l) => l.id === id);
export const levelsOf = (rating) => LEVELS.filter((l) => l.rating === rating);
export const indexOfLevel = (id) => LEVELS.findIndex((l) => l.id === id);
