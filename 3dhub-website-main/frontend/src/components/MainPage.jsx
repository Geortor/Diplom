import styles from '../styles/MainPage.module.css'
import React, {useEffect, useState} from 'react';
import {API_STATIC_URL, MAIN_URL} from "../App";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import loadstaticContextMenu from "../modelActions/loadStatic";

const MainPage = () => {
    const [staticContext, setStaticContext] = useState([])
    const [cart, setCart] = useState([])
    const [witdh, setWitdh] = useState(window.innerWidth)

    const handleResize = () => {
        setWitdh(window.innerWidth)
    }


    useEffect(() => {
        loadstaticContextMenu(setStaticContext, setCart)
        window.addEventListener("resize", handleResize)
    }, [])

    return (
        <div className='wrapper'>
            <Header header_menu={staticContext.header_menu} cart={cart} width={witdh}/>
            <div className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.greetingBlock}>
                        <div className={styles.greetingBlockInformation}>
                            <div className={styles.logo}>
                                <img id="logo-image" src={API_STATIC_URL + 'market/images/logo.svg'}/>
                            </div>
                            <div className={styles.title}>
                                <span className="title-text">Найдёшь, научишься и заработаешь на 3D моделях</span>
                            </div>
                            <div className={styles.description}>
                                <span className="description-text">Пройди регистрацию, выбери роль и продавай или покупай 3D модели!</span>
                            </div>
                            <div className={styles.button}>
                                <span className="button-text">Регистрация</span>
                            </div>
                        </div>
                        <a className={styles.greetingBlockImage} href="#">
                            <img id={styles.greetingImage}
                                 src={API_STATIC_URL + 'market/images/greeting-block-image.svg'}/>
                        </a>
                    </div>
                    <div className={styles.aboutUs}>
                        <div className={styles.aboutUsBlockImage}>
                            <img id={styles.aboutUsImage} src={API_STATIC_URL + 'market/images/about-us.svg'}/>
                        </div>
                        <div className={styles.aboutUsBlockInformation}>
                            <div className={styles.title}>
                                <span className="title-text">О нас</span>
                            </div>
                            <div className={styles.description}>
                                <span className="description-text">Мы команда 3DHUB. Наш девиз - удобство! Впервую очередь мы нацелены на вас - наших дорогих пользователей, вместе с вами мы с каждым днем становимся лучше!</span>
                            </div>
                            <div className={styles.button}>
                                <span className="button-text">Подробнее</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.ourServices}>
                        <div className={styles.ourServicesBlockImages}>
                            <div className={styles.photo1}></div>
                            <div className={styles.photo2}></div>
                            <div className={styles.photo3}></div>
                        </div>
                        <div className={styles.ourServicesBlockInformation}>
                            <div className={styles.title}>
                                <span className="title-text">Наши сервисы</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.socialMedia}>
                        <div className={styles.socialMediaBlockImages}>
                            <div className={styles.photo4}></div>
                            <div className={styles.photo5}></div>
                        </div>
                        <div className={styles.socialMediaBlockInformation}>
                            <div className={styles.title}>
                                <span className="title-text">Будь в курсе всего!</span>
                            </div>
                            <div className={styles.description}>
                                <span className="description-text">Новости 3DHUB в социальных сетях</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer over_footer_menu={staticContext.over_footer_menu}
                    under_footer_menu={staticContext.under_footer_menu}
                    width={witdh}/>
        </div>
    );
};

export default MainPage;