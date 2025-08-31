import { useEffect, useRef, useState } from "react";

import style from "./PostForm.module.scss";
import { useNavigate } from "react-router-dom";

export default function PostForm({
  mode = "create",
  prevData = null,
  postId = null,
}) {
  const navigate = useNavigate();

  const titleRef = useRef();
  const localityRef = useRef();
  const initialDateRef = useRef();
  const finalDateRef = useRef();
  const descriptionRef = useRef();

  const [company, setCompany] = useState(prevData?.company || []);
  const [albumUrls, setAlbumUrls] = useState(prevData?.album || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Recupera i dati iniziali in modalità Edit
  useEffect(() => {
    if (prevData) {
      if (titleRef.current) titleRef.current.value = prevData.title || "";
      if (localityRef.current)
        localityRef.current.value = prevData.locality || "";
      if (descriptionRef.current)
        descriptionRef.current.value = prevData.description || "";
      if (initialDateRef.current) {
        const [d, m, y] = prevData.initialDate.split("/");
        initialDateRef.current.value = `${y}-${m.padStart(2, "0")}-${d.padStart(
          2,
          "0"
        )}`;
      }
      if (finalDateRef.current) {
        const [d, m, y] = prevData.finalDate.split("/");
        finalDateRef.current.value = `${y}-${m.padStart(2, "0")}-${d.padStart(
          2,
          "0"
        )}`;
      }
      setCompany(prevData.company || []);
      setAlbumUrls(prevData.album || []);
    }
  }, [prevData]);

  // Cambio formattazione data YYYY-MM-DD -> D/MM/YYYY
  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Gestione dei dati del form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Controllo presenza di almeno 1 immagine
    if (albumUrls.length === 0) {
      alert("Devi aggiungere almeno un URL per l'album!");
      return;
    }

    // Dati iniziali in fase Edit
    const postData = {
      title: titleRef.current.value,
      locality: localityRef.current.value,
      company,
      initialDate: formatDate(initialDateRef.current.value),
      finalDate: formatDate(finalDateRef.current.value),
      description: descriptionRef.current.value,
      album: albumUrls,
    };

    // Validazione date
    if (new Date(postData.finalDate) < new Date(postData.initialDate)) {
      alert("Se sei tornato prima di partire, non sei mai partito!");
      return;
    }

    setIsSubmitting(true);

    // Invio al backend POST / PATCH
    try {
      const url =
        mode === "edit"
          ? `${import.meta.env.VITE_API_URL}/posts/${postId}`
          : `${import.meta.env.VITE_API_URL}/posts`;
      const method = mode === "edit" ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
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

      alert(
        mode === "edit"
          ? "Post aggiornato con successo!"
          : "Post aggiunto con successo"
      );

      navigate("/travels");
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
    <section className={style.postForm}>
      <h2>Compila il form</h2>
      <small>*: campi obbligatori</small>

      <form onSubmit={handleSubmit}>
        <label htmlFor="title">
          Dai un nome alla tua avventura*{" "}
          <input
            id="title"
            type="text"
            ref={titleRef}
            required
            defaultValue={prevData?.title || ""}
          />
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
          {isSubmitting
            ? "Invio in corso..."
            : mode === "edit"
            ? "Salva modifiche"
            : "Aggiungi al Diario"}
        </button>
      </form>
    </section>
  );
}
