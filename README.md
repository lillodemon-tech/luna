# 📺 MyStream — Setup Completo

Guida passo-passo per mettere tutto online in ~15 minuti.

---

## 📁 File inclusi

| File | Descrizione |
|---|---|
| `index.html` | App completa (frontend + logica) |
| `worker.js` | Proxy Cloudflare per iframe |
| `README.md` | Questa guida |

---

## STEP 1 — Crea il database su Supabase (gratis)

1. Vai su **https://supabase.com** → crea account gratuito
2. Crea un nuovo progetto (es. "mystream")
3. Vai su **SQL Editor** e incolla questo codice:

```sql
CREATE TABLE links (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  url text NOT NULL,
  thumb text DEFAULT '',
  type text DEFAULT 'film',
  tag text,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Permetti accesso pubblico (solo tu hai la password admin)
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON links FOR ALL USING (true) WITH CHECK (true);
```

4. Clicca **Run** per eseguire
5. Vai su **Settings → API** e copia:
   - `Project URL` → è il tuo `SUPABASE_URL`
   - `anon public key` → è il tuo `SUPABASE_ANON_KEY`

---

## STEP 2 — Configura index.html

Apri `index.html` con un editor di testo e trova il blocco CONFIG (verso la fine del file):

```js
const CONFIG = {
  SUPABASE_URL:      'INCOLLA_QUI_IL_TUO_SUPABASE_URL',
  SUPABASE_ANON_KEY: 'INCOLLA_QUI_IL_TUO_SUPABASE_ANON_KEY',
  ADMIN_PASSWORD:    'cambia_questa_password',   // ← scegli una password
  PROXY_URL:         '',                          // ← aggiungi dopo lo step 3
};
```

Sostituisci i valori con quelli copiati da Supabase e scegli una password admin.

---

## STEP 3 — Deploy del Proxy su Cloudflare Workers (gratis)

Il proxy serve per caricare i siti streaming dentro l'iframe dell'app.

1. Vai su **https://workers.cloudflare.com** → crea account gratuito
2. Clicca **Create a Worker**
3. Cancella tutto il codice di default
4. Incolla il contenuto del file `worker.js`
5. Clicca **Save and Deploy**
6. Copia l'URL del worker (es. `https://mystream-proxy.tuonome.workers.dev`)
7. Incollalo nel CONFIG di `index.html`:

```js
PROXY_URL: 'https://mystream-proxy.tuonome.workers.dev',
```

> 💡 Il piano gratuito di Cloudflare Workers include **100.000 richieste/giorno** — più che sufficiente per uso personale.

---

## STEP 4 — Pubblica su GitHub Pages (gratis)

1. Crea un nuovo repository su **https://github.com** (es. `mystream`)
2. Carica `index.html` nel repository
3. Vai su **Settings → Pages**
4. Seleziona branch `main`, cartella `/ (root)` → **Save**
5. Dopo 1-2 minuti il sito è online su:
   ```
   https://tuonome.github.io/mystream
   ```

---

## STEP 5 — Importa i link predefiniti

1. Apri il tuo sito
2. Clicca **Importa** in alto a destra
3. Seleziona il file `mystream_links.json` (se l'hai scaricato)

I 18 siti streaming vengono importati automaticamente nel database.

---

## 🔐 Come funziona la password admin

- Chiunque può **visualizzare** i link e **cercare** sui siti
- Solo chi conosce la password può **aggiungere**, **modificare** o **eliminare** link
- La sessione admin rimane attiva finché non ricarichi la pagina
- Per uso personale puoi anche lasciarla semplice, tanto il sito è solo tuo

---

## 🖥️ Uso in locale (senza GitHub)

Puoi aprire `index.html` direttamente nel browser. In modalità locale:
- I dati vengono salvati nel `localStorage` del browser (niente Supabase necessario)
- Il proxy funziona ugualmente se configurato
- Perfetto per uso offline

---

## 🔧 Risoluzione problemi

| Problema | Soluzione |
|---|---|
| Banner "Non configurato" | Controlla SUPABASE_URL e ANON_KEY nel CONFIG |
| Iframe bianco | Il proxy non è configurato o il sito ha protezioni extra |
| Link non si salvano | Verifica le RLS policy su Supabase (vedi Step 1) |
| Popup bloccati nella ricerca | Consenti popup dal tuo sito nelle impostazioni del browser |
| Worker dà errore 502 | Il sito di destinazione blocca le richieste da Cloudflare |

---

## 💰 Costi

Tutto è **completamente gratuito** per uso personale:

- **Supabase Free**: 500MB database, 2GB bandwidth/mese
- **Cloudflare Workers Free**: 100.000 richieste/giorno
- **GitHub Pages**: illimitato per repository pubblici

---

## 📱 Stack tecnologico

```
Browser  →  GitHub Pages (index.html)
                ↓
          Supabase (PostgreSQL)   ← salva/legge link
                ↓
     Cloudflare Worker (proxy)    ← iframe streaming
                ↓
          Siti streaming esterni
```
