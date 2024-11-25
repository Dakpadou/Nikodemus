import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table, Alert } from "react-bootstrap";
import axios from "axios";

const CategoryManager = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    presentation: "",
    image: "",
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Charger les catégories depuis l'API
  const fetchCategories = () => {
    axios.get(`${apiUrl}/category`).then((response) => {
      setCategories(response.data);
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

  const handleSave = () => {
    const fieldsToValidate = editingCategory || newCategory;
    if (
      !fieldsToValidate.name ||
      !fieldsToValidate.presentation ||
      !fieldsToValidate.image
    ) {
      setErrorMessage("Tous les champs doivent être remplis.");
      return;
    }

    if (editingCategory) {
      axios
        .put(`${apiUrl}/category/update/${editingCategory.id}`, editingCategory)
        .then(() => {
          setCategories((prev) =>
            prev.map((cat) =>
              cat.id === editingCategory.id ? editingCategory : cat
            )
          );
          handleCloseModal();
        })
        .catch((error) => {
          console.error("Erreur lors de la mise à jour :", error);
        });
    } else {
      axios
        .post(`${apiUrl}/category/add`, newCategory)
        .then((response) => {
          setCategories((prev) => [...prev, response.data]);
          setNewCategory({ name: "", presentation: "", image: "" });
          handleCloseModal();
        })
        .catch((error) => {
          console.error("Erreur lors de l'ajout :", error);
        });
    }
  };

  const handleDelete = (categoryId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      axios
        .delete(`${apiUrl}/category/delete/${categoryId}`)
        .then(() => {
          setCategories((prev) =>
            prev.filter((category) => category.id !== categoryId)
          );
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression :", error);
        });
    }
  };

  return (
    <div>
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
                  src={category.image}
                  alt={category.name}
                  style={{ width: "50px" }}
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
            <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible>
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
              <Form.Label>Image (URL)</Form.Label>
              <Form.Control
                type="text"
                value={editingCategory?.image || newCategory.image}
                onChange={(e) => {
                  if (editingCategory) {
                    setEditingCategory({
                      ...editingCategory,
                      image: e.target.value,
                    });
                  } else {
                    setNewCategory({ ...newCategory, image: e.target.value });
                  }
                }}
              />
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
