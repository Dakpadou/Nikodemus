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
    // Fonction pour mettre à jour le nombre d'éléments dans le panier
    const updateCartCount = () => {
      setCartItems(getCartCount());
    };
  
    // écouteur événement cartUpdated pour l'icone panier
    window.addEventListener("cartUpdated", updateCartCount);
  
    // Nettoyage de l'écouteur lorsque le composant est démonté
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

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
            <Nav.Link as={Link} to="/formation">Toutes les formations</Nav.Link>
            <Nav.Link as={Link} to="/formations-par-categorie">Catégories</Nav.Link>

            {/* Affichage conditionnel au roles*/}
            
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

            {user?.role !== 1 && user?.role !== 2 && user?.role !== 3 && (
              <Nav.Item>
                <Link to="/register-user" className="nav-link">Créer un compte</Link>
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
