const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const page_controller = require("../controllers/page_caontroller");
const auth = require("../middlewares/auth");
const pathdatadmin = path.join(__dirname, "../database/admins.json");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, `../../public/images/${req.body.path}`));
    },
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 1024 },
    fileFilter(req, file, next) {
        const isPhoto =
            file.mimetype !== "image/png" &&
            file.mimetype !== "image/jpg" &&
            file.mimetype !== "image/jpeg"
                ? false
                : file;

        const admins = JSON.parse(fs.readFileSync(pathdatadmin, { encoding: "utf-8" }));

        let auth;
        admins.tokens.forEach((token) => {
            token.name === req.body.name &&
            bcrypt.compareSync(token.token, req.body.token)
                ? auth = true
                : auth = false;
        });

        console.log(file, "----------->", isPhoto,auth);

        if (isPhoto && auth) {
            next(null, true);
        } else {
            const message = isPhoto
                ? "falta el token de admin"
                : "El formato de archivo debe ser de tipo PNG, JPG o JPEG";

            file = {
                error: true,
                field: req.body.field,
                message: message,
            };

            req.file = file;

            next(null, false);
        }
    },
});

/* GET home page. */
router.get("/", page_controller.index);

//  Update data.
router.post("/text/:section", auth, page_controller.updateText);
router.post("/images/:section", upload.single("file"), page_controller.updateImages);

module.exports = router;
