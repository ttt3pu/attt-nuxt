import { siGoogle, siZenn } from 'simple-icons';
import { describe, expect, it } from 'vitest';
import { experiencedItems, primaryItems, secondaryItems, studyingItems } from '~/constants/skills';
import { snsItems } from '~/constants/sns';

const HEX_COLOR_REGEX = /^[0-9a-fA-F]{6}$/;

describe('プロダクトで利用するブランドおよび技術スタックアイコンの描画データ', () => {
  describe('サイト共通のSNSリンク表示', () => {
    it('SNSアイコン（GitHub, Zenn, X）のSVGパスが空でなく正しく定義されていること', () => {
      expect(snsItems).toHaveLength(3);
      for (const item of snsItems) {
        expect(item.title).toBeTruthy();
        expect(typeof item.path).toBe('string');
        expect(item.path.trim().length).toBeGreaterThan(0);
        expect(item.href).toMatch(/^https?:\/\//);
      }
    });
  });

  describe('記事一覧のZenn記事バッジ表示', () => {
    it('ZennアイコンのSVGパスが空でなく正しく定義されていること', () => {
      expect(typeof siZenn.path).toBe('string');
      expect(siZenn.path.trim().length).toBeGreaterThan(0);
    });
  });

  describe('管理者ログインボタンのブランドアイコン表示', () => {
    it('GoogleアイコンのカラーコードおよびSVGパスが正しく定義されていること', () => {
      expect(siGoogle.hex).toMatch(HEX_COLOR_REGEX);
      expect(typeof siGoogle.path).toBe('string');
      expect(siGoogle.path.trim().length).toBeGreaterThan(0);
    });
  });

  describe('スキルマップの技術アイコン表示', () => {
    const allSkillItems = [...primaryItems, ...secondaryItems, ...studyingItems, ...experiencedItems];

    it('アイコンデータが指定された全スキルのカラーコードとSVGパスが正しく定義されていること', () => {
      const itemsWithIcon = allSkillItems.filter((item) => item.icnData);
      expect(itemsWithIcon.length).toBeGreaterThan(0);

      for (const item of itemsWithIcon) {
        const icon = item.icnData!;
        expect(icon.hex).toMatch(HEX_COLOR_REGEX);
        expect(typeof icon.path).toBe('string');
        expect(icon.path.trim().length).toBeGreaterThan(0);
      }
    });

    it('全アイコンの表示データ（名前、カラーコード、SVGパス）がスナップショットと一致すること', () => {
      const snapshotData = {
        sns: snsItems.map((item) => ({
          title: item.title,
          path: item.path,
        })),
        login: {
          title: siGoogle.title,
          hex: siGoogle.hex,
          path: siGoogle.path,
        },
        postBadge: {
          title: siZenn.title,
          path: siZenn.path,
        },
        skills: allSkillItems.map((item) => ({
          heading: item.heading,
          hex: item.icnData?.hex ?? null,
          path: item.icnData?.path ?? null,
        })),
      };

      expect(snapshotData).toMatchSnapshot();
    });
  });
});
