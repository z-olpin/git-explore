const getAnalysis = async () => {
  const gitUrl = document.querySelector('input').value;
  const res = await fetch('/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({gitUrl})
  });
  const analysis = await res.json();
  makeTable(analysis);
}

const makeTable = (analysis) => {
  let table = document.createElement('table');
  let thead = document.createElement('tr');
  ["Language", "Files", "Code", "Comments", "Blanks"].forEach(h => {
    let th = document.createElement('th');
    th.append(h);
    thead.append(th);
  });
  table.append(thead);
  Object.entries(analysis).forEach(([language, stats]) => {
    let {blanks, code, comments} = stats;
    let tr = document.createElement('tr');
    [language, stats.reports.length, code, comments, blanks].forEach(col => {
      let td = document.createElement('td');
      td.append(col);
      tr.append(td);
    });
    table.append(tr);
  });
  document.body.append(table);
}

document.querySelector('button').addEventListener('click', getAnalysis)
