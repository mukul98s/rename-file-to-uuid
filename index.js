const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const PATH = "/home/mukul98s/Downloads/demo-pictures";

if (!fs.existsSync(PATH)) {
  throw new Error("This Folder does not exits");
}

try {
  const files = fs.readdirSync(PATH, { encoding: "utf-8" });

  console.log(files);
  files.forEach((file) => {
    const extension = path.extname(file);
    const filePath = `${PATH}/${file}`;
    const newPath = `${PATH}/${uuid()}${extension}`;

    fs.renameSync(filePath, newPath);
  });
} catch (e) {
  console.log(e);
}
