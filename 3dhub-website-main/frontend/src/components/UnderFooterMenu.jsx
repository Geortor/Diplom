import React, {Component} from 'react';
import {API_STATIC_URL} from "../App";
import SocialMediaFooter from "./SocialMediaFooter";

const UnderFooterMenu = (props) => {
    return (
        <div className="under-footer-menu">
            <div className="footer-info">
                <span className="title">3DHUB  ©2023</span>
            </div>
            {props.menu.map((element, idx) => {
                    return (
                        <a href="#" key={idx} className="under-footer-submenu-title">{element.title}</a>)
                }
            )
            }
            <SocialMediaFooter classname={'footer-social-media'}/>
        </div>
    );
}

export default UnderFooterMenu;