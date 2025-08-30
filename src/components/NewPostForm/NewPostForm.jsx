import { useRef, useState } from "react";

import style from "./NewPostForm.module.scss";

export default function NewPostForm() {
  const titleRef = useRef();
  const localityRef = useRef();
  const initialDateRef = useRef();
  const finalDateRef = useRef();
  const descriptionRef = useRef();

  const [company, setCompany] = useState([]);
  const [albumUrls, setAlbumUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gestione dei dati del form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Cambio formattazione data YYYY-MM-DD -> D/MM/YYYY
    const formatDate = (isoDate) => {
      const d = new Date(isoDate);
      const day = d.getDate().toString().padStart(2, "0");
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const newPost = {
      title: titleRef.current.value,
      locality: localityRef.current.value,
      company,
      initialDate: formatDate(initialDateRef.current.value),
      finalDate: formatDate(finalDateRef.current.value),
      description: descriptionRef.current.value,
      album: albumUrls,
    };

    // Validazione date
    if (new Date(newPost.finalDate) < new Date(newPost.initialDate)) {
      alert("Se sei tornato prima di partire, non sei mai partito!");
      return;
    }

    setIsSubmitting(true);

    try {
      // Invio al backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) throw new Error("Errore durante il salvataggio");

      const data = await response.json();
      console.log("Post salvato:", data);

      // Reset campi del form
      titleRef.current.value = "";
      localityRef.current.value = "";
      setCompany([]);
      initialDateRef.current.value = "";
      finalDateRef.current.value = "";
      descriptionRef.current.value = "";
      setAlbumUrls([]);

      alert("Post aggiunto con successo!");
    } catch (error) {
      console.error(error);
      alert("Si è verificato un errore durante il salvataggio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rimozione compagni di viaggio
  const handleRemoveItem = (index, setter) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <section className={style.newPostForm}>
      <h2>Compila il form</h2>
      <small>*: campi obbligatori</small>

      <form onSubmit={handleSubmit}>
        <label htmlFor="title">
          Dai un nome alla tua avventura*{" "}
          <input id="title" type="text" ref={titleRef} required />
        </label>

        <label htmlFor="locality">
          In che località?*
          <input id="locality" type="text" ref={localityRef} required />
        </label>

        <div className={style.wrapper}>
          <label htmlFor="company">
            Con chi hai viaggiato?
            <input
              id="company"
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  e.preventDefault();
                  setCompany([...company, e.currentTarget.value.trim()]);
                  e.currentTarget.value = "";
                }
              }}
              placeholder="Scrivi un nome e premi Invio"
            />
          </label>
          <div className={style.tagContainer}>
            {company.map((c, i) => (
              <span key={i} className={style.tag}>
                {c}
                <button
                  type="button"
                  onClick={() => handleRemoveItem(i, setCompany)}
                >
                  x
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className={style.dateWrapper}>
          <label htmlFor="initialDate">
            Data di partenza...*
            <input id="initialDate" type="date" ref={initialDateRef} required />
          </label>

          <label htmlFor="finalDate">
            ...e data di ritorno*
            <input id="finalDate" type="date" ref={finalDateRef} required />
          </label>
        </div>

        <label htmlFor="description">
          Descrivi la tua esperienza*
          <textarea id="description" ref={descriptionRef} required></textarea>
        </label>

        <div className={style.wrapper}>
          <label>
            Inserisci e invia URL delle immagini{" "}
            <input
              type="text"
              placeholder="https://..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  e.preventDefault();
                  setAlbumUrls([...albumUrls, e.currentTarget.value.trim()]);
                  e.currentTarget.value = "";
                }
              }}
            />
          </label>
          <div className={style.tagContainer}>
            {albumUrls.map((url, i) => (
              <span key={i} className={style.tag}>
                {url}
                <button
                  type="button"
                  onClick={() => handleRemoveItem(i, setAlbumUrls)}
                >
                  x
                </button>
              </span>
            ))}
          </div>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Invio in corso..." : "Aggiungi al Diario"}
        </button>
      </form>
    </section>
  );
}
