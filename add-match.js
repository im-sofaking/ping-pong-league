#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { createInterface } from 'readline';
import { execSync } from 'child_process';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

const DATA_PATH = './src/data/matches.json';

// Colori per il terminale
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

console.log(`\n${colors.cyan}🏓 Reply Ping Pong League - Gestione Partite${colors.reset}\n`);

// Funzione per ricalcolare tutte le vittorie dalle partite esistenti
function recalculateWins(data) {
  // Azzera tutti i conteggi
  data.players.forEach(p => p.wins = 0);
  data.teams.forEach(t => t.wins = 0);
  
  // Conta vittorie da partite singole
  data.singleMatches.forEach(match => {
    const winner = match.score1 > match.score2 ? match.player1 : match.player2;
    const player = data.players.find(p => p.name === winner);
    if (player) player.wins++;
  });
  
  // Conta vittorie da partite doppie
  data.doubleMatches.forEach(match => {
    const winningTeam = match.score1 > match.score2 ? match.team1 : match.team2;
    
    // Aggiorna vittorie giocatori
    winningTeam.forEach(playerName => {
      const player = data.players.find(p => p.name === playerName);
      if (player) player.wins++;
    });
    
    // Aggiorna vittorie team
    const teamKey = [...winningTeam].sort().join('-');
    const team = data.teams.find(t => {
      const tKey = [...t.members].sort().join('-');
      return tKey === teamKey;
    });
    if (team) team.wins++;
  });
}

async function resetSeason(data) {
  console.log(`\n${colors.red}⚠️  ATTENZIONE! Stai per azzerare completamente la stagione.${colors.reset}`);
  console.log(`${colors.yellow}Questa azione eliminerà:${colors.reset}`);
  console.log('  - Tutte le partite singole');
  console.log('  - Tutte le partite doppie');
  console.log('  - Tutti i conteggi vittorie\n');
  
  const conferma1 = await question(`${colors.red}Sei sicuro di voler azzerare tutto? (scrivi SI): ${colors.reset}`);
  
  if (conferma1.trim().toUpperCase() !== 'SI') {
    console.log(`\n${colors.yellow}❌ Operazione annullata.${colors.reset}`);
    return;
  }
  
  const conferma2 = await question(`${colors.red}Conferma nuovamente (scrivi AZZERA): ${colors.reset}`);
  
  if (conferma2.trim().toUpperCase() !== 'AZZERA') {
    console.log(`\n${colors.yellow}❌ Operazione annullata.${colors.reset}`);
    return;
  }
  
  // Azzera tutto
  data.players.forEach(p => p.wins = 0);
  data.teams.forEach(t => t.wins = 0);
  data.singleMatches = [];
  data.doubleMatches = [];
  
  console.log(`\n${colors.green}✅ Stagione azzerata con successo!${colors.reset}`);
  console.log(`${colors.cyan}Pronti per una nuova stagione! 🏓${colors.reset}`);
}

