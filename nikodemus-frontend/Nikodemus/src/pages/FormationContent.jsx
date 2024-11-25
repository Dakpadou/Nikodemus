import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Alert, Card } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";
import { Helmet } from "react-helmet";

const FormationContent = () => {
    const { user, loading } = useAuth(); // Récupère les informations utilisateur
    const { formationId } = useParams(); // Récupère l'ID de la formation depuis l'URL
    const [content, setContent] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (loading || !user) return;

        // Appelle le backend pour vérifier l'accès et récupérer le contenu
        axios
            .get(`${apiUrl}/user/content/${formationId}/${user.id}`)
            .then((res) => {
              console.log(res.data.data , 'dedede');
                setContent(res.data.data); // Stocke le contenu de la formation
                setError("");
            })
            .catch((err) => {
                if (err.response && err.response.status === 403) {
                    setError("Accès refusé : vous n'avez pas acheté cette formation.");
                    setTimeout(() => navigate("/"), 3000); // Redirige après 3 secondes
                } else {
                    setError("Erreur lors de la récupération du contenu.");
                }
            });
    }, [loading, user, formationId, navigate, apiUrl]);

    if (loading) {
        return <p>Chargement des données utilisateur...</p>;
    }

    return (
      <Container className="mt-4">
           <Helmet>
                <meta charSet="utf-8" />
                <title>NikoDemus-Formations</title>
                <meta
                    name="description"
                    content="Toutes nos formations"
                />
                <link rel="canonical" href={`http://localhost:5173/formation`} />
            </Helmet>
      {/* Affichage des erreurs */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Affichage du contenu en style article */}
      {content && (
          <article className="p-4  rounded">
              <header className="mb-4">
                  <h1>{content.Titre}</h1>
                  
              </header>
              
              {/* Ajout de l'image si disponible */}
              {content.image && (
                  <div className="text-center mb-4">
                      <img
                          src={`${apiUrl}/uploads/${content.image}`}
                          alt={content.Titre}
                          style={{
                              maxWidth: "100%",
                              height: "auto",
                              borderRadius: "8px"
                          }}
                      />
                  </div>
              )}

              <section className="mb-4">
                  <h2>Présentation</h2>
                  <p>{content.presentation}</p>
                  {/* Si la présentation contient du HTML */}
                  <div dangerouslySetInnerHTML={{ __html: content.presentation }} />
              </section>
              
              <section>
                  <h2>Contenu</h2>
                  {/* Si le contenu contient du HTML */}
                  <div dangerouslySetInnerHTML={{ __html: content.content }} />
              </section>
          </article>
      )}
  </Container>
    );
};

export default FormationContent;
