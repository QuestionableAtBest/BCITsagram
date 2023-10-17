/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

//Hint: do Promise.All([grayScale("img1.png"),grayScale("img2.png"),grayScale("img3.png")])
// .then(()=>console.log("All images have been grayscaled"))
const AdmZip = require("adm-zip"),
  { pipeline } = require("stream"),
  fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");

const handleGrayscale = (image) => {
  return new Promise((resolve, reject) => {
    for (let y = 0; y < image.height; y++) {
      for (let x = 0; x < image.width; x++) {
        const idx = (image.width * y + x) << 2;

        const red = image.data[idx];
        const green = image.data[idx + 1];
        const blue = image.data[idx + 2];
        const gray = 0.2126 * red + 0.7152 * green + 0.0722 * blue;

        image.data[idx] = gray;
        image.data[idx + 1] = gray;
        image.data[idx + 2] = gray;
      }
    }
    resolve(image);
  });
};
/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  //Step 1: Read zip file
  //Step 2: Unzip the zip file
  return new Promise((resolve, reject) => {
    const zip = new AdmZip(pathIn);
    zip.extractAllTo(pathOut, true);
    resolve("Successfully unzipped");
  });
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  //Step 3: Read all png images from unzipped folder
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const pngFiles = files.filter((file) => path.extname(file) === ".png");
        resolve(pngFiles);
      }
    });
  });
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */

//Step 4: Send them to the grayscale function
//Step 5: After ALL IMAGES have SUCCESSFULLY been grayscaled, show a success message.
// ALL ERRORS MUST SHOW IN .catch in PROMISE CHAIN
const grayScale = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(pathIn);
    const writeStream = fs.createWriteStream(pathOut);
    const pngStream = new PNG().on("parsed", function () {
      handleGrayscale(this);
      this.pack().pipe(writeStream)
      .on('error',(err)=>reject(err));
    });

    pipeline(readStream, pngStream, function onEnd(err) {
      if (err) {
        reject(err);
      } else {
        resolve("Successfully Grayscaled");
      }
    });
  });
};

module.exports = {
  unzip,
  readDir,
  grayScale,
};
