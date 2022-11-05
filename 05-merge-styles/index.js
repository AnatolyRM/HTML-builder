async function bundler() {
  const fs = require('fs')
  const fsPromise = require('fs/promises')
  const path = require('path')

  try {
    await fsPromise.access(path.join(__dirname, 'project-dist', 'bundle.css'), fs.F_OK)
    await fsPromise.rm(path.join(__dirname, 'project-dist', 'bundle.css'), { recursive: true })
  } catch (error) {/*console.log(error)*/ }

  try {
    fs.open(
      path.join(__dirname, 'project-dist', 'bundle.css'),
      'w',
      error => { if (error) throw error
        console.log('Файл bundle.css створаны')
      }
    )

    const files = await fsPromise.readdir(path.join(__dirname, 'styles'), { withFileTypes: true })

    for (const file of files) {
      let fileEl = path.parse(path.join(__dirname, 'styles', `${file.name}`))
      if (!file.isDirectory() && fileEl.ext === '.css') {
        fs.readFile(path.join(__dirname, 'styles', `${file.name}`), "utf8", (error, data) => { if (error) throw error
          fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'),
            `${data}`,
            error => { if (error) throw error
              console.log(`Файл ${file.name} быў аб'яднаны`)
            })
          }
        )
      }
    }
  } catch (error) { console.error(error) }
} 

bundler()