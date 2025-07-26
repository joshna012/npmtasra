// -------------- helpers --------------
function byId(id){return document.getElementById(id)}
const form    = byId('adminForm');
const out     = byId('jsonOut');
const pushBtn = byId('pushBtn');

/* Turn form fields into JSON snippet */
form.onsubmit = e=>{
    e.preventDefault();
    const fd = new FormData(form);
    const obj = Object.fromEntries(fd.entries());
    obj.tags = obj.title.toLowerCase().split(' ');
    const snippet = JSON.stringify(obj,null,2);
    out.value = snippet;
};

/* OPTIONAL : push to repository --------------------------------------------------
   Requires:
   1. create .env or secret with a Personal-Access-Token (PAT) that has  `repo` scope
   2. replace REPO, OWNER, BRANCH below
*/
const OWNER  = 'YOUR_GH_USER';
const REPO   = 'YOUR_REPO';
const BRANCH = 'main';          // gh-pages if you like
pushBtn.onclick = async ()=>{
    const token = prompt('Paste your GitHub token:');
    if(!token) return;
    const path  = 'data/apps.json';

    // 1. Get current file SHA ---------------
    const headers={Authorization:`token \${token}`,Accept:'application/vnd.github+json'};
    const res   = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`,{headers});
    const json  = await res.json();
    const sha   = json.sha;
    const contentArr = JSON.parse(atob(json.content));
    contentArr.push(JSON.parse(out.value));         // add new record

    // 2. Commit updated file ---------------
    const body = {
        message: `Add \${form.title.value}`,
        branch : BRANCH,
        sha,
        content: btoa(JSON.stringify(contentArr,null,2))
    };
    const put = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`,{
        method:'PUT',headers,body:JSON.stringify(body)});
    if(put.ok) alert('Pushed 🎉  Refresh the site!');
    else alert('GitHub API error');
};
