<template>
    <div id="contactPage">

      <section class="bento">
        <div v-for="item in contactPage" :key="item" class="box"></div>
      </section>

    </div>
</template>

<script setup>
definePageMeta({
  layout: {
    props: {
      showPageTitle: true,
      pageTitle: 'Contact Us'
    },
  },
})

const contactPage = [
  { text: '', icon: 'bi bi-', link: '' }
]
</script>

<style lang="scss">

</style>