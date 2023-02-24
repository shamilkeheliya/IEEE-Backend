require('dotenv').config();
const mongoose = require("mongoose");
const cors = require("cors");

const port = 5000;
const dbURL = process.env.MONGODB;
const app = require("./app");
const routes = require("./routes");


let bodyParser = require('body-parser');
app.use(bodyParser.json());

mongoose.set("strictQuery", false);
mongoose.connect(dbURL)
.then(() => {

    const server = app.listen(port, ()=>{
        console.log("DB connected", port);
    });

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cors());
 
    app.use('/api/v1', routes);
});