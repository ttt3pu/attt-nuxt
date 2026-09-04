<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import {
  FISH_DEFINITIONS,
  GAME_DURATION_SECONDS,
  HIGH_SCORE_STORAGE_KEY,
  PHYSICS_CONFIG,
} from '@/constants/oyatsu-toss';
import type {
  FishKind,
  FishObject,
  GameMode,
  GamePlayState,
  PaddleState,
  ParticleObject,
  ScorePopupObject,
} from '@/types/oyatsu-toss';

const emit = defineEmits<{
  close: [];
  catReaction: [kind: 'happy' | 'hurt'];
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);

// ゲーム状態
const gameState = ref<GamePlayState>('ready');
const gameMode = ref<GameMode>('timed');
const score = ref(0);
const combo = ref(0);
const maxCombo = ref(0);
const fedCount = ref(0);
const timeLeft = ref(GAME_DURATION_SECONDS);
const highScore = ref(0);
const isNewRecord = ref(false);

// 物理オブジェクト
let nextFishId = 1;
let nextPopupId = 1;
const fishes: FishObject[] = [];
const particles: ParticleObject[] = [];
const popups: ScorePopupObject[] = [];

// パドル状態
const paddle: PaddleState = {
  x: -100,
  y: -100,
  prevX: -100,
  prevY: -100,
  vx: 0,
  vy: 0,
  radius: PHYSICS_CONFIG.paddleRadius,
  isPressed: false,
  angle: 0,
};

let animationFrameId: number | null = null;
let timerIntervalId: ReturnType<typeof setInterval> | null = null;
let spawnIntervalId: ReturnType<typeof setInterval> | null = null;

// ハイスコア読み込み
function loadHighScore() {
  if (typeof window === 'undefined') return;
  try {
    const saved = localStorage.getItem(HIGH_SCORE_STORAGE_KEY);
    if (saved) {
      highScore.value = parseInt(saved, 10) || 0;
    }
  } catch {
    // ignore
  }
}

function saveHighScore(newScore: number) {
  if (typeof window === 'undefined') return;
  if (newScore > highScore.value) {
    highScore.value = newScore;
    isNewRecord.value = true;
    try {
      localStorage.setItem(HIGH_SCORE_STORAGE_KEY, String(newScore));
    } catch {
      // ignore
    }
  }
}

// 魚のスポーン
function spawnFish(forcedKind?: FishKind) {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const kinds: FishKind[] = ['normal', 'normal', 'speedy', 'big', 'gold'];
  const kind = forcedKind || (kinds[Math.floor(Math.random() * kinds.length)] as FishKind);
  const def = FISH_DEFINITIONS[kind];

  const spawnFromLeft = Math.random() < 0.5;
  const startX = spawnFromLeft ? -def.radius : canvas.width + def.radius;
  const startY = Math.random() * (canvas.height * 0.35) + 60;

  // 放物線初速
  const baseVx = (Math.random() * 3 + 2.2) * (spawnFromLeft ? 1 : -1);
  const baseVy = -(Math.random() * 4 + 3.5);

  fishes.push({
    id: nextFishId++,
    kind,
    x: startX,
    y: startY,
    vx: baseVx,
    vy: baseVy,
    width: def.radius * 2.2,
    height: def.radius * 1.4,
    radius: def.radius,
    rotation: spawnFromLeft ? 0.3 : -0.3,
    vRot: (Math.random() - 0.5) * 0.05,
    squashX: 1,
    squashY: 1,
    bounceCount: 0,
    isAlive: true,
    eaten: false,
  });
}

// パーティクル生成
function createSparks(
  x: number,
  y: number,
  color: string,
  count = 8,
  shape: 'circle' | 'star' | 'sparkle' | 'heart' = 'sparkle',
) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1.5;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1,
      color,
      size: Math.random() * 6 + 3,
      life: 1,
      maxLife: Math.random() * 20 + 20,
      shape,
      rotation: Math.random() * Math.PI,
      vRot: (Math.random() - 0.5) * 0.2,
    });
  }
}

