import React from 'react'
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div>
            <h1>Erreur 404, page introuvable</h1>
            <p>Vous pouvez toujours...</p>
            <Link to='/'>retourner a l'accueil</Link>

        </div>
    )
}

