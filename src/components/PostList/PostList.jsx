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
    <section className={style.list}>
      {posts.map((p) => {
        return <PostCard key={p.id} post={p} />;
      })}
    </section>
  );
}
