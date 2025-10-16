import axios from "axios";
import {MAIN_URL} from "../App";
import {useState} from "react";

const loadstaticContextMenu = (setStaticContext, setCart) => {
    axios.get(MAIN_URL + '/home/')
        .then(result => {
            setStaticContext(
                result.data
            )
        })
        .catch(error => {
            console.log(error);
        })

    axios.get(MAIN_URL + '/cart/')
        .then(result => {
            setCart(
                result.data
            )
        })
        .catch(error => {
            console.log(error);
        })
}

export default loadstaticContextMenu;