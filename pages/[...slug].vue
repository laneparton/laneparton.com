<template>
  <main class="page">
    <div class="container">
      <ContentDoc v-slot="{ doc }">
        <h1>{{ doc.title }}</h1>
        <ContentRenderer :value="doc" />
      </ContentDoc>
    </div>
  </main>
</template>

<style lang="scss">
.page {
    padding: 50px 0;
}
</style>