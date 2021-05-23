<template>
  <div class="the-posts">
    <v-heading-lv2>Posts</v-heading-lv2>

    <div
      role="list"
      class="the-posts__items"
    >
      <component
        :is="item.type === 'zenn' ? 'a' : 'nuxt-link'"
        v-for="(item, i) in _recentPosts"
        :key="i"
        role="listitem"
        class="item"
        v-bind="item.type === 'zenn'
          ? {
            href: item.link,
            rel: 'noopener',
            target: '_blank',
          }
          : {
            to: localePath({name: 'blog-slug', params: {slug: item.link}}),
          }
        "
      >
        <span class="item__meta">
          <span
            v-if="item.type === 'zenn'"
            class="item__icn"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path :d="$data.icnZenn" />
            </svg>
          </span>

          <icn-pencil
            class="item__icn pencil"
            v-else
            decorative
          />

          <time class="item__date" :datetime="item.date">{{ item.dateFormated }}</time>
        </span>

        <span class="item__heading">{{ item.title }}</span>
      </component>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import icnZenn from 'simple-icons/icons/zenn';
import icnPencil from 'vue-material-design-icons/Pencil.vue';
import dayjs from 'dayjs';

export default {
  components: {
    icnPencil,
  },
  data: function() {
    return {
      icnZenn: icnZenn.path,
    };
  },
  computed: mapState({
    _zennPosts: state => state.zennPosts,
    _blogPosts: state => state.blogPosts,
    _recentPosts: function() {
      const filteredZennPosts = this._zennPosts.items.map((row) => ({
        type: 'zenn',
        title: row.title,
        date: row.pubDate,
        dateFormated: dayjs(row.pubDate).format('YYYY.MM.DD'),
        link: row.link,
      }));

      const filteredBlogPosts = this._blogPosts.map((row) => ({
        type: 'blog',
        title: row.title,
        date: row.publishedAt,
        dateFormated: dayjs(row.publishedAt).format('YYYY.MM.DD'),
        link: row.id,
      }));

      const mergedPosts = [
        ...filteredZennPosts,
        ...filteredBlogPosts,
      ];

      // 日付順に並び替え
      mergedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

      // ブログの投稿を1個だけ一番前に持ってくる
      for (let i = 0; i < mergedPosts.length; i++) {
        if (mergedPosts[i].type === 'blog') {
          mergedPosts.unshift(mergedPosts[i]);
          mergedPosts.splice(i + 1, 1);
          break;
        }
      }

      return mergedPosts;
    },
  }),
}
</script>

<style lang="scss" scoped>
.item {
  $thisItem: &;

  display: block;

  &:hover {
    #{$thisItem}__heading {
      text-decoration: underline;
      text-decoration-color: var(--txt-color-link-hover);
      text-underline-offset: 4px;
    }
  }

  &:not(:last-child) {
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--gray-color);
  }

  &__meta {
    display: flex;
    align-items: baseline;
    color: var(--txt-color-white);
  }

  &__date {
    font-family: var(--font-family--en);
    font-size: 0.9rem;
  }

  &__icn {
    flex-shrink: 0;
    fill: currentColor;
    width: 20px;
    height: 20px;
    display: inline-block;
    margin-right: 8px;
    position: relative;
    top: 2px;

    /* stylelint-disable-next-line */
    ::v-deep svg {
      width: 100%;
      height: 100%;
    }
  }

  &__heading {
    font-family: var(--font-family--jp);
    width: 100%;
    color: var(--txt-color-link);
  }
}
</style>