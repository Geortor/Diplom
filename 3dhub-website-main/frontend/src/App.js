import './styles/App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import ListModels from "./components/ListModels";
import MainPage from "./components/MainPage";
import Model from "./components/Model";
import LoginPage from "./components/LoginPage";
import RegistrationPage from "./components/RegistrationPage";
import VerifyEmail from "./components/VerifyEmail";

export const API_STATIC_URL = "https://3dhub.site/static/rest/"

export const MAIN_URL = "http://localhost:8000/api"

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage/>}/>
                <Route path="/market/" element={<ListModels/>}/>
                <Route path="/model/:modelId" element={<Model/>}/>
                <Route path="/login/" element={<LoginPage/>}/>
                <Route path="/register/" element={<RegistrationPage/>}/>
                <Route path="/verify_signup/" element={<VerifyEmail/>} />
            </Routes>
        </Router>
    )

}

export default App;
