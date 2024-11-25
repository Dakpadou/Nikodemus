import React, { useState, useEffect } from "react";
import FormationComponent from "../components/formationcomponent";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";



const FormationPage = () => {

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>NikoDemus-Formations</title>
                <meta
                    name="description"
                    content="Toutes nos formations"
                />
                <link rel="canonical" href={`http://localhost:5173/formation`} />
            </Helmet>
            <h1>Toutes les formations</h1>
            <FormationComponent />
        </>
    )
};

export default FormationPage;