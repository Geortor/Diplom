import React from 'react';
import downloadModel from "../../modelActions/downloadModel";
import addModelToCart from "../../modelActions/addModelToCart";
import styles from '../../styles/ListModels.module.css';

const ModelListButtons = (props) => {
    if (props.model.price) {
        return (
            <div className={styles.modelCardButtons}>
                <div className={styles.modelCardAddToCart} onClick={() => addModelToCart(props.model)}><span>В корзину</span></div>
            </div>
        )
    }

    return (<div className={styles.modelCardButtons}>
            <a className={styles.modelCardDownload} onClick={() => downloadModel(props.model)}>
                <span>Скачать</span>
            </a></div>
    )

}

export default ModelListButtons;