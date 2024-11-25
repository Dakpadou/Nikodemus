import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';

const UpdateFormation = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams(); // Récupération de l'id dans l'url
  const [titre, setTitre] = useState('');
  const [presentation, setPresentation] = useState('');
  const [prix, setPrix] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true); // verification du chargement des données avant affichage
  const TinyApi = import.meta.env.VITE_TINY_API_KEY; // import depuis .env de la clé api

  // Charger les informations a pa--rtir de l'id formation
  useEffect(() => {
    axios.get(`${apiUrl}/formation/${id}`)
      .then(res => {
        const formation = res.data;
        setTitre(formation.data.Titre);
        setPresentation(formation.data.presentation);
        setPrix(formation.data.prix);
        setIsLoading(false); // Les données sont prêtes

        console.log(formation);
        
      })
      .catch(err => {
        console.error('Erreur lors de la récupération des données de la formation', err);
        setIsLoading(false); // Arrêter le chargement même en cas d'erreur
      });
  }, [id]);
  

  //gestion de la soumission du formulaire


  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`${apiUrl}/formation/update/${id}`, {
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

  // pendant que les données chargent

  if (isLoading) {
    return <p>Chargement des données...</p>;
  }

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
          {/* <textarea
            value={presentation}
            onChange={(e) => setPresentation(e.target.value)}
            required
          /> */}
          <Editor
                    apiKey={TinyApi}
                    initialValue={presentation}
                    onEditorChange={(content) => setPresentation(content)}
                    init={{
                        plugins: [
                            // Core editing features
                            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                            // Your account includes a free trial of TinyMCE premium features
                            // Try the most popular premium features until Nov 28, 2024:
                            'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown',
                            // Early access to document converters
                            'importword', 'exportword', 'exportpdf'
                        ],
                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                        tinycomments_mode: 'embedded',
                        tinycomments_author: 'Author name',
                        mergetags_list: [
                            { value: 'First.Name', title: 'First Name' },
                            { value: 'Email', title: 'Email' },
                        ],
                        ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                        exportpdf_converter_options: { 'format': 'Letter', 'margin_top': '1in', 'margin_right': '1in', 'margin_bottom': '1in', 'margin_left': '1in' },
                        exportword_converter_options: { 'document': { 'size': 'Letter' } },
                        importword_converter_options: { 'formatting': { 'styles': 'inline', 'resets': 'inline', 'defaults': 'inline', } },
                    }}
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
