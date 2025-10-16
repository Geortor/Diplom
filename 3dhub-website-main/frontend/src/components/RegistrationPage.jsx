import React, {useState} from 'react';
import {API_STATIC_URL, MAIN_URL} from "../App";
import styles from '../styles/RegistrationPage.module.css'
import axios from "axios";

const RegistrationPage = () => {
    const [fieldUsernameIsValid, setFieldUsernameIsValid] = useState(false)
    const [fieldEmailIsValid, setFieldEmailIsValid] = useState(false)
    const [fieldPassword, setFieldPasswordIsValid] = useState(false)
    const [fieldPasswordConfirm, setFieldPasswordConfirmIsValid] = useState(false)
    const [agreeWithPolitic, setAgreeWithPolitic] = useState(false)

    const isActiveCheckBox = () => {
        const checkBox = document.querySelector(`.${styles.agreePoliticCheckBox.replace('+', '\\+')}`)
        const checkBoxImg = document.getElementById(styles.checkAgreePoliticMarkImg)

        if (agreeWithPolitic) {
            setAgreeWithPolitic(false)
            checkBox.style.backgroundColor = 'transparent'
            checkBoxImg.style.display = 'block'
        } else {
            setAgreeWithPolitic(true)
            checkBox.style.backgroundColor = '#FFB100'
            checkBoxImg.style.display = 'block'
        }
    }

    const fieldError = (textError, parentClass) => {
        let blockFieldError = parentClass.querySelector(`.${styles.fieldError.replace('+', '\\+')}`)
        blockFieldError.className = styles.fieldError
        blockFieldError.innerHTML = textError
    }

    let timeValidateFieldUsername;
    const validateFieldUsername = () => {
        clearTimeout(timeValidateFieldUsername);

        timeValidateFieldUsername = setTimeout(
            async () => {
                setFieldUsernameIsValid(false)

                let usernameFieldParentClass = document.querySelector(`.${styles.usernameLabel}`)
                let usernameFieldError = usernameFieldParentClass.querySelector(`.${styles.fieldError.replace('+', '\\+')}`)

                usernameFieldError.innerHTML = ''

                const usernameField = document.getElementById('usernameField').value.trim().toLowerCase()
                const usernamePattern = /^[a-zA-Z0-9]+$/
                const usernameCheckMark = usernameFieldParentClass.querySelector(`.${styles.confirmCheckMark}`)

                if (usernameField.length < 4) {
                    fieldError('Имя пользователя слишком короткое', usernameFieldParentClass)
                    usernameCheckMark.style.opacity = '0'
                } else if (!usernamePattern.exec(usernameField)) {
                    fieldError('Такое имя пользователя не подходит', usernameFieldParentClass)
                    usernameCheckMark.style.opacity = '0'
                } else {
                    let checkUser = await new Promise((resolve, reject) => {
                        axios({
                            url: `${MAIN_URL}/username_validate/${usernameField}/`,
                            method: 'POST',
                        }).then(result => resolve(result.data['is_exists']));
                    })

                    if (checkUser) {
                        fieldError('Такое имя пользователя уже занято', usernameFieldParentClass)
                        usernameCheckMark.style.opacity = '0'
                    } else {
                        setFieldUsernameIsValid(true)
                        usernameCheckMark.style.opacity = '1'
                    }
                }
            }, 1000, this)
    }
    const validateFieldEmail = async () => {
        setFieldEmailIsValid(false)

        let emailFieldParentClass = document.querySelector(`.${styles.emailLabel}`)
        let emailFieldError = emailFieldParentClass.querySelector(`.${styles.fieldError.replace('+', '\\+')}`)

        emailFieldError.innerHTML = ''

        const emailField = document.getElementById('emailField').value.trim()
        const emailPattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        const emailCheckMark = emailFieldParentClass.querySelector(`.${styles.confirmCheckMark}`)


        if (!emailPattern.exec(emailField)) {
            fieldError('Неверный email', emailFieldParentClass)
            emailCheckMark.style.opacity = '0'
        } else {
            emailCheckMark.style.opacity = '1'
            setFieldEmailIsValid(true)
        }
    }

    const validatePassword = () => {
        setFieldPasswordIsValid(false)

        validatePasswordConfirm()

        let passwordParentClass = document.querySelector(`.${styles.passwordLabel}`)
        let passwordError = passwordParentClass.querySelector(`.${styles.fieldError.replace('+', '\\+')}`)

        passwordError.innerHTML = ''

        const passwordField = document.getElementById('passwordField').value.trim()
        const passwordPattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        const passwordCheckMark = passwordParentClass.querySelector(`.${styles.confirmCheckMark}`)


        if (!passwordPattern.exec(passwordField)) {
            fieldError('Неверный пароль', passwordParentClass)
            passwordCheckMark.style.opacity = '0'
        } else {
            passwordCheckMark.style.opacity = '1'
            setFieldPasswordIsValid(true)
        }
    }

    const validatePasswordConfirm = () => {
        setFieldPasswordConfirmIsValid(false)

        let passwordConfirmParentClass = document.querySelector(`.${styles.passwordConfirmLabel}`)
        let passwordConfirmError = passwordConfirmParentClass.querySelector(`.${styles.fieldError.replace('+', '\\+')}`)

        passwordConfirmError.innerHTML = ''

        const passwordField = document.getElementById('passwordField').value.trim()
        const passwordConfirmField = document.getElementById('passwordConfirmField').value.trim()
        const passwordConfirmCheckMark = passwordConfirmParentClass.querySelector(`.${styles.confirmCheckMark}`)


        if (passwordField !== passwordConfirmField) {
            fieldError('Пароли не совпадают', passwordConfirmParentClass)
            passwordConfirmCheckMark.style.opacity = '0'
        } else {
            passwordConfirmCheckMark.style.opacity = '1'
            setFieldPasswordConfirmIsValid(true)
        }
    }

    const confirmForm = async () => {
        const usernameField = document.getElementById('usernameField').value.trim().toLowerCase()
        const emailField = document.getElementById('emailField').value.trim()
        const passwordField = document.getElementById('passwordField').value.trim()

        const formError = document.querySelector(`.${styles.formError}`)

        if (fieldUsernameIsValid && fieldEmailIsValid && fieldPassword && fieldPasswordConfirm && agreeWithPolitic) {
            axios({
                url: `${MAIN_URL}/signup/`,
                method: 'POST',
                data: {
                    username: usernameField,
                    email: emailField,
                    password: passwordField
                },
                validateStatus: (status) => {
                    return status >= 200 && status < 500
                }
            })
                .then(res => {
                    if (res.status === 400) {
                        formError.innerHTML = `Пользователь с адресом ${emailField} уже зарегистрирован на сайте`
                    } else {
                        formError.innerHTML = `Пользователь был успешно создан`
                    }
                });
        } else {
            formError.innerHTML = 'В форме присутствуют неправильно заполненные поля'
        }
    }

    return (
        <div className="wrapper">
            <div className={styles.main}>
                <div className={styles.registrationForm}>
                    <div className={styles.logoRegistrationForm}>
                        <a href='/'><img src={API_STATIC_URL + 'market/images/logo.svg'}/></a>
                    </div>
                    <div className={styles.registrationFormTitle}>Регистрация</div>
                    <div className={styles.formError}></div>
                    <div className={styles.form}>
                        <div className={styles.usernameInputBlock}>
                            <label className={styles.usernameLabel} htmlFor="usernameField">
                                <span>Имя пользователя</span>
                                <input id="usernameField" type="text" maxLength="20" onChange={validateFieldUsername}/>
                                <span className={styles.fieldError}></span>
                                <span className={styles.confirmCheckMark}></span>
                            </label>
                        </div>
                        <div className={styles.emailInputBlock}>
                            <label className={styles.emailLabel} htmlFor="emailField">
                                <span>Email</span>
                                <input id="emailField" type="email" onChange={validateFieldEmail}/>
                                <span className={styles.fieldError}></span>
                                <span className={styles.confirmCheckMark}></span>
                            </label>
                        </div>
                        <div className={styles.passwordInputBlock}>
                            <label className={styles.passwordLabel} htmlFor="passwordField">
                                <span>Пароль</span>
                                <input id="passwordField" type="password" onChange={validatePassword}/>
                                <span className={styles.fieldError}></span>
                                <span className={styles.confirmCheckMark}></span>
                            </label>
                        </div>
                        <div className={styles.passwordConfirmInputBlock}>
                            <label className={styles.passwordConfirmLabel} htmlFor="passwordConfirmField">
                                <span>Повторите пароль</span>
                                <input id="passwordConfirmField" type="password" onChange={validatePasswordConfirm}/>
                                <span className={styles.fieldError}></span>
                                <span className={styles.confirmCheckMark}></span>
                            </label>
                        </div>

                        <div className={styles.agreePoliticBlock}>
                            <div className={styles.agreePoliticCheckBox} onClick={isActiveCheckBox}>
                                <img id={styles.checkAgreePoliticMarkImg}
                                     src={API_STATIC_URL + 'market/images/checkmark.svg'}/>
                            </div>
                            <label className={styles.politicTitle}>
                                <span>Соглашаюсь с</span>
                                <a className={styles.politicUrl}>политикой конфиденциальности</a>
                            </label>
                        </div>
                    </div>
                    <div className={styles.registrationButtonWrapper}>
                        <div className={styles.registrationButton} onClick={confirmForm}>
                            <a href="#">Регистрация</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default RegistrationPage;