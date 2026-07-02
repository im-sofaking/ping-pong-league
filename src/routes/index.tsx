import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ReplyLogo } from "@/components/ReplyLogo";

// Import avatar locali
import andreaAvatar from "@/assets/avatars/andrea.svg";
import carlottaAvatar from "@/assets/avatars/carlotta.svg";
import davideAvatar from "@/assets/avatars/davide.svg";
import gabriAvatar from "@/assets/avatars/gabri.svg";
import lucaBAvatar from "@/assets/avatars/luca-b.svg";
import lucaVAvatar from "@/assets/avatars/luca-v.svg";
import riccardoAvatar from "@/assets/avatars/riccardo.svg";

// 🔥 IMPORT DATI DAL FILE JSON
// Per aggiornare i dati: modifica src/data/matches.json
import matchesData from "@/data/matches.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Reply Ping Pong League" },
      { name: "description", content: "The premium leaderboard for the Reply Ping Pong League." },
      { property: "og:title", content: "Reply Ping Pong League" },
      { property: "og:description", content: "The premium leaderboard for the Reply Ping Pong League." },
    ],
  }),
  component: Index,
});

type Player = { name: string; wins: number };
type Team = { name: string; wins: number; members: string[] };
type SingleMatch = { player1: string; player2: string; score1: number; score2: number; date: string };
type DoubleMatch = { team1: string[]; team2: string[]; score1: number; score2: number; date: string };

// 🔥 DATI CARICATI DAL FILE JSON
// Per aggiornare: modifica public/data/matches.json e riavvia il dev server
const PLAYERS: Player[] = matchesData.players;
const TEAMS: Team[] = matchesData.teams;
const SINGLE_MATCHES: SingleMatch[] = matchesData.singleMatches;
const DOUBLE_MATCHES: DoubleMatch[] = matchesData.doubleMatches;

// Avatar locali personalizzati
const LOCAL_AVATARS: Record<string, string> = {
  "Andrea": andreaAvatar,
  "Carlotta": carlottaAvatar,
  "Davide": davideAvatar,
  "Gabri": gabriAvatar,
  "Luca B": lucaBAvatar,
  "Luca V": lucaVAvatar,
  "Riccardo": riccardoAvatar,
};

// Funzione per ottenere l'URL dell'avatar (locale o API fallback)
const avatarUrl = (name: string) => {
  // Se esiste un avatar locale, usalo
  if (LOCAL_AVATARS[name]) {
    return LOCAL_AVATARS[name];
  }

  // Altrimenti usa l'API DiceBear come fallback
  const seed = encodeURIComponent(name);
  const params = new URLSearchParams({
    seed: seed,
    backgroundColor: 'b6e3f4,c0aede,d1d4f9',
    backgroundType: 'gradientLinear',
  });

  // Personalizzazioni base per ogni player
  switch (name) {
    case "Andrea":
      params.set('facialHairProbability', '100');
      params.set('hairColor', '4a312c');
      break;
    case "Luca B":
      params.set('glassesProbability', '100');
      params.set('hairColor', '2c1b18');
      break;
    case "Davide":
      params.set('glassesProbability', '100');
      params.set('hairColor', '2c1b18');
      break;
    case "Carlotta":
      params.set('hairColor', 'blonde');
      params.set('mouthProbability', '100');
      break;
    case "Luca V":
      params.set('facialHairProbability', '100');
      params.set('hairColor', '2c1b18');
      break;
    case "Riccardo":
      params.set('glassesProbability', '100');
      params.set('hairColor', '2c1b18');
      break;
    case "Gabri":
      params.set('hairColor', '2c1b18');
      break;
  }

  return `https://api.dicebear.com/9.x/avataaars/svg?${params.toString()}`;
};

const MEDALS = ["🥇", "🥈", "🥉"];
const MEDAL_RING = [
  "ring-amber-300/50 bg-gradient-to-r from-amber-300/15 to-transparent",
  "ring-slate-200/40 bg-gradient-to-r from-slate-200/10 to-transparent",
  "ring-orange-400/40 bg-gradient-to-r from-orange-400/10 to-transparent",
];

