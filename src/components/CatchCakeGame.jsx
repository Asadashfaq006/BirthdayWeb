'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

const GAME_DURATION = 30; // seconds
const CAKE_SPEED_INITIAL = 2.5;
const BASKET_WIDTH = 90;
const BASKET_HEIGHT = 26;
const CAKE_SIZE = 36;

/**
 * Catch the falling cakes game. Uses requestAnimationFrame via refs to avoid stale closures.
 * Responsive: canvas scales to container width.
 */
export default function CatchCakeGame({ theme }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    basketX: 200,
    cakes: [],
    score: 0,
    timeLeft: GAME_DURATION,
    running: false,
    speed: CAKE_SPEED_INITIAL,
    lastCakeAt: 0,
    lastTick: 0,
    width: 400,
    height: 340,
  });
  const rafRef = useRef(null);
  const timerRef = useRef(null);

  const [displayScore, setDisplayScore] = useState(0);
  const [displayTime, setDisplayTime] = useState(GAME_DURATION);
  const [phase, setPhase] = useState('idle'); // idle | playing | gameover

  // Sync dimensions to canvas container
  const syncSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.parentElement?.clientWidth || 400;
    const h = Math.min(w * 0.85, 340);
    canvas.width = w;
    canvas.height = h;
    stateRef.current.width = w;
    stateRef.current.height = h;
    stateRef.current.basketX = w / 2 - BASKET_WIDTH / 2;
  }, []);

  useEffect(() => {
    syncSize();
    const ro = new ResizeObserver(syncSize);
    if (canvasRef.current?.parentElement) ro.observe(canvasRef.current.parentElement);
    return () => ro.disconnect();
  }, [syncSize]);

  function spawnCake(now) {
    const s = stateRef.current;
    if (now - s.lastCakeAt < 900) return;
    s.lastCakeAt = now;
    const x = Math.floor((s.width - CAKE_SIZE - 10) * ((now % 1000) / 1000)) + 5;
    s.cakes.push({ x, y: -CAKE_SIZE, id: now });
  }

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s = stateRef.current;

    ctx.clearRect(0, 0, s.width, s.height);

    // Background
    ctx.fillStyle = '#fdf2f8';
    ctx.fillRect(0, 0, s.width, s.height);

    // Basket
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.roundRect(s.basketX, s.height - BASKET_HEIGHT - 8, BASKET_WIDTH, BASKET_HEIGHT, 8);
    ctx.fill();
    ctx.fillStyle = '#ec4899';
    ctx.font = `${BASKET_HEIGHT - 6}px serif`;
    ctx.textAlign = 'center';
    ctx.fillText('🧺', s.basketX + BASKET_WIDTH / 2, s.height - 10);

    // Cakes
    ctx.font = `${CAKE_SIZE}px serif`;
    s.cakes.forEach((c) => {
      ctx.fillText('🎂', c.x, c.y + CAKE_SIZE);
    });

    // Score HUD
    ctx.fillStyle = '#be185d';
    ctx.font = 'bold 15px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${s.score}`, 10, 22);
    ctx.textAlign = 'right';
    ctx.fillText(`${s.timeLeft}s`, s.width - 10, 22);
  }, []);

  const tick = useCallback(
    (now) => {
      const s = stateRef.current;
      if (!s.running) return;

      // Cap delta to avoid spiral of death
      const delta = Math.min(now - s.lastTick, 50);
      s.lastTick = now;

      // Speed ramp
      const elapsed = GAME_DURATION - s.timeLeft;
      s.speed = CAKE_SPEED_INITIAL + elapsed * 0.06;

      spawnCake(now);

      s.cakes.forEach((c) => {
        c.y += s.speed * (delta / 16);
      });

      const basketTop = s.height - BASKET_HEIGHT - 8;
      const caught = [];
      const missed = [];

      s.cakes.forEach((c) => {
        if (
          c.y + CAKE_SIZE >= basketTop &&
          c.x + CAKE_SIZE >= s.basketX &&
          c.x <= s.basketX + BASKET_WIDTH
        ) {
          caught.push(c.id);
        } else if (c.y > s.height) {
          missed.push(c.id);
        }
      });

      if (caught.length) {
        s.score += caught.length;
        setDisplayScore(s.score);
      }

      s.cakes = s.cakes.filter((c) => !caught.includes(c.id) && !missed.includes(c.id));

      draw();
      rafRef.current = requestAnimationFrame(tick);
    },
    [draw]
  );

  function startGame() {
    const s = stateRef.current;
    s.score = 0;
    s.timeLeft = GAME_DURATION;
    s.cakes = [];
    s.running = true;
    s.lastTick = performance.now();
    s.lastCakeAt = 0;
    setDisplayScore(0);
    setDisplayTime(GAME_DURATION);
    setPhase('playing');

    timerRef.current = setInterval(() => {
      stateRef.current.timeLeft -= 1;
      setDisplayTime(stateRef.current.timeLeft);
      if (stateRef.current.timeLeft <= 0) {
        endGame();
      }
    }, 1000);

    rafRef.current = requestAnimationFrame(tick);
  }

  function endGame() {
    stateRef.current.running = false;
    clearInterval(timerRef.current);
    cancelAnimationFrame(rafRef.current);
    setPhase('gameover');
  }

  // Mouse/touch basket control
  function handlePointerMove(e) {
    const s = stateRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !s.running) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left - BASKET_WIDTH / 2;
    s.basketX = Math.max(0, Math.min(s.width - BASKET_WIDTH, x));
  }

  useEffect(() => () => {
    clearInterval(timerRef.current);
    cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {phase === 'idle' && (
        <div className="text-center flex flex-col gap-3">
          <p className={`text-sm ${theme?.subtext || 'text-gray-500'}`}>
            Move your mouse (or finger) to catch the falling cakes! You have {GAME_DURATION}{' '}
            seconds.
          </p>
          <button
            onClick={startGame}
            className={`px-6 py-2.5 rounded-2xl font-bold text-sm ${
              theme?.btnPrimary ||
              'bg-gradient-to-r from-pink-500 to-rose-400 text-white'
            }`}
          >
            🎂 Start Catching!
          </button>
        </div>
      )}

      {phase !== 'idle' && (
        <div className="flex gap-4 text-sm font-semibold">
          <span className={theme?.heading || 'text-pink-700'}>Score: {displayScore}</span>
          <span className={theme?.subtext || 'text-gray-500'}>{displayTime}s left</span>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="rounded-2xl border-2 border-pink-200 touch-none"
        style={{ display: phase === 'gameover' ? 'none' : 'block', maxWidth: '100%' }}
        onMouseMove={handlePointerMove}
        onTouchMove={handlePointerMove}
      />

      {phase === 'gameover' && (
        <div className="text-center flex flex-col items-center gap-4 py-4">
          <p className="text-5xl">🎂</p>
          <p className={`text-2xl font-extrabold ${theme?.heading || 'text-pink-700'}`}>
            Game Over!
          </p>
          <p className={theme?.text || 'text-gray-700'}>
            You caught <span className="font-bold text-pink-600">{displayScore}</span> cakes!
          </p>
          <button
            onClick={startGame}
            className={`px-6 py-2.5 rounded-2xl font-bold text-sm ${
              theme?.btnPrimary || 'bg-pink-500 text-white'
            }`}
          >
            🔄 Play Again
          </button>
        </div>
      )}
    </div>
  );
}
