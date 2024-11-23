import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:3000/auth/me', {
                    withCredentials: true,
                });
                setUser(response.data.user);
            } catch (error) {
                setUser(null); // Aucun utilisateur connecté
            } finally {
                setLoading(false); // Fin du chargement
            }
        };

        fetchUser();
    }, []);

    const logout = async () => {
        await axios.post('http://localhost:3000/auth/logout', {}, { withCredentials: true });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};