function AnimatedNumber({ value, delay = 0 }: { value: number; delay?: number }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toString());
  useEffect(() => {
    const controls = animate(mv, value, { duration: 1.6, delay, ease: "easeOut" });
    return () => controls.stop();
  }, [value, delay, mv]);
  return <motion.span>{rounded}</motion.span>;
}

function Intro({ onDone }: { onDone: () => void }) {
  // Simple ping pong ball animation with 3 bounces
  const BALL_SIZE = 60;
  const CONTAINER_HEIGHT = 400;
  const GROUND_POSITION = CONTAINER_HEIGHT - 80;
  
  // Three bounces: first bounce is highest, each subsequent bounce is lower
  const bounceHeights = [
    0,           // start at top
    GROUND_POSITION,  // fall to ground (bounce 1)
    GROUND_POSITION * 0.4,  // bounce up 40%
    GROUND_POSITION,  // fall to ground (bounce 2)
    GROUND_POSITION * 0.55,  // bounce up 55%
    GROUND_POSITION,  // fall to ground (bounce 3)
    GROUND_POSITION * 0.7,  // small bounce up 70%
    GROUND_POSITION   // settle on ground
  ];
  
  const scaleY = [1, 0.75, 1, 0.8, 1, 0.85, 1, 0.9];
  const times = [0, 0.2, 0.35, 0.5, 0.63, 0.75, 0.86, 1];
  const DURATION = 2.5;

  useEffect(() => {
    const t = setTimeout(onDone, DURATION * 1000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.6 } }}
    >
      <div className="relative flex flex-col items-center" style={{ height: CONTAINER_HEIGHT }}>
        {/* Ground shadow */}
        <motion.div
          className="absolute rounded-full bg-black/60 blur-lg"
          style={{
            top: GROUND_POSITION + BALL_SIZE - 8,
            height: 8,
            x: "-50%",
          }}
          initial={{ width: 0, opacity: 0 }}
          animate={{
            opacity: [0, 0.6, 0.3, 0.6, 0.35, 0.55, 0.4, 0.5],
            width: [0, BALL_SIZE * 1.8, BALL_SIZE * 0.9, BALL_SIZE * 1.6, BALL_SIZE * 1, BALL_SIZE * 1.5, BALL_SIZE * 1.1, BALL_SIZE * 1.4],
          }}
          transition={{ duration: DURATION, times, ease: "linear" }}
        />

        {/* Ping pong ball */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: BALL_SIZE,
            height: BALL_SIZE,
            backgroundColor: "#ffffff",
            boxShadow:
              "inset -6px -8px 12px rgba(0,0,0,0.15), inset 4px 4px 10px rgba(255,255,255,0.9), 0 0 30px rgba(255,255,255,0.4), 0 4px 15px rgba(0,0,0,0.3)",
            transformOrigin: "50% 100%",
          }}
          animate={{ 
            y: bounceHeights,
            scaleY 
          }}
          transition={{ 
            duration: DURATION, 
            times, 
            ease: "easeInOut" 
          }}
        >
          {/* Orange curve on the ball for ping pong effect */}
          <div
            className="absolute rounded-full border-2 border-orange-400/50"
            style={{
              top: "20%",
              left: "15%",
              right: "15%",
              bottom: "20%",
              borderBottomColor: "transparent",
              borderLeftColor: "transparent",
              transform: "rotate(-25deg)",
            }}
          />
        </motion.div>
      </div>

      <motion.p
        className="mt-8 text-xs tracking-[0.4em] text-white/40 uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: DURATION, times: [0, 0.2, 0.8, 1] }}
      >
        Reply Ping Pong League
      </motion.p>
    </motion.div>
  );
}

