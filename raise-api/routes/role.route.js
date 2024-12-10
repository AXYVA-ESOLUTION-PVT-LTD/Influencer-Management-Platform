const Role = require("../controllers/role.controller");
const express = require("express");
const router = express.Router();
const { role } = require("../middleware/role.middleware");
const auth = require("../config/authentication");

router.post("/addRole", auth, role, Role.addRole);
router.get("/getRoleById/:id", auth, Role.getRoleById);
router.post("/getRoles", auth, Role.getRoles);
router.post("/updateRoleById/:id", auth, role, Role.updateRoleById);
router.get("/deleteRoleById/:id", auth, Role.deleteRoleById);

module.exports = router;
