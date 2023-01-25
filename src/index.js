#!/usr/bin/env node

const { existsSync } = require("fs");
const { extname } = require("path");
const { v4: uuid } = require("uuid");
const { readdir, rename } = require("fs/promises");

(async () => {
  const inquirer = await import("inquirer");
  const prompt = await inquirer.createPromptModule();

  const { file_path } = await prompt([
    {
      type: "input",
      name: "file_path",
      message: "Enter the path of the folder",
    },
  ]);

  if (!existsSync(file_path)) {
    console.log(color("danger", "❌ This folder does not exists"));
    process.exit(1);
  } else {
    const { confirm } = await prompt([
      {
        type: "list",
        name: "confirm",
        message: `This will rename all the files in the folder ${file_path}, Do you want to proceed further?`,
        choices: ["yes", "no"],
      },
    ]);

    if (confirm === "no") {
      process.exit(1);
    } else {
      const startTime = performance.now();
      const files = await readdir(file_path);
      files.forEach(async (file) => {
        const extension = extname(file);
        const oldPath = `${file_path}/${file}`;
        const newPath = `${file_path}/${uuid()}${extension}`;

        await rename(oldPath, newPath);
      });

      const endTime = performance.now();
      const executionTime = ((endTime - startTime) / 1000).toFixed(3);

      console.log(
        color(
          "success",
          `✅ Renamed ${files.length} files in ${executionTime} seconds`
        )
      );
      process.exit(0);
    }
  }
})();

const styles = {
  success: { open: "\u001b[32;1m", close: "\u001b[0m" },
  danger: { open: "\u001b[31;1m", close: "\u001b[0m" },
  info: { open: "\u001b[36;1m", close: "\u001b[0m" },
  subtitle: { open: "\u001b[2;1m", close: "\u001b[0m" },
};

function color(modifier, string) {
  return styles[modifier].open + string + styles[modifier].close;
}
