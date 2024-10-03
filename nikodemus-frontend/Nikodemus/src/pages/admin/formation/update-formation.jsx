import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import axios from 'axios';

const UpdateFormation = () => {
  const { id } = useParams(); // Récupération de l'id dans l'url
  const [titre, setTitre] = useState('');
  const [presentation, setPresentation] = useState('');
  const [prix, setPrix] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:3000/formation/update/${id}`, {
        titre,
        presentation,
        prix
      });

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setErrorMessage('');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la formation', error);
      setErrorMessage('Erreur lors de la mise à jour. Réessayez ou contactez un administrateur.');
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <h2>Mettre à jour la formation</h2>
      
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p>{errorMessage}</p>}

      <form onSubmit={handleUpdate}>
        <div>
          <label>Titre de la formation</label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Présentation</label>
          <textarea
            value={presentation}
            onChange={(e) => setPresentation(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Prix</label>
          <input
            type="number"
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
            required
          />
        </div>
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
};

export default UpdateFormation;
