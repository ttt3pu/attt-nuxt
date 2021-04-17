<template>
  <div class="container">
    <h1 class="title">
      attt
    </h1>

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
  display: flex;
}

.main-contents {
  padding: 100px 25px;
  flex-grow: 1;
  max-width: 980px;
  margin-right: 0;
  margin-left: auto;
}

.title {
  position: fixed;
  top: 0;
  left: 0;
  width: 50%;
  padding: 75px 100px;
  font-family: 'Poppins', sans-serif;
  display: block;
  font-weight: 400;
  font-size: 10rem;
  line-height: 1;
  color: #e2f1ff;
}
</style>
