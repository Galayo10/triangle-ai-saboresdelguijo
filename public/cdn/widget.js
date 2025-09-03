(() => {
  const s = document.currentScript;
  const tenant = (s && s.dataset && s.dataset.tenant) ? s.dataset.tenant : 'default';
  const sid = (crypto.randomUUID && crypto.randomUUID()) || (Date.now()+'-'+Math.random());
  const origin = location.origin; // cuando despliegues, será https://tuapp.onrender.com o tu dominio
  const iframeURL = `${origin}/embed?tenant=${encodeURIComponent(tenant)}&sid=${encodeURIComponent(sid)}`;

  const btn = document.createElement('button');
  btn.textContent = '💬 Chat';
  btn.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:999999;border:2px solid #000;border-radius:999px;padding:10px 14px;background:#fff;cursor:pointer;box-shadow:0 6px 16px rgba(0,0,0,.15);font-weight:700;';
  const panel = document.createElement('div');
  panel.style.cssText = 'position:fixed;bottom:78px;right:20px;width:min(420px,92vw);height:min(640px,80vh);border:2px solid #000;border-radius:16px;background:#fff;display:none;overflow:hidden;z-index:999998;box-shadow:0 18px 46px rgba(0,0,0,.22);';
  const iframe = document.createElement('iframe');
  iframe.src = iframeURL;
  iframe.style.cssText = 'width:100%;height:100%;border:0;';
  panel.appendChild(iframe);

  btn.onclick = () => { panel.style.display = (panel.style.display==='none'?'block':'none'); };
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') panel.style.display='none'; });

  document.body.appendChild(btn);
  document.body.appendChild(panel);
})();