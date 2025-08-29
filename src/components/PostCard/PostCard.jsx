import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUsers } from "@fortawesome/free-solid-svg-icons";

import style from "./PostCard.module.scss";

/**
 * Card di anteprima per un singolo Post
 * - Mostra immagine, titolo, località e date (partenza - ritorno)
 * - Cliccabile: porta al dettaglio del Post
 * - Utilizzata all'interno della PostList
 */
export default function PostCard({ post }) {
  const navigate = useNavigate();

  return (
    <article
      className={style.card}
      onClick={() => navigate(`/travels/${post.id}`)}
    >
      <div className={style.carousel}>
        <img
          src={
            post.album[0] ||
            "https://thumbs.dreamstime.com/b/vacation-icon-creative-element-design-tourism-icons-collection-pixel-perfect-web-apps-software-print-usage-143072406.jpg"
          }
          alt={`"foto" ${post.title}`}
        />
      </div>

      <div className={style.info}>
        <h4>{post.title}</h4>
        <i>{post.locality}</i>{" "}
        <FontAwesomeIcon
          icon={post.company.length > 0 ? faUsers : faUser}
          title={
            post.company.length > 0
              ? "Viaggio di gruppo"
              : "Viaggio in solitaria"
          }
        />
        <div className={style.date}>
          <small>dal {post.initialDate}</small>
          <small>al {post.finalDate}</small>
        </div>
      </div>
    </article>
  );
}
