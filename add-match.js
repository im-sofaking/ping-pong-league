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

console.log(`\n${colors.cyan}🏓 Reply Ping Pong League - Aggiungi Partita${colors.reset}\n`);

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
      
      const score1 = parseInt(await question(`Punteggio ${player1}: `));
      const score2 = parseInt(await question(`Punteggio ${player2}: `));
      
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
      
      // Mantieni solo le ultime 5 partite
      if (data.singleMatches.length > 5) {
        data.singleMatches = data.singleMatches.slice(0, 5);
      }
      
      // Aggiorna le vittorie
      const winnerPlayer = data.players.find(p => p.name === winner);
      if (winnerPlayer) {
        winnerPlayer.wins += 1;
      }
      
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
      
      const score1 = parseInt(await question(`Punteggio Team 1: `));
      const score2 = parseInt(await question(`Punteggio Team 2: `));
      
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
      
      // Mantieni solo le ultime 5 partite
      if (data.doubleMatches.length > 5) {
        data.doubleMatches = data.doubleMatches.slice(0, 5);
      }
      
      // Aggiorna le vittorie per entrambi i membri del team vincente
      winningTeam.forEach(playerName => {
        const player = data.players.find(p => p.name === playerName);
        if (player) {
          player.wins += 1;
        }
      });
    }
    
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
    
    // Loop per aggiungere più partite
    let continua = true;
    while (continua) {
      await addMatch(data);
      
      const risposta = await question(`\n${colors.yellow}Vuoi aggiungere un'altra partita? (s/n): ${colors.reset}`);
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
        execSync(`git commit -m "Add match: ${tipo} - ${new Date().toLocaleDateString('it-IT')}"`, { stdio: 'inherit' });
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
