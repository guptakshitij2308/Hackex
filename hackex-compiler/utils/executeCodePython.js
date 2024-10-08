// /* eslint-disable prefer-promise-reject-errors */
// const path = require("path");
// const fs = require("fs");
// // const { v4: uuidv4 } = require("uuid");
// const { exec } = require("child_process");

// const outPath = path.join(__dirname, "outputExe");

// if (!fs.existsSync(outPath)) {
//   fs.mkdirSync(outPath, { recursive: true });
// }

// // eslint-disable-next-line no-unused-vars
// const executeCodePython = (filePath, inputPath) => {
//   const executionId = path.basename(filePath).split(".")[0];
//   const outName = `${executionId}.txt`; // Change to .txt to store output as text
//   const outputPath = path.join(outPath, outName);
//   const command = `python ${filePath} < ${inputPath} > ${outputPath}`;

//   return new Promise((resolve, reject) => {
//     exec(command, (err, stdout, stderr) => {
//       if (err) {
//         console.error(`Error: ${err.message}`);
//         console.error(`stderr: ${stderr}`);
//         reject(`Compilation or execution error: ${stderr}`);
//         return;
//       }

//       if (stderr) {
//         console.error(`stderr: ${stderr}`);
//         reject(`Execution error: ${stderr}`);
//         return;
//       }

//       console.log(`stdout: ${stdout}`);
//       resolve(stdout);
//     });
//   });

//   // return new Promise((resolve, reject) => {
//   //   // Execute Python script and redirect output to file
//   //   exec(
//   //     `python ${filePath} < ${inputPath} > ${outputPath}`,
//   //     (err, stdout, stderr) => {
//   //       if (err) {
//   //         reject(err);
//   //         return;
//   //       }

//   //       if (stderr) {
//   //         reject(stderr);
//   //         return;
//   //       }

//   //       // Read the output from the file
//   //       fs.readFile(outputPath, "utf8", (readErr, data) => {
//   //         if (readErr) {
//   //           reject(readErr);
//   //           return;
//   //         }

//   //         // Resolve with the output data
//   //         resolve(data);
//   //       });
//   //     }
//   //   );
//   // });
// };

// module.exports = { executeCodePython };

const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const outPath = path.join(__dirname, "outputExe");

if (!fs.existsSync(outPath)) {
  fs.mkdirSync(outPath, { recursive: true });
}

const executeCodePython = (filePath, inputPath) => {
  const executionId = path.basename(filePath).split(".")[0];
  const outName = `${executionId}.txt`; // Change to .txt to store output as text
  const outputPath = path.join(outPath, outName);
  const command = `python ${filePath} < ${inputPath} > ${outputPath}`;

  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error: ${err.message}`);
        console.error(`stderr: ${stderr}`);
        reject(`Execution error: ${stderr}`);
        return;
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`);
        reject(`Execution error: ${stderr}`);
        return;
      }

      // Read the output from the file
      fs.readFile(outputPath, "utf8", (readErr, data) => {
        if (readErr) {
          console.error(`Read error: ${readErr.message}`);
          reject(readErr);
          return;
        }

        // Resolve with the output data
        resolve(data);
      });
    });
  });
};

module.exports = { executeCodePython };
