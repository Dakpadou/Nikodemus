import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ManageFormation from "../../../components/manageformation";
import { Editor } from '@tinymce/tinymce-react';





const AddFormation = () => {
    const [data, setData] = useState({
        titre: "",
        presentation: "",
        prix: ""
    });

    const handleEditorChange = (content) => {
        setData({
            ...data,
            presentation: content
        });
    };


    const handleChange = (e) => {
        const value = e.target.value;
        setData({
            ...data,
            [e.target.name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();


        axios.post("http://localhost:3000/formation/add2", data, {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    };

    const TinyApi = import.meta.env.VITE_TINY_API_KEY;


    return (
        <>
            <h2>ajout formation</h2>
            <form onSubmit={handleSubmit}>
                <label>Titre</label>
                <input type="text" name="titre" value={data.titre} onChange={handleChange} />
                <label>Presentation</label>
                {/* <input type="text" name="presentation" value={data.presentation} onChange={handleChange} /> */}
                <Editor
                    apiKey={TinyApi}
                    value={data.presentation}
                    onEditorChange={handleEditorChange}
                    init={{
                        plugins: [
                            // Core editing features
                            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                            // Your account includes a free trial of TinyMCE premium features
                            // Try the most popular premium features until Nov 28, 2024:
                            'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown',
                            // Early access to document converters
                            'importword', 'exportword', 'exportpdf'
                        ],
                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                        tinycomments_mode: 'embedded',
                        tinycomments_author: 'Author name',
                        mergetags_list: [
                            { value: 'First.Name', title: 'First Name' },
                            { value: 'Email', title: 'Email' },
                        ],
                        ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                        exportpdf_converter_options: { 'format': 'Letter', 'margin_top': '1in', 'margin_right': '1in', 'margin_bottom': '1in', 'margin_left': '1in' },
                        exportword_converter_options: { 'document': { 'size': 'Letter' } },
                        importword_converter_options: { 'formatting': { 'styles': 'inline', 'resets': 'inline', 'defaults': 'inline', } },
                    }}
                    initialValue="Welcome to TinyMCE!"
                />

                <label>Prix</label>
                <input type="text" name="prix" value={data.prix} onChange={handleChange} />
                <button type="submit">Ajouter</button>

            </form>

            <ManageFormation />


        </>
    )
};

export default AddFormation;