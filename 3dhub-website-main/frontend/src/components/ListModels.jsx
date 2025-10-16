import React, {useEffect, useState} from 'react';
import axios from "axios";
import Author from "./ModelListView/Author";
import {API_STATIC_URL, MAIN_URL} from "../App";
import styles from '../styles/ListModels.module.css'
import {Link} from "react-router-dom";
import ModelButtons from "./ModelListView/ModelButtons";
import Header from "./Header";
import Footer from "./Footer";
import loadstaticContextMenu from "../modelActions/loadStatic";

const ListModels = () => {
    document.title = '3DHUB - Маркетплейс'
    const [data, setData] = useState([])
    const [staticContext, setStaticContext] = useState([])
    const [cart, setCart] = useState([])
    const [witdh, setWitdh] = useState(window.innerWidth)

    const loadModels = () => {
        axios.get(MAIN_URL + '/market/')
            .then(result => {
                setData(
                    result.data
                )
            })
            .catch(error => {
                console.log(error);
            })
    }

    const handleResize = () => {
        setWitdh(window.innerWidth)
    }


    useEffect(() => {
        loadstaticContextMenu(setStaticContext, setCart)
        loadModels()
        window.addEventListener("resize", handleResize)
    }, [])

    return (
        <div className='wrapper'>
            <Header header_menu={staticContext.header_menu} cart={cart} width={witdh}/>
            <div className={styles.main}>
                <div className={styles.modelsContainer}>
                    {data.map((model) =>
                        (<div className={styles.modelCard} key={model.id}>
                                <div className={styles.modelCardOverMenu}>
                                    <div className={styles.modelCardPrice}>
                                        <span>{model.price ? `₽ ${model.price}` : 'Бесплатно'}</span>
                                    </div>
                                    <div className={styles.modelCardLike}><img
                                        src={API_STATIC_URL + 'market/images/like_heart.svg'}/>
                                    </div>
                                </div>
                                <div className={styles.modelCardImage}>
                                    <Link to={`/model/${model.id}`}>
                                        <img src={MAIN_URL + model.images[0].image}/>
                                    </Link>
                                </div>
                                <div className={styles.modelCardName}><a href="#">{model.name}</a></div>
                                <Author author={model.author}/>
                                <div className={styles.modelCardButtons}>
                                    <ModelButtons model={model}/>
                                </div>
                            </div>

                        )
                    )
                    }

                </div>
                <Footer over_footer_menu={staticContext.over_footer_menu}
                        under_footer_menu={staticContext.under_footer_menu}
                        width={witdh}/>
            </div>
        </div>)
}

export default ListModels;