import React from 'react';
import { useEffect } from "react";
import Image from "../assets/404.gif";
import { useNavigate } from "react-router-dom"

const ErrorPage = () => {
    const navigate = useNavigate()


    useEffect(() => {
        setTimeout(() => {
            navigate(-1);
        }, 6000);
    }) 
    return(
        <section className="error-page">
            <div className="errorPage_container">
                <img src={Image} alt="Paage Not Found" width="250" height="250" style={{maxWidth: '100%', height: 'auto'}} />
                <h1>ERROR 404</h1>
                <p>this page does not exist. You will be redirect to the previous page shortly.</p>
            </div>
            </section>
    )
}
export default ErrorPage;