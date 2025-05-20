const express = require("express");
const router = express.Router();
const expertServiceListController = require("../controllers/expertServiceList.controller");

// CRUD Routes
router.post("/expertServiceLists", expertServiceListController.createExpertServiceList);
router.get("/expertServiceLists", expertServiceListController.getAllExpertServiceLists);
router.get("/expertServiceLists/:id", expertServiceListController.getExpertServiceListById);
router.put("/expertServiceLists/:id", expertServiceListController.updateExpertServiceList);
router.delete("/expertServiceLists/:id", expertServiceListController.deleteExpertServiceList);

module.exports = router;