const express = require("express");
const app = express();
const fs = require("fs");
const path=require("path");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res, next) {
  fs.readdir("./files", function (err, files) {
    if (err)
      res.send(
        "something went wrong while reading the directory: " + err.message
      );
    else res.render("index", { files });
  });
});

app.get("/edit/:filename", function (req, res, next) {
  fs.readFile(`./files/${req.params.filename}`, "utf8", function (err, data) {
    if (err) res.send("error:" + err);
    else res.render("edit", { data, filename: req.params.filename });
  });
});

app.get("/delete/:filename", function (req, res, next) {
  fs.unlink(`./files/${req.params.filename}`, function (err) {
    if (err) res.send("error:" + err);
    else res.redirect("/");
  });
});

app.post("/update/:filename", function (req, res, next) {
  fs.writeFile(
    `./files/${req.params.filename}`,
    req.body.formdata,
    function (err) {
      if (err) res.send("error:" + err);
      else res.redirect("/");
    }
  );
});

app.get("/create", function (req, res, next) {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());

  console.log();
  const fn = `${day}-${month}-${year}.txt`;
  fs.writeFile(`./files/${fn}`, "daal cheeni", function (err) {
    if (err) res.send("something went wrong");
    else res.send("done!");
  });
});

app.listen(3000);
