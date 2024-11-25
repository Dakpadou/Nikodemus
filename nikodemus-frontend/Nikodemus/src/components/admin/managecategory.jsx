import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table, Alert } from "react-bootstrap";
import axios from "axios";

const CategoryManager = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    presentation: "",
    image: null,
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Charger les catégories depuis l'API
  const fetchCategories = () => {
    axios
      .get(`${apiUrl}/category`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des catégories :", error);
        setErrorMessage("Erreur lors du chargement des catégories.");
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleShowModal = (category = null) => {
    setEditingCategory(category);
    setErrorMessage("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditingCategory(null);
    setErrorMessage("");
    setShowModal(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (editingCategory) {
      setEditingCategory({ ...editingCategory, image: file });
    } else {
      setNewCategory({ ...newCategory, image: file });
    }
  };

  const handleSave = () => {
    const fieldsToValidate = editingCategory || newCategory;

    if (!fieldsToValidate.name || !fieldsToValidate.presentation) {
      setErrorMessage("Tous les champs doivent être remplis.");
      return;
    }

    const formData = new FormData();
    formData.append("name", fieldsToValidate.name);
    formData.append("presentation", fieldsToValidate.presentation);

    // Ajoutez l'image seulement si elle existe
    if (fieldsToValidate.image instanceof File) {
      formData.append("image", fieldsToValidate.image);
    } else if (!editingCategory) {
      setErrorMessage("L'image est obligatoire pour ajouter une nouvelle catégorie.");
      return;
    }

    const request = editingCategory
      ? axios.put(`${apiUrl}/category/update/${editingCategory.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      : axios.post(`${apiUrl}/category/add`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

    request
      .then(() => {
        fetchCategories(); // Rafraîchit la liste des catégories
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Erreur lors de la sauvegarde :", error);
        setErrorMessage("Erreur lors de la sauvegarde des données.");
      });
  };

  const handleDelete = (categoryId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      axios
        .delete(`${apiUrl}/category/delete/${categoryId}`)
        .then(() => {
          setCategories((prev) => prev.filter((category) => category.id !== categoryId));
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression :", error);
          setErrorMessage("Erreur lors de la suppression.");
        });
    }
  };

  return (
    <div className="container mt-4">
      <Button variant="primary" onClick={() => handleShowModal()}>
        Ajouter une catégorie
      </Button>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Nom</th>
            <th>Présentation</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category.id}>
              <td>{index + 1}</td>
              <td>{category.name}</td>
              <td>{category.presentation}</td>
              <td>
                <img
                  src={`${apiUrl}/uploads/${category.image}`}
                  alt={category.name}
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
              </td>
              <td>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => handleShowModal(category)}
                >
                  Modifier
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(category.id)}
                >
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && (
            <Alert
              variant="danger"
              onClose={() => setErrorMessage("")}
              dismissible
            >
              {errorMessage}
            </Alert>
          )}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                value={editingCategory?.name || newCategory.name}
                onChange={(e) => {
                  if (editingCategory) {
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    });
                  } else {
                    setNewCategory({ ...newCategory, name: e.target.value });
                  }
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Présentation</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={
                  editingCategory?.presentation || newCategory.presentation
                }
                onChange={(e) => {
                  if (editingCategory) {
                    setEditingCategory({
                      ...editingCategory,
                      presentation: e.target.value,
                    });
                  } else {
                    setNewCategory({
                      ...newCategory,
                      presentation: e.target.value,
                    });
                  }
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
              {editingCategory?.image && (
                <div className="mt-2">
                  <strong>Image actuelle :</strong>
                  <img
                    src={`${apiUrl}/uploads/${editingCategory.image}`}
                    alt="Image actuelle"
                    style={{ width: "100px", marginTop: "10px" }}
                  />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CategoryManager;
