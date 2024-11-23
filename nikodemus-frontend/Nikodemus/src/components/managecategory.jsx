import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    presentation: "",
    image: ""
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // récuperer les categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/category");
      setCategories(response.data);
      console.log(response.data);
      
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCreateCategory = async () => {
    try {
      await axios.post("http://localhost:3000/category/add", newCategory);
      fetchCategories();
      setNewCategory({ name: "", presentation: "", image: "" });
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/category/delete/${id}`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory({ ...category });
    setShowModal(true);
  };

  const handleUpdateCategory = async () => {
    try {
      if (!editingCategory?.id) {
        console.error("Category ID is missing"); // Log si l'ID est absent
        return;
      }
  
      await axios.put(`/api/categories/${editingCategory.id}`, {
        name: editingCategory.name,
        presentation: editingCategory.presentation,
        image: editingCategory.image,
      });
  
      fetchCategories(); // màj  liste catégories
      setShowModal(false); 
      setEditingCategory(null); 
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };
  

  return (
    <div> 
      <div>
        <h2>Créer une nouvelle catégorie</h2>
        <input
          type="text"
          placeholder="Name"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Presentation"
          value={newCategory.presentation}
          onChange={(e) =>
            setNewCategory({ ...newCategory, presentation: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newCategory.image}
          onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
        />
        <button onClick={handleCreateCategory}>Create</button>
      </div>

      {/* Category Table */}
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Presentation</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>
                <Link to={`/category/${category.id}`}>{category.name}</Link>
              </td>
              <td>{category.presentation}</td>
              <td>
                <img src={category.image} alt={category.name} width="50" />
              </td>
              <td>
                <button onClick={() => handleEditCategory(category)}>Edit</button>
                <button onClick={() => handleDeleteCategory(category.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {showModal && (
        <div className="modal">
          <h2>Edit Category</h2>
          <label>Nom:</label>
          <input
            type="text"
            placeholder="Name"
            value={editingCategory.name}
            onChange={(e) =>
              setEditingCategory({ ...editingCategory, name: e.target.value })
            }
          />
          <label>Présentation:</label>
          <input
            type="text"
            placeholder="Presentation"
            value={editingCategory.presentation}
            onChange={(e) =>
              setEditingCategory({
                ...editingCategory,
                presentation: e.target.value
              })
            }
          />
          <label>URL de l'image:</label>
          <input
            type="text"
            placeholder="Image URL"
            value={editingCategory.image}
            onChange={(e) =>
              setEditingCategory({ ...editingCategory, image: e.target.value })
            }
          />
          <button onClick={handleUpdateCategory}>Save</button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
