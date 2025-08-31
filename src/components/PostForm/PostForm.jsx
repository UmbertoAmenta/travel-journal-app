import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import style from "./PostForm.module.scss";

export default function PostForm({
  mode = "create",
  prevData = null,
  postId = null,
}) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [locality, setLocality] = useState("");
  const [initialDate, setInitialDate] = useState("");
  const [finalDate, setFinalDate] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState([]);
  const [albumUrls, setAlbumUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Recupera i dati iniziali in modalità Edit
  useEffect(() => {
    console.log("prevData ricevuto:", prevData);
    if (prevData) {
      // Se prevData è un array, prendi il primo elemento
      const postData = Array.isArray(prevData) ? prevData[0] : prevData;

      console.log("Impostazione dati iniziali...");
      setTitle(postData.title || "");
      setLocality(postData.locality || "");
      setDescription(postData.description || "");
      setCompany(postData.company || []);
      setAlbumUrls(postData.album || []);

      if (postData.initialDate) {
        console.log("Data iniziale:", postData.initialDate);
        const [d, m, y] = postData.initialDate.split("/");
        const formattedDate = `${y}-${m.padStart(2, "0")}-${d.padStart(
          2,
          "0"
        )}`;
        console.log("Data formattata:", formattedDate);
        setInitialDate(formattedDate);
      }

      if (postData.finalDate) {
        console.log("Data finale:", postData.finalDate);
        const [d, m, y] = postData.finalDate.split("/");
        const formattedDate = `${y}-${m.padStart(2, "0")}-${d.padStart(
          2,
          "0"
        )}`;
        console.log("Data formattata:", formattedDate);
        setFinalDate(formattedDate);
      }
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
      title,
      locality,
      company,
      initialDate: formatDate(initialDate),
      finalDate: formatDate(finalDate),
      description,
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

      alert(
        mode === "edit"
          ? "Post aggiornato con successo!"
          : "Post aggiunto con successo"
      );

      // Reset stati
      setTitle("");
      setLocality("");
      setInitialDate("");
      setFinalDate("");
      setDescription("");
      setCompany([]);
      setAlbumUrls([]);

      navigate("/travels");
    } catch (error) {
      console.error(error);
      alert("Si è verificato un errore durante il salvataggio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rimozione compagno di viaggio/immagine
  const handleRemoveItem = (index, setter) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  // Aggiunta compagno di viaggio
  const handleAddCompany = (name) => {
    if (name.trim()) setCompany([...company, name.trim()]);
  };

  // Aggiunta immagine all'album
  const handleAddAlbumUrl = (url) => {
    if (url.trim()) setAlbumUrls([...albumUrls, url.trim()]);
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label htmlFor="locality">
          In che località?*
          <input
            id="locality"
            type="text"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            required
          />
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
                  handleAddCompany(e.currentTarget.value);
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
            <input
              id="initialDate"
              type="date"
              value={initialDate}
              onChange={(e) => setInitialDate(e.target.value)}
              required
            />
          </label>

          <label htmlFor="finalDate">
            ...e data di ritorno*
            <input
              id="finalDate"
              type="date"
              value={finalDate}
              onChange={(e) => setFinalDate(e.target.value)}
              required
            />
          </label>
        </div>

        <label htmlFor="description">
          Descrivi la tua esperienza*
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
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
                  handleAddAlbumUrl(e.currentTarget.value);
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
