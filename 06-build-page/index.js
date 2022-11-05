async function buildPage() {
  const fs = require('fs')
  const fsPromise = require('fs/promises')
  const path = require('path')
  let tempStr

  try {
    await fsPromise.access(path.join(__dirname, 'project-dist'), fs.F_OK)
    await fsPromise.rm(path.join(__dirname, 'project-dist'), { recursive: true })
  } catch (error) { console.log(`Тэчка 'project-dist' была паспяхова створана`) }

  try {
    await fsPromise.mkdir(path.join(__dirname, 'project-dist'), { recursive: true })
    fs.open(
      path.join(__dirname, 'project-dist', 'index.html'),
      'w',
      error => { if (error) throw error
        console.log('Файл index.html створаны')
      }
    )
    fs.open(
      path.join(__dirname, 'project-dist', 'style.css'),
      'w',
      error => { if (error) throw error
        console.log('Файл style.css створаны')
      }
    )
  } catch (error) { console.log(error) }

  try {
    fs.readFile(path.join(__dirname, 'template.html'), "utf8", (error, data) => { if (error) throw error
        tempStr = data
      })
  } catch (error) { console.log(error) }

  try {
    const files = await fsPromise.readdir(path.join(__dirname, 'components'), { withFileTypes: true })
    for (const file of files) {
      let fileObj = path.parse(path.join(__dirname, 'components', `${file.name}`))
      if (!file.isDirectory() && fileObj.ext === '.html') {
        fs.readFile(path.join(__dirname, 'components', `${file.name}`), "utf8", (error, data) => { if (error) throw error
          let reg = new RegExp(`{{${fileObj.name}}}`, 'g')
          tempStr = tempStr.replace(reg, data)

          if (tempStr.search(/{{|}}/g) === -1) {
              fs.appendFile(
              path.join(__dirname, 'project-dist', 'index.html'),
              `${tempStr}`,
              error => { if (error) throw error
                console.log('Файл index.HTML быў зменены')
              }
            )}
          }
        )
      }
    }
  } catch (error) { console.log(error)  }

  try {
    const files = await fsPromise.readdir(path.join(__dirname, 'styles'), { withFileTypes: true })
    for (const file of files) {
      let fileObj = path.parse(path.join(__dirname, 'styles', `${file.name}`))

      if (!file.isDirectory() && fileObj.ext === '.css') {
        fs.readFile(path.join(__dirname, 'styles', `${file.name}`), "utf8", (error, data) => { if (error) throw error
            fs.appendFile(
              path.join(__dirname, 'project-dist', 'style.css'),
              `${data}`,
              error => { if (error) throw error
                console.log('Файл style.CSS быў зменены')
              }
            )
          }
        )
      }
    }
  } catch (error) { console.log(error) }

  async function copy(src, addr) {
    const elements = await fsPromise.readdir(src, { withFileTypes: true })
    await fsPromise.mkdir(addr)

    for (let el of elements) {
      const srcP = path.join(src, el.name)
      const addrP = path.join(addr, el.name)
      if (el.isDirectory()) {
        await copy(srcP, addrP)
        console.log(`Тэчка "${el.name}" была паспяхова скапіяваная`)
      } else {
        await fsPromise.copyFile(srcP, addrP)
      }
    }
  }
  copy(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'))
}

buildPage() 