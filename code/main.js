const express = require("express")
const server = express()
const { execSync } = require("child_process")
const path = require("path")
const fs = require("fs")

// TODO error handling and attention to security

// Temporarily hard coded
const PORT = "5000"

// Super disk / cpu / network intensive.
const cloneRepo = (gitUrl) => {
  const success = execSync(`git clone ${gitUrl}`, (err, stdout, stderror) => {
    if (err || stderror) return false
    return true
  })
  return success
}

const runTokei = (repoPath) => {
  const output = execSync(
    `tokei -o json ${process.cwd()}/${repoPath}`,
    (err, stdout, stderror) => {
      if (err) return err.message
      if (stderror) return stderror
      return stdout
    }
  )
  return output.toString();
}

server.use(express.static(path.join(__dirname, "client")))
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.post("/analyze", (req, res) => {
  const gitUrl = req.body.gitUrl.replace(/[^a-zA-Z0-9/_\.\-:]/g, '')
  const repoName = gitUrl.match(/\/([\w\-\_\d]*).git$/)[1]
  if (repoName && cloneRepo(gitUrl)) {
    res.send(runTokei(repoName))
  } else {
    res.status(500).json({ message: "Something went wrong." })
  }
  // TODO
  fs.rmdir(repoName, { recursive: true }, (err) => {
    if (err) throw err
  })
})

server.listen(PORT, () => console.log(`Server is running at ${PORT}...`))
