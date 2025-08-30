import { useState, useEffect } from "react";

import PostCard from "../PostCard/PostCard";
import Loader from "../Loader/Loader";
import FilterAndSortBar from "../FilterAndSortBar/FilterAndSortBar";

import { useFilterAndSort } from "../../hooks/useFilterAndSort";

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

  const { filters, setFilters, sorting, toggleSort, filteredAndSortedPosts } =
    useFilterAndSort(posts);
  // Recupero di tutti i Post (Index)
  useEffect(() => {
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

  if (error) return <p>Errore: {error}</p>;

  if (posts.length === 0) return <p>Nessun post disponibile</p>;

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
