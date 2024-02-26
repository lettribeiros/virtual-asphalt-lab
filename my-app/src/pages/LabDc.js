import React from "react";
import { Link } from "react-router-dom";
import home from "../assets/home.png";
import "./LabDc.css";

const LabDc = () => {
    return (
        <div className="containerLabDc">
            <Link to="/" className="buttonHomeLabDc">
            <img src={home} alt="casa"></img>
                Home
            </Link>
            <div className="conteudoLabDc">
                <h1>🚧 Em construção<span class="loading-dots">.</span><span class="loading-dots">.</span><span class="loading-dots">.</span> 🚧</h1>
            </div>
        </div>
    )
};

export default LabDc;