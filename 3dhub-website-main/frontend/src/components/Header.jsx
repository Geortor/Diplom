import React, {useState} from "react";
import {API_STATIC_URL} from "../App";
import SocialMediaFooter from "./SocialMediaFooter";

const Header = (props) => {
    const [isOpenBurgerMenu, setIsOpenBurgerMenu] = useState(false)

    const checkOpenBurgerMenu = () => {
        let burger_menu_block = document.querySelector('.burger-menu-container')
        if (isOpenBurgerMenu) {
            burger_menu_block.style.right = '-350px'
            setIsOpenBurgerMenu(false)
        } else {
            burger_menu_block.style.right = '0'
            setIsOpenBurgerMenu(true)
        }
    }

    if (props.width <= 771 && props.header_menu) {
        return (<header>
            <div className="header-container">
                <div className="logo">
                    <a href="/"><img src={API_STATIC_URL + 'market/images/logo.svg'}/></a>
                </div>
                <div className="actions-wrapper">
                    <div className="cart">
                        <img src={API_STATIC_URL + 'market/images/cart.svg'}/>
                    </div>
                    <div className="burger-menu-button" onClick={checkOpenBurgerMenu}>
                        <span className="burger-menu-visual"></span>
                        <span className="burger-menu-visual"></span>
                        <span className="burger-menu-visual"></span>
                    </div>
                    <div className="burger-menu-container">
                        <div className="burger-menu-categories">
                            <a href="/login/">Войти</a>
                            {
                                props.header_menu.map((element, idx) => {
                                    return (
                                        <a href={element.url} key={idx}>{element.title}</a>
                                    )
                                })
                            }
                        </div>
                        <SocialMediaFooter classname="burger-menu-social-media"/>
                    </div>
                </div>

            </div>
        </header>)
    } else if (props.width > 771 && props.header_menu) {

        return (<header>
                <div className="header-container">
                    <div className="logo">
                        <a href="/"><img src={API_STATIC_URL + 'market/images/logo.svg'}/></a>
                    </div>
                    <div className="header-menu">
                        {
                            props.header_menu.map((element, idx) => {
                                return (
                                    <a href={element.url} key={idx}>{element.title}</a>
                                )
                            })
                        }
                    </div>

                    <div className="login-button-wrapper">
                        <div className="cart">
                            <img src={API_STATIC_URL + 'market/images/cart.svg'}/>
                        </div>
                        <a href="/login/" className="login-button">
                            Войти
                        </a>
                    </div>
                </div>
            </header>
        );
    }
}

export default Header