require('dotenv').config()
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./router/index')
const errorMiddleware = require('./middleware/error-middleware')
const mongoose = require("mongoose");


const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        credentials: true,
        origin: 'http://localhost:3000'
    }
));
app.use('/api', router);
app.use(errorMiddleware);
const start = async () => {
    try{
        await mongoose.connect(process.env.DB_URL, {
            useNewURLParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()