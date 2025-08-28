import { Link } from "react-router-dom";

import style from "./Header.module.scss";

/**
 * Header
 * - Mostra logo e titolo
 * - Contiene la navigazione principale:
 *   - Link alla homepage
 *   - Pulsante per aggiungere un nuovo viaggio
 * - Pensato come componente persistente (layout)
 */
export default function Header() {
  return (
    <header>
      <div className={style.main_container}>
        <div className={style.title_wrapper}>
          <img
            alt="🌴 Page icon"
            src="https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/1f334.svg"
          ></img>
          <h2>Diario di Viaggio</h2>
        </div>

        <nav>
          <Link to="/">I tuoi Viaggi</Link>
          <button type="button" title="Nuovi Ricordi">
            +
          </button>
        </nav>
      </div>
    </header>
  );
}
