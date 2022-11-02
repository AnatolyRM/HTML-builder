const { stdin, stdout } = process

const path = require('path') //чтобы работать с путями 

const fs = require('fs') //нужен для работы с файлами и папками

fs.open(
  path.join(__dirname, 'text.txt'),
  'w',
  error => { if (error) throw error }
)

stdout.write('Увядзіце тэкст для запісу: \n')

stdin.on('data', data => {
  let dataStr = data.toString()
  dataStr.slice(0, 4) === 'exit' ? process.exit() : (
    fs.appendFile(
      path.join(__dirname, 'text.txt'),
      `${data}`,
      error => {
        if (error) throw error
        console.log('/// Файл дапісаны, працягваем...')
      }
    ))
})

process.on('SIGINT', () => process.exit())

process.on('exit', () => stdout.write(`/// Прыемна было з вамі працаваць.\nусяго найлепшага.`))
