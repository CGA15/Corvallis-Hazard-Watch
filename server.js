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




    app.get('*', function (req, res, next) {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });






    app.listen(port, function () {
        console.log("== Server is listening on port:", port)
    })