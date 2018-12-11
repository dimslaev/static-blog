const fs = require('fs')
const path = require('path')
const express = require('express')
const twig = require('twig')
const markdown = require('marked')
const yaml = require('yaml-front-matter')
const app = express()
const port = process.env.PORT || 3000

// Set public folder 
app.use(express.static(path.join(__dirname, 'public')))

// Set view engine 
twig.cache(false) // Disable twig cache 
app.set('view engine', 'twig')
app.set('twig options', { strict_variables: false })

// Start server 
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// Locate and read data file   
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

// Convert to yaml / html
function parse(data) {
  // Parse yaml
  const frontMatter = yaml.loadFront(data) 

  // Convert markdown 
  const html = markdown(frontMatter.__content)

  // Replace markdown with html 
  delete frontMatter.__content
  data = {...frontMatter, html: html}

  return data
}

// Home route 
app.get('/', async (req, res) => {
  let data = await read('home')

  if (data) {
    // Render home template
    res.render('home.twig', parse(data))
  } else {
    // Return error 
    res.send('Error: Page doesn\'t exist')
  }
})