const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  createUser,
  loginUser,
  getUser,
  getAllUsers,
  getOneUser,
  deleteUser,
  updateUser,
} = require("../db");

const isLoggedIn = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.slice(7);
  if (!token) {
    return next();
  }
  try {
    const { id } = jwt.verify(token, process.env.JWT);
    const user = await getUser(id);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

router.post("/register", async (req, res, next) => {
  try {
    const { first_name, last_name, email, normal_password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(normal_password, salt);
    const response = await createUser(first_name, last_name, email, password);
    const token = jwt.sign({ id: response.id }, process.env.JWT);
    res.send({ token });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, normal_password } = req.body;
    const user = await loginUser(email, normal_password);
    if ((await bcrypt.compare(normal_password, user.password)) == false) {
      const error = Error("Wrong password");
      error.status = 401;
      throw error;
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT);
    res.send({ token });
  } catch (error) {
    console.log(error);
  }
});

router.get("/aboutMe", isLoggedIn, async (req, res, next) => {
  try {
    req.user == undefined
      ? res.status(401).send("No user logged in.")
      : res.status(200).send(req.user);
  } catch (error) {
    next(error);
  }
});

router.get("/allUsers", isLoggedIn, async (req, res, next) => {
  try {
    if (req.user == undefined) {
      res.status(401).send("No user logged in.");
    }
    const response = await getAllUsers();
    res.send(response);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", isLoggedIn, async (req, res, next) => {
  try {
    if (req.user == undefined) {
      res.status(401).send("No user logged in.");
    }
    const id = req.params.id;
    const response = await getOneUser(id);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", isLoggedIn, async (req, res, next) => {
  try {
    if (req.user == undefined) {
      res.status(401).send("No user logged in.");
    }
    const id = req.params.id;
    const response = await deleteUser(id);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", isLoggedIn, async (req, res, next) => {
  try {
    if (req.user == undefined) {
      res.status(401).send("No user logged in.");
    }
    const id = req.params.id;
    const { first_name, last_name, email, normal_password } = req.body;
    if (normal_password == undefined) {
      const response = await updateUser(id, first_name, last_name, email);
      res.send(response);
    } else {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(normal_password, salt);
      const response = await updateUser(
        id,
        first_name,
        last_name,
        email,
        password
      );
      res.send(response);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