// ポップアップテキスト生成（洗練された英語・シンボル）
function createScorePopup(x: number, y: number, text: string, color = '#38bdf8') {
  popups.push({
    id: nextPopupId++,
    x,
    y,
    text,
    color,
    scale: 1.25,
    life: 1,
    maxLife: 35,
  });
}

// ゲーム開始
function startGame(mode: GameMode = 'timed') {
  gameMode.value = mode;
  gameState.value = 'playing';
  score.value = 0;
  combo.value = 0;
  maxCombo.value = 0;
  fedCount.value = 0;
  timeLeft.value = GAME_DURATION_SECONDS;
  isNewRecord.value = false;

  fishes.length = 0;
  particles.length = 0;
  popups.length = 0;

  loadHighScore();

  // 初回魚スポーン
  spawnFish('normal');
  setTimeout(() => {
    if (gameState.value === 'playing') spawnFish('gold');
  }, 800);

  // 定期スポーン
  if (spawnIntervalId) clearInterval(spawnIntervalId);
  spawnIntervalId = setInterval(() => {
    if (gameState.value !== 'playing') return;
    if (fishes.filter((f) => f.isAlive && !f.eaten).length < 4) {
      spawnFish();
    }
  }, 2000);

  // タイマー
  if (timerIntervalId) clearInterval(timerIntervalId);
  if (mode === 'timed') {
    timerIntervalId = setInterval(() => {
      if (gameState.value !== 'playing') return;
      timeLeft.value--;
      if (timeLeft.value <= 0) {
        endGame();
      }
    }, 1000);
  }
}

// ゲーム終了
function endGame() {
  gameState.value = 'gameover';
  if (timerIntervalId) clearInterval(timerIntervalId);
  if (spawnIntervalId) clearInterval(spawnIntervalId);
  saveHighScore(score.value);
}

function handleClose() {
  if (timerIntervalId) clearInterval(timerIntervalId);
  if (spawnIntervalId) clearInterval(spawnIntervalId);
  emit('close');
}

// マウス・タッチ移動ハンドラ
function updatePaddlePosition(clientX: number, clientY: number) {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const targetX = (clientX - rect.left) * scaleX;
  const targetY = (clientY - rect.top) * scaleY;

  paddle.prevX = paddle.x;
  paddle.prevY = paddle.y;
  paddle.x = targetX;
  paddle.y = targetY;

  // 速度ベクトル（前フレームとの差分を平滑化）
  paddle.vx = (paddle.x - paddle.prevX) * 0.75;
  paddle.vy = (paddle.y - paddle.prevY) * 0.75;
}

function onMouseMove(e: MouseEvent) {
  updatePaddlePosition(e.clientX, e.clientY);
}

function onTouchMove(e: TouchEvent) {
  if (e.touches.length > 0) {
    const touch = e.touches[0];
    if (touch) {
      updatePaddlePosition(touch.clientX, touch.clientY);
    }
  }
}

function onTouchStart(e: TouchEvent) {
  if (e.touches.length > 0) {
    const touch = e.touches[0];
    if (touch) {
      updatePaddlePosition(touch.clientX, touch.clientY);
      paddle.prevX = paddle.x;
      paddle.prevY = paddle.y;
    }
  }
}

function getCatZone(width: number, _height: number) {
  const isSp = width <= 768;
  return {
    x: isSp ? width - 50 : width - 55,
    y: isSp ? 70 : 75,
    radius: isSp ? 65 : 75,
  };
}

