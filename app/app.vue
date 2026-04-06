<template>
  <div>
    <Head>
      <Meta name="color-scheme" content="only light" />
    </Head>
    <NuxtLayout />
    <div class="box">
      <ThemeToggle />
    </div>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

.box {
  display: none;
}
</style>