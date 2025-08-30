import style from "./FilterAndSortBar.module.scss";

/**
 * Barra di controllo che permette di:
 * - Filtrare i post per località
 * - Filtrare i post per tipologia di viaggio (solitaria / gruppo)
 * - Ordinare i post per data, località o durata
 */
export default function FilterAndSortBar({
  uniquePlaces,
  filters,
  setFilters,
  sorting,
  toggleSort,
}) {
  const { postsByPlace, tripType } = filters;
  const { sortBy, sortDirection } = sorting;

  return (
    <section className={style.filter_and_sort}>
      <div className="filter">
        <details>
          <summary>Filtra</summary>
          <div>
            {/* select per località (solo quelle utilizzate) */}
            <select
              value={postsByPlace}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  postsByPlace: e.target.value,
                }))
              }
            >
              <option value="">Tutte le località</option>
              {uniquePlaces.map((place) => (
                <option key={place} value={place}>
                  {place}
                </option>
              ))}
            </select>

            {/* select per viaggio in solitaria/gruppo */}
            <select
              value={tripType}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, tripType: e.target.value }))
              }
            >
              <option value="all">Tutti i viaggi</option>
              <option value="solo">Solitaria</option>
              <option value="group">Gruppo</option>
            </select>
          </div>
        </details>
      </div>

      <div className="sort">
        <details>
          <summary>Ordina</summary>
          <div>
            {/* cronologico (default, dal più recente) */}
            <button onClick={() => toggleSort("date")}>
              📅 Data{" "}
              <span className={style.arrow}>
                {sortBy === "date" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
              </span>
            </button>

            {/* alfabetico per località */}
            <button onClick={() => toggleSort("locality")}>
              🔤 Località{" "}
              <span className={style.arrow}>
                {sortBy === "locality"
                  ? sortDirection === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </span>
            </button>

            {/* lunghezza viaggio */}
            <button onClick={() => toggleSort("duration")}>
              ⏱️ Durata{" "}
              <span className={style.arrow}>
                {sortBy === "duration"
                  ? sortDirection === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </span>
            </button>
          </div>
        </details>
      </div>
    </section>
  );
}
