# おやつ工房 — 背景に「おやつが降ってくる」視覚

**目的**: インクリメンタルで増えたおやつ量が、**数値だけでなく見た目でも楽しく伝わる**ようにする。工房の**背後**に、おやつが**ふわっと降ってくる／流れる**ようなレイヤーを置く。

**前提（既存方針との整合）**

- トップヒーロー左のゲーム枠内（`OrganismsOyatsuWorkshop`）に収める。
- **`prefers-reduced-motion: reduce`** のときは、落下アニメを止めるか、静的な薄いグラデーションにフォールバックする。
- 数値は主役。背景は**邪魔にならない**（低コントラスト・パネルより下の z-index）。

---

## 1. 体験イメージ

| 項目 | 案 |
|------|-----|
| **トリガー** | おやつの量・生産率・累計生産などの**いずれか（または複合）**で「密度」や「大きさ」が変わる。 |
| **見え方** | **魚形の SVG**（`AtomsOyatsuFish`）を複数、上から下へ（または斜めに）**ゆっくり落下**させる。各匹は **`randomOyatsuFishColors()`**（`app/utils/oyatsu-fish-colors.ts`）で **HSL のランダムな塗り・線色**にし、カラフルさを出す。ループはランダムな位置・遅延・スケールで単調さを避ける。 |
| **読みやすさ** | パネル（`oyatsu-workshop__panel`）は**前面**に固定。背景は `pointer-events: none` でクリックを奪わない。魚コンポーネントは装飾のため **`aria-hidden`** 済み。 |

### 1.1 視覚アセット（確定）

| 項目 | 内容 |
|------|------|
| **グラフィック** | `app/components/atoms/OyatsuFish.vue`（`AtomsOyatsuFish`）。Openclipart 由来の魚パスを単色 `fill` / `stroke` で差し替え可能にしたもの。 |
| **色** | 落下インスタンスごとに `randomOyatsuFishColors()` で `{ fill, stroke }` を割り当てる（親またはバックドロップコンポーネント側）。 |
| **備考** | 「おやつ」の世界観として**魚**を採用（猫のエサのイメージ）。数値上の「おやつ」とは別物の**装飾粒子**として扱う（§2 の注意と同じ）。 |

---

## 2. データとの接続（設計の選択肢）

実装は次のどれか（または段階的に組み合わせてよい）。

1. **生産率 `productionRate`** に比例して「同時に画面にいる粒の数」やスポーン間隔を変える。
2. **`treats`（所持）** の桁が大きくなるほど、粒のサイズや色の濃さを少しだけ上げる（上限あり）。
3. **`totalTreatsProduced`（累計）** のマイルストーンで、**パレットや落下パターン**を切り替える（任意・後回し可）。

**注意**: 1 粒 = 1 おやつにすると数が爆発するので、**「表示用の装飾粒子」**と**実際の数値**は一致させない（密度は対数や上限でクリップ）。

---

## 3. 実装アプローチ（比較）

| 方式 | 長所 | 短所 |
|------|------|------|
| **A. 純 CSS / 少数 DOM**（`position: absolute` + `@keyframes` / Vue `v-for` で N 個固定） | Vue と相性がよい、メインスレッドの制御が簡単 | 粒数が多いと DOM 負荷 |
| **B. 単一 `<canvas>`**（`requestAnimationFrame` で描画） | 粒数を増やしやすい、既存の tick と合わせやすい | 解像度・DPR 対応、ヒット領域は不要 |
| **C. ループ SVG パターン** | 軽量・装飾向き | 単体では変化が単調になりやすい（本件では **A + 魚 SVG 複数**で対応） |

**推奨**: **A（少数 DOM）** で、各要素を **`AtomsOyatsuFish`** にする。匹数は **8〜24 程度**を目安に上限を設ける。パフォーマンス上まだ厳しければ **B（canvas）** に移行し、魚は**スプライト化または簡略シルエット**に差し替える案を検討。工房は既に `tick` があるので、B なら `useOyatsuIncremental` の `productionRate` を子へ渡すか `watch` で足りる。

---

## 4. コンポーネント構成（案）

```
OyatsuWorkshop.vue
  └─ OyatsuWorkshopBackdrop (新規) … 画面全体・overflow hidden・z-index 最下層
       └─ 落下レイヤー … v-for で複数
            └─ AtomsOyatsuFish（各匹 :fill / :stroke を randomOyatsuFishColors 由来で）
  └─ OyatsuWorkshop__panel（既存・前面）
```

