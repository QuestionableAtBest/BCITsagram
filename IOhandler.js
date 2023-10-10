/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

//Step 4: Send them to the grayscale function
//Step 5: After ALL IMAGES have SUCCESSFULLY been grayscaled, show a success message.
// ALL ERRORS MUST SHOW IN .catch in PROMISE CHAIN

//Hint: do Promise.All([grayScale("img1.png"),grayScale("img2.png"),grayScale("img3.png")])
// .then(()=>console.log("All images have been grayscaled"))
const PNG = require("pngjs").PNG;
const { rejects } = require("assert");
const unzipper = require("unzipper")
const fs = require("fs")

function handleGrayscale(){
  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      var idx = (this.width * y + x) << 2;
      // invert color CHANGE THIS TO GRAYSCALE
      this.data[idx] = 255 - this.data[idx];
      this.data[idx + 1] = 255 - this.data[idx + 1];
      this.data[idx + 2] = 255 - this.data[idx + 2];
    }
  }
  return this;
}
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
  return new Promise((resolve,rejects) =>{
      fs.createReadStream(pathIn)
      .pipe(unzipper.Extract({path:pathOut}))
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
    })
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  //Step 3: Read all png images from unzipped folder
  // return new Promise((resolve,rejects) =>{
    fs.readdir(dir, (err,files) =>{
      console.log(files)
      if(err) rejects(err);
      else{
        resolve(files);
      }
    })
  // })
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  //Pipeline method
  const readStream = fs.createReadStream(pathIn);
  const writeStream = fs.createWriteStream(pathOut);
  const pngStream = new PNG({}).on("parsed",() => {
    const modifiedImage = handleGrayscale();
    modifiedImage.pack()
  });
  //this works, can do pipe .on error handling, or use pipeline (try pipeline)
  readStream.pipe(pngStream).pipe(writeStream);
};

module.exports = {
  unzip,
  readDir,
  grayScale,
};
