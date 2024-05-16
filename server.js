    const express = require("express")
    const app = express()
    const port = process.env.PORT || 8000
    const path = require("path");

    const { createClient } = require('@supabase/supabase-js');
    const supabaseUrl = 'https://tkmthnhmpgonqiwlgjvu.supabase.co'
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrbXRobmhtcGdvbnFpd2xnanZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2MzA2NTQsImV4cCI6MjAyMTIwNjY1NH0.GOazICQfn1jgQJ_8zuF2vUb-x-3Un4lYQzmmjTQrf5k"//process.env.SUPABASE_KEY
    const supabase = createClient(supabaseUrl, supabaseKey)



    app.use(express.json())


    app.use(function (req, res, next) {
        console.log("== Request received")
        console.log("  - METHOD:", req.method)
        console.log("  - URL:", req.url)
        console.log("  - HEADERS:", req.headers)
        next()
    })
    app.use(express.static(path.join(__dirname, "dist")));

    app.get('/', function (req, res, next) {
        res.sendFile(__dirname + "/dist/index.html");
    });
    // app.get('/map', function (req, res, next) {
    //     const requestedFile = req.params.request;
    //     const filePath = __dirname + "/dist/" + requestedFile;

    //     res.sendFile(filePath, function (err) {
    //         if (err) {
    //             next(err); // Pass the error to the next middleware
    //         } else {
    //             console.log('File sent:', filePath);
    //         }
    //     });
    // });

    // app.get('/font-awesome-4.7.0/css/:item',function(req,res,next){
    //     const filepath=__dirname+ "/font-awesome-4.7.0/css/" + item;
    //     console.log("=========" + filepath)
    //     res.sendFile(filepath, function (err) {
    //         if (err) {
    //             next(err); // Pass the error to the next middleware
    //         } else {
    //             console.log('File sent:', filepath);
    //         }
    //     });
    // })
    app.get('/api/Hazards', async (req, res) => {
        try {
            const { data, error } = await supabase.from('hazards').select('*');

            if (error) {
                throw error;
            }

            res.json({ data });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }

    });

    app.post('/api/addHazard', async (req, res) => {
        try {
            const { data, error } = await supabase
                .from('hazards')
                .insert([
                    { type: req.body.type, latitude: req.body.latitude, longitude: req.body.longitude, text: req.body.text, creator_id: req.body.creator_id, radius: req.body.radius, location: req.body.location},
                ])
                .select()

            if (error) {
                throw error;
            }

            res.json({ data });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    app.post('/api/sensor', async (req, res) => {
        try {
            // Check if the request contains the required fields
            if (!req.body.hasOwnProperty('lat') || !req.body.hasOwnProperty('long') || !req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('status')) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            if (req.body.status != 0 || req.body.status != 1){
                return res.status(400).json({ message: "Status field must equal 0 or 1 only"})
            }

            // grabbing current time to fill last_updated field
            const time = new Date();
            // formatting the time value
            const timeHolder = time.toISOString();

            const { data, error } = await supabase
                .from('sensor')
                .insert([
                    { last_updated: timeHolder, latitude: req.body.lat, longitude: req.body.long, sensor_name: req.body.name, sensor_status: req.body.status },
                ])
                .select()

            if (error) {
                throw error;
            }
            
            // Implement your logic here to handle the sensor data
            // For now, let's return a message indicating that this functionality is not yet implemented
            //return res.status(501).json({ message: "This functionality is not yet implemented" });
            return res.status(204).json({ message: 'corny' });
        } catch (error) {
            console.error("Error processing sensor data:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
    


    app.get('*', function (req, res, next) {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });






    app.listen(port, function () {
        console.log("== Server is listening on port:", port)
    })