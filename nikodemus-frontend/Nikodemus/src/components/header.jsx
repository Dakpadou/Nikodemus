import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Home from "../pages/Home";
import Formation from "../pages/Formation";




const Header = () => {

  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Accueil  </Link>
          </li>
          <li>
            <Link to="/formation">Formation</Link>
          </li>
          <li> Administrateur
            <ul>
              <li>
            <Link to="/admin/formation/add">Admin</Link>
            </li>
            </ul>
          </li>
        </ul>
      </nav>

    </>
  )
};

export default Header;