const fs = require('fs')
const path = require('path')
const express = require('express')
const twig = require('twig')
const markdown = require('marked')
const yaml = require('yaml-front-matter')
const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'twig')
app.set('twig options', { strict_variables: false })
twig.cache(false) // Disable twig cache 

app.use(express.static(path.join(__dirname, 'public')))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// Read markdown file   
async function read(path) {
  return new Promise(resolve => {
    try {
      const data = fs.readFileSync(`${__dirname}/data/${path}/index.md`).toString('utf8')
      resolve(data)
    } catch (error) {
      resolve(false)
    }
  })
}

// Parse yaml & convert to html
function parse(data) {
  const frontMatter = yaml.loadFront(data) 
  const html = markdown(frontMatter.__content)

  // Replace markdown with html in object
  delete frontMatter.__content
  frontMatter = {...frontMatter, html: html}

  return frontMatter
}

// Home route 
app.get('/', async (req, res) => {
  const data = await read('home')

  if (data) {
    res.render('home.twig', parse(data))
  } else {
    res.send('Error: Page doesn\'t exist')
  }
})