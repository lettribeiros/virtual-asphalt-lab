import React, { useState } from 'react';
import menu_icon from '../assets/menu-icon.png'
import '../styles/Home.css';

function NavMenu() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLinkClick = () => {
        setMenuOpen(false); 
    };

    return (
        <div className="nav-menu">
            <div className="menu">
                <a href="#inicio">HOME</a>
                <a href="#descricao">LEIA-ME</a>
                <a href="#lab">LABORATÓRIO</a>
                <a href="#about-us">SOBRE</a>
            </div>
            <div className="menu-icon" onClick={toggleMenu}>
                <img src={menu_icon} alt="Menu" />
            </div>
            {menuOpen && (
                <div className="menu-popup"> 
                    <a href="#inicio" onClick={handleLinkClick}>HOME</a>
                    <a href="#descricao" onClick={handleLinkClick}>LEIA-ME</a>
                    <a href="#lab" onClick={handleLinkClick}>LABORATÓRIO</a>
                    <a href="#about-us" onClick={handleLinkClick}>SOBRE</a>
                </div>
            )}
        </div>
    );
}

export default NavMenu;
