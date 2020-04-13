const express = require("express");
const multer = require("multer");

const app = express();

let filePath = __dirname + "\\";
let newNameContainer = { oldname: "_", newname: "_" };

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, newFileName(file.originalname, newNameContainer));
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

function newFileName(originalFileName, nameContainer) {
  let newName = Date.now() + "-" + originalFileName;
  nameContainer = { oldname: originalFileName, newname: newName };
  console.log("newFileName: " + nameContainer.newname);
  return newName;
}
// const upload = multer({ dest: "uploads" });

app.use(express.static(__dirname));

app.use(
  multer({ storage: storageConfig, fileFilter: fileFilter }).single("image")
);

app.post("/upload", (req, res, next) => {
  console.log("upload started...");

  let filedata = req.file;
  if (!filedata) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.send({ status: "File not uploaded..." });
  } else {
    console.log(filedata);
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.send({ filePath: filePath + filedata.path });
  }

  // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  // res.send({ status: "Done" });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Server listeining port: " + PORT);
});
