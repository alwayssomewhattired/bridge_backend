const app = require("./app");

// const PORT = 3000; //dev
const PORT = 80; //prod

app.listen(PORT, () => {
  console.log(`I am listening on port ${PORT}`);
});

//"postgres://postgres:palestinedeathcircle@localhost:5432/bridge"
