import { useState, useEffect } from "react";

import style from "./PostList.module.scss";

// componenti
import PostCard from "../PostCard/PostCard";
import Loader from "../Loader/Loader";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
