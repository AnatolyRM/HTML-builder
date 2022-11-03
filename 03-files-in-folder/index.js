async function readFiles() {
  const fs = require('fs/promises')
  const path = require('path')
  const files = await fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true })
  
  for (const file of files) {
    let objFile = path.parse(path.join(__dirname, 'secret-folder', `${file.name}`))
    let statFile = await fs.stat(path.join(__dirname, 'secret-folder', `${file.name}`))
    let sizeFile = (statFile.size / 1024)

    if (!file.isDirectory()) {
      console.log(`${objFile.name} - ${objFile.ext.slice(1)} - ${sizeFile} Kb`)
    }
  }
}

readFiles()