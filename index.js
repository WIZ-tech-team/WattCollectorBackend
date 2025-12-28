const express = require("express");
const cors = require("cors");

const readingRoutes = require("./routes/readings");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", readingRoutes);
const HOST = '0.0.0.0';
const PORT = 3000;
app.listen(PORT,HOST, () => {
console.log(`Backend running on http://0.0.0.0:${PORT}`);
});
