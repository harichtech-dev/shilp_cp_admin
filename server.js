
const next = require("next");
const http = require("http");
const path = require("path");

const port = process.env.PORT || 3000;

// VERY IMPORTANT 👇
const app = next({
  dev: false,
  dir: path.join(__dirname) // ensures correct build path
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  http.createServer((req, res) => {
    handle(req, res);
  }).listen(port, () => {
    console.log("Server running on port", port);
  });
}).catch(err => {
  console.error("Error starting server:", err);
});