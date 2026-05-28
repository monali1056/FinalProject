const express = require("express");
const router  = express.Router();
const { submitContact } = require("../controllers/contact.controller");

router.post("/", submitContact);   // Public — contact form submission

module.exports = router;
