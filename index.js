const fs = require('fs')
const express = require('express')
const markdown = require('marked');
const yaml = require('yaml-front-matter')
const app = express()
const port = 3000

app.set("twig options", {
    allow_async: true,
    strict_variables: false
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

async function read() {
  return new Promise(resolve => {
    try {
      const data = fs.readFileSync(`${__dirname}/posts/${this}/index.md`).toString('utf8')
      resolve(data)
    } catch (error) {
      resolve(false)
    }
  })
}

app.get('/posts/:slug', async (req, res) => {
  let postObj = await read.call(req.params.slug)

  if (postObj) {
    postObj = yaml.loadFront(postObj)
    postObj = {...postObj, html: markdown(postObj.__content)}
    delete postObj.__content

    res.render('index.twig', postObj)
  } else {
    res.send('Error: Page doesn\'t exist')
  }
})