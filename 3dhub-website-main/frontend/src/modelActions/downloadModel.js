import axios from "axios";
import {MAIN_URL} from "../App";

const downloadModel = (model) => {
    axios({
        url: MAIN_URL + `/download_model/${model.id}/`,
        method: 'GET',
        responseType: 'blob', // important
    })
        .then(result => {
            const href = window.URL.createObjectURL(result.data);

            const anchorElement = document.createElement('a');

            anchorElement.href = href;
            anchorElement.download = model.name;

            document.body.appendChild(anchorElement);
            anchorElement.click();

            document.body.removeChild(anchorElement);
            window.URL.revokeObjectURL(href);
        })

        .catch(error => {
            console.log(error);
        })
}

export default downloadModel;