// 物理演算＆更新ループ
function updatePhysics() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const width = canvas.width;
  const height = canvas.height;

  // 猫のキャッチターゲットゾーン
  const catZone = getCatZone(width, height);

  // 魚の物理更新
  for (let i = fishes.length - 1; i >= 0; i--) {
    const fish = fishes[i];
    if (!fish) continue;

    if (fish.eaten) {
      // 食べられた演出（回転しながら縮小して消滅）
      fish.x += (catZone.x - fish.x) * 0.18;
      fish.y += (catZone.y - fish.y) * 0.18;
      fish.squashX *= 0.85;
      fish.squashY *= 0.85;
      fish.rotation += 0.3;
      if (fish.squashX < 0.05) {
        fishes.splice(i, 1);
      }
      continue;
    }

    const def = FISH_DEFINITIONS[fish.kind];

    // 重力＆空気抵抗
    fish.vy += PHYSICS_CONFIG.gravity * def.weight;
    fish.vx *= PHYSICS_CONFIG.airResistance;
    fish.vy *= PHYSICS_CONFIG.airResistance;

    // 速度制限
    fish.vx = Math.max(-PHYSICS_CONFIG.maxVx, Math.min(PHYSICS_CONFIG.maxVx, fish.vx));
    fish.vy = Math.max(-PHYSICS_CONFIG.maxVy, Math.min(PHYSICS_CONFIG.maxVy, fish.vy));

    fish.x += fish.vx;
    fish.y += fish.vy;

    // 回転角（移動方向に合わせる）
    const targetRot = Math.atan2(fish.vy, fish.vx) * 0.3;
    fish.rotation += (targetRot - fish.rotation) * 0.1 + fish.vRot;
    fish.vRot *= 0.95;

    // スカッシュ復元
    fish.squashX += (1 - fish.squashX) * 0.14;
    fish.squashY += (1 - fish.squashY) * 0.14;

    // パドルとの衝突判定
    const dx = fish.x - paddle.x;
    const dy = fish.y - paddle.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const minDist = fish.radius + paddle.radius;

    if (dist < minDist && dist > 0) {
      // 衝突法線
      const nx = dx / dist;
      const ny = dy / dist;

      // パドルから押し出し
      const overlap = minDist - dist;
      fish.x += nx * overlap;
      fish.y += ny * overlap;

      // パドルの速度を反映（スマッシュ効果）
      const paddleSpeed = Math.sqrt(paddle.vx * paddle.vx + paddle.vy * paddle.vy);
      const isSmash = paddleSpeed > 6 || paddle.vy < -4;

      // 反発計算
      const bounceVy = Math.min(
        PHYSICS_CONFIG.minVyOnHit,
        -PHYSICS_CONFIG.paddleHitForce + paddle.vy * PHYSICS_CONFIG.paddleSpeedMultiplier,
      );
      const bounceVx = nx * 5 + paddle.vx * PHYSICS_CONFIG.paddleSpeedMultiplier;

      fish.vx = bounceVx;
      fish.vy = bounceVy * def.restitution;
      fish.vRot = (Math.random() - 0.5) * 0.35;

      // スカッシュ＆ストレッチ変形
      fish.squashX = 1.4;
      fish.squashY = 0.6;

      fish.bounceCount++;
      combo.value++;
      if (combo.value > maxCombo.value) {
        maxCombo.value = combo.value;
      }

      // スコア加算
      const comboMult = 1 + Math.min(combo.value, 15) * 0.1;
      const pts = Math.round(def.scoreValue * comboMult);
      score.value += pts;

      // パーティクル＆エフェクト
      createSparks(fish.x, fish.y, isSmash ? '#facc15' : def.color, isSmash ? 14 : 7, isSmash ? 'star' : 'sparkle');

      const hitText = isSmash ? `SMASH +${pts}` : combo.value > 1 ? `+${pts}` : `+${pts}`;
      createScorePopup(fish.x, fish.y - 20, hitText, isSmash ? '#f59e0b' : '#38bdf8');
    }

    // 左右の壁バウンド
    if (fish.x - fish.radius < 0) {
      fish.x = fish.radius;
      fish.vx = -fish.vx * PHYSICS_CONFIG.wallBounceDamping;
      fish.squashX = 0.75;
      fish.squashY = 1.25;
      createSparks(fish.x, fish.y, '#ffffff', 3, 'circle');
    } else if (fish.x + fish.radius > width) {
      fish.x = width - fish.radius;
      fish.vx = -fish.vx * PHYSICS_CONFIG.wallBounceDamping;
      fish.squashX = 0.75;
      fish.squashY = 1.25;
      createSparks(fish.x, fish.y, '#ffffff', 3, 'circle');
    }

    // 猫のお口キャッチ判定
    const catDx = fish.x - catZone.x;
    const catDy = fish.y - catZone.y;
    const catDist = Math.sqrt(catDx * catDx + catDy * catDy);

    if (catDist < catZone.radius && !fish.eaten && fish.vy < 4) {
      // 猫ちゃんがキャッチ！
      fish.eaten = true;
      fedCount.value++;

      const comboBonus = combo.value * 25;
      const eatScore = def.eatScoreBonus + comboBonus;
      score.value += eatScore;

      // 猫リアクションを発火！
      emit('catReaction', 'happy');

      createSparks(catZone.x, catZone.y, '#f43f5e', 20, 'heart');
      createScorePopup(catZone.x - 20, catZone.y - 10, `+${eatScore}`, '#f43f5e');
      continue;
    }

    // 画面下に落下（ミス）
    if (fish.y - fish.radius > height + 20) {
      combo.value = 0; // コンボリセット
      fishes.splice(i, 1);
      // 魚が減ったら補給
      if (fishes.filter((f) => f.isAlive && !f.eaten).length < 2 && gameState.value === 'playing') {
        spawnFish();
      }
    }
  }

  // パーティクル更新
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    if (!p) continue;
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.08;
    p.rotation += p.vRot;
    p.life++;
    if (p.life >= p.maxLife) {
      particles.splice(i, 1);
    }
  }

  // ポップアップ更新
  for (let i = popups.length - 1; i >= 0; i--) {
    const pop = popups[i];
    if (!pop) continue;
    pop.y -= 1.4;
    pop.scale = Math.max(1, pop.scale - 0.008);
    pop.life++;
    if (pop.life >= pop.maxLife) {
      popups.splice(i, 1);
    }
  }
}

