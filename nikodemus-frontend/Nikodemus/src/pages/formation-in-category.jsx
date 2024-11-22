import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const FormationsParCategorie = () => {
  const [formations, setFormations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1); // Initialiser à 1 pour afficher la catégorie 1 par défaut
  const [isLoading, setIsLoading] = useState(true); // Indicateur de chargement des catégories
  const [isLoadingFormations, setIsLoadingFormations] = useState(false); // Indicateur de chargement des formations

  // Gestion des doublons d'ID
  const enleveDoublon = (list) => {
    const uniqueIds = new Set();
    return list.filter((item) => {
      if (uniqueIds.has(item.id)) {
        return false;
      }
      uniqueIds.add(item.id);
      return true;
    });
  };

  // Récupérer les catégories et les formations par catégorie
  useEffect(() => {
    // Récupérer les catégories
    axios
      .get("http://localhost:3000/category/shortcategory")
      .then((response) => {
        setCategories(response.data);
        setIsLoading(false); // Fin du chargement des catégories
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des catégories :", error);
        setIsLoading(false); // Fin du chargement des catégories
      });

    // Récupérer les formations pour la catégorie sélectionnée (par défaut la catégorie 1)
    setIsLoadingFormations(true); // Démarrer le chargement des formations
    axios
      .get(`http://localhost:3000/formation/incategory/${selectedCategory}`)
      .then((response) => {
        const uniqueFormations = enleveDoublon(response.data);
        setFormations(uniqueFormations);
        setIsLoadingFormations(false); // Fin du chargement des formations
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des formations :", error);
        setIsLoadingFormations(false); // Fin du chargement des formations
      });
  }, [selectedCategory]); // Effectue l'appel chaque fois que la catégorie sélectionnée change

  return (
    <div>
      <h1>Formations</h1>
      {isLoading ? (
        <p>Chargement des catégories...</p>
      ) : (
        <>
          <div>
            <label htmlFor="categoryFilter">Filtrer par catégorie :</label>
            <select
              id="categoryFilter"
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value ? Number(e.target.value) : 1) // Sélectionner la catégorie 1 par défaut si aucune sélection
              }
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {isLoadingFormations ? (
            <p>Chargement des formations...</p>
          ) : (
            <ul>
              {formations.length > 0 ? (
                formations.map((formation) => (
                  <li key={formation.id}>
                    <Link to={`/formation/${formation.id}`}>
                      {formation.Titre}
                    </Link>{" "}
                    - {formation.category_name} - {formation.prix}€
                  </li>
                ))
              ) : (
                <p>Aucune formation trouvée pour cette catégorie.</p>
              )}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default FormationsParCategorie;