async function deleteMatch(data) {
  // Scegli tipo di partita da eliminare
  console.log(`${colors.yellow}Che tipo di partita vuoi eliminare?${colors.reset}`);
  console.log('1) Singolo');
  console.log('2) Doppio\n');
  const tipoInput = await question('Scegli (1 o 2): ');
  const tipo = tipoInput.trim() === '2' ? 'doppio' : 'singolo';
  
  const matches = tipo === 'singolo' ? data.singleMatches : data.doubleMatches;
  
  if (matches.length === 0) {
    console.log(`\n${colors.red}❌ Nessuna partita ${tipo} disponibile!${colors.reset}`);
    return;
  }
  
  // Mostra le partite disponibili
  console.log(`\n${colors.blue}📋 Partite ${tipo} disponibili:${colors.reset}`);
  matches.forEach((match, i) => {
    if (tipo === 'singolo') {
      console.log(`  ${i + 1}) ${match.player1} ${match.score1}-${match.score2} ${match.player2} (${match.date})`);
    } else {
      console.log(`  ${i + 1}) ${match.team1.join('&')} ${match.score1}-${match.score2} ${match.team2.join('&')} (${match.date})`);
    }
  });
  
  const scelta = parseInt(await question(`\nQuale partita vuoi eliminare? (1-${matches.length}): `)) - 1;
  
  if (scelta < 0 || scelta >= matches.length) {
    console.log(`\n${colors.red}❌ Scelta non valida!${colors.reset}`);
    return;
  }
  
  // Rimuovi la partita
  const removed = matches.splice(scelta, 1)[0];
  
  // Ricalcola le vittorie
  recalculateWins(data);
  
  console.log(`\n${colors.green}✅ Partita eliminata con successo!${colors.reset}`);
  if (tipo === 'singolo') {
    console.log(`   ${removed.player1} ${removed.score1} - ${removed.score2} ${removed.player2}`);
  } else {
    console.log(`   ${removed.team1.join(' & ')} ${removed.score1} - ${removed.score2} ${removed.team2.join(' & ')}`);
  }
}

async function addMatch(data) {
  // 1. Tipo di partita
  console.log(`${colors.yellow}Che tipo di partita vuoi aggiungere?${colors.reset}`);
  console.log('1) Singolo');
  console.log('2) Doppio\n');
  const tipoInput = await question('Scegli (1 o 2): ');
  const tipo = tipoInput.trim() === '2' ? 'doppio' : 'singolo';
    
    let match = {};
    let winner = null;
    
    if (tipo === 'singolo') {
      // Partita singola
      console.log(`\n${colors.blue}📋 Giocatori disponibili:${colors.reset}`);
      data.players.forEach((p, i) => console.log(`  ${i + 1}) ${p.name}`));
      
      const p1Index = parseInt(await question('\nGiocatore 1 (numero): ')) - 1;
      const p2Index = parseInt(await question('Giocatore 2 (numero): ')) - 1;
      
      const player1 = data.players[p1Index].name;
      const player2 = data.players[p2Index].name;
      
      console.log(`\n${colors.cyan}⚡ ${player1} vs ${player2}${colors.reset}`);
      
      let score1, score2;
      while (true) {
        const risultato = await question(`Risultato (es. 11-9): `);
        const match = risultato.trim().match(/^(\d+)-(\d+)$/);
        
        if (match) {
          score1 = parseInt(match[1]);
          score2 = parseInt(match[2]);
          break;
        } else {
          console.log(`${colors.red}Formato non valido! Usa il formato: 11-9${colors.reset}`);
        }
      }
      
      const today = new Date().toLocaleDateString('it-IT');
      
      match = {
        player1,
        player2,
        score1,
        score2,
        date: today
      };
      
      winner = score1 > score2 ? player1 : player2;
      
      // Aggiungi la partita all'inizio dell'array
      data.singleMatches.unshift(match);
      
    } else {
      // Partita doppia
      console.log(`\n${colors.blue}📋 Giocatori disponibili:${colors.reset}`);
      data.players.forEach((p, i) => console.log(`  ${i + 1}) ${p.name}`));
      
      console.log(`\n${colors.yellow}Team 1:${colors.reset}`);
      const t1p1Index = parseInt(await question('Giocatore 1 (numero): ')) - 1;
      const t1p2Index = parseInt(await question('Giocatore 2 (numero): ')) - 1;
      
      console.log(`\n${colors.yellow}Team 2:${colors.reset}`);
      const t2p1Index = parseInt(await question('Giocatore 1 (numero): ')) - 1;
      const t2p2Index = parseInt(await question('Giocatore 2 (numero): ')) - 1;
      
      const team1 = [data.players[t1p1Index].name, data.players[t1p2Index].name];
      const team2 = [data.players[t2p1Index].name, data.players[t2p2Index].name];
      
      console.log(`\n${colors.cyan}⚡ ${team1.join(' & ')} vs ${team2.join(' & ')}${colors.reset}`);
      
      let score1, score2;
      while (true) {
        const risultato = await question(`Risultato (es. 11-9): `);
        const match = risultato.trim().match(/^(\d+)-(\d+)$/);
        
        if (match) {
          score1 = parseInt(match[1]);
          score2 = parseInt(match[2]);
          break;
        } else {
          console.log(`${colors.red}Formato non valido! Usa il formato: 11-9${colors.reset}`);
        }
      }
      
      const today = new Date().toLocaleDateString('it-IT');
      
      match = {
        team1,
        team2,
        score1,
        score2,
        date: today
      };
      
      const winningTeam = score1 > score2 ? team1 : team2;
      
      // Aggiungi la partita all'inizio dell'array
      data.doubleMatches.unshift(match);
    }
    
    // Ricalcola tutte le vittorie
    recalculateWins(data);
    
    // Ordina i giocatori alfabeticamente
    data.players.sort((a, b) => a.name.localeCompare(b.name));
    
    // Mostra conferma
    console.log(`\n${colors.green}✅ Partita aggiunta con successo!${colors.reset}`);
    
    if (tipo === 'singolo') {
      console.log(`   ${match.player1} ${match.score1} - ${match.score2} ${match.player2}`);
      console.log(`   🏆 Vincitore: ${winner}`);
    } else {
      console.log(`   ${match.team1.join(' & ')} ${match.score1} - ${match.score2} ${match.team2.join(' & ')}`);
    }
}

