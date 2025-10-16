import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {MAIN_URL} from "../App";
import {useNavigate} from "react-router-dom";
import styles from '../styles/VerifyEmail.module.css'

function VerifyEmail(props) {
    const [message, setMessage] = useState('');
    const [resultResponce, setResultResponce] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const uid = window.location.href.split('uid=')[1].split('&')[0]
        const token = window.location.href.split('token=')[1]
        axios.post(`${MAIN_URL}/signup/activate/${uid}/${token}/`,)
            .then(response => {
                setMessage('Ваш email успешно подтвержден! Через несколько секунд вы будете перенаправлены на страницу входа...')
                setResultResponce(true)
                setTimeout(() => {
                    navigate('/login/')
                }, 3000)
            })
            .catch(error => {
                setMessage('Произошла ошибка при подтверждении email. Попробуйте снова перейти по ссылке в письме или обратитесь в службу поддержки!')
            })
    }, [])

    return (
        <div className={resultResponce ? styles.success : styles.error}>
            <span>{message}</span>
        </div>
    );
}

export default VerifyEmail;
