#!/usr/bin/env node

// scripts/cli.js
import { Command } from "commander";

// scripts/init.js
import fs2 from "fs/promises";
import path2 from "path";
import prompts2 from "prompts";

// scripts/helpers.js
import fetch from "node-fetch";
import fs from "fs/promises";
import path from "path";
import prompts from "prompts";
var CONFIG_FILE = path.join(process.cwd(), ".flextailrc.json");
var REGISTRY_URL = "https://raw.githubusercontent.com/FlexTail/Flextail-components/main/registry.json";
async function getRegistry() {
  try {
    const response = await fetch(REGISTRY_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch registry: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("\u{1F6A8} Fatal Error: Could not fetch component registry.");
    console.error(`Reason: ${error.message}. Check your internet connection or the URL.`);
    process.exit(1);
  }
}
async function getComponentBaseDir() {
  const srcPath = path.join(process.cwd(), "src");
  try {
    const stat = await fs.stat(srcPath);
    if (stat.isDirectory()) {
      return "src";
    }
  } catch (error) {
  }
  return "";
}
async function getTsConfigPathAlias() {
  var _a;
  const tsConfigPath = path.join(process.cwd(), "tsconfig.json");
  try {
    const content = await fs.readFile(tsConfigPath, "utf8");
    const cleanedContent = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");
    const tsConfig = JSON.parse(cleanedContent);
    const paths = (_a = tsConfig.compilerOptions) == null ? void 0 : _a.paths;
    if (paths) {
      for (const alias in paths) {
        if (alias.endsWith("/*") && paths[alias].includes("*")) {
          return alias.substring(0, alias.length - 1);
        }
      }
    }
  } catch (error) {
  }
  return "";
}
async function downloadAndSaveFile(url, targetPath, alias) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download file from ${url}: ${response.statusText}`);
    }
    let fileContent = await response.text();
    const dir = path.dirname(targetPath);
    if (alias) {
      fileContent = fileContent.replace(/@\//g, `${alias}/`);
      console.log(`
    \u27A1\uFE0F Updated imports with alias: ${alias}/`);
    }
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(targetPath, fileContent, "utf8");
    console.log(`\u2705 File saved successfully to: ${targetPath}`);
  } catch (error) {
    console.error(`
\u{1F6A8} Fatal Error: Could not process file for path ${targetPath}.`);
    console.error(`Reason: ${error.message}`);
    process.exit(1);
  }
}

// scripts/init.js
var CONFIG_FILE2 = path2.join(process.cwd(), ".flextailrc.json");
async function initProject() {
  console.log("\n\u2728 Welcome to FlexTail! Let's configure your project.");
  const [autoBasePath, autoAlias] = await Promise.all([
    getComponentBaseDir(),
    getTsConfigPathAlias()
  ]);
  const questions = [
    {
      type: "text",
      name: "componentPath",
      message: "Where should we add new components (e.g., src/<name>)?",
      initial: path2.join(autoBasePath, "components")
    },
    {
      type: "text",
      name: "componentAlias",
      message: "What is your component path alias (e.g., @/<name>)?",
      initial: autoAlias || "@"
    }
  ];
  const answers = await prompts2(questions, {
    onCancel: () => {
      console.log("\n\u{1F6AB} Project initialization cancelled. Configuration file was not created.");
      process.exit(1);
    }
  });
  if (!answers.componentPath || !answers.componentAlias) {
    console.log("\n\u{1F6AB} Project initialization incomplete. Configuration file was not created.");
    return;
  }
  const config = {
    $schema: "https://raw.githubusercontent.com/FlexTail/npm-flextail/schema.json",
    aliases: {
      path: answers.componentAlias,
      components: answers.componentPath
    }
  };
  try {
    await fs2.writeFile(CONFIG_FILE2, JSON.stringify(config, null, 2), "utf8");
    console.log(`
\u2705 Configuration saved to ${path2.basename(CONFIG_FILE2)}`);
    console.log("Project initialized. You can now run `flextail add [component]`");
  } catch (error) {
    console.error("\n\u{1F6A8} Error: Could not save configuration file.");
    console.error(error.message);
    process.exit(1);
  }
}

// scripts/add.js
import path4 from "path";
import fs4 from "fs/promises";

// scripts/config.js
import fs3 from "fs/promises";
import path3 from "path";
var CONFIG_FILE3 = path3.join(process.cwd(), ".flextailrc.json");
var configCache = null;
async function getConfig() {
  if (configCache) {
    return configCache;
  }
  try {
    const configContent = await fs3.readFile(CONFIG_FILE3, "utf8");
    const config = JSON.parse(configContent);
    configCache = config;
    return config;
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error("\u{1F6A8} Error: Configuration file not found.");
      console.error(`File not found at: ${CONFIG_FILE3}`);
      console.error("\nPlease run `flextail init` to set up your project.");
    } else if (error instanceof SyntaxError) {
      console.error("\u{1F6A8} Error: Configuration file is malformed.");
      console.error(`Could not parse JSON in ${CONFIG_FILE3}`);
      console.error(error.message);
    } else {
      console.error(`\u{1F6A8} An unexpected error occurred while reading the config: ${error.message}`);
    }
    process.exit(1);
  }
}

// scripts/add.js
var checkFileExists = async (filePath) => {
  try {
    await fs4.access(filePath);
    return true;
  } catch (e) {
    return false;
  }
};
async function installComponentAndDeps(componentName, context, isDependency = false) {
  if (context.installed.has(componentName)) {
    return;
  }
  const component = context.registry.find((c) => c.name.toLowerCase() === componentName.toLowerCase());
  if (!component) {
    console.error(`
\u274C Error: Dependency "${componentName}" not found in the registry.`);
    throw new Error("Missing Dependency");
  }
  if (!isDependency) {
    console.log(`
\u{1F50D} Found component "${componentName}". Fetching files...`);
  } else {
    console.log(`
  \u{1F517} Installing dependency: "${componentName}"...`);
  }
  if (component.deps && component.deps.length > 0) {
    for (const depName of component.deps) {
      await installComponentAndDeps(depName, context, true);
    }
  }
  for (const file of component.files) {
    const finalTargetPath = path4.normalize(path4.join(context.saveDir, file.target_path));
    if (isDependency && await checkFileExists(finalTargetPath)) {
      console.log(`  \u23E9 Dependency file already present: ${finalTargetPath}`);
      continue;
    }
    await downloadAndSaveFile(file.content_url, finalTargetPath, context.alias);
  }
  context.installed.add(componentName);
}
async function addComponent(componentName) {
  console.log(`
\u{1F4E6} FlexTail CLI: Adding component "${componentName}"...`);
  const [config, registry] = await Promise.all([
    getConfig(),
    getRegistry()
  ]);
  const primaryComponent = registry.find((c) => c.name.toLowerCase() === componentName.toLowerCase());
  if (!primaryComponent) {
    console.error(`
\u274C Error: Component "${componentName}" not found in the registry.`);
    console.log(`Available components: ${registry.map((c) => c.name).join(", ")}`);
    process.exit(1);
  }
  const context = {
    registry,
    saveDir: path4.normalize(path4.join(process.cwd(), config.aliases.components)),
    alias: config.aliases.path,
    installed: /* @__PURE__ */ new Set()
  };
  console.log(`
\u{1F6E0}\uFE0F  Installing to: ${config.aliases.components}`);
  if (context.alias) {
    console.log(`\u{1F517}  Using alias: '${context.alias}'`);
  }
  try {
    await installComponentAndDeps(componentName, context);
    console.log(`
\u{1F389} Success! Component "${componentName}" and all dependencies are installed.`);
    if (primaryComponent.npmDependencies && primaryComponent.npmDependencies.length > 0) {
      console.log(`
\u{1F514} Note: This component requires a manual install:`);
      console.log(`  npm install ${primaryComponent.npmDependencies.join(" ")}`);
    }
  } catch (error) {
    console.error(`
\u274C Installation failed for component "${componentName}".`);
    if (error.message !== "Missing Dependency") {
      console.error(`Reason: ${error.message}`);
    }
    process.exit(1);
  }
}

// scripts/remove.js
import path5 from "path";
import fs5 from "fs/promises";
import prompts3 from "prompts";
async function removeComponent(componentName) {
  console.log(`
\u{1F4E6} FlexTail CLI: Removing component "${componentName}"...`);
  const [config, registry] = await Promise.all([
    getConfig(),
    getRegistry()
  ]);
  const component = registry.find((c) => c.name.toLowerCase() === componentName.toLowerCase());
  if (!component) {
    console.error(`
\u274C Error: Component "${componentName}" not found in the registry.`);
    console.log(`Available components: ${registry.map((c) => c.name).join(", ")}`);
    process.exit(1);
  }
  const componentSaveDir = path5.normalize(path5.join(process.cwd(), config.aliases.components));
  console.log(`
\u{1F50D} Locating files in: ${config.aliases.components}`);
  const filesToDelete = component.files.map(
    (file) => path5.normalize(path5.join(componentSaveDir, file.target_path))
  );
  console.log("The following files will be permanently deleted:");
  filesToDelete.forEach((file) => console.log(`  - ${file}`));
  const { confirm } = await prompts3({
    type: "confirm",
    name: "confirm",
    message: "Are you sure you want to delete these files?",
    initial: false
  });
  if (!confirm) {
    console.log("\u{1F44B} Aborted. No files were removed.");
    process.exit(0);
  }
  console.log(`
\u{1F5D1}\uFE0F Removing ${component.files.length} files...`);
  let filesRemovedCount = 0;
  let errorsOccurred = false;
  try {
    for (const file of component.files) {
      const finalTargetPath = path5.normalize(path5.join(componentSaveDir, file.target_path));
      try {
        await fs5.unlink(finalTargetPath);
        console.log(`  \u2705 File removed: ${finalTargetPath}`);
        filesRemovedCount++;
      } catch (error) {
        if (error.code === "ENOENT") {
          console.log(`  \u26A0\uFE0F  File not found (already removed): ${finalTargetPath}`);
        } else {
          console.error(`
\u{1F6A8} Error removing file ${finalTargetPath}:`);
          console.error(`Reason: ${error.message}`);
          errorsOccurred = true;
        }
      }
    }
    if (filesRemovedCount > 0 && !errorsOccurred) {
      console.log(`
\u2705 Success! Component "${componentName}" files were removed.`);
    } else if (errorsOccurred) {
      console.log(`
\u26A0\uFE0F Finished removal, but some errors occurred.`);
      process.exit(1);
    } else {
      console.log(`
\u26A0\uFE0F Finished, but no files were removed for "${componentName}".`);
    }
  } catch (error) {
    console.error(`
\u274C Removal failed for component "${componentName}".`);
    console.error(`Reason: ${error.message}`);
    process.exit(1);
  }
}

// scripts/update.js
import fs6 from "fs/promises";
import path6 from "path";
import fetch2 from "node-fetch";
import { diffLines } from "diff";
import prompts4 from "prompts";
async function updateComponent(componentName) {
  console.log(`
\u{1F4E6} FlexTail CLI: Checking for updates to "${componentName}"...`);
  const [config, registry] = await Promise.all([
    getConfig(),
    getRegistry()
  ]);
  const component = registry.find((c) => c.name.toLowerCase() === componentName.toLowerCase());
  if (!component) {
    console.error(`
\u274C Error: Component "${componentName}" not found in the registry.`);
    process.exit(1);
  }
  const componentSaveDir = path6.normalize(path6.join(process.cwd(), config.aliases.components));
  const alias = config.aliases.path;
  let filesNeedUpdate = false;
  for (const file of component.files) {
    const localPath = path6.normalize(path6.join(componentSaveDir, file.target_path));
    let localContent = "";
    try {
      localContent = await fs6.readFile(localPath, "utf8");
    } catch (error) {
      if (error.code === "ENOENT") {
        console.error(`
\u26A0\uFE0F File not found locally: ${localPath}`);
        console.log(`Run \`flextail add ${componentName}\` to install it.`);
      } else {
        console.error(`
\u{1F6A8} Error reading local file ${localPath}:`, error.message);
      }
      continue;
    }
    const fileUrl = file.content_url;
    const response = await fetch2(fileUrl);
    if (!response.ok) {
      console.error(`
\u{1F6A8} Error fetching remote file: ${fileUrl}`);
      continue;
    }
    const newContentRaw = await response.text();
    const newContent = newContentRaw.replace(/(@\/)([\w\-./]+)/g, `${alias}$2`);
    const fileDiff = diffLines(localContent, newContent);
    const changes = fileDiff.filter((part) => part.added || part.removed);
    if (changes.length > 0) {
      filesNeedUpdate = true;
      console.log(`
--- Changes for ${file.target_path} ---`);
      fileDiff.forEach((part) => {
        const color = part.added ? "\x1B[32m" : part.removed ? "\x1B[31m" : "\x1B[90m";
        process.stdout.write(color + part.value + "\x1B[0m");
      });
      const { confirm } = await prompts4({
        type: "confirm",
        name: "confirm",
        message: `
Apply these changes and overwrite ${localPath}?`,
        initial: false
      });
      if (confirm) {
        await fs6.writeFile(localPath, newContent, "utf8");
        console.log(`\u2705 File updated: ${localPath}`);
      } else {
        console.log(`\u{1F6AB} Update skipped for: ${localPath}`);
      }
    }
  }
  if (!filesNeedUpdate) {
    console.log(`
\u{1F389} Component "${componentName}" is already up to date.`);
  }
}

