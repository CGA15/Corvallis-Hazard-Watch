import { useState } from "react";
import hazardTypes from './hazardTypes.json'; // Import hazardTypes data

export default function MapPopUp({ e, map }) {
    const [slider, setSlider] = useState(100);
    const [showSlider, setShowSlider] = useState(false);
    const [hazardType, setHazardType] = useState('');

    // Event handler for selecting a hazard type
    const handleSelectChange = (e) => {
        setHazardType(e.target.value);
    };
    
    // Function to close the popup
    const closePopup = () => {
        map.closePopup();
    };

    // Function to submit the form
    const submit = () => {
        // Perform submission logic here
        console.log("Submitted!");
        map.closePopup(); // Close the popup after submission
    };

    return (
        <div>
            <div>
                <h3>Please select a type of issue</h3>
                <select name="hazard" id="hazard" onChange={handleSelectChange}>
                    {hazardTypes.data.map((hazard, index) => (
                        <option key={index} value={hazard.id}>{hazard.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <input type="radio" name="htype" onChange={() => setShowSlider(false)} /> Point<br />
                <input type="radio" name="htype" onChange={() => setShowSlider(true)} /> Circle<br />
                {showSlider && (
                    <div id="radiusSlider">
                        <label htmlFor="radius">Radius:</label>
                        <input
                            type="range"
                            min="1"
                            max="200"
                            value={slider}
                            onChange={(e) => setSlider(parseInt(e.target.value))}
                        />
                        <span>{slider}</span> meters
                    </div>
                )} 
                <button onClick={closePopup}>Close</button>
                <button onClick={submit}>Submit</button>
            </div>
        </div>
    );
}
