import { useState, useEffect } from "react";

import PostCard from "../PostCard/PostCard";
import Loader from "../Loader/Loader";
import FilterAndSortBar from "../FilterAndSortBar/FilterAndSortBar";

import { useFilterAndSort } from "../../hooks/useFilterAndSort";

import style from "./PostList.module.scss";
import { Link } from "react-router-dom";

/**
 * Lista di Post
 * - Recupera tutti i post dall'API (Index)
 * - Gestisce loading, errori e lista vuota
 * - Mostra una serie di PostCard
 */
export default function PostList() {
  // Stati legati al fetch dei Post
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Array senza duplicati (new Set crea un oggetto Set senza duplicati) ordinato alfabeticamente
  const uniquePlaces = [...new Set(posts.map((p) => p.locality))].sort();

  const { filters, setFilters, sorting, toggleSort, filteredAndSortedPosts } =
    useFilterAndSort(posts);
  // Recupero di tutti i Post (Index)
  useEffect(() => {
    const url = import.meta.env.VITE_API_URL + "/posts";
    console.log(import.meta.env.VITE_API_URL);
    console.log("Fetching from:", url);

    fetch(`${import.meta.env.VITE_API_URL}/posts`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Il server non risponde");
        }
        return res.json();
      })
      .then(({ data }) => setPosts(data))
      .catch((error) => setError(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <section className={style.emptylist}>
        <h2>🚨 Si è verificato un errore</h2>
        <p>{error.message || "Impossibile recuperare i dati dal server."}</p>

        <div className={style.errorDetails}>
          <p>🔧 Prova a:</p>
          <ul>
            <li>🔄 Ricaricare la pagina</li>
            <li>📶 Controllare la connessione</li>
            <li>📩 Contattare il supporto se il problema persiste</li>
          </ul>
        </div>

        <p className={style.callToAction}>
          Anche gli imprevisti fanno parte del viaggio 🌧️→🌈
        </p>
      </section>
    );
  }

  // Gestione database vuoto e filtri eccessivi
  if (filteredAndSortedPosts.length === 0) {
    return posts.length === 0 ? (
      <section className={style.emptylist}>
        <h2>🎫 Nessun viaggio disponibile</h2>
        <p>
          Il diario è ancora vuoto. È il momento perfetto per iniziare a
          scrivere la tua storia!
        </p>
        <Link to="/travels/new">
          <button className={style.addDataBtn}>
            Aggiungi il tuo primo viaggio
          </button>
        </Link>
      </section>
    ) : (
      <section className={style.emptylist}>
        <h2>🔍 Nessun viaggio trovato</h2>
        <p>
          I filtri selezionati non corrispondono a nessun viaggio registrato.
        </p>{" "}
        <div className={style.filtersSummary}>
          {filters.postsByPlace && (
            <span>
              📍 <strong>Località:</strong> {filters.postsByPlace}
            </span>
          )}
          <span>
            🧑‍🤝‍🧑 <strong>Viaggio:</strong>{" "}
            {filters.tripType === "solo" ? "in solitaria" : "in compagnia"}
          </span>{" "}
        </div>
        <p className={style.callToAction}>
          Un buon motivo per preparare i bagagli 🧳→🎫→🌴
        </p>
      </section>
    );
  }

  return (
    <>
      <FilterAndSortBar
        uniquePlaces={uniquePlaces}
        filters={filters}
        setFilters={setFilters}
        sorting={sorting}
        toggleSort={toggleSort}
      />

      <section className={style.list}>
        {filteredAndSortedPosts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </section>
    </>
  );
}
