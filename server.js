// AstroHealth AI backend: serves the page and proxies agent calls to the Anthropic API.
// The API key stays on the server and is never exposed to the browser.
// Requires Node 18+. No npm dependencies.
const http = require('http');
const fs = require('fs');
const path = require('path');

// Minimal .env loader
try{
  fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/).forEach(l => {
    const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if(m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  });
}catch(e){}

const PORT = process.env.PORT || 3001;
const KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5';
const INDEX = path.join(__dirname, 'public', 'index.html');

function send(res, code, obj){
  res.writeHead(code, {'Content-Type':'application/json'});
  res.end(JSON.stringify(obj));
}

http.createServer((req, res) => {
  if(req.method === 'GET' && (req.url === '/' || req.url === '/index.html')){
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    return fs.createReadStream(INDEX).pipe(res);
  }
  if(req.method === 'POST' && req.url === '/api/agent'){
    if(!KEY) return send(res, 500, {error:'ANTHROPIC_API_KEY is not set on the server (see README).'});
    let body = '';
    req.on('data', c => { body += c; if(body.length > 200000) req.destroy(); });
    req.on('end', async () => {
      try{
        const {system, messages, tools} = JSON.parse(body || '{}');
        if(!Array.isArray(messages) || !messages.length) return send(res, 400, {error:'messages required'});
        const r = await fetch('https://api.anthropic.com/v1/messages', {
          method:'POST',
          headers:{'Content-Type':'application/json', 'x-api-key':KEY, 'anthropic-version':'2023-06-01'},
          body:JSON.stringify({model:MODEL, max_tokens:800, system:String(system || '').slice(0, 4000), messages, tools:Array.isArray(tools) ? tools : []})
        });
        const raw = await r.text();
        let data = null; try{ data = raw ? JSON.parse(raw) : null; }catch(e){}
        if(!r.ok) return send(res, r.status, {error:(data && data.error && data.error.message) || `Anthropic API error ${r.status}`});
        send(res, 200, {content:data.content, stop_reason:data.stop_reason});
      }catch(e){ send(res, 500, {error:e.message || 'server error'}); }
    });
    return;
  }
  send(res, 404, {error:'not found'});
}).listen(PORT, () => console.log(`AstroHealth AI running at http://localhost:${PORT}  (key ${KEY ? 'loaded' : 'MISSING'})`));
