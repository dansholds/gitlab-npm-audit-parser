/**
 * FILE: setupTests.js
 * JEST HOOK: setupFilesAfterEnv
 * ------------------------------
 * Configures jest test environment for all tests
 */
const { createHash } = require("crypto");
const { readFile } = require("fs/promises");
const { validate } = require("jsonschema");
const schemaSpec =
  require("@gitlab-org/security-report-schemas").DependencyScanningReportSchema;
const path = require("path");
const thisModule = require("../package.json");

global.PROJECT_ROOT = path.dirname(__dirname);
global.PARSER_CLI = path.resolve(global.PROJECT_ROOT, thisModule.main);

// console.log(`Tests running in ${process.env.NODE_ENV || "development"} mode.`);
// console.log(
//   `Entrypoint: ${global.PARSER_CLI.replace(global.PROJECT_ROOT, "")}`
// );

global.sha256sum = async function sha256sum(filepath) {
  const hash = createHash("sha256");
  const data = await readFile(filepath);
  hash.update(data);
  return hash.digest("hex");
};

global.validateReport = function validateReport(reportObj) {
  const result = validate(reportObj, schemaSpec);
  const isValid = result.errors.length === 0;
  if (!isValid) {
    process.stderr.write("Report errors:\n");
    process.stderr.write(`  ${result.errors.join(";\n  ")};\n\n`);
  }
  return isValid;
};

global.validateReportFile = async function validateReportFile(filepath) {
  const reportJSON = await readFile(filepath, "utf-8");
  return global.validateReport(reportJSON);
};
