import { useNavigate } from "react-router-dom";
import style from "./PostCard.module.scss";

export default function PostCard({ post }) {
  const navigate = useNavigate();

  return (
    <article onClick={() => navigate(`/travels/${post.id}`)}>
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
        <i>{post.locality}</i>
        <div className={style.date}>
          <small>dal {post.initialDate}</small>
          <small>al {post.finalDate}</small>
        </div>
      </div>
    </article>
  );
}
