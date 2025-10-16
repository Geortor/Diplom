import React from 'react';
import {API_STATIC_URL} from "../App";

const SocialMediaFooter = (props) => {
    return (
        <div className={props.classname}>
            <a href="https://t.me/online3dhub" className={props.classname + '-telegram'}>
                <img src={API_STATIC_URL + 'market/images/telegram_icon.svg'}/>
            </a>
            <a href="https://t.me/threedhub_bot" className={props.classname + '-telegram-bot'}>
                <img src={API_STATIC_URL + 'market/images/telegram_bot_icon.svg'}/>
            </a>
            <a href="https://vk.com/online3dhub" className={props.classname + '-vk'}>
                <img src={API_STATIC_URL + 'market/images/vk_icon.svg'}/>
            </a>
        </div>
    );
};

export default SocialMediaFooter;