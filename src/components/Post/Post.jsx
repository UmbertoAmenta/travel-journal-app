import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import style from "./Post.module.scss";

import Loader from "../Loader/Loader.jsx";

export default function Post() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Il server non risponde");
        }
        return res.json();
      })
      .then(({ data }) => {
        setPost(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <p>Errore: {error}</p>;
  }

  if (!post) {
    return <p>Post non trovato</p>;
  }

  return (
    <section className={style.post}>
      <div className={style.carousel}>
        <img
          src={
            post.album[0] ||
            "https://thumbs.dreamstime.com/b/vacation-icon-creative-element-design-tourism-icons-collection-pixel-perfect-web-apps-software-print-usage-143072406.jpg"
          }
          alt={`"foto" ${post.title}`}
        />
      </div>
      <h2>{post.title}</h2>
      <div className={style.info}>
        <div>
          <h3>
            <i>{post.locality}</i>
          </h3>
          <div>
            <span>{post.initialDate}</span>
            <span>{post.finalDate}</span>
          </div>
          {post.company.length === 0 ? (
            <p>Viaggio in solitaria</p>
          ) : (
            <p>
              <small>
                In compagnia di:{" "}
                {post.company.length === 1
                  ? post.company[0]
                  : post.company.length === 2
                  ? post.company.join(" e ")
                  : `${post.company.slice(0, -1).join(", ")} e ${
                      post.company[post.company.length - 1]
                    }`}
              </small>
            </p>
          )}
        </div>
        <p>{post.description}</p>
      </div>
    </section>
  );
}
