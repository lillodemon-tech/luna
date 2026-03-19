// ═══════════════════════════════════════════════════════
//  MyStream Proxy — Cloudflare Worker
//  Rimuove X-Frame-Options e CSP per permettere iframe
//  Riscrive i link relativi in assoluti
// ═══════════════════════════════════════════════════════

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Preflight CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  const reqUrl = new URL(request.url);
  const target = reqUrl.searchParams.get('url');

  if (!target) {
    return new Response(
      `<h2>MyStream Proxy</h2><p>Usa: <code>?url=https://sito.com</code></p>`,
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    );
  }

  let targetUrl;
  try {
    targetUrl = new URL(target);
  } catch {
    return new Response('URL non valido', { status: 400 });
  }

  try {
    const response = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'it-IT,it;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': targetUrl.origin,
      },
      redirect: 'follow',
    });

    // Costruisci nuovi header senza le restrizioni iframe
    const newHeaders = new Headers();
    for (const [key, value] of response.headers.entries()) {
      const lower = key.toLowerCase();
      // Rimuovi header che bloccano iframe e tracciano la posizione
      if (
        lower === 'x-frame-options' ||
        lower === 'content-security-policy' ||
        lower === 'content-security-policy-report-only' ||
        lower === 'x-content-type-options'
      ) continue;
      newHeaders.set(key, value);
    }

    // Aggiungi CORS
    for (const [k, v] of Object.entries(CORS_HEADERS)) {
      newHeaders.set(k, v);
    }

    const contentType = response.headers.get('content-type') || '';

    // Se è HTML, riscrivi i link relativi e inietta base tag
    if (contentType.includes('text/html')) {
      let body = await response.text();
      const proxyBase = reqUrl.origin + reqUrl.pathname; // URL del worker stesso

      // Inietta <base> tag per risolvere URL relativi
      const baseTag = `<base href="${targetUrl.origin}/">`;
      body = body.replace(/<head([^>]*)>/i, `<head$1>${baseTag}`);

      // Riscrivi i link assoluti per farli passare dal proxy
      body = rewriteLinks(body, targetUrl, proxyBase);

      newHeaders.set('Content-Type', 'text/html; charset=utf-8');
      return new Response(body, {
        status: response.status,
        headers: newHeaders,
      });
    }

    // Altrimenti passa il body così com'è (immagini, JS, CSS...)
    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });

  } catch (err) {
    return new Response(
      `<html><body style="font-family:sans-serif;padding:40px;background:#0a0a0f;color:#e8e8f0">
        <h2>⚠️ Errore proxy</h2>
        <p>Impossibile raggiungere: <code>${target}</code></p>
        <p style="color:#7070a0;font-size:13px">${err.message}</p>
        <p><a href="${target}" target="_top" style="color:#e8a020">↗ Apri direttamente</a></p>
      </body></html>`,
      {
        status: 502,
        headers: { 'Content-Type': 'text/html', ...CORS_HEADERS },
      }
    );
  }
}

function rewriteLinks(html, targetUrl, proxyBase) {
  const origin = targetUrl.origin;

  // Riscrivi href e src assoluti che puntano allo stesso dominio
  html = html.replace(
    /(href|src|action)="(https?:\/\/[^"]+)"/gi,
    (match, attr, url) => {
      // Riscrivi solo URL dello stesso dominio, lascia CDN esterne
      if (url.startsWith(origin)) {
        return `${attr}="${proxyBase}?url=${encodeURIComponent(url)}"`;
      }
      return match;
    }
  );

  return html;
} } }
    );
  }

  let targetUrl;
  try {
    targetUrl = new URL(target);
  } catch {
    return new Response('URL non valido', { status: 400 });
  }

  try {
    const response = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'it-IT,it;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': targetUrl.origin,
      },
      redirect: 'follow',
    });

    // Costruisci nuovi header senza le restrizioni iframe
    const newHeaders = new Headers();
    for (const [key, value] of response.headers.entries()) {
      const lower = key.toLowerCase();
      // Rimuovi header che bloccano iframe e tracciano la posizione
      if (
        lower === 'x-frame-options' ||
        lower === 'content-security-policy' ||
        lower === 'content-security-policy-report-only' ||
        lower === 'x-content-type-options'
      ) continue;
      newHeaders.set(key, value);
    }

    // Aggiungi CORS
    for (const [k, v] of Object.entries(CORS_HEADERS)) {
      newHeaders.set(k, v);
    }

    const contentType = response.headers.get('content-type') || '';

    // Se è HTML, riscrivi i link relativi e inietta base tag
    if (contentType.includes('text/html')) {
      let body = await response.text();
      const proxyBase = reqUrl.origin + reqUrl.pathname; // URL del worker stesso

      // Inietta <base> tag per risolvere URL relativi
      const baseTag = `<base href="${targetUrl.origin}/">`;
      body = body.replace(/<head([^>]*)>/i, `<head$1>${baseTag}`);

      // Riscrivi i link assoluti per farli passare dal proxy
      body = rewriteLinks(body, targetUrl, proxyBase);

      newHeaders.set('Content-Type', 'text/html; charset=utf-8');
      return new Response(body, {
        status: response.status,
        headers: newHeaders,
      });
    }

    // Altrimenti passa il body così com'è (immagini, JS, CSS...)
    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });

  } catch (err) {
    return new Response(
      `<html><body style="font-family:sans-serif;padding:40px;background:#0a0a0f;color:#e8e8f0">
        <h2>⚠️ Errore proxy</h2>
        <p>Impossibile raggiungere: <code>${target}</code></p>
        <p style="color:#7070a0;font-size:13px">${err.message}</p>
        <p><a href="${target}" target="_top" style="color:#e8a020">↗ Apri direttamente</a></p>
      </body></html>`,
      {
        status: 502,
        headers: { 'Content-Type': 'text/html', ...CORS_HEADERS },
      }
    );
  }
}

function rewriteLinks(html, targetUrl, proxyBase) {
  const origin = targetUrl.origin;

  // Riscrivi href e src assoluti che puntano allo stesso dominio
  html = html.replace(
    /(href|src|action)="(https?:\/\/[^"]+)"/gi,
    (match, attr, url) => {
      // Riscrivi solo URL dello stesso dominio, lascia CDN esterne
      if (url.startsWith(origin)) {
        return `${attr}="${proxyBase}?url=${encodeURIComponent(url)}"`;
      }
      return match;
    }
  );

  return html;
}
