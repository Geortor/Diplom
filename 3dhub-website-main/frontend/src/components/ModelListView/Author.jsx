import React from 'react';
import {MAIN_URL} from "../../App";
import IsStaffIcon from "../IsStaffIcon";
import styles from '../../styles/ListModels.module.css';

const Author = (props) => {

    return (
        <div className={styles.modelCardAuthor}>
            <div className={styles.modelCardAuthorAvatar}><img src={MAIN_URL + props.author.profile.avatar}/>
            </div>
            <div className={styles.modelCardAuthorUsername}>{props.author.username}</div>
            <IsStaffIcon is_staff={props.author.is_staff}/>
        </div>
    );

}

export default Author;