import style from "./Loader.module.scss";

/**
 * Loader
 * - Indicatore di caricamento dati riutilizzabile
 * - Usato in:
 *   - PostList (lista di posts)
 *   - Post (pagina di dettaglio)
 */
export default function Loader() {
  return (
    <div className={style.loader}>
      <span className={style.bubble}></span>
      <span className={style.bubble}></span>
      <span className={style.bubble}></span>
    </div>
  );
}
