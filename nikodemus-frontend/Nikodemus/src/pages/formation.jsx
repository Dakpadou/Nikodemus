import React, { useState, useEffect } from "react";
import FormationComponent from "../components/formationcomponent";
import { Link } from "react-router-dom";



const FormationPage = () => {

return (
    <>
        <h1>Toutes les formations</h1>
        <FormationComponent />
    </>
)
};

export default FormationPage;