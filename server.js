const express = require("express");
const connectDB = require("./config/db");
const path = require("path")

const app = express();

// connect db
connectDB();

//init middleware
app.use(express.json({ extended: false }))

//define the routes
app.use("/api/users", require("./route/users"))
app.use("/api/auth", require("./route/auth"))
app.use("/api/contacts", require("./route/contacts"))

// serve static assets (react) in prod
if (process.env.NODE_ENV === "production") {
    // serve static folder
    app.use(express.static("client/build"));

    app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    )
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))