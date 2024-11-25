import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Card, Button, Row, Col, Spinner } from "react-bootstrap";

const FormationsParCategorie = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [formations, setFormations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFormations, setIsLoadingFormations] = useState(false);

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

  useEffect(() => {
    axios
      .get(`${apiUrl}/category/shortcategory`)
      .then((response) => {
        setCategories(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des catégories :", error);
        setIsLoading(false);
      });

    setIsLoadingFormations(true);
    axios
      .get(`${apiUrl}/formation/incategory/${selectedCategory}`)
      .then((response) => {
        console.log(response.data);
        
        const uniqueFormations = enleveDoublon(response.data);
        setFormations(uniqueFormations);
        setIsLoadingFormations(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des formations :", error);
        setIsLoadingFormations(false);
      });
  }, [selectedCategory]);

  return (
    <div className="container">
      <h1 className="my-4">Formations</h1>
      {isLoading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement des catégories...</span>
        </Spinner>
      ) : (
        <>
          <div className="mb-4">
            <label htmlFor="categoryFilter" className="form-label">
              Filtrer par catégorie :
            </label>
            <select
              id="categoryFilter"
              className="form-select"
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value ? Number(e.target.value) : 1)
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
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Chargement des formations...</span>
            </Spinner>
          ) : (
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {formations.length > 0 ? (
                formations.map((formation) => (
                  <Col key={formation.id}>
                    <Card>
                      <Card.Img
                        variant="top"
                        src={`${import.meta.env.VITE_API_URL}/uploads/${formation.image}`}

                        alt={`Image de ${formation.Titre}`}
                        style={{ height: "150px", objectFit: "cover" }}
                      />
                      <Card.Body>
                        <Card.Title>{formation.Titre}</Card.Title>
                        <Card.Text>
                          Catégorie : {formation.category_name} <br />
                          Prix : {formation.prix}€
                        </Card.Text>
                        <Button as={Link} to={`/formation/${formation.id}`} variant="primary">
                          Voir les détails
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <p>Aucune formation trouvée pour cette catégorie.</p>
              )}
            </Row>
          )}
        </>
      )}
    </div>
  );
};

export default FormationsParCategorie;
