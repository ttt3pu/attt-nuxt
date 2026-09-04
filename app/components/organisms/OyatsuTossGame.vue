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
import type { OyatsuCatchCatReactionKind } from '@/types/oyatsu-catch';

const emit = defineEmits<{
  close: [];
  catReaction: [kind: OyatsuCatchCatReactionKind];
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
  const startY = Math.random() * (canvas.height * 0.4) + 60;

  // 中央寄りに放り投げる初速
  const baseVx = (Math.random() * 3 + 2) * (spawnFromLeft ? 1 : -1);
  const baseVy = -(Math.random() * 4 + 3);

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

// ポップアップテキスト生成
function createScorePopup(x: number, y: number, text: string, color = '#ffd54f') {
  popups.push({
    id: nextPopupId++,
    x,
    y,
    text,
    color,
    scale: 1.3,
    life: 1,
    maxLife: 40,
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
  }, 1000);

  // 定期スポーン
  if (spawnIntervalId) clearInterval(spawnIntervalId);
  spawnIntervalId = setInterval(() => {
    if (gameState.value !== 'playing') return;
    if (fishes.filter((f) => f.isAlive && !f.eaten).length < 4) {
      spawnFish();
    }
  }, 2200);

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
  paddle.vx = (paddle.x - paddle.prevX) * 0.7;
  paddle.vy = (paddle.y - paddle.prevY) * 0.7;
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

// 物理演算＆更新ループ
function updatePhysics() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const width = canvas.width;
  const height = canvas.height;

  // 猫のキャッチターゲットゾーン（右上端）
  const catZone = {
    x: width - 60,
    y: 80,
    radius: 70,
  };

  // 魚の物理更新
  for (let i = fishes.length - 1; i >= 0; i--) {
    const fish = fishes[i];
    if (!fish) continue;

    if (fish.eaten) {
      // 食べられた演出（回転しながら縮小して消滅）
      fish.x += (catZone.x - fish.x) * 0.15;
      fish.y += (catZone.y - fish.y) * 0.15;
      fish.squashX *= 0.88;
      fish.squashY *= 0.88;
      fish.rotation += 0.25;
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

    // 回転角（移動方向に少し合わせる）
    const targetRot = Math.atan2(fish.vy, fish.vx) * 0.3;
    fish.rotation += (targetRot - fish.rotation) * 0.1 + fish.vRot;
    fish.vRot *= 0.95;

    // スカッシュ復元
    fish.squashX += (1 - fish.squashX) * 0.12;
    fish.squashY += (1 - fish.squashY) * 0.12;

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
      fish.vRot = (Math.random() - 0.5) * 0.3;

      // スカッシュ＆ストレッチ変形
      fish.squashX = 1.35;
      fish.squashY = 0.65;

      fish.bounceCount++;
      combo.value++;
      if (combo.value > maxCombo.value) {
        maxCombo.value = combo.value;
      }

      // スコア加算
      const comboMult = 1 + Math.min(combo.value, 10) * 0.1;
      const pts = Math.round(def.scoreValue * comboMult);
      score.value += pts;

      // パーティクル＆エフェクト
      createSparks(fish.x, fish.y, isSmash ? '#ffeb3b' : def.color, isSmash ? 14 : 7, isSmash ? 'star' : 'sparkle');

      const hitText = isSmash ? `SMASH! +${pts}` : combo.value > 1 ? `${combo.value} COMBO! +${pts}` : `+${pts}`;
      createScorePopup(fish.x, fish.y - 20, hitText, isSmash ? '#ff9800' : '#4fc3f7');
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

    if (catDist < catZone.radius && !fish.eaten && fish.vy < 3) {
      // 猫ちゃんがキャッチ！
      fish.eaten = true;
      fedCount.value++;

      const comboBonus = combo.value * 20;
      const eatScore = def.eatScoreBonus + comboBonus;
      score.value += eatScore;

      // 猫リアクションを発火！
      emit('catReaction', 'happy');

      createSparks(catZone.x, catZone.y, '#ff4081', 18, 'heart');
      createScorePopup(catZone.x - 30, catZone.y - 10, `DELICIOUS! +${eatScore}`, '#ff4081');
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
    p.vy += 0.08; // 軽い重力
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
    pop.y -= 1.2;
    pop.scale = Math.max(1, pop.scale - 0.01);
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

  // 背景の柔らかいグリッド/水玉パターン
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  for (let x = 20; x < width; x += 40) {
    for (let y = 20; y < height; y += 40) {
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // 猫のキャッチターゲットエリア（ガイド表示）
  const catZoneX = width - 60;
  const catZoneY = 80;
  ctx.save();
  const pulse = Math.sin(Date.now() * 0.005) * 0.15 + 0.85;
  const zoneGrad = ctx.createRadialGradient(catZoneX, catZoneY, 10, catZoneX, catZoneY, 70 * pulse);
  zoneGrad.addColorStop(0, 'rgba(255, 105, 180, 0.3)');
  zoneGrad.addColorStop(1, 'rgba(255, 105, 180, 0)');
  ctx.fillStyle = zoneGrad;
  ctx.beginPath();
  ctx.arc(catZoneX, catZoneY, 70 * pulse, 0, Math.PI * 2);
  ctx.fill();

  // 目印のテキスト
  ctx.font = 'bold 12px sans-serif';
  ctx.fillStyle = 'rgba(255, 182, 193, 0.7)';
  ctx.textAlign = 'center';
  ctx.fillText('🐾 ここへトス！', catZoneX, catZoneY + 65);
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
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.fill();

    // 魚の本体（滑らかな魚シェイプ）
    ctx.beginPath();
    ctx.moveTo(r * 1.1, 0); // 鼻先
    ctx.quadraticCurveTo(0, -r * 0.8, -r * 0.9, 0); // 上腹
    ctx.lineTo(-r * 1.4, -r * 0.6); // 尾ビレ上
    ctx.lineTo(-r * 1.1, 0); // 尾ビレ中央くびれ
    ctx.lineTo(-r * 1.4, r * 0.6); // 尾ビレ下
    ctx.lineTo(-r * 0.9, 0); // 尾ビレ付け根
    ctx.quadraticCurveTo(0, r * 0.8, r * 1.1, 0); // 下腹
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

    // 魚の目（白目＋黒目＋ハイライト）
    const eyeX = r * 0.55;
    const eyeY = -r * 0.15;
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, r * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(eyeX + 1, eyeY, r * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = '#222222';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(eyeX + 2, eyeY - 1, r * 0.05, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // 黄金魚のキラキラエフェクト
    if (fish.kind === 'gold') {
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 235, 59, 0.4)';
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
    ctx.font = `bold ${Math.round(18 * pop.scale)}px 'Fredoka', 'M PLUS Rounded 1c', sans-serif`;
    ctx.fillStyle = pop.color;
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 4;
    ctx.fillText(pop.text, pop.x, pop.y);
    ctx.restore();
  }

  // 肉球パドルの描画
  if (paddle.x > -50) {
    ctx.save();
    ctx.translate(paddle.x, paddle.y);

    // パドルのオーラ（スピードがある時）
    const pSpeed = Math.sqrt(paddle.vx * paddle.vx + paddle.vy * paddle.vy);
    if (pSpeed > 4) {
      ctx.beginPath();
      ctx.arc(0, 0, paddle.radius * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 215, 0, 0.25)';
      ctx.fill();
    }

    // 肉球ベース円（クッション皿）
    ctx.beginPath();
    ctx.arc(0, 0, paddle.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff0f5';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ff80ab';
    ctx.stroke();

    // 肉球マーク（中央の大きな肉球パッド）
    ctx.fillStyle = '#ff4081';
    ctx.beginPath();
    ctx.ellipse(0, 4, 12, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // 肉球の指 3つ
    const toeOffsets = [
      { x: -11, y: -7, r: 4.5 },
      { x: 0, y: -12, r: 5 },
      { x: 11, y: -7, r: 4.5 },
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

    <!-- プレイ中ヘッダー UI -->
    <div v-if="gameState === 'playing'" class="oyatsu-toss__hud">
      <div class="oyatsu-toss__stats-group">
        <div class="oyatsu-toss__hud-item">
          <span class="oyatsu-toss__label">SCORE</span>
          <span class="oyatsu-toss__value">{{ score }}</span>
        </div>
        <div v-if="gameMode === 'timed'" class="oyatsu-toss__hud-item">
          <span class="oyatsu-toss__label">TIME</span>
          <span class="oyatsu-toss__value" :class="{ 'oyatsu-toss__value--warning': timeLeft <= 5 }">
            {{ timeLeft }}s
          </span>
        </div>
        <div class="oyatsu-toss__hud-item">
          <span class="oyatsu-toss__label">COMBO</span>
          <span
            class="oyatsu-toss__value oyatsu-toss__value--combo"
            :class="{ 'oyatsu-toss__value--combo-active': combo > 1 }"
          >
            {{ combo }}
          </span>
        </div>
      </div>
      <div class="oyatsu-toss__hud-actions">
        <button type="button" class="oyatsu-toss__icon-btn" aria-label="終了する" @click="endGame">✕</button>
      </div>
    </div>

    <!-- スタート待機画面（Ready） -->
    <div v-if="gameState === 'ready'" class="oyatsu-toss__overlay">
      <div class="oyatsu-toss__card">
        <h2 class="oyatsu-toss__title">🐟 お魚トス＆ジャグリング 🐾</h2>
        <p class="oyatsu-toss__desc">
          マウスや指で<strong>肉球パドル</strong>を動かして、落ちてくる魚をポンポン弾こう！<br />
          右上にいる<strong>お腹を空かせた猫ちゃん</strong>の口へトスすると大喜び！♥
        </p>

        <div class="oyatsu-toss__tips">
          <div class="oyatsu-toss__tip-item">
            <span class="oyatsu-toss__tip-icon">🏓</span>
            <span>マウスを素早く振って<strong>スマッシュトス</strong>！</span>
          </div>
          <div class="oyatsu-toss__tip-item">
            <span class="oyatsu-toss__tip-icon">✨</span>
            <span>落とさずに連続トスで<strong>コンボ倍率アップ</strong>！</span>
          </div>
        </div>

        <div v-if="highScore > 0" class="oyatsu-toss__highscore-badge">
          👑 ハイスコア: <strong>{{ highScore }}</strong> pt
        </div>

        <div class="oyatsu-toss__btn-group">
          <button
            type="button"
            class="oyatsu-toss__start-btn oyatsu-toss__start-btn--primary"
            @click="startGame('timed')"
          >
            30秒チャレンジで遊ぶ！
          </button>
          <button
            type="button"
            class="oyatsu-toss__start-btn oyatsu-toss__start-btn--secondary"
            @click="startGame('endless')"
          >
            エンドレスで練習
          </button>
          <button type="button" class="oyatsu-toss__close-btn" @click="handleClose">もどる</button>
        </div>
      </div>
    </div>

    <!-- ゲームオーバー画面（Result） -->
    <div v-if="gameState === 'gameover'" class="oyatsu-toss__overlay">
      <div class="oyatsu-toss__card">
        <h2 class="oyatsu-toss__title">
          {{ isNewRecord ? '🎉 NEW RECORD! 🎉' : '🏁 FINISH! 🏁' }}
        </h2>

        <div class="oyatsu-toss__result-score">
          <div class="oyatsu-toss__score-main">
            <span class="oyatsu-toss__score-num">{{ score }}</span>
            <span class="oyatsu-toss__score-unit">pt</span>
          </div>
        </div>

        <div class="oyatsu-toss__result-details">
          <div class="oyatsu-toss__detail-row">
            <span>最大コンボ</span>
            <strong>{{ maxCombo }} 連続</strong>
          </div>
          <div class="oyatsu-toss__detail-row">
            <span>猫ちゃんが食べた魚</span>
            <strong>{{ fedCount }} 匹</strong>
          </div>
          <div class="oyatsu-toss__detail-row">
            <span>ハイスコア</span>
            <strong>{{ highScore }} pt</strong>
          </div>
        </div>

        <div class="oyatsu-toss__btn-group">
          <button
            type="button"
            class="oyatsu-toss__start-btn oyatsu-toss__start-btn--primary"
            @click="startGame(gameMode)"
          >
            もう一度遊ぶ！
          </button>
          <button type="button" class="oyatsu-toss__close-btn" @click="handleClose">トップへ戻る</button>
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

/* HUD */
.oyatsu-toss__hud {
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: none;
  z-index: 10;
}

.oyatsu-toss__stats-group {
  display: flex;
  gap: 1rem;
}

.oyatsu-toss__hud-item {
  background: rgb(15 23 42 / 75%);
  backdrop-filter: blur(8px);
  border: 1px solid rgb(255 255 255 / 15%);
  border-radius: 9999px;
  padding: 0.35rem 0.9rem;
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  box-shadow: 0 4px 12px rgb(0 0 0 / 30%);
}

.oyatsu-toss__label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.05em;
}

.oyatsu-toss__value {
  font-size: 1.15rem;
  font-weight: 800;
  color: #f8fafc;
  font-variant-numeric: tabular-nums;
}

.oyatsu-toss__value--warning {
  color: #ef4444;
  animation: pulse-warn 0.6s infinite alternate;
}

.oyatsu-toss__value--combo {
  color: #38bdf8;
  transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.oyatsu-toss__value--combo-active {
  color: #facc15;
  transform: scale(1.2);
}

.oyatsu-toss__hud-actions {
  pointer-events: auto;
}

.oyatsu-toss__icon-btn {
  background: rgb(15 23 42 / 75%);
  backdrop-filter: blur(8px);
  border: 1px solid rgb(255 255 255 / 15%);
  color: #cbd5e1;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.oyatsu-toss__icon-btn:hover {
  background: rgb(239 68 68 / 80%);
  color: #fff;
  border-color: #ef4444;
}

/* オーバーレイ（開始前 / 終了後） */
.oyatsu-toss__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(8 16 37 / 82%);
  backdrop-filter: blur(10px);
  z-index: 20;
  padding: 1.5rem;
  animation: fade-in 0.3s ease;
}

.oyatsu-toss__card {
  background: rgb(30 41 59 / 95%);
  border: 1px solid rgb(255 255 255 / 15%);
  border-radius: 1.5rem;
  padding: 2rem;
  max-width: 440px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgb(0 0 0 / 50%);
}

.oyatsu-toss__title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 0.75rem;
}

.oyatsu-toss__desc {
  font-size: 0.875rem;
  color: #cbd5e1;
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

.oyatsu-toss__tips {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: rgb(15 23 42 / 60%);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  margin-bottom: 1.25rem;
  text-align: left;
  font-size: 0.8rem;
  color: #94a3b8;
}

.oyatsu-toss__tip-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.oyatsu-toss__tip-icon {
  font-size: 1.1rem;
}

.oyatsu-toss__highscore-badge {
  display: inline-block;
  background: rgb(250 204 21 / 15%);
  border: 1px solid rgb(250 204 21 / 30%);
  color: #fde047;
  font-size: 0.85rem;
  padding: 0.3rem 0.8rem;
  border-radius: 9999px;
  margin-bottom: 1.25rem;
}

.oyatsu-toss__result-score {
  margin: 1.5rem 0;
}

.oyatsu-toss__score-main {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.3rem;
}

.oyatsu-toss__score-num {
  font-size: 3.5rem;
  font-weight: 900;
  color: #38bdf8;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 20px rgb(56 189 248 / 40%);
}

.oyatsu-toss__score-unit {
  font-size: 1.25rem;
  font-weight: 700;
  color: #94a3b8;
}

.oyatsu-toss__result-details {
  background: rgb(15 23 42 / 60%);
  border-radius: 0.75rem;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.oyatsu-toss__detail-row {
  display: flex;
  justify-content: space-between;
  color: #cbd5e1;
}

.oyatsu-toss__detail-row strong {
  color: #f8fafc;
}

.oyatsu-toss__btn-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.oyatsu-toss__start-btn {
  width: 100%;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: none;
}

.oyatsu-toss__start-btn--primary {
  background: linear-gradient(135deg, #38bdf8, #0284c7);
  color: #fff;
  box-shadow: 0 6px 16px rgb(2 132 199 / 40%);
}

.oyatsu-toss__start-btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgb(2 132 199 / 60%);
}

.oyatsu-toss__start-btn--secondary {
  background: rgb(255 255 255 / 8%);
  border: 1px solid rgb(255 255 255 / 20%);
  color: #e2e8f0;
}

.oyatsu-toss__start-btn--secondary:hover {
  background: rgb(255 255 255 / 15%);
}

.oyatsu-toss__close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.85rem;
  padding: 0.4rem;
  cursor: pointer;
}

.oyatsu-toss__close-btn:hover {
  color: #fff;
}

@keyframes pulse-warn {
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.15);
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