async function main() {
  try {
    // Leggi i dati attuali
    const data = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
    
    // Loop per gestire più operazioni
    let continua = true;
    while (continua) {
      console.log(`${colors.yellow}Cosa vuoi fare?${colors.reset}`);
      console.log('1) Aggiungere una partita');
      console.log('2) Eliminare una partita');
      console.log('3) Azzera stagione\n');
      
      const azione = await question('Scegli (1, 2 o 3): ');
      console.log('');
      
      if (azione.trim() === '2') {
        await deleteMatch(data);
      } else if (azione.trim() === '3') {
        await resetSeason(data);
      } else {
        await addMatch(data);
      }
      
      const risposta = await question(`\n${colors.yellow}Vuoi fare altre modifiche? (s/n): ${colors.reset}`);
      continua = risposta.toLowerCase() === 's' || risposta.toLowerCase() === 'y';
      
      if (continua) {
        console.log(''); // Riga vuota per separare
      }
    }
    
    // Salva i dati aggiornati
    writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
    
    // Chiedi se fare push
    const doPush = await question(`\n${colors.yellow}Vuoi fare commit e push su GitHub? (s/n): ${colors.reset}`);
    
    if (doPush.toLowerCase() === 's' || doPush.toLowerCase() === 'y') {
      console.log(`\n${colors.blue}📤 Push su GitHub in corso...${colors.reset}`);
      
      try {
        execSync('git add src/data/matches.json', { stdio: 'inherit' });
        execSync(`git commit -m "Update matches - ${new Date().toLocaleDateString('it-IT')}"`, { stdio: 'inherit' });
        execSync('git push', { stdio: 'inherit' });
        
        console.log(`\n${colors.green}✅ Push completato! L'app si aggiornerà automaticamente.${colors.reset}\n`);
      } catch (error) {
        console.log(`\n${colors.red}❌ Errore durante il push. Fallo manualmente con:${colors.reset}`);
        console.log('   git add src/data/matches.json');
        console.log('   git commit -m "Add match"');
        console.log('   git push\n');
      }
    } else {
      console.log(`\n${colors.yellow}⚠️  Ricorda di fare commit e push manualmente!${colors.reset}\n`);
    }
    
  } catch (error) {
    console.error(`\n${colors.red}❌ Errore:${colors.reset}`, error.message);
  } finally {
    rl.close();
  }
}

main();
