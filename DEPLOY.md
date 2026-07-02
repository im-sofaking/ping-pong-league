# 🚀 Guida al Deploy - Reply Ping Pong League

## ✅ Step 1: Repository Git Inizializzato
Il repository Git locale è già pronto! ✓

---

## 📤 Step 2: Crea Repository su GitHub e Push

### 1️⃣ Vai su GitHub
- Apri [github.com](https://github.com)
- Clicca sul pulsante **"+"** in alto a destra
- Seleziona **"New repository"**

### 2️⃣ Configura il Repository
- **Repository name**: `ping-pong-league` (o il nome che preferisci)
- **Description**: "Reply Ping Pong League - Leaderboard tra amici"
- **Visibility**: **Public** o **Private** (se vuoi che solo tu veda il codice)
- ⚠️ **NON** spuntare "Initialize this repository with a README"
- Clicca **"Create repository"**

### 3️⃣ Collega e Pusha il Codice
GitHub ti mostrerà delle istruzioni. Usa queste:

```bash
# Sostituisci 'TUO-USERNAME' con il tuo username GitHub
git remote add origin https://github.com/TUO-USERNAME/ping-pong-league.git
git branch -M main
git push -u origin main
```

**Oppure esegui questi comandi nel terminale di VS Code:**
1. Copia l'URL che GitHub ti ha dato (sarà simile a: https://github.com/tuo-username/ping-pong-league.git)
2. Esegui i comandi sopra sostituendo l'URL

---

## 🌐 Step 3: Deploy Online (Scegli UN'opzione)

### ⭐ OPZIONE A: Vercel (CONSIGLIATA - Più facile)

**Vantaggi**: Deploy automatico, SSL gratuito, velocissimo, zero configurazione

1. Vai su [vercel.com](https://vercel.com)
2. Clicca **"Sign Up"** e accedi con GitHub
3. Clicca **"Import Project"**
4. Seleziona il repository `ping-pong-league`
5. Vercel rileva automaticamente che è un progetto Vite
6. Clicca **"Deploy"**
7. ✅ **FATTO!** La tua app è online in ~2 minuti

**URL**: Otterrai un link tipo `ping-pong-league.vercel.app`

**Aggiornamenti automatici**: Ogni volta che fai `git push`, l'app si aggiorna automaticamente!

---

### 🔄 OPZIONE B: Netlify (Alternativa valida)

1. Vai su [netlify.com](https://netlify.com)
2. Clicca **"Sign Up"** con GitHub
3. Clicca **"Add new site"** → **"Import an existing project"**
4. Seleziona il repository
5. Configura il build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Clicca **"Deploy"**

---

### 🎯 OPZIONE C: Cloudflare Pages

1. Vai su [pages.cloudflare.com](https://pages.cloudflare.com)
2. Accedi e clicca **"Create a project"**
3. Connetti GitHub e seleziona il repository
4. Configurazione:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Clicca **"Save and Deploy"**

---

## 📝 Dopo il Deploy: Come Aggiornare i Dati

### Metodo 1: Via GitHub (da browser o smartphone)
1. Vai su `github.com/tuo-username/ping-pong-league`
2. Naviga in `public/data/matches.json`
3. Clicca l'icona matita (✏️ Edit)
4. Modifica il JSON (aggiungi partite, ecc.)
5. Scrolla in basso e clicca **"Commit changes"**
6. ✨ L'app si aggiorna automaticamente in 1-2 minuti!

### Metodo 2: Via Locale
1. Modifica `public/data/matches.json` in VS Code
2. Esegui:
   ```bash
   git add .
   git commit -m "Aggiornamento partite"
   git push
   ```
3. Deploy automatico!

---

## 🔐 Sicurezza del JSON

- ✅ **Solo tu puoi modificare**: Serve accesso al repository GitHub
- ⚠️ **I dati sono pubblici**: Chiunque con il link può vederli (ma va bene per un'app tra amici!)
- 💡 **Tip**: Se vuoi privacy totale, metti il repository **Private** su GitHub

---

## 🆘 Problemi Comuni

### Il logo Reply non si vede dopo il deploy
- Assicurati che `src/assets/reply-logo.png` sia committato
- Verifica che il file esista in `public/` se necessario

### Gli avatar non si caricano
- Controlla che tutti i file `.svg` siano nella cartella `src/assets/avatars/`
- Verifica che siano committati su Git

### L'app non si aggiorna dopo modifica JSON
- Aspetta 1-2 minuti per il deploy automatico
- Controlla la dashboard Vercel/Netlify per vedere lo stato del deploy
- Prova a fare "Hard Refresh" nel browser (Ctrl+Shift+R)

---

## 📞 Supporto

Se hai problemi, controlla:
- Dashboard del servizio di hosting (Vercel/Netlify)
- Logs di build per vedere eventuali errori
- Stato del push su GitHub

**Il Tuo Link Finale sarà tipo:**
- Vercel: `https://ping-pong-league.vercel.app`
- Netlify: `https://ping-pong-league.netlify.app`
- Cloudflare: `https://ping-pong-league.pages.dev`

🎉 **Buon divertimento con la tua Ping Pong League online!**