- `OyatsuWorkshopBackdrop` に `treats` / `productionRate`（または正規化した 0〜1 の `density`）を props で渡す。
- 減速モーション時は**落下レイヤーをマウントしない**か、アニメのみ無効化（魚は非表示または静止）。

---

## 5. マイルストーン案

| ID | 内容 |
|----|------|
| **FT-1** | 工房コンテナ内に**背景レイヤー**を追加（z-index・パネルより下・`pointer-events: none`）。**reduce motion** でアニメ停止。 |
| **FT-2** | **生産率**（または正規化した値）に連動して、スポーン頻度・粒数に**上限付き**で反映。 |
| **FT-3** | 見た目のチューニング（`AtomsOyatsuFish` の `size`・不透明度・落下速度・ランダム幅）。必要なら canvas へ移行。 |

---

## 6. 未決・リスク

| 項目 | メモ |
|------|------|
| **アセット** | **魚 SVG（`AtomsOyatsuFish`）で確定**。色は `randomOyatsuFishColors()`。canvas 移行時は再検討。 |
| **モバイル** | ヒーロー左は縦幅が限られる。粒の数は SP でさらに抑える。 |
| **パフォーマンス** | 常時アニメはバッテリーに効く。タブ非表示時は `document.visibilityState` で停止を検討。 |

---

## 7. 関連ファイル

- `app/components/organisms/OyatsuWorkshop.vue`
- `app/composables/useOyatsuIncremental.ts`（`treats` / `productionRate` / `totalTreatsProduced`）
- `app/components/atoms/OyatsuFish.vue`（`AtomsOyatsuFish`）
- `app/utils/oyatsu-fish-colors.ts`（`randomOyatsuFishColors`）

---

## 8. 実装前に決めておくこと（チェックリスト）

実装時の手戻りを減らすための**方針の置き場**。細部はプロトで調整してよい。

### 8.1 落下アニメの方式

| 選択肢 | 内容 |
|--------|------|
| **CSS のみ** | `@keyframes` で `transform: translate`（＋任意で `rotate`）。実装が速い。速度を生産率に連動させる場合は CSS 変数で `--duration` 等を渡す。 |
| **rAF** | `requestAnimationFrame` で座標更新。軌道や速度の動的変更がやりやすい。やや実装コスト増。 |

**初期方針（案）**: まず **CSS** で FT-1〜2 を通し、物足りなければ rAF へ。

### 8.2 魚の向き

- 元 SVG の向きと「下に落ちる」方向が一致しない場合、各インスタンスに **`transform: rotate(…deg)`** や **`scaleX(-1)`** を当てて、**進行方向に頭が向く**ようにする。
- 斜め落下にする場合は、移動ベクトルに合わせて回転角を揃える。

### 8.3 スポーン数・間隔（目安）

数値は実装後チューニングでよいが、**上限と単調増加の抑止**だけ決める。

| 項目 | 案 |
|------|------|
| **同時表示の上限** | デスクトップ **〜24**、モバイル **〜12**（§8.5 と合わせて調整）。 |
| **生産率との関係** | 例: `maxFish = min(上限, floor(k * log(1 + productionRate)))` のように **対数＋上限**。またはレート帯ごとのテーブル。 |
| **再スポーン間隔** | ランダムな `animation-delay` またはタイマーでばらつき。 |

### 8.4 レイヤー順（z-index）

| 要素 | 想定 |
|------|------|
| **魚・背景レイヤー** | 工房コンテナ内で**最下層**（例: `z-index: 0`）。`pointer-events: none`。 |
| **パネル UI** | 魚より上（例: `z-index: 1` 以上）。 |
| **3 択モーダル**（Teleport） | 既存どおり **モーダルが最前面**（例: `z-index: 200` 付近）。魚は**常にモーダルより下**。 |

### 8.5 モバイル

- ヒーロー左は縦幅が狭いため、**同時匹数**・**`size`（`AtomsOyatsuFish`）**・**不透明度**のいずれかまたは複合で、SP を一段控えめにする（メディアクエリまたは `matchMedia`）。

### 8.6 タブ非表示・バッテリー（任意）

| 方針 | 内容 |
|------|------|
| **推奨** | `document.visibilityState === 'hidden'` のとき、落下アニメを**一時停止**（CSS アニメ `animation-play-state: paused` またはクラスで非表示）。 |
| **後回し可** | 初回リリースでは未実装にし、FT-3 以降で足す。 |

実装時は上記を満たしつつ、`prefers-reduced-motion`（§前提）と矛盾しないようにする。
