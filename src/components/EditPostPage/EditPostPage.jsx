import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Loader from "../Loader/Loader";
import PostForm from "../PostForm/PostForm";

export default function EditPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`)
      .then((res) => res.json())
      .then(({ data }) => setPost(data))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <Loader />;
  if (!post) return <p>Post non trovato</p>;

  return <PostForm mode="edit" prevData={post} postId={id} />;
}
