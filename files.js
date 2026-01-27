const fs = require('fs');
const path = require('path');

async function makeDirectory(path) {
  // Check if the path already exists
  try {
    await fs.promises.access(path);
    return 0;
  } catch (error) {
    // If there is an error, it means the path does not exist
    // Try to create the directory
    try {
      await fs.promises.mkdir(path, { recursive: true });
      return 1;
    } catch (error) {
      // If there is an error, log it
      console.log(error);
      process.exit(1);
      return 2;
    }
  }
}

async function writeTextFile(path, content) {
  try {
    await fs.promises.writeFile(path, content, { encoding: 'utf8' });
    return `File "${path}" created successfully!`;
  } catch (err) {
    throw new Error(`\x1b[31mError\x1b[0m creating file: ${err.message}`);
  }
}

async function renameFile(filePath, newName) {
  try {
    // get the parent directory and extension of the file
    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);

    // construct the new path with the new name and the same extension
    const newPath = path.join(dir, newName + ext);

    // await for the rename operation to finish
    await fs.renameSync(filePath, newPath);

    // log a success message
    console.log('\x1b[32mSuccessfully\x1b[0m renamed file!');
  } catch (error) {
    // handle any errors
    console.error(error);
  }
}

async function copyFile(source, destination) {
  // Copy the file
  await fs.copyFileSync(source, destination);
}

async function removeDirectory(dirPath) {
  await fs.promises.rm(dirPath, { recursive: true, force: true });
}

async function getFiles(dirPath, extension) {
  // Create an empty array to store the file paths
  let list = [];

  // Use fsPromises.readdir to read the directory contents
  // and get an array of file names
  let files = await fs.promises.readdir(dirPath);

  // Loop through the file names
  for (let file of files) {
    // Get the absolute path of the file
    let filePath = path.join(dirPath, file);

    // Use fsPromises.stat to get the file stats
    let stats = await fs.promises.stat(filePath);

    // Check if the file is a directory or not
    if (stats.isDirectory()) {
      // If it is a directory, call the function recursively with the subdirectory path
      // and concatenate the result to the list array
      list = list.concat(await getFiles(`${filePath}`, extension));
    } else {
      // If it is not a directory, append the file path to the list array
      var baseName = path.basename(dirPath);
      list.push({
        ascendant: {
          path: {
            full: path.join(dirPath),
            name: baseName
          }
        },
        path: {
          full: filePath,
          name: file
        }
      });
    }
  }

  return list.filter((e) => !(String(e.path.name).match(new RegExp(`\.${extension || ''}$`), 'gmi') === null));
}

async function readFile(path) {
  try {
    const fileContent = await fs.promises.readFile(path, 'utf8');
    return fileContent;
  } catch (e) {
    return false;
  }
}

async function moveFile(source, destination) {
  var name = path.basename(source);
  var path2 = path.join(destination, name);
  await fs.promises.rename(source, path2, (err) => {
    if (err) throw err;
    console.log('\x1b[32mSuccessfully\x1b[0m moved file');
  });
}

module.exports = {
  makeDirectory,
  writeTextFile,
  renameFile,
  removeDirectory,
  copyFile,
  getFiles,
  readFile,
  moveFile
};
