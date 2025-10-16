import React, {useState} from 'react';
import {API_STATIC_URL} from "../App";
import styles from '../styles/LoginPage.module.css'

const LoginPage = () => {
    const [savePassword, setSavePassword] = useState(false)

    const isActiveCheckBox = () => {
        const checkBox = document.querySelector(`.${styles.savePasswordCheckBox}`)
        const checkMark = document.querySelector(`.${styles.confirmCheckMark}`)

        if (savePassword) {
            setSavePassword(false)
            checkBox.style.backgroundColor = 'transparent'
            checkMark.style.borderColor = 'transparent'
        } else {
            setSavePassword(true)
            checkBox.style.backgroundColor = '#FFB100'
            checkMark.style.borderColor = 'white'
        }
    }

    return (
        <div className="wrapper">
            <div className={styles.main}>
                <div className={styles.loginForm}>
                    <div className={styles.logoLoginForm}>
                        <a href='/'><img src={API_STATIC_URL + 'market/images/logo.svg'}/></a>
                    </div>
                    <div className={styles.loginFormTitle}>Вход</div>
                    <div className={styles.form}>
                        <div className={styles.loginInputBlock}>
                            <label className={styles.loginLabel} htmlFor="login">
                                <span>Логин(username)</span>
                                <input id="login" type="text"/>
                            </label>
                        </div>

                        <div className={styles.passwordInputBlock}>
                            <label className={styles.passwordLabel} htmlFor="password">
                                <span>Пароль</span>
                                <input id="password" type="password"/>
                            </label>
                        </div>

                        <a href="#" className={styles.passwordRecovery}>
                            Забыли пароль?
                        </a>

                        <div className={styles.savePasswordBlock}>
                            <div className={styles.savePasswordCheckBox} onClick={isActiveCheckBox}>
                                    <span className={styles.confirmCheckMark}></span>
                            </div>
                            <label htmlFor="savePassword">
                                <span onClick={isActiveCheckBox}>Сохранить пароль</span>
                            </label>
                        </div>
                    </div>
                    <div className={styles.loginButtonWrapper}>
                        <div className={styles.loginButton}>
                            <a href="#">Войти</a>
                        </div>
                    </div>
                    <div className={styles.registrationBlock}>
                        <span>Ещё не зарегистрированы?</span>
                        <a href="/register/" className={styles.registrationButton}>Давайте это исправим</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;