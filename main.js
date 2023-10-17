const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

IOhandler.unzip(zipFilePath, pathUnzipped)
  .then((msg) => {
    console.log(msg);
  })
  .then(() => {
    return IOhandler.readDir(pathUnzipped);
  })
  .then((imgs) => {
    Promise.all(imgs.map((img) => IOhandler.grayScale(pathUnzipped + "/" + img,pathProcessed + "/" + img)));
  })
  .then(() => {
    console.log("Successfully Grayscaled");
  })
  .catch(() => console.log("An error has occured"));
