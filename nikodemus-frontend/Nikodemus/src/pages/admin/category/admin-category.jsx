import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CategoryManager from "../../../components/admin/managecategory";


const categoryAdmin = () => {

    return (
        <>
        <h1>Gestionnaire de catégorie</h1>
        <CategoryManager/>
        </>
    )
};

export default categoryAdmin;