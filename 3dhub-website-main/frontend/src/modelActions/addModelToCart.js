import axios from "axios";
import {MAIN_URL} from "../App";

const addModelToCart = (model) => {
    axios({
        url: MAIN_URL + `/cart/add/${model.id}/`,
        method: 'POST',
    })
}

export default addModelToCart;