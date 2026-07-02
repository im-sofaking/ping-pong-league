# 🏓 Script Aggiungi Partita

Script interattivo per aggiungere facilmente nuove partite alla leaderboard.

## 🚀 Come Usare

```bash
npm run match
```

## 📋 Cosa fa lo script?

1. **Chiede il tipo di partita** (Singolo o Doppio)
2. **Mostra i giocatori disponibili** con numeri
3. **Chiede i giocatori/team** che hanno giocato
4. **Chiede il risultato** della partita
5. **Aggiorna automaticamente:**
   - ✅ Aggiunge la partita alla lista
   - ✅ Aggiorna il conteggio vittorie del vincitore
   - ✅ Mantiene solo le ultime 5 partite
   - ✅ Ordina i giocatori alfabeticamente
6. **Chiede se fare push su GitHub**
   - Se sì: fa commit e push automatico
   - Se no: puoi farlo manualmente dopo

## 📝 Esempio d'Uso

```
🏓 Reply Ping Pong League - Aggiungi Partita

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

Vuoi fare commit e push su GitHub? (s/n): s

📤 Push su GitHub in corso...
✅ Push completato! L'app si aggiornerà automaticamente.
```

## 🎯 Funzionalità

### Partite Singole
- Seleziona 2 giocatori
- Inserisci i punteggi
- Il vincitore viene determinato automaticamente
- Le vittorie vengono aggiornate

### Partite Doppie
- Seleziona 2 giocatori per Team 1
- Seleziona 2 giocatori per Team 2
- Inserisci i punteggi
- Entrambi i membri del team vincente ricevono +1 vittoria

### Gestione Automatica
- **Data**: Aggiunta automaticamente (oggi)
- **Vittorie**: Calcolate e aggiornate automaticamente
- **Classifica**: Mantenuta in ordine alfabetico
- **Cronologia**: Solo le ultime 5 partite per tipo

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
