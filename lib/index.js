const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const files = require('./files')
clear()
console.log(
    chalk.cyanBright(
      figlet.textSync('Express Generator', { horizontalLayout: 'full' })
    )
)
files.mkFolder()