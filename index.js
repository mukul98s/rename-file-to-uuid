const node_modules = __dirname + "/node_modules";
const fs = require("fs");
const spawnSync = require("child_process").spawnSync;

var styles = {
  success: { open: "\u001b[32;1m", close: "\u001b[0m" },
  danger: { open: "\u001b[31;1m", close: "\u001b[0m" },
  info: { open: "\u001b[36;1m", close: "\u001b[0m" },
  subtitle: { open: "\u001b[2;1m", close: "\u001b[0m" },
};

function color(modifier, string) {
  return styles[modifier].open + string + styles[modifier].close;
}

if (!fs.existsSync(node_modules)) {
  console.log(color("subtitle", "Checking for yarn!"));
  let npm = "";
  const yarn = spawnSync("f --version", { shell: true })
    .stdout.toString()
    .trim();

  if (!yarn) {
    console.log(color("info", "Yarn is not installed"));
    console.log(color("subtitle", "Checking for npm!"));
    npm = spawnSync("npm --version", { shell: true }).stdout.toString().trim();
  } else {
    console.log(color("info", `Found yarn version: ${yarn}`));
  }

  if (npm) {
    console.log(color("subtitle", `Found npm version: ${npm}`));
  }

  if (!yarn && !npm) {
    console.log(
      color("danger", "Please install either yarn or npm to proceed further")
    );
    return;
  }

  var command = yarn ? "yarn install" : "npm i";

  console.log(color("info", "📨 Running the following command: " + command));

  console.log(color("subtitle", "⌛ Installing Dependencies"));
  const result = spawnSync(command, { stdio: "inherit", shell: true });

  if (result.status === 0) {
    console.log(color("success", "✅  Dependencies are installed... \n"));
  } else {
    process.exit(result.status);
  }
}

const path = require("path");
const { v4: uuid } = require("uuid");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

let PATH = "";

readline.question("Enter the absolute path of the folder! \n", (name) => {
  PATH = name;

  if (!fs.existsSync(PATH)) {
    console.log(color("danger", "❌ This folder does not exists"));
  } else {
    const startTime = performance.now();
    try {
      const files = fs.readdirSync(PATH, { encoding: "utf-8" });

      console.log(color("info", `⏸️ Renaming ${files.length} files`));

      files.forEach((file) => {
        const extension = path.extname(file);
        const filePath = `${PATH}/${file}`;
        const newPath = `${PATH}/${uuid()}${extension}`;

        fs.renameSync(filePath, newPath);
      });

      const endTime = performance.now();
      const executionTime = ((endTime - startTime) / 1000).toFixed(5);
      console.log(
        color(
          "success",
          `✅ Wallah! Renamed ${files.length} files in ${executionTime} seconds!`
        )
      );
    } catch (e) {
      throw new Error(e);
    }
  }

  readline.close();
});
