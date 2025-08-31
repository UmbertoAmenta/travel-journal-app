import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Loader from "../Loader/Loader";
import PostForm from "../PostForm/PostForm";

export default function EditPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Post non trovato");
        }
        return res.json();
      })
      .then(({ data }) => {
        // Se data è un array, prendi il primo elemento
        const postData = Array.isArray(data) ? data[0] : data;
        if (!postData) throw new Error("Dati non validi");
        setPost(postData);
      })
      .catch((error) => {
        console.error("Errore nel caricamento del post:", error);
        setError(error.message);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <Loader />;
  if (error) return <p>Errore: {error}</p>;
  if (!post) return <p>Post non trovato</p>;

  return <PostForm mode="edit" prevData={post} postId={id} />;
}
