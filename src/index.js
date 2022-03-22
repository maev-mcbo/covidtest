const express =  require("express");
const morgan = require("morgan");
const path = require("path");


// Intializations
const app = express();

// Settings
app.set("port", 5000);


// Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



// Global variables


// Public
app.use(express.static(path.join(__dirname, "public")));


app.listen(app.get("port"));
console.log("Server is in port", app.get("port"));