(() => {
  const s = document.currentScript;
  if (!s) return;

  // Base (host) del script: https://triangle-ai-XXXX.onrender.com
  const scriptURL = new URL(s.src);
  const BASE = scriptURL.origin;

  // Parámetros configurables por atributos
  const tenant    = (s.dataset.tenant || 'default').toLowerCase();
  const label     = s.dataset.label || '💬 Chat';
  const position  = (s.dataset.position || 'bottom-right').toLowerCase(); // bottom-right | bottom-left
  const accent    = s.dataset.accent || '#1AAD5C';
  const offset    = parseInt(s.dataset.offset || '20', 10); // px desde el borde
  const zIndex    = parseInt(s.dataset.z || '999999', 10);
  const sid = (crypto.randomUUID && crypto.randomUUID()) || (Date.now() + '-' + Math.random().toString(16).slice(2));

  const iframeURL = `${BASE}/embed?tenant=${encodeURIComponent(tenant)}&sid=${encodeURIComponent(sid)}`;

  // Estilos comunes
  const sideRight = position === 'bottom-right';
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.setAttribute('type', 'button');
  btn.style.position   = 'fixed';
  btn.style.bottom     = `${offset}px`;
  btn.style[sideRight ? 'right' : 'left'] = `${offset}px`;
  btn.style.zIndex     = String(zIndex);
  btn.style.border     = '2px solid #000';
  btn.style.borderRadius = '999px';
  btn.style.padding    = '10px 14px';
  btn.style.background = '#fff';
  btn.style.cursor     = 'pointer';
  btn.style.boxShadow  = '0 6px 16px rgba(0,0,0,.15)';
  btn.style.fontWeight = '700';
  btn.style.userSelect = 'none';

  // Panel
  const panel = document.createElement('div');
  panel.style.position   = 'fixed';
  panel.style.bottom     = `${offset + 58}px`;
  panel.style[sideRight ? 'right' : 'left'] = `${offset}px`;
  panel.style.width      = 'min(420px, 92vw)';
  panel.style.height     = 'min(640px, 80vh)';
  panel.style.border     = '2px solid #000';
  panel.style.borderRadius = '16px';
  panel.style.background = '#fff';
  panel.style.display    = 'none';
  panel.style.overflow   = 'hidden';
  panel.style.zIndex     = String(zIndex - 1);
  panel.style.boxShadow  = '0 18px 46px rgba(0,0,0,.22)';

  const iframe = document.createElement('iframe');
  iframe.src   = iframeURL;
  iframe.style.width  = '100%';
  iframe.style.height = '100%';
  iframe.style.border = '0';

  // Botón cerrar dentro del panel (esquina superior)
  const closer = document.createElement('button');
  closer.textContent = '×';
  closer.setAttribute('type', 'button');
  closer.style.position = 'absolute';
  closer.style.top = '8px';
  closer.style[sideRight ? 'right' : 'left'] = '8px';
  closer.style.width = '28px';
  closer.style.height = '28px';
  closer.style.border = '2px solid #000';
  closer.style.borderRadius = '10px';
  closer.style.background = '#fff';
  closer.style.cursor = 'pointer';
  closer.style.zIndex = '1';

  // Hover/acento
  btn.addEventListener('mouseenter', () => { btn.style.boxShadow = '0 10px 22px rgba(0,0,0,.18)'; });
  btn.addEventListener('mouseleave', () => { btn.style.boxShadow = '0 6px 16px rgba(0,0,0,.15)'; });

  // Toggle
  function openPanel(){ panel.style.display = 'block'; }
  function closePanel(){ panel.style.display = 'none'; }
  function toggle(){ panel.style.display = (panel.style.display === 'none' ? 'block' : 'none'); }

  btn.addEventListener('click', toggle);
  closer.addEventListener('click', closePanel);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanel(); });

  // Acento (verde) como pequeño punto decorativo en el botón
  const dot = document.createElement('span');
  dot.style.display = 'inline-block';
  dot.style.width   = '10px';
  dot.style.height  = '10px';
  dot.style.borderRadius = '999px';
  dot.style.border  = '2px solid #000';
  dot.style.background = accent;
  dot.style.marginRight = '8px';

  const labelNode = document.createElement('span');
  labelNode.textContent = label.replace(/^(\s*💬\s*)?/,''); // evita doble 💬 si ya lo pusiste

  btn.textContent = ''; // limpiamos y añadimos con el punto
  btn.appendChild(dot);
  btn.appendChild(labelNode);

  panel.appendChild(iframe);
  panel.appendChild(closer);
  document.body.appendChild(btn);
  document.body.appendChild(panel);
})();