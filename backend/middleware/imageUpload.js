import multer from "multer";
import path from "path";

export const imageUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads/images");
    },

    filename: function (req, file, cb) {

      const ext = path.extname(file.originalname);

      const name =
        file.fieldname +
        "_" +
        Date.now() +
        ext;

      cb(null, name);
    },
  }),
});