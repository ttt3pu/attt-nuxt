/**
 * 落下魚 SVG 用のランダムな塗り・線色（HSL）。
 * 線色は塗りより少し暗くして輪郭が残るようにする。
 */
export function randomOyatsuFishColors(): { fill: string; stroke: string } {
  const h = Math.floor(Math.random() * 360);
  const s = 52 + Math.floor(Math.random() * 38);
  const l = 58 + Math.floor(Math.random() * 22);
  const fill = `hsl(${h} ${s}% ${l}%)`;
  const stroke = `hsl(${h} ${Math.min(100, s + 8)}% ${Math.max(12, l - 30)}%)`;
  return { fill, stroke };
}
