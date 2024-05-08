import styled from "@emotion/styled";
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

const home = () => {
    return (<div class="landing-page">

        <div class="content">
            <div class="container">
                <div class="info">
                    <h1>Stay Informed on Local Hazards</h1>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus odit nihil ullam nesciunt quidem iste, Repellendus odit nihil</p>
                    <button>View Map</button>
                </div>

                <div class=" image ">
                    <img src="public\assets\icons\map.png " />
                </div>
            </div>
        </div>
    </div>)
}
export default home