import { useState, useEffect } from "react";

import PostCard from "../PostCard/PostCard";
import Loader from "../Loader/Loader";

import { parseDate } from "../../utils/date";

import style from "./PostList.module.scss";

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

  // Stati legati al filtraggio dei Post
  const [postsByPlace, setPostsByPlace] = useState("");
  const [tripType, setTripType] = useState("all");

  // Stati legati all'ordinamento dei Post
  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  // Logiche di filtro
  const filteredLocality = (post) =>
    postsByPlace === "" || post.locality === postsByPlace;

  const filteredTripType = (post) =>
    tripType === "all" ||
    (tripType === "group" && post.company.length > 0) ||
    (tripType === "solo" && post.company.length === 0);

  const filteredPosts = posts.filter(
    (p) => filteredLocality(p) && filteredTripType(p)
  );

  // Logiche di ordinamento
  const sortPosts = (posts, sortField, sortDirection) => {
    const sorted = [...posts];

    sorted.sort((a, b) => {
      let result = 0;

      switch (sortField) {
        case "date":
          result = parseDate(a.initialDate) - parseDate(b.initialDate);
          break;

        case "locality":
          result = a.locality.localeCompare(b.locality);
          break;

        case "duration":
          const durationA = parseDate(a.finalDate) - parseDate(a.initialDate);
          const durationB = parseDate(b.finalDate) - parseDate(b.initialDate);
          result = durationA - durationB;
          break;

        default:
          result = 0;
      }

      return result;
    });

    if (sortDirection === "desc") {
      sorted.reverse();
    }

    return sorted;
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  // Recupero di tutti i Post (Index)
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/posts`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Il server non risponde");
        }
        return res.json();
      })
      .then(({ data }) => {
        setPosts(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <p>Errore: {error}</p>;
  }

  if (posts.length === 0) {
    return <p>Nessun post disponibile</p>;
  }

  return (
    <>
      <section className={style.filter_and_sort}>
        <div className="filter">
          <details>
            <summary>Filtra</summary>
            <div>
              {/* select per località (solo quelle utilizzate) */}
              <select
                name=""
                value={postsByPlace}
                onChange={(e) => setPostsByPlace(e.target.value)}
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
                onChange={(e) => setTripType(e.target.value)}
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
                {sortBy === "date" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
              </button>

              {/* alfabetico per località */}
              <button onClick={() => toggleSort("locality")}>
                🔤 Località{" "}
                {sortBy === "locality"
                  ? sortDirection === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </button>

              {/* lunghezza viaggio */}
              <button onClick={() => toggleSort("duration")}>
                ⏱️ Durata{" "}
                {sortBy === "duration"
                  ? sortDirection === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </button>
            </div>
          </details>
        </div>
      </section>

      <section className={style.list}>
        {sortPosts(filteredPosts, sortBy, sortDirection).map((p) => {
          return <PostCard key={p.id} post={p} />;
        })}
      </section>
    </>
  );
}