function PlayerAvatar({ name, size = 40 }: { name: string; size?: number }) {
  return (
    <img
      src={avatarUrl(name)}
      alt={name}
      width={size}
      height={size}
      className="shrink-0 rounded-full bg-white/10 ring-1 ring-white/15"
      style={{ width: size, height: size }}
    />
  );
}

type Row = {
  key: string;
  title: string;
  subtitle?: string;
  avatars: string[];
  wins: number;
};

function LeaderboardCard({
  label,
  rows,
  delayBase = 0,
}: {
  label: string;
  rows: Row[];
  delayBase?: number;
}) {
  const sorted = [...rows].sort((a, b) => b.wins - a.wins);
  const max = sorted[0]?.wins ?? 1;

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl md:p-7"
      style={{ boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)" }}
    >
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />

      <div className="relative mb-4 flex items-center justify-between">
        <h2 className="text-[11px] font-medium tracking-[0.3em] text-white/60 uppercase">{label}</h2>
        <span className="text-[10px] tracking-widest text-white/30 uppercase">{sorted.length} {rows[0]?.subtitle ? "teams" : "players"}</span>
      </div>

      <ul className="relative space-y-2">
        {sorted.map((r, i) => {
          const isTop3 = i < 3;
          return (
            <motion.li
              key={r.key}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delayBase + 0.25 + i * 0.07, duration: 0.5, ease: "easeOut" }}
              className={`group relative flex items-center gap-3 rounded-2xl border border-white/5 p-3 transition hover:bg-white/[0.06] md:gap-4 md:p-4 ${
                isTop3 ? `ring-1 ${MEDAL_RING[i]}` : "bg-white/[0.03]"
              }`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-sm font-semibold text-white/80">
                {isTop3 ? <span className="text-xl">{MEDALS[i]}</span> : <span className="text-xs text-white/40">{i + 1}</span>}
              </div>

              <div className="flex shrink-0 -space-x-2">
                {r.avatars.map((a) => (
                  <PlayerAvatar key={a} name={a} size={36} />
                ))}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-medium text-white md:text-base">{r.title}</p>
                  <p className="text-xs text-white/40">{((r.wins / max) * 100).toFixed(0)}%</p>
                </div>
                {r.subtitle && (
                  <p className="truncate text-[11px] text-white/40">{r.subtitle}</p>
                )}
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className={`h-full rounded-full ${
                      i === 0
                        ? "bg-gradient-to-r from-amber-300 to-yellow-500"
                        : i === 1
                        ? "bg-gradient-to-r from-slate-200 to-slate-400"
                        : i === 2
                        ? "bg-gradient-to-r from-orange-400 to-amber-700"
                        : "bg-gradient-to-r from-emerald-400/60 to-emerald-400/10"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(r.wins / max) * 100}%` }}
                    transition={{ delay: delayBase + 0.4 + i * 0.07, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-semibold tabular-nums text-white md:text-2xl">
                  <AnimatedNumber value={r.wins} delay={delayBase + 0.3 + i * 0.07} />
                </div>
                <div className="text-[10px] tracking-widest text-white/40 uppercase">wins</div>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

function MatchesCard({
  label,
  matches,
  type,
  delayBase = 0,
}: {
  label: string;
  matches: SingleMatch[] | DoubleMatch[];
  type: "single" | "double";
  delayBase?: number;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl md:p-7"
      style={{ boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)" }}
    >
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />

      <div className="relative mb-4 flex items-center justify-between">
        <h2 className="text-[11px] font-medium tracking-[0.3em] text-white/60 uppercase">{label}</h2>
        <span className="text-[10px] tracking-widest text-white/30 uppercase">Last {matches.length} matches</span>
      </div>

      <ul className="relative space-y-2">
        {matches.map((match, i) => {
          const isSingle = type === "single";
          const m = match as any;
          const winner = isSingle 
            ? (m.score1 > m.score2 ? m.player1 : m.player2)
            : (m.score1 > m.score2 ? m.team1 : m.team2);
          
          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delayBase + 0.25 + i * 0.07, duration: 0.5, ease: "easeOut" }}
              className="group relative flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3 transition hover:bg-white/[0.06] md:gap-4 md:p-4"
            >
              <div className="flex-1">
                {isSingle ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <PlayerAvatar name={m.player1} size={28} />
                        <span className={`text-sm font-medium ${m.score1 > m.score2 ? 'text-white' : 'text-white/50'}`}>
                          {m.player1}
                        </span>
                      </div>
                      <span className={`text-lg font-semibold tabular-nums ${m.score1 > m.score2 ? 'text-white' : 'text-white/40'}`}>
                        {m.score1}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <PlayerAvatar name={m.player2} size={28} />
                        <span className={`text-sm font-medium ${m.score2 > m.score1 ? 'text-white' : 'text-white/50'}`}>
                          {m.player2}
                        </span>
                      </div>
                      <span className={`text-lg font-semibold tabular-nums ${m.score2 > m.score1 ? 'text-white' : 'text-white/40'}`}>
                        {m.score2}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {m.team1.map((player: string) => (
                            <PlayerAvatar key={player} name={player} size={28} />
                          ))}
                        </div>
                        <span className={`text-sm font-medium ${m.score1 > m.score2 ? 'text-white' : 'text-white/50'}`}>
                          {m.team1.join(" & ")}
                        </span>
                      </div>
                      <span className={`text-lg font-semibold tabular-nums ${m.score1 > m.score2 ? 'text-white' : 'text-white/40'}`}>
                        {m.score1}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {m.team2.map((player: string) => (
                            <PlayerAvatar key={player} name={player} size={28} />
                          ))}
                        </div>
                        <span className={`text-sm font-medium ${m.score2 > m.score1 ? 'text-white' : 'text-white/50'}`}>
                          {m.team2.join(" & ")}
                        </span>
                      </div>
                      <span className={`text-lg font-semibold tabular-nums ${m.score2 > m.score1 ? 'text-white' : 'text-white/40'}`}>
                        {m.score2}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-right">
                <div className="text-[10px] tracking-wider text-white/40">
                  {m.date}
                </div>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

function StatPill({ label, value, delay = 0 }: { label: string; value: number; delay?: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center backdrop-blur-xl">
      <div className="text-2xl font-semibold tabular-nums text-white md:text-3xl">
        <AnimatedNumber value={value} delay={delay} />
      </div>
      <div className="mt-0.5 text-[10px] tracking-[0.25em] text-white/50 uppercase">{label}</div>
    </div>
  );
}

function BestDuoCard({ players, wins, delayBase = 0 }: { players: string[]; wins: number; delayBase?: number }) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl md:p-6"
      style={{ boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)" }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delayBase, duration: 0.6 }}
    >
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-yellow-500/15 blur-3xl" />
      
      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[11px] font-medium tracking-[0.3em] text-white/60 uppercase">Best Duo</h2>
          <span className="text-xl">🏆</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {players.map((player) => (
              <PlayerAvatar key={player} name={player} size={48} />
            ))}
          </div>
          
          <div className="flex-1">
            <p className="text-lg font-semibold text-white md:text-xl">
              {players.join(' & ')}
            </p>
            <p className="text-sm text-white/50">Coppia più vincente</p>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold tabular-nums text-amber-400">
              <AnimatedNumber value={wins} delay={delayBase + 0.2} />
            </div>
            <div className="text-[10px] tracking-widest text-white/40 uppercase">wins</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Leaderboard() {
  const singlesRows: Row[] = useMemo(
    () => PLAYERS.map((p) => ({ key: p.name, title: p.name, avatars: [p.name], wins: p.wins })),
    [],
  );
  const doublesRows: Row[] = useMemo(
    () =>
      TEAMS.map((t) => ({
        key: t.name,
        title: t.name,
        subtitle: t.members.join(" & "),
        avatars: t.members,
        wins: t.wins,
      })),
    [],
  );

  const singlesGames = SINGLE_MATCHES.length;
  const doublesGames = DOUBLE_MATCHES.length;
  const totalGames = singlesGames + doublesGames;

  // Calcola le coppie migliori dai double matches
  const bestDuos = useMemo(() => {
    const duoMap = new Map<string, { players: string[], wins: number }>();
    
    DOUBLE_MATCHES.forEach((match) => {
      const winner = match.score1 > match.score2 ? match.team1 : match.team2;
      const key = [...winner].sort().join('-');
      
      if (duoMap.has(key)) {
        duoMap.get(key)!.wins++;
      } else {
        duoMap.set(key, { players: winner, wins: 1 });
      }
    });
    
    const duos = Array.from(duoMap.values());
    if (duos.length === 0) return [];
    
    // Trova il numero massimo di vittorie
    const maxWins = Math.max(...duos.map(d => d.wins));
    
    // Restituisci tutte le coppie con il numero massimo di vittorie
    return duos.filter(d => d.wins === maxWins);
  }, []);

  return (
    <motion.div
      className="relative z-10 w-full max-w-3xl px-4 py-10"
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-8 text-center">
        <motion.div
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] tracking-[0.25em] text-white/60 uppercase backdrop-blur-xl"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Season 01 · Live
        </motion.div>
        <div className="flex items-center justify-center gap-3 md:gap-4">
          <motion.div
            initial={{ opacity: 0, x: -12, rotate: -8 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <ReplyLogo className="h-10 w-10 md:h-14 md:w-14" size={56} />
          </motion.div>
          <h1 className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-5xl leading-tight">
            Reply Ping Pong League
          </h1>
        </div>
      </div>

      <motion.div
        className="mb-6 grid grid-cols-3 gap-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <StatPill label="Total games" value={totalGames} delay={0.4} />
        <StatPill label="Singles" value={singlesGames} delay={0.5} />
        <StatPill label="Doubles" value={doublesGames} delay={0.6} />
      </motion.div>

      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-[1fr_auto]">
          <LeaderboardCard label="Classifica" rows={singlesRows} delayBase={0.2} />
          <div className="md:w-80 space-y-4">
            {bestDuos.length === 0 ? (
              <motion.div
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl md:p-6"
                style={{ boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)" }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
              >
                <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl" />
                <div className="relative text-center">
                  <h2 className="mb-3 text-[11px] font-medium tracking-[0.3em] text-white/60 uppercase">Best Duo</h2>
                  <span className="text-4xl mb-2 block">🏆</span>
                  <p className="text-sm text-white/50">Nessuna partita doppia ancora giocata</p>
                </div>
              </motion.div>
            ) : (
              <>
                {bestDuos.length > 1 && (
                  <motion.div
                    className="text-center text-xs text-amber-400/80 tracking-wide"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    🏆 Pareggio! {bestDuos.length} coppie al primo posto
                  </motion.div>
                )}
                {bestDuos.map((duo, index) => (
                  <BestDuoCard 
                    key={duo.players.join('-')} 
                    players={duo.players} 
                    wins={duo.wins} 
                    delayBase={0.25 + (index * 0.1)} 
                  />
                ))}
              </>
            )}
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <MatchesCard label="Single Matches" matches={SINGLE_MATCHES} type="single" delayBase={0.35} />
          <MatchesCard label="Double Matches" matches={DOUBLE_MATCHES} type="double" delayBase={0.5} />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-white/40">
        <span>{PLAYERS.length} players · {TEAMS.length} teams</span>
        <span>Updated just now</span>
      </div>
    </motion.div>
  );
}

function Index() {
  const [showLeague, setShowLeague] = useState(false);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a14]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,80,255,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,180,255,0.12),transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!showLeague ? (
          <Intro key="intro" onDone={() => setShowLeague(true)} />
        ) : (
          <Leaderboard key="board" />
        )}
      </AnimatePresence>
    </main>
  );
}
