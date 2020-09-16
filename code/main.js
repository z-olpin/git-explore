const express = require('express');
const server = express();
const { execSync } = require('child_process')

const PORT = '5000';

const cloneRepo = (gitUrl) => {
  const success = execSync(`git clone ${gitUrl}`, (err, stdout, stderror) => {
    if (err || stderror) return false;
    return true;
  });
  return success;
}

const runScc = (repoPath) => {
  const output = execSync(`scc ${process.cwd()}/${repoPath}`, (err, stdout, stderror) => {
    if (err) return err.message;
    if (stderror) return stderror;
    return stdout;
  })
  return output;
};

server.use(express.json());
server.use(express.urlencoded({extended: true}));

server.get('/', (req, res) => {
  res.send('hello');
});

server.post('/analyze', (req, res) => {
  const { gitUrl } = req.body;
  const repoName = gitUrl.match(/\/([\w\-\_\d]*).git$/)[1];
  if (cloneRepo(gitUrl)){
    res.send(runScc(repoName));
  } else {
    res.status(500).json({message: "Something went wrong."});
  }
  // TODO: cleanup. Remove cloned dir.
});

server.listen(PORT, () => console.log(`Server is running at ${PORT}...`));
