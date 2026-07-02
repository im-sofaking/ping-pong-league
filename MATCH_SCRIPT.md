# 🏓 Script Gestione Partite

Script interattivo per aggiungere o eliminare partite dalla leaderboard.

## 🚀 Come Usare

```bash
npm run match
```

## 📋 Cosa fa lo script?

1. **Chiede cosa vuoi fare**
   - Aggiungere una partita
   - Eliminare una partita (utile se hai inserito un risultato sbagliato)
2. **Se aggiungi una partita:**
   - Chiede il tipo di partita (Singolo o Doppio)
   - Mostra i giocatori disponibili con numeri
   - Chiede i giocatori/team che hanno giocato
   - Chiede il risultato della partita
   - Aggiunge la partita e ricalcola le vittorie automaticamente
3. **Se elimini una partita:**
   - Chiede il tipo di partita (Singolo o Doppio)
   - Mostra tutte le partite disponibili
   - Chiede quale eliminare
   - Elimina la partita e ricalcola le vittorie automaticamente
4. **Chiede se fare altre modifiche**
   - Se sì: ripete il processo dall'inizio
   - Se no: salva i dati e procede
5. **Chiede se fare push su GitHub**
   - Se sì: fa commit e push automatico
   - Se no: puoi farlo manualmente dopo

## 📝 Esempio d'Uso

### Aggiungere una partita

```
🏓 Reply Ping Pong League - Gestione Partite

Cosa vuoi fare?
1) Aggiungere una partita
2) Eliminare una partita

Scegli (1 o 2): 1

Che tipo di partita vuoi aggiungere?
1) Singolo
2) Doppio

Scegli (1 o 2): 1

📋 Giocatori disponibili:
  1) Andrea
  2) Carlotta
  3) Davide
  4) Gabri
  5) Luca B
  6) Luca V
  7) Riccardo

Giocatore 1 (numero): 6
Giocatore 2 (numero): 1

⚡ Luca V vs Andrea

Punteggio Luca V: 7
Punteggio Andrea: 11

✅ Partita aggiunta con successo!
   Luca V 7 - 11 Andrea
   🏆 Vincitore: Andrea

Vuoi fare altre modifiche? (s/n): n

Vuoi fare commit e push su GitHub? (s/n): s

📤 Push su GitHub in corso...
✅ Push completato! L'app si aggiornerà automaticamente.
```

### Eliminare una partita

```
Cosa vuoi fare?
1) Aggiungere una partita
2) Eliminare una partita

Scegli (1 o 2): 2

Che tipo di partita vuoi eliminare?
1) Singolo
2) Doppio

Scegli (1 o 2): 1

📋 Partite singolo disponibili:
  1) Luca V 7-11 Andrea (02/07/2026)
  2) Riccardo 11-9 Davide (01/07/2026)
  3) Andrea 11-4 Gabri (30/06/2026)

Quale partita vuoi eliminare? (1-3): 1

✅ Partita eliminata con successo!
   Luca V 7 - 11 Andrea

Vuoi fare altre modifiche? (s/n): n
```

## 🎯 Funzionalità

### Aggiungere Partite

#### Partite Singole
- Seleziona 2 giocatori
- Inserisci i punteggi
- Il vincitore viene determinato automaticamente
- Le vittorie vengono ricalcolate

#### Partite Doppie
- Seleziona 2 giocatori per Team 1
- Seleziona 2 giocatori per Team 2
- Inserisci i punteggi
- Entrambi i membri del team vincente ricevono +1 vittoria
- Le vittorie del team vengono aggiornate per la "Best Duo"

### Eliminare Partite

- Utile se hai inserito un risultato sbagliato
- Mostra tutte le partite disponibili
- Seleziona quale eliminare
- Le vittorie vengono ricalcolate automaticamente

### Gestione Automatica
- **Data**: Aggiunta automaticamente (oggi) per nuove partite
- **Vittorie**: Ricalcolate automaticamente ad ogni modifica
- **Classifica**: Mantenuta in ordine alfabetico
- **Storico**: Tutte le partite vengono mantenute (nessun limite)

## 🔧 Modifica Manuale

Se preferisci, puoi sempre modificare `src/data/matches.json` manualmente.

Struttura del file:
```json
{
  "players": [
    { "name": "Nome", "wins": numero }
  ],
  "teams": [...],
  "singleMatches": [
    { 
      "player1": "Nome1", 
      "player2": "Nome2", 
      "score1": 11, 
      "score2": 7, 
      "date": "02/07/2026" 
    }
  ],
  "doubleMatches": [...]
}
```

## ⚠️ Note

- Lo script fa commit **solo** del file `matches.json`
- Il push richiede autenticazione Git configurata
- La data viene inserita automaticamente nel formato DD/MM/YYYY
- I giocatori devono già esistere nel file JSON

## 🆘 Problemi Comuni

**Errore durante il push:**
- Verifica di essere autenticato su GitHub
- Fai il push manualmente con:
  ```bash
  git add src/data/matches.json
  git commit -m "Add match"
  git push
  ```

**Script non si avvia:**
- Assicurati di essere nella directory del progetto
- Verifica che Node.js sia installato: `node --version`
