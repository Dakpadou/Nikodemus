import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <p>Chargement...</p>; 
    }

    // Si allowedRoles est vide, c'est une page publique
    if (allowedRoles.length === 0) {
        return children;
    }

    // si le user n'a pas d'acces redirection vers login
    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }

    // Affiche le contenu protégé
    return children;
};

export default ProtectedRoute;