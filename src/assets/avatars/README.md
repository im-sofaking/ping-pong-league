# Avatar Personalizzati

Questa cartella contiene gli avatar SVG personalizzati per ogni giocatore.

## Come aggiungere un nuovo avatar:

1. **Vai al playground**: https://www.dicebear.com/playground/
2. **Seleziona lo stile**: "Avataaars"
3. **Personalizza l'avatar** con le caratteristiche del giocatore
4. **Scarica l'SVG** o copia il codice
5. **Salva il file** in questa cartella con il nome: `{nome-giocatore}.svg`
   - Esempi: `andrea.svg`, `luca-b.svg`, `davide.svg`, ecc.
6. **Aggiorna il codice** in `src/routes/index.tsx`:
   - Aggiungi l'import: `import andreaAvatar from "@/assets/avatars/andrea.svg";`
   - Aggiungi nel dizionario `LOCAL_AVATARS`: `"Andrea": andreaAvatar,`

## Lista giocatori:

- [ ] Andrea (moro, carnagione chiara, baffo)
- [x] Carlotta (bionda, occhi azzurri, sorridente) ✅
- [ ] Davide (moro, orecchino, occhiali)
- [ ] Gabri (moro, capelli corti)
- [ ] Luca B (moro, occhiali, capelli corti neri)
- [ ] Luca V (moro, capelli corti, barba e baffo)
- [ ] Riccardo (moro, capelli corti, occhiali, sorridente)

## Note:

Gli avatar locali hanno priorità sull'API DiceBear. Se un avatar non è presente localmente, verrà usato automaticamente quello generato dall'API come fallback.
