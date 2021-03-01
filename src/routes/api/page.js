const express = require('express');
const router = express.Router();
const path = require("path");
const controllers = require("../../controllers/pageController");
const auth = require("../../middlewares/auth");
const multer = require("multer");
const bcrypt = require("bcrypt");
const urlBaseApi =
    process.env.USERDOMAIN == "DESKTOP-O3O462B"
        ? process.env.URL_API_DEV
        : process.env.URL_API_PROD;

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
          cb(null, path.join(__dirname,'../../../public/images/'))
    },
    filename: (req, file, cb) => {
          cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  })

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 1024 },
    fileFilter(req, file, next) {

      const isPhoto = file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' ? "" : file;

      const admin = req.body.user ? req.body.user : "";
      const auth = bcrypt.compareSync(`${process.env.MY_PASS}`, admin)

      console.log(file, "----------->",isPhoto)

      if (isPhoto && auth) {
        next(null, true);
      } else {

        if(!auth){
          res.redirect(`${urlBaseApi}`);
        }

        const message = isPhoto ? "falta el token de admin" : "El formato de archivo debe ser de tipo PNG, JPG o JPEG";

        file = {
          error: true,
          field: `error${file.fieldname}home`,
          message: message
        };

        req.file = file;

        next(null, false);
      }
    }
  });

router.post("/", auth, controllers.getPage);

router.post("/modifycanchayhorario",auth, controllers.modifycanchayhorario);

router.post("/modifysection", upload.any("images"), controllers.modifySection);

router.post("/modifyfooter", auth, controllers.modifyFooter);

router.post("/sponsors/:id", auth, controllers.getSponsors);

router.post("/modifyheader/link", auth, controllers.modifyLinks);

module.exports = router;