// 描画ルーチン
function drawGame() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // クリア
  ctx.clearRect(0, 0, width, height);

  // 背景の洗練されたドットグリッド
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  for (let x = 24; x < width; x += 36) {
    for (let y = 24; y < height; y += 36) {
      ctx.beginPath();
      ctx.arc(x, y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // 猫のキャッチターゲットエリア（テキストなし・モダンなパルスリング＆ターゲットマーク）
  const catZone = getCatZone(width, height);
  const catZoneX = catZone.x;
  const catZoneY = catZone.y;
  const targetRadius = catZone.radius;
  const now = Date.now();
  const pulse = Math.sin(now * 0.004) * 0.12 + 0.88;
  const spinAngle = (now * 0.0012) % (Math.PI * 2);

  ctx.save();
  // 外側の淡いグロー
  const zoneGrad = ctx.createRadialGradient(catZoneX, catZoneY, 15, catZoneX, catZoneY, targetRadius * pulse);
  zoneGrad.addColorStop(0, 'rgba(244, 63, 94, 0.25)');
  zoneGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');
  ctx.fillStyle = zoneGrad;
  ctx.beginPath();
  ctx.arc(catZoneX, catZoneY, targetRadius * pulse, 0, Math.PI * 2);
  ctx.fill();

  // スタイリッシュな破線回転サークル
  ctx.save();
  ctx.translate(catZoneX, catZoneY);
  ctx.rotate(spinAngle);
  ctx.beginPath();
  ctx.arc(0, 0, targetRadius * 0.65 * pulse, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(244, 63, 94, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 6]);
  ctx.stroke();

  // コーナーターゲットマーク
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    const r = targetRadius * 0.78 * pulse;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fill();
  }
  ctx.restore();
  ctx.restore();

  // 魚の描画
  for (const fish of fishes) {
    ctx.save();
    ctx.translate(fish.x, fish.y);
    ctx.rotate(fish.rotation);
    ctx.scale(fish.squashX, fish.squashY);

    const def = FISH_DEFINITIONS[fish.kind];
    const r = fish.radius;

    // 魚の影
    ctx.beginPath();
    ctx.ellipse(2, 6, r * 0.9, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fill();

    // 魚の本体
    ctx.beginPath();
    ctx.moveTo(r * 1.1, 0);
    ctx.quadraticCurveTo(0, -r * 0.8, -r * 0.9, 0);
    ctx.lineTo(-r * 1.4, -r * 0.6);
    ctx.lineTo(-r * 1.1, 0);
    ctx.lineTo(-r * 1.4, r * 0.6);
    ctx.lineTo(-r * 0.9, 0);
    ctx.quadraticCurveTo(0, r * 0.8, r * 1.1, 0);
    ctx.closePath();

    ctx.fillStyle = def.color;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = def.accentColor;
    ctx.stroke();

    // 背ビレ
    ctx.beginPath();
    ctx.moveTo(-r * 0.2, -r * 0.6);
    ctx.quadraticCurveTo(0, -r * 1.0, r * 0.3, -r * 0.5);
    ctx.fillStyle = def.accentColor;
    ctx.fill();

    // 胸ビレ
    ctx.beginPath();
    ctx.ellipse(-r * 0.1, r * 0.1, r * 0.35, r * 0.18, 0.4, 0, Math.PI * 2);
    ctx.fillStyle = def.accentColor;
    ctx.fill();

    // 目
    const eyeX = r * 0.55;
    const eyeY = -r * 0.15;
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, r * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(eyeX + 1, eyeY, r * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(eyeX + 2, eyeY - 1, r * 0.05, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // 黄金魚のオーラ
    if (fish.kind === 'gold') {
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.25, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.restore();
  }

  // パーティクル描画
  for (const p of particles) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    const alpha = 1 - p.life / p.maxLife;
    ctx.globalAlpha = Math.max(0, alpha);

    if (p.shape === 'heart') {
      ctx.fillStyle = p.color;
      ctx.font = `${p.size * 2}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('♥', 0, 0);
    } else if (p.shape === 'star') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const outer = p.size;
        const inner = p.size * 0.45;
        const a1 = (i * Math.PI * 2) / 5 - Math.PI / 2;
        const a2 = a1 + Math.PI / 5;
        if (i === 0) ctx.moveTo(Math.cos(a1) * outer, Math.sin(a1) * outer);
        else ctx.lineTo(Math.cos(a1) * outer, Math.sin(a1) * outer);
        ctx.lineTo(Math.cos(a2) * inner, Math.sin(a2) * inner);
      }
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // ポップアップスコアテキスト描画
  for (const pop of popups) {
    ctx.save();
    const alpha = 1 - pop.life / pop.maxLife;
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.font = `800 ${Math.round(18 * pop.scale)}px system-ui, -apple-system, sans-serif`;
    ctx.fillStyle = pop.color;
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 6;
    ctx.fillText(pop.text, pop.x, pop.y);
    ctx.restore();
  }

  // 肉球パドルの描画
  if (paddle.x > -50) {
    ctx.save();
    ctx.translate(paddle.x, paddle.y);

    const pSpeed = Math.sqrt(paddle.vx * paddle.vx + paddle.vy * paddle.vy);
    if (pSpeed > 4) {
      ctx.beginPath();
      ctx.arc(0, 0, paddle.radius * 1.35, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.fill();
    }

    // パドル本体
    ctx.beginPath();
    ctx.arc(0, 0, paddle.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#38bdf8';
    ctx.stroke();

    // 肉球マーク
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.ellipse(0, 4, 11, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    const toeOffsets = [
      { x: -10, y: -7, r: 4 },
      { x: 0, y: -11, r: 4.5 },
      { x: 10, y: -7, r: 4 },
    ];
    for (const toe of toeOffsets) {
      ctx.beginPath();
      ctx.arc(toe.x, toe.y, toe.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// メインループ
function gameLoop() {
  if (gameState.value === 'playing') {
    updatePhysics();
  }
  drawGame();
  animationFrameId = requestAnimationFrame(gameLoop);
}

// Canvas リサイズ
function resizeCanvas() {
  const canvas = canvasRef.value;
  const container = containerRef.value;
  if (!canvas || !container) return;

  const rect = container.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}

onMounted(() => {
  loadHighScore();
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  animationFrameId = requestAnimationFrame(gameLoop);
});

onBeforeUnmount(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  if (timerIntervalId) clearInterval(timerIntervalId);
  if (spawnIntervalId) clearInterval(spawnIntervalId);
  window.removeEventListener('resize', resizeCanvas);
});
</script>

<template>
  <div ref="containerRef" class="oyatsu-toss">
    <!-- Canvas ゲーム画面 -->
    <canvas
      ref="canvasRef"
      class="oyatsu-toss__canvas"
      @mousemove="onMouseMove"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
    />

    <!-- ミニマル HUD -->
    <div v-if="gameState === 'playing'" class="oyatsu-toss__hud">
      <div class="oyatsu-toss__stats-group">
        <div class="oyatsu-toss__hud-badge">
          <span class="oyatsu-toss__badge-label">SCORE</span>
          <span class="oyatsu-toss__badge-val">{{ score }}</span>
        </div>
        <div v-if="gameMode === 'timed'" class="oyatsu-toss__hud-badge">
          <span class="oyatsu-toss__badge-label">TIME</span>
          <span class="oyatsu-toss__badge-val" :class="{ 'oyatsu-toss__badge-val--warn': timeLeft <= 5 }">
            {{ timeLeft }}
          </span>
        </div>
        <div v-if="combo > 1" class="oyatsu-toss__hud-badge oyatsu-toss__hud-badge--combo">
          <span class="oyatsu-toss__badge-label">COMBO</span>
          <span class="oyatsu-toss__badge-val">×{{ combo }}</span>
        </div>
      </div>
      <button type="button" class="oyatsu-toss__close-icon" aria-label="Exit" @click="endGame">✕</button>
    </div>

    <!-- スタート画面（ミニマル＆クール） -->
    <div v-if="gameState === 'ready'" class="oyatsu-toss__overlay">
      <div class="oyatsu-toss__modal">
        <div class="oyatsu-toss__hero-badge">MINI GAME</div>
        <h2 class="oyatsu-toss__main-title">FISH TOSS</h2>

        <div v-if="highScore > 0" class="oyatsu-toss__best-pill">BEST {{ highScore }}</div>

        <div class="oyatsu-toss__action-row">
          <button type="button" class="oyatsu-toss__btn-hero" @click="startGame('timed')">PLAY (30s)</button>
          <button type="button" class="oyatsu-toss__btn-ghost" @click="startGame('endless')">ENDLESS</button>
        </div>

        <button type="button" class="oyatsu-toss__exit-link" @click="handleClose">BACK</button>
      </div>
    </div>

    <!-- リザルト画面（洗練されたスコアカード） -->
    <div v-if="gameState === 'gameover'" class="oyatsu-toss__overlay">
      <div class="oyatsu-toss__modal">
        <div class="oyatsu-toss__hero-badge">
          {{ isNewRecord ? 'NEW RECORD' : 'RESULT' }}
        </div>

        <div class="oyatsu-toss__score-display">
          {{ score }}
        </div>

        <div class="oyatsu-toss__grid-stats">
          <div class="oyatsu-toss__stat-cell">
            <span class="oyatsu-toss__cell-label">MAX COMBO</span>
            <span class="oyatsu-toss__cell-val">{{ maxCombo }}</span>
          </div>
          <div class="oyatsu-toss__stat-cell">
            <span class="oyatsu-toss__cell-label">FED</span>
            <span class="oyatsu-toss__cell-val">{{ fedCount }}</span>
          </div>
          <div class="oyatsu-toss__stat-cell">
            <span class="oyatsu-toss__cell-label">BEST</span>
            <span class="oyatsu-toss__cell-val">{{ highScore }}</span>
          </div>
        </div>

        <div class="oyatsu-toss__action-row">
          <button type="button" class="oyatsu-toss__btn-hero" @click="startGame(gameMode)">RETRY</button>
          <button type="button" class="oyatsu-toss__btn-ghost" @click="handleClose">CLOSE</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.oyatsu-toss {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  user-select: none;
  touch-action: none;
}

.oyatsu-toss__canvas {
  width: 100%;
  height: 100%;
  display: block;
  cursor: none;
}

/* ミニマル HUD */
.oyatsu-toss__hud {
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  right: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: none;
  z-index: 10;
}

.oyatsu-toss__stats-group {
  display: flex;
  gap: 0.5rem;
}

.oyatsu-toss__hud-badge {
  background: rgb(15 23 42 / 65%);
  backdrop-filter: blur(12px);
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: 9999px;
  padding: 0.3rem 0.85rem;
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
  box-shadow: 0 4px 16px rgb(0 0 0 / 25%);
}

.oyatsu-toss__hud-badge--combo {
  border-color: rgb(56 189 248 / 40%);
  background: rgb(56 189 248 / 15%);
  animation: pulse-warn 0.4s ease alternate;
}

.oyatsu-toss__badge-label {
  font-size: 0.65rem;
  font-weight: 800;
  color: #64748b;
  letter-spacing: 0.08em;
}

.oyatsu-toss__badge-val {
  font-size: 1.1rem;
  font-weight: 800;
  color: #f8fafc;
  font-variant-numeric: tabular-nums;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
}

.oyatsu-toss__badge-val--warn {
  color: #f43f5e;
  animation: pulse-warn 0.5s infinite alternate;
}

.oyatsu-toss__close-icon {
  pointer-events: auto;
  background: rgb(15 23 42 / 65%);
  backdrop-filter: blur(12px);
  border: 1px solid rgb(255 255 255 / 12%);
  color: #94a3b8;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.oyatsu-toss__close-icon:hover {
  background: rgb(244 63 94 / 80%);
  color: #fff;
  border-color: #f43f5e;
}

/* オーバーレイ */
.oyatsu-toss__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(8 16 37 / 75%);
  backdrop-filter: blur(16px);
  z-index: 20;
  padding: 1.5rem;
  animation: fade-in 0.25s ease-out;
}

.oyatsu-toss__modal {
  background: rgb(15 23 42 / 85%);
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: 1.75rem;
  padding: 2.25rem 2rem;
  max-width: 360px;
  width: 100%;
  text-align: center;
  box-shadow: 0 24px 48px rgb(0 0 0 / 50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.oyatsu-toss__hero-badge {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: #38bdf8;
  background: rgb(56 189 248 / 12%);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  margin-bottom: 0.75rem;
}

.oyatsu-toss__main-title {
  font-size: 1.75rem;
  font-weight: 900;
  letter-spacing: 0.05em;
  color: #f8fafc;
  margin-bottom: 0.5rem;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
}

.oyatsu-toss__best-pill {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #94a3b8;
  margin-bottom: 1.75rem;
}

.oyatsu-toss__score-display {
  font-size: 4rem;
  font-weight: 900;
  color: #38bdf8;
  line-height: 1;
  margin: 1rem 0 1.5rem;
  font-variant-numeric: tabular-nums;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
  text-shadow: 0 0 28px rgb(56 189 248 / 40%);
}

.oyatsu-toss__grid-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  width: 100%;
  background: rgb(30 41 59 / 50%);
  border-radius: 1rem;
  padding: 0.85rem 0.5rem;
  margin-bottom: 1.75rem;
}

.oyatsu-toss__stat-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.oyatsu-toss__cell-label {
  font-size: 0.6rem;
  font-weight: 800;
  color: #64748b;
  letter-spacing: 0.05em;
}

.oyatsu-toss__cell-val {
  font-size: 1.15rem;
  font-weight: 800;
  color: #f8fafc;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
}

.oyatsu-toss__action-row {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  width: 100%;
}

.oyatsu-toss__btn-hero {
  width: 100%;
  padding: 0.85rem 1.5rem;
  border-radius: 9999px;
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  cursor: pointer;
  background: linear-gradient(135deg, #38bdf8, #0284c7);
  color: #fff;
  border: none;
  box-shadow: 0 6px 20px rgb(2 132 199 / 40%);
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.oyatsu-toss__btn-hero:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgb(2 132 199 / 60%);
}

.oyatsu-toss__btn-ghost {
  width: 100%;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  cursor: pointer;
  background: transparent;
  border: 1px solid rgb(255 255 255 / 15%);
  color: #cbd5e1;
  transition: all 0.2s ease;
}

.oyatsu-toss__btn-ghost:hover {
  background: rgb(255 255 255 / 10%);
  color: #fff;
}

.oyatsu-toss__exit-link {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  margin-top: 1.25rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.oyatsu-toss__exit-link:hover {
  color: #cbd5e1;
}

@keyframes pulse-warn {
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.1);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.96);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
