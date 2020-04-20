const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const app = express();

let filePath = __dirname + "../uploads/";
let newNameContainer = { oldname: "_", newname: "_" };

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
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
app.use("/", (req, res, next) => {
  console.log("GET: " + req.url);
  fs.stat(__dirname + req.url, (err, stats) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("File: " + stats.ino);
    // stats.isFile();
    // stats.size();
    // stats;
  });
  // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  // res.sendFile(__dirname + req.url);
});

app.use(express.static(__dirname));

app.use(
  multer({ storage: storageConfig, fileFilter: fileFilter }).single("image")
);

app.post("/upload", (req, res, next) => {
  console.log("---- upload started... ----");

  let filedata = req.file;
  if (!filedata) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.send({ status: "File not uploaded..." });
  } else {
    console.log(filedata);
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    // res.send({ filePath: filePath + filedata.path });
    res.send({ filePath: "/uploads/" + filedata.filename });
  }

  // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  // res.send({ status: "Done" });
});

const PORT = process.env.PORT || 9001;

app.listen(PORT, () => {
  console.log("Server listeining port: " + PORT);
  console.log("Files will be saved to: " + __dirname + "\\uploads");
  console.log("Folder info: " + fs.readdirSync(__dirname + "\\uploads"));
});
