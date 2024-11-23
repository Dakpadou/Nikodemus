import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Home from "../pages/Home";





const Header = () => {

  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Accueil</Link>
          </li>
          <li>
            <Link to="/formation">Formation</Link>
          </li>
          <li>
            <Link to="/category">Catégories</Link>
          </li>
          <li>
            <Link to="/formations-par-categorie">Formation par catégorie</Link>
          </li>
          <li> Administrateur
            <ul>
              <li>
            <Link to="/admin/formation/add">Créer une formation</Link>
            </li>
            <li>
            <Link to="/admin/category">Gérer les catégories</Link>
            </li>
            </ul>
          </li>
        </ul>
      </nav>

    </>
  )
};

export default Header;