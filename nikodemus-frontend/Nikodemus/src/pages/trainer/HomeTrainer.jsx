import React, { useState } from "react";
import AddFormationModal from "../../components/AddFormationModal";
import { useAuth } from "../../hooks/useAuth";
import ManageFormation from "../../components/trainer/ManageFormationTrainer";


const HomeTrainer = () => {
    const { user, loading } = useAuth(); // Récupère l'utilisateur et l'état de chargement
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    if (loading) {
        return <p>Chargement des données utilisateur...</p>;
    }

    return (
        <div>
            <h1>Bienvenue {user?.username ? `, ${user.username}` : ""} !</h1>
            <p>Ajoutez vos formations et gérez votre contenu.</p>
            <button onClick={handleShow} className="btn btn-primary">
                Ajouter une Formation
            </button>

            {/* Affichage du Modal */}
            <AddFormationModal show={showModal} handleClose={handleClose} />
            <ManageFormation/>
        </div>
    );
};

export default HomeTrainer;