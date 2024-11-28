import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await axios.get(`${apiUrl}/auth/me`, { withCredentials: true });
                setUser(response.data.user); // Met à jour l'utilisateur si connecté
            } catch (error) {
                console.error("Erreur d'authentification :", error);
                setUser(null); // Aucun utilisateur connecté
            } finally {
                setLoading(false);
            }
        };
        verifyAuth();
    }, []);

    const logout = async () => {
        try {
            await axios.post(`${apiUrl}/auth/logout`, {}, { withCredentials: true });
            setUser(null); // Déconnecte l'utilisateur
            window.location.href = "/login"; // Redirige vers la page de connexion
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
