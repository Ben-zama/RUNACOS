<template>
    <div id="contactPage">

      <section class="bento">
        <div v-for="item in contactPage" :key="item" class="box">
          <div class="top">
            <i :class="item.icon"></i>
          <h3>Give us a call</h3>
          </div>
          <div class="bottom">
            <a href=""></a>
          </div>
        </div>
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
  { text: '', icon: 'bi bi-phone', link: '' }
]
</script>

<style lang="scss">

</style>