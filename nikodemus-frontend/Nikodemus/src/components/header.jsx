import React, { useState, useEffect } from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom"; // Utilisation de React Router
import { useAuth } from "../context/AuthContext"; // Hook pour récupérer l'utilisateur

const Header = () => {
    const { user, logout, loading } = useAuth(); // Récupération de l'utilisateur et des actions
    const [cartItems, setCartItems] = useState(0); // Nombre d'articles dans le panier

    // Fonction pour récupérer le nombre d'articles dans le panier
    const getCartCount = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        return cart.length;
    };

    // Mise à jour du nombre d'articles du panier
    useEffect(() => {
        const updateCartCount = () => {
            setCartItems(getCartCount());
        };

        // Écoute d'un événement fictif `cartUpdated`
        window.addEventListener("cartUpdated", updateCartCount);

        // Nettoyage de l'écouteur lors du démontage
        return () => {
            window.removeEventListener("cartUpdated", updateCartCount);
        };
    }, []);

    // Chargement
    if (loading) {
        return <div>Chargement...</div>;
    }

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container fluid>
                {/* Nom ou logo de l'application */}
                <Navbar.Brand as={Link} to="/">Nikodemeus</Navbar.Brand>
                
                {/* Bouton pour activer/désactiver le menu sur mobile */}
                <Navbar.Toggle aria-controls="navbarScroll" />
                
                <Navbar.Collapse id="navbarScroll">
                    {/* Liens principaux */}
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: "100px" }}
                        navbarScroll
                    >
                        <Nav.Link as={Link} to="/">Accueil</Nav.Link>
                        <Nav.Link as={Link} to="/formation">Toutes les formations</Nav.Link>
                        <Nav.Link as={Link} to="/formations-par-categorie">Catégories</Nav.Link>

                        {/* Gestion des rôles */}
                        {user?.role === 1 && (
                            <Nav.Item>
                                <Link to="/admin" className="nav-link">Administration</Link>
                            </Nav.Item>
                        )}

                        {user?.role === 2 && (
                            <Nav.Item>
                                <Link to="/trainer" className="nav-link">Espace formateur</Link>
                            </Nav.Item>
                        )}

                        {user?.role === 3 && (
                            <Nav.Item>
                                <Link to="/user" className="nav-link">Mes formations</Link>
                            </Nav.Item>
                        )}

                        {!user && (
                            <Nav.Item>
                                <Link to="/register-user" className="nav-link">Créer un compte</Link>
                            </Nav.Item>
                        )}
                    </Nav>

                    {/* Panier avec notification */}
                    <Nav.Item className="ms-3">
                        <Link to="/panier" className="nav-link">
                            <i className="fa fa-shopping-cart" style={{ fontSize: "24px" }}></i>
                            {cartItems > 0 && (
                                <span className="badge bg-danger">
                                    {cartItems}
                                </span>
                            )}
                        </Link>
                    </Nav.Item>

                    {/* Gestion de la connexion/déconnexion */}
                    {user ? (
                        <>
                            <span className="ms-3">Bonjour, {user.username} !</span>
                            <Button variant="outline-danger" className="ms-3" onClick={logout}>
                                Déconnexion
                            </Button>
                        </>
                    ) : (
                        <Nav.Item className="ms-3">
                            <Link to="/login" className="nav-link">
                                Se connecter
                            </Link>
                        </Nav.Item>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
