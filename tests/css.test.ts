import fs from 'node:fs';
import path from 'node:path';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import * as sass from 'sass';
import { describe, expect, it } from 'vitest';

const ROOT_DIR = path.resolve(__dirname, '..');

describe('プロダクトのスタイルシートおよびCSS処理パイプライン', () => {
  describe('SassによるプロダクトSCSSのコンパイル', () => {
    it('共通SCSS（common.scss）がコンパイルされ、変数計算やmixin展開が正しく行われること', () => {
      const scssPath = path.join(ROOT_DIR, 'app/assets/scss/common.scss');
      const rawScss = fs.readFileSync(scssPath, 'utf-8');

      // nuxt.config.ts の vite.css.preprocessorOptions.scss.additionalData と同様の事前設定
      const input = `@use "sass:math";\n@use "sass:color";\n${rawScss}`;
      const result = sass.compileString(input);

      expect(result.css).toBeTruthy();
      // z-map mixin が連番の z-index に展開されていること
      expect(result.css).toContain('--z-init: 0;');
      expect(result.css).toContain('--z-cat: 1;');
      expect(result.css).toContain('--z-cat-layer: 2;');
      expect(result.css).toContain('--z-title: 3;');
      expect(result.css).toContain('--z-sns: 4;');
      expect(result.css).toContain('--z-scroll: 5;');
      expect(result.css).toContain('--z-language: 6;');

      // math.div(100, 1980) * 100 の計算結果（約 5.050505...vw）が含まれること
      expect(result.css).toMatch(/--padding-lr-pc: 5\.0505\d*vw;/);

      // color.adjust の計算結果が含まれること
      expect(result.css).toContain('--txt-color-link-hover: hsl(48.2926829268, 100%, 101.9607843137%);');

      // スタイル定義全体のスナップショット
      expect(result.css).toMatchSnapshot();
    });

    it('mixins.scss の line-height-crop mixin が正しく擬似要素と計算式を展開すること', () => {
      const scssPath = path.join(ROOT_DIR, 'app/assets/scss/mixins.scss');
      const rawScss = fs.readFileSync(scssPath, 'utf-8');

      const testScss = `
        ${rawScss}
        .test-crop {
          @include line-height-crop(1.5);
        }
      `;

      const result = sass.compileString(testScss);

      expect(result.css).toContain('.test-crop::before');
      expect(result.css).toContain('.test-crop::after');
      expect(result.css).toContain('margin-top: calc((1 - 1.5) * 0.5em);');
      expect(result.css).toContain('margin-bottom: calc((1 - 1.5) * 0.5em);');
      expect(result.css).toMatchSnapshot();
    });

    it('CatMascotコンポーネントのSCSSスタイルが正常にコンパイルされ、レスポンシブ計算やキーフレームが出力されること', () => {
      const sfcPath = path.join(ROOT_DIR, 'app/components/molecules/CatMascot.vue');
      const sfcContent = fs.readFileSync(sfcPath, 'utf-8');

      const styleMatch = sfcContent.match(/<style lang="scss"[^>]*>([\s\S]*?)<\/style>/);
      expect(styleMatch).not.toBeNull();

      const scssCode = styleMatch![1];
      // nuxt.config.ts と同様の additionalData を付与
      const input = `@use "sass:math";\n${scssCode}`;
      const result = sass.compileString(input);

      expect(result.css).toBeTruthy();
      // レスポンシブ mixin（cat-size）による各メディアクエリの出力検証
      expect(result.css).toContain('@media (width >= 1601px)');
      expect(result.css).toContain('@media (width <= 1600px)');
      expect(result.css).toContain('@media (width <= 768px)');
      expect(result.css).toContain('@media (width <= 568px)');

      // アニメーションキーフレームの出力検証
      expect(result.css).toContain('@keyframes cat-kunekune');
      expect(result.css).toContain('@keyframes cat-heart-float');
      expect(result.css).toContain('@keyframes cat-gloom-spin-float');

      // スナップショットで固定
      expect(result.css).toMatchSnapshot();
    });
  });

  describe('PostCSSおよびAutoprefixerによるCSSの変換', () => {
    it('プロダクトのCSSファイル（common.css, tailwind.css）がPostCSSで正常にパースできること', async () => {
      const commonCss = fs.readFileSync(path.join(ROOT_DIR, 'app/assets/css/common.css'), 'utf-8');
      const tailwindCss = fs.readFileSync(path.join(ROOT_DIR, 'app/assets/css/tailwind.css'), 'utf-8');

      const commonResult = await postcss().process(commonCss, { from: 'app/assets/css/common.css' });
      expect(commonResult.css).toBe(commonCss);

      const tailwindResult = await postcss().process(tailwindCss, { from: 'app/assets/css/tailwind.css' });
      expect(tailwindResult.css).toBe(tailwindCss);
    });

    it('Autoprefixerによりベンダープレフィックスが必要なプロパティに適切なプレフィックスが付与されること', async () => {
      // プロダクトで使われるベンダープレフィックス対象プロパティ（user-select, appearance など）
      const sampleCss = `
        .interactive-element {
          user-select: none;
          appearance: none;
        }
      `;

      const result = await postcss([
        autoprefixer({
          overrideBrowserslist: ['defaults', 'safari >= 12', 'ios >= 12'],
        }),
      ]).process(sampleCss, { from: undefined });

      expect(result.css).toContain('-webkit-user-select: none;');
      expect(result.css).toContain('user-select: none;');
      expect(result.css).toMatchSnapshot();
    });

    it('コンパイルされたプロダクトSCSS（CatMascot）にPostCSSとAutoprefixerを通したCSSが正しく出力されること', async () => {
      const sfcPath = path.join(ROOT_DIR, 'app/components/molecules/CatMascot.vue');
      const sfcContent = fs.readFileSync(sfcPath, 'utf-8');
      const styleMatch = sfcContent.match(/<style lang="scss"[^>]*>([\s\S]*?)<\/style>/);
      const scssCode = styleMatch![1];

      const sassResult = sass.compileString(`@use "sass:math";\n${scssCode}`);

      const processed = await postcss([
        autoprefixer({
          overrideBrowserslist: ['defaults', 'safari >= 12', 'ios >= 12'],
        }),
      ]).process(sassResult.css, { from: undefined });

      expect(processed.css).toBeTruthy();
      // -webkit- プレフィックスの付与確認（keyframes や transform 等）
      expect(processed.css).toContain('@keyframes cat-kunekune');
      expect(processed.css).toMatchSnapshot();
    });
  });
});
