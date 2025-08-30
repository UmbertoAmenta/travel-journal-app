/**
 * Converte una stringa "gg/mm/yyyy" in un oggetto Date.
 * @param {string} d - Data (gg/mm/yyyy)
 * @returns {Date|null}
 */
export function parseDate(d) {
  if (!d) return null;
  const [day, month, year] = d.split("/").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Calcola la durata del viaggio in giorni (inclusivi).
 * @param {string} start - Data iniziale (gg/mm/yyyy)
 * @param {string} end - Data finale (gg/mm/yyyy)
 * @returns {number} numero di giorni
 */
export function getDuration(start, end) {
  const startDate = parseDate(start);
  const endDate = parseDate(end);
  if (!startDate || !endDate) return 0;

  // differenza in millisecondi / 1000 / 60 / 60 / 24
  const diffTime = endDate - startDate;
  return Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
  // +1 perché un viaggio dal 9/9 al 12/9 dura 4 giorni, non 3
}
