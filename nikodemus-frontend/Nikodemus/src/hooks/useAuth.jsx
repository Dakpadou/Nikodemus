import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Vérifier l'authentification de l'utilisateur à chaque changement de page
        const verifyAuth = async () => {
            try {
                const response = await axios.get('http://localhost:3000/auth/me', { withCredentials: true });
                setUser(response.data.user);
            } catch (error) {
                console.error("Non authentifié");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        verifyAuth();
    }, []);

    // Fonction de déconnexion
    const logout = async () => {
        try {
            await axios.post('http://localhost:3000/auth/logout', {}, { withCredentials: true });
            setUser(null); // Déconnecter l'utilisateur dans l'état
            window.location.href = '/login'; // Rediriger vers la page de connexion
        } catch (error) {
            console.error('Erreur lors de la déconnexion', error);
        }
    };

    return { user, loading, logout };
};