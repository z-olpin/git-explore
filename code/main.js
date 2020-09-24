const util = require("util")
const execFile = util.promisify(require("child_process").execFile)
const path = require("path")
const fs = require("fs")
const express = require("express")

const server = express()

const PORT = 3000

server.use(express.static(path.join(__dirname, "client")))
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

// Clones a repository to the process's cwd
const clone = async (gitUrl, repoName) => {
  await execFile("git", ["clone", "--depth=1", gitUrl, `clones/${repoName}`]).catch((e) => {
    throw e
  })
}

// Runs the tokei utility on @param `path` and returns default analysis as an object.
const tokei = async (repoPath) => {
  const { stdout } = await execFile("tokei", ["-o", "json", repoPath])
    .catch(e => {
      throw e
    })
  return JSON.parse(stdout)
}

// Removes cloned directory after analysis
const cleanUp = async (path) => {
  await fs.rmdir(path, { recursive: true }, (e) => {
    if (e) console.error(e)
  })
}

/*****************************************
 *               ROUTES                  *
 *****************************************/

// Post request with `gitUrl` field in body returns tokei analysis as json object
server.post("/analyze", async (req, res) => {
  const gitUrl = req.body.gitUrl.replace(/[^a-zA-Z0-9/_\.\-:]/g, "")
  const repoName = gitUrl.match(/\/([\w\-\_\d]*).git$/)[1]
  await clone(gitUrl, repoName).catch((e) => console.error(e))
  const analysis = await tokei(`clones/${repoName}`).catch((e) => console.error(e))
  res.json(analysis)
  await cleanUp(repoName)
})

server.listen(PORT, () => console.log(`Server is running at ${PORT}...`))
