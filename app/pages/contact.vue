<template>
  <div id="contactPage">
    <section class="bento">
      <div v-for="item in contactPage" :key="item" class="box">
        <div class="top">
          <i :class="item.icon"></i>
          <h3>{{ item.text }}</h3>
        </div>
        <div class="bottom">
          <a v-for="link in links" :key="link" :href="link.url">{{
            link.label
          }}</a>
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
      pageTitle: "Contact Us",
    },
  },
});

const contactPage = [
  {
    text: "Give us a call",
    icon: "bi bi-telephone",
    links: [{ url: "tel:+234 815 645 7041", label: "+234 815 645 7041" }, { url: "tel:+234 808 847 7531", label: "+234 808 847 7531" }],
  },
];
</script>

<style lang="scss">
</style>