// scripts/list.js
async function listComponents() {
  console.log("\n\u2728 FlexTail Component Registry \u2728");
  console.log("---------------------------------");
  const registry = await getRegistry();
  if (!registry || registry.length === 0) {
    console.log("No components found in the registry.");
    console.log("Please check your network connection or the registry URL.");
    return;
  }
  const sortedRegistry = registry.slice().sort((a, b) => a.name.localeCompare(b.name));
  const maxNameLength = sortedRegistry.reduce((max, c) => Math.max(max, c.name.length), 0);
  console.log(`
Found ${sortedRegistry.length} available components:
`);
  for (const component of sortedRegistry) {
    const paddedName = component.name.padEnd(maxNameLength + 4);
    const description = component.description || "No description available.";
    console.log(`\u{1F4E6} ${paddedName} - ${description}`);
  }
  console.log("\n---------------------------------");
  console.log("To install a component, use:");
  console.log("flextail add <component-name>");
  console.log("---------------------------------");
}

// scripts/cli.js
var program = new Command();
program.name("flextail").description("A CLI utility to manage FlexTail components.").version("0.0.91");
program.command("init").description("Initialize FlexTail configuration file (.flextailrc.json)").action(initProject);
program.command("add").argument("<componentName>", "The name of the component to add").description("Download and install a component").action(addComponent);
program.command("remove").argument("<componentName>", "The name of the component to remove").description("Remove a component's files from the project").action(removeComponent);
program.command("update").argument("<componentName>", "The name of the component to update").description("Check for and apply updates to an installed component").action(updateComponent);
program.command("list").description("List all available components in the registry").action(listComponents);
program.parse(process.argv);
