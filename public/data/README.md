# Sistema di Gestione Dati - Ping Pong League

## 📁 File dei Dati

I dati delle partite sono salvati in: **`src/data/matches.json`**

## 🔄 Come Aggiornare i Dati

### In Locale (durante lo sviluppo)
1. Apri il file `src/data/matches.json`
2. Modifica i dati (aggiungi partite, aggiorna vittorie, ecc.)
3. Salva il file
4. L'app si aggiornerà automaticamente (hot reload)

### Dopo l'Hosting (GitHub/Netlify/Vercel)
1. Vai su GitHub nel repository del progetto
2. Naviga in `src/data/matches.json`
3. Clicca su "Edit" (icona matita)
4. Modifica i dati
5. Fai commit delle modifiche
6. L'app si aggiornerà automaticamente in 1-2 minuti!

## 📝 Struttura del JSON

```json
{
  "players": [
    { "name": "Nome Giocatore", "wins": numero_vittorie }
  ],
  "teams": [
    { 
      "name": "Nome Team", 
      "members": ["Giocatore1", "Giocatore2"], 
      "wins": numero_vittorie 
    }
  ],
  "singleMatches": [
    {
      "player1": "Giocatore1",
      "player2": "Giocatore2",
      "score1": punteggio1,
      "score2": punteggio2,
      "date": "DD/MM/YYYY"
    }
  ],
  "doubleMatches": [
    {
      "team1": ["GiocatoreA", "GiocatoreB"],
      "team2": ["GiocatoreC", "GiocatoreD"],
      "score1": punteggio1,
      "score2": punteggio2,
      "date": "DD/MM/YYYY"
    }
  ]
}
```

## 🎯 Esempio: Aggiungere una Nuova Partita

### Partita Singola:
```json
{ 
  "player1": "Luca B", 
  "player2": "Andrea", 
  "score1": 11, 
  "score2": 9, 
  "date": "03/07/2026" 
}
```

### Partita Doppia:
```json
{ 
  "team1": ["Luca B", "Riccardo"], 
  "team2": ["Andrea", "Davide"], 
  "score1": 11, 
  "score2": 7, 
  "date": "03/07/2026" 
}
```

## ⚠️ Note Importanti

- **Formato data**: Usa sempre DD/MM/YYYY (es: 02/07/2026)
- **Nomi giocatori**: Devono corrispondere esattamente a quelli in `players`
- **Le ultime 5 partite**: Vengono mostrate automaticamente in ordine
- **Best Duo**: Calcolato automaticamente dalle vittorie nei double matches
- **Backup**: Fai sempre un backup del file prima di modifiche importanti!

## 🚀 Vantaggi di questo Sistema

✅ Nessun database da gestire
✅ Facile da modificare (anche da smartphone via GitHub)
✅ Versionato con Git (storico delle modifiche)
✅ Nessun costo aggiuntivo
✅ Veloce e leggero
