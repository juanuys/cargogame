const fs = require('fs')

fs.writeFileSync('VERSION_FILE', require('./package.json').version)
