async function copyDir() {
  const fs = require('fs')
  const fsPromise = require('fs/promises')
  const path = require('path')

  try {
    await fsPromise.access(path.join(__dirname, 'files-copy'), fs.F_OK);
    const del = await fsPromise.rm(path.join(__dirname, 'files-copy'), { recursive: true });
  } catch { console.log(`--- Ствараем тэчку ---`)}

  try {
    const filesCopy = await fsPromise.mkdir(path.join(__dirname, 'files-copy'), { recursive: true })
    const files = await fsPromise.readdir(path.join(__dirname, 'files'), { withFileTypes: true })
    for (const file of files) {
      console.log(file)
      await fsPromise.copyFile(path.join(__dirname, 'files', `${file.name}`), path.join(__dirname, 'files-copy', `${file.name}`))
    }
  } catch (error) { console.error(error) }
}

copyDir()