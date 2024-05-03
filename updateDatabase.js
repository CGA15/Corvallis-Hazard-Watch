
const apiKey = 'bed1848ba67a4ff12b0e3c2f5c0421fe';

// Import required modules and define Supabase client
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://tkmthnhmpgonqiwlgjvu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrbXRobmhtcGdvbnFpd2xnanZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2MzA2NTQsImV4cCI6MjAyMTIwNjY1NH0.GOazICQfn1jgQJ_8zuF2vUb-x-3Un4lYQzmmjTQrf5k';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to fetch hazards from Supabase
const getHazards = async () => {
    try {
        const { data, error } = await supabase.from('hazards').select('*');
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Internal server error');
    }
};

// Function to fetch location data from OpenWeatherMap API
const getLocation = async (lat, lon) => {
    try {
        const limit = 1;
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=${limit}&appid=${apiKey}`);
        const locationData = await response.json();
        return locationData;
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching location data');
    }
};
const put = async (newdata, id) => {

    const hazID = id;
    const updateData = newdata;
  
    try {
      const { data, error } = await supabase.from('hazards').update(updateData).eq('id', hazID);
  
      if (error) {
        throw error;
      }
  
      console.log('Hazard updated successfully')
    } catch (error) {
      console.error(error);
      console.log( 'Internal server error' );
    }
  
};
// Main function to fetch hazards, get location data, and print
async function main() {
    try {
        const hazards = await getHazards();
        for (let i = 0; i < hazards.length; i++) {
            const lat = hazards[i].latitude;
            const lon = hazards[i].longitude;
            const location = await getLocation(lat, lon);
            // console.log(location);
            if(location[0] && location[0].country && location[0].country === "US")
            {
                const locString = `${location[0].name},${location[0].state}, ${location[0].country}`
                hazards[i].location=locString;
                put(hazards[i], hazards[i].id)
            }
            else
            {
                if(location[0] && location[0].country)
                {
                    const locString = `${location[0].name}, ${location[0].country}`
                    hazards[i].location=locString;
                    put(hazards[i], hazards[i].id)
                }
                else{
                    console.log("invalid")
                    hazards[i].location="N/A";
                    put(hazards[i], hazards[i].id)
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
}

main();
