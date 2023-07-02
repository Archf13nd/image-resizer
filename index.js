const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const sharpArguments = {};
const programArguments = {};

const acceptedArguments = {
  inputDir: { for: "program" },
  outputDir: { for: "program" },
  identifier: { for: "program" },
  width: { for: "sharp", type: Number },
  height: { for: "sharp", type: Number },
};

const trimFlag = (argument) => {
  const i = argument.indexOf("=") + 1;
  return argument.slice(i, argument.length);
};

const trimValue = (argument) => {
  const p1 = 2;
  const p2 = argument.indexOf("=");
  return argument.slice(p1, p2);
};

const convertValue = (value, type) => {
  if (type === Number) {
    return +value;
  } else {
    return value + "";
  }
};

process.argv.forEach((e, i) => {
  const flag = trimValue(e);
  const value = trimFlag(e);
  //   Ignores first two arguments
  if (!(i < 2)) {
    if (acceptedArguments[flag]) {
      if (acceptedArguments[flag].for === "sharp") {
        const type = acceptedArguments[flag].type;
        sharpArguments[flag] = convertValue(value, type);
      } else {
        programArguments[flag] = convertValue(value, null);
      }
    }
  }
});

const newFileName = (name, string = "") => {
  const format = name.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)/g);
  return name.replace(format, string + format);
};

const resizeImagesInDir = (dir) => {
  const inputDirPath = path.resolve(dir);
  //   const outputDirPath = path.basename(path.relative(__dirname, inputDirPath));
  const outputDirPath = path.resolve(inputDirPath, "..");

  const fileNames = fs.readdirSync(dir);

  fileNames.forEach((e) => {
    const fileName = newFileName(e, programArguments.identifier);
    if (!fs.existsSync(outputDirPath + "/" + programArguments.identifier)) {
      fs.mkdirSync(outputDirPath + "/" + programArguments.identifier);
    }

    sharp(path.resolve(`${inputDirPath}/${e}`))
      .resize(sharpArguments)
      .toFile(`${outputDirPath}/${programArguments.identifier}/${fileName}`)
      .then((data) => {
        // 100 pixels wide, auto-scaled height
      });
  });
};

resizeImagesInDir(programArguments.inputDir);
