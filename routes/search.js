const express = require("express");

const search = require("../search/search");


const router = express.Router();

router.post("/searchMother", search.searchMother);

module.exports = router;
