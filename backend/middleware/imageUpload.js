import multer from "multer";
import path from "path";

const uploadDirectory =
  process.env.VERCEL === "1"
    ? "/tmp"
    : "./uploads/images";

export const imageUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDirectory);
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