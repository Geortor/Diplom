import styles from '../styles/ModelPage.module.css'
import React, {useEffect, useState} from 'react';
import axios from "axios";
import {API_STATIC_URL, MAIN_URL} from "../App";
import ModelButtons from "./ModelView/ModelButtons";
import Header from "./Header";
import loadstaticContextMenu from "../modelActions/loadStatic";

const Model = () => {
    const [model, setModel] = useState([])
    const [staticContext, setStaticContext] = useState([])
    const [cart, setCart] = useState([])
    const modelId = window.location.href.split('/').at(-1)
    const [witdh, setWitdh] = useState(window.innerWidth)

    const loadModel = () => {
        axios.get(MAIN_URL + '/model/' + modelId + '/')
            .then(result => {
                setModel(
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
        loadModel()
        window.addEventListener("resize", handleResize)
    }, [])

    const time_view = (time) => {
        const date_add_model = new Date(time)
        const date_now = new Date(Date.now())
        const time_difference = date_now - date_add_model
        const day_difference = Math.abs(date_now.getDay() - date_add_model.getDay())
        const COUNT_MS_IN_DAY = 86400000

        let hours_date_add_model = date_add_model.getHours()
        if (hours_date_add_model < 10) {
            hours_date_add_model = '0' + String(hours_date_add_model)
        }

        let minutes_date_add_model = date_add_model.getMinutes()
        if (minutes_date_add_model < 10) {
            minutes_date_add_model = '0' + String(minutes_date_add_model)
        }

        let view_add_model_time = `${hours_date_add_model}:${minutes_date_add_model}`

        const MONTHS = [
            'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
            'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'
        ]

        let time_view;
        if (COUNT_MS_IN_DAY > time_difference && day_difference === 0) {
            time_view = `Сегодня в ${view_add_model_time}`
        } else if (COUNT_MS_IN_DAY * 2 > time_difference > COUNT_MS_IN_DAY && day_difference === 1) {
            time_view = `Вчера в ${view_add_model_time}`
        } else if (date_now.getFullYear() === date_add_model.getFullYear()) {
            time_view = `${date_add_model.getUTCDate()} ${MONTHS[date_add_model.getMonth()]} в 
            ${view_add_model_time}`
        }

        return time_view
    }


    if (model.author) {
        document.title = `3DHUB - Модель пользователя ${model.author.username} - ${model.name}`
        return (
            <div className={styles.main}>
                <Header header_menu={staticContext.header_menu} cart={cart} width={witdh}/>
                <div className={styles.contentContainer}>
                    <div className={styles.modelImage}><img src={MAIN_URL + model.images[0].image}/></div>
                    <div className={styles.modelInformation}>
                        <div className={styles.modelName}><span>{model.name}</span></div>
                        <div className={styles.modelStatistic}>
                            <div className="numberOfViews" title="Количество просмотров модели">
                                <img src={API_STATIC_URL + 'market/images/view-icon.svg'}/>
                                <span id={styles.views}>{model.count_views}</span>
                            </div>
                            <div className="numberOfLikes" title="Количество лайков модели">
                                <img src={API_STATIC_URL + 'market/images/like_heart.svg'}/>
                                <span id={styles.likes}>0</span>
                            </div>
                            <div className={styles.numberOfComments} title="Количество комментариев модели">
                                <img src={API_STATIC_URL + 'market/images/comment-icon.svg'}/>
                                <span id={styles.comments}>0</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.authorBlockAndOther}>
                        <div className={styles.modelAuthor}>
                            <div className={styles.modelAuthorAvatar}><img
                                src={MAIN_URL + model.author.profile.avatar}/>
                            </div>
                            <div className={styles.modelAuthorInformationWrapper}>
                                <div className={styles.modelAuthorInformation}>
                                    <div className={styles.modelAuthorNameWrapper}>
                                        <div className={styles.modelAuthorUsername}><span>{model.author.username}</span>
                                        </div>
                                        <div className={styles.modelAuthorVerification} title="Official account"><img
                                            src={API_STATIC_URL + 'market/images/verification_icon.svg'}/>
                                        </div>
                                    </div>
                                    <div className={styles.modelAuthorEvaluation}>
                                        <img src={API_STATIC_URL + 'market/images/star.svg'}/>
                                        <span>0.0</span>
                                    </div>
                                    <div className={styles.modelAuthorLikes}>
                                        <img src={API_STATIC_URL + 'market/images/like_heart.svg'}/>
                                        <span>0</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.buttonFollow}><span>Подписаться</span></div>
                        </div>
                        <div className={styles.otherButton}>
                            <div className={styles.replyButton} title="Поделиться моделью в соц.сетях">
                                <img src={API_STATIC_URL + 'market/images/reply-icon.svg'}/>
                                <span>Поделиться</span>
                            </div>
                            <div className={styles.complaintButton} title="Пожаловаться на модель">
                                <img src={API_STATIC_URL + 'market/images/warning-icon.svg'}/>
                                <span>Пожаловаться</span>
                            </div>
                        </div>
                    </div>
                    <ModelButtons model={model} styles={styles}/>
                    <div className={styles.modelDescription}>
                        <div className={styles.title}>
                            <span>Описание</span>
                        </div>
                        <div className={styles.description}><span>{model.description}</span></div>
                    </div>
                    <div className={styles.modelDateAdd}>
                        <img src={API_STATIC_URL + 'market/images/clock-icon.svg'}/>
                        <div className="date">{time_view(model.time_create)}</div>
                    </div>
                    <div className="model-commentary-block">
                        <div className="title">
                            <span>Комментарии</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


}

export default Model;