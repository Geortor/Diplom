import React from 'react';
import {API_STATIC_URL} from "../../App";
import downloadModel from "../../modelActions/downloadModel";

const ModelButtons = (props) => {
    if (props.model.price) {
        return (<div className={props.styles.modelControlButtons}>
            <div className={props.styles.modelAddToCart}>
                <img src={API_STATIC_URL + 'market/images/add-to-cart.svg'}/>
                <span>В корзину</span>
            </div>
        </div>)
    }

    return (<div className={props.styles.modelControlButtons}>
            <a className={props.styles.modelDownload} onClick={() => downloadModel(props.model)}>
                <img src={API_STATIC_URL + 'market/images/download-icon.svg'}/>
                <span>Скачать</span>
            </a>
        </div>
    )
};

export default ModelButtons;