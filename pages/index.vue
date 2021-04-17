<template>
  <div class="container">
    <!-- <h1 class="title">
      attt
    </h1> -->

    <div class="main-contents">
      <Skillmap />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  align-items: center;
}

.main-contents {
  max-width: 980px;
  margin: 0 auto;
}

.title {
  font-family: 'Poppins', sans-serif;
  display: block;
  font-weight: 400;
  font-size: 6rem;
  color: #e2f1ff;
}
</style>
