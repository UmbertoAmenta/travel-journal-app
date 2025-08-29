import { useState, useEffect } from "react";

import PostCard from "../PostCard/PostCard";
import Loader from "../Loader/Loader";

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
            <div></div>
          </details>
        </div>
      </section>

      <section className={style.list}>
        {filteredPosts.map((p) => {
          return <PostCard key={p.id} post={p} />;
        })}
      </section>
    </>
  );
}
