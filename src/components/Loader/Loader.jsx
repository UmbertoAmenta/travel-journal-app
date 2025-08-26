import style from "./Loader.module.scss";

export default function Loader() {
  return (
    <div className={style.loader}>
      <span className={style.bubble}></span>
      <span className={style.bubble}></span>
      <span className={style.bubble}></span>
    </div>
  );
}
