import React from 'react';
import {API_STATIC_URL} from "../App";
import styles from '../styles/ListModels.module.css';

const IsStaffIcon = (props) => {
    if (props.is_staff) {
        return (
            <div className={styles.modelCardAuthorVerification} title="Official account">
                <img src={API_STATIC_URL + 'market/images/verification_icon.svg'}/>
            </div>
        );
    }
};

export default IsStaffIcon;