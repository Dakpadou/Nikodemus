import React, { useState, useEffect } from "react";
import axios from "axios";

const FormationsParCategorie = () => {
  const [formations, setFormations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // Catégorie sélectionnée
  const [isLoading, setIsLoading] = useState(true);

  // Récupérer les catégories et les formations
  useEffect(() => {
    // Récupérer les catégories
    axios.get("http://localhost:3000/category/shortcategory")  
      .then(response => {
        setCategories(response.data);  // Assurez-vous que votre réponse a les catégories
      })
      .catch(error => console.error("Erreur lors du chargement des catégories :", error));

    // Récupérer les formations
    axios.get("http://localhost:3000/formation/formation/incategory")  
      .then(response => {
        setFormations(response.data);  // Assurez-vous que votre réponse a les formations
        setIsLoading(false);
      })
      .catch(error => console.error("Erreur lors du chargement des formations :", error));
  }, []);

  // Filtrer les formations par catégorie
  const filteredFormations = selectedCategory
    ? formations.filter(formation => formation.category_id === selectedCategory)
    : formations;

  return (
    <div>
      <h1>Formations</h1>
      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <>
          <div>
            <label htmlFor="categoryFilter">Filtrer par catégorie :</label>
            <select
              id="categoryFilter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <ul>
            {filteredFormations.map((formation) => (
              <li key={formation.id}>
                <h3>{formation.titre}</h3>
                <p>{formation.prix} €</p>
                <img src={formation.image} alt={formation.titre} width={100} />
                <p>Catégorie : {formation.category_name}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default FormationsParCategorie;
