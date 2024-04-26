const express = require("express")
const app = express()
const port = process.env.PORT || 8000

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

app.get('/', function (req, res, next) {
    res.status(200).send({
        msg: "Hello, world!"
    })
})

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
                { type: req.body.type, latitude: req.body.latitude, longitude: req.body.longitude, text: req.body.text, creator_id: req.body.creator_id},
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




app.use('*', function (req, res, next) {
    res.status(404).send({
        err: "This URL was not recognized: " + req.originalUrl
    })
})






app.listen(port, function () {
    console.log("== Server is listening on port:", port)
})
