import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Si tu veux utiliser React Router pour la navigation
import { useAuth } from '../hooks/useAuth'; // Hook pour récupérer l'état de l'utilisateur

const Header = () => {
  const { user, logout, loading } = useAuth(); // Récupère l'utilisateur et la fonction de déconnexion
  console.log(user);
  // State pour gérer le nombre d'éléments dans le panier
  const [cartItems, setCartItems] = useState(0);

  // Fonction pour récupérer le nombre d'éléments dans le panier (supposé dans localStorage)
  const getCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    return cart.length;
  };

  // Mettez à jour le nombre d'articles dans le panier à chaque chargement
  useEffect(() => {
    setCartItems(getCartCount());
  }, []); // Ce useEffect ne s'exécute qu'une seule fois lors du montage du composant

  if (loading) {
    return <div>Chargement...</div>; // Affiche un message de chargement jusqu'à ce que l'utilisateur soit prêt
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        {/* Logo ou nom de l'application */}
        <Navbar.Brand as={Link} to="/">Nikodemeus</Navbar.Brand>
        
        {/* Bouton pour activer ou désactiver la navigation mobile */}
        <Navbar.Toggle aria-controls="navbarScroll" />
        
        <Navbar.Collapse id="navbarScroll">
          {/* Navigation principale */}
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link as={Link} to="/">Accueil</Nav.Link>
            <Nav.Link as={Link} to="/formation">Formations</Nav.Link>
            <Nav.Link as={Link} to="/category">Catégories</Nav.Link>
            <Nav.Link as={Link} to="/formations-par-categorie">Formation par catégorie</Nav.Link>

            {/* Affichage conditionnel des liens d'administration si l'utilisateur est connecté et est un administrateur */}
            {user?.role === 1 && (
              <Nav.Item>
                <Link to="/admin/formation/add" className="nav-link">Admin</Link>
              </Nav.Item>
            )}
          </Nav>

          {/* Panier avec notification de quantité d'éléments */}
          <Nav.Item className="ms-3">
            <Link to="/panier" className="nav-link">
              <i className="fa fa-shopping-cart" style={{ fontSize: '24px' }}></i>
              {cartItems > 0 && (
                <span className="badge bg-danger">
                  {cartItems}
                </span>
              )}
            </Link>
          </Nav.Item>

          {/* Bouton de déconnexion ou lien vers la page de connexion */}
          {user ? (
            <>
              <span className="ms-3">Bonjour, {user.username}!</span>
              <Button variant="outline-danger" className="ms-3" onClick={logout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <Nav.Item>
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
