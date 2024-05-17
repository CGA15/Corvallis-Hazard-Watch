    const express = require("express")
    const app = express()
    const port = process.env.PORT || 3000
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
    
    async function getSensorCurrentStatus(sName) {
        try {
            const { data, error } = await supabase
                .from('sensor')
                .select('sensor_status')
                .eq('sensor_name', sName)
                .single();

            if (error) {
                throw error;
            }

            return data ? data.sensor_status : null;
        } catch (error) {
            console.error('Could not fetch sensor data: ', error.message);
            return null;
        }
    }

    app.put('/api/sensor', async (req, res) => {
        const { sensor_name, sensor_status } = req.body;

        console.log(req.body)

        if(!sensor_name || sensor_status === undefined) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if(sensor_status > 1 || sensor_status < 0) {
            return res.status(400).json({ message: "sensor_status is only allowed to be 0 or 1" })
        }

        try {
            const statusCheck = await getSensorCurrentStatus(sensor_name);
            //console.log(statusCheck)
            if(statusCheck === sensor_status){
                return res.status(201).json({ message: 'Sensor not in need of update' });
            }

            // grabbing current time to fill last_updated field
            const time = new Date();
            // formatting the time value
            const timeHolder = time.toISOString();

            const { data, error } = await supabase
                .from('sensor')
                .update({ sensor_status, last_updated: timeHolder })
                .eq('sensor_name', sensor_name)

            if (error) {
                throw error;
            }

            res.status(200).json({ message: 'Sensor status updated' });
        } catch(error) {
            res.status(500).json({ error: "Internal Server Error"});
        }
    });

    app.get('*', function (req, res, next) {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });






    app.listen(port, function () {
        console.log("== Server is listening on port:", port)
    })