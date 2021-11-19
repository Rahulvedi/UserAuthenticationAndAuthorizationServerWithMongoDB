const express = require("express");
const fs = require("fs");
const Port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
var corsOptions = {
  origin: "http://localhost:3001",
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Rahul's application." });
});

// MONGODB Connection
const dbConfig = require("./config/db.config");
const db = require("./models");
require('dotenv').config();
const Role = db.role;
// `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`
db.mongoose
  .connect(
    process.env.MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });
function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}

//routes

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);

//server
app.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});
