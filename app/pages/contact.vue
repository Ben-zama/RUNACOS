<template>
  <div id="contactPage">
    <section class="bento">
      <div v-for="item in contactPage" :key="item" class="box">
        <div class="top">
          <i :class="item.icon"></i>
          <h3>{{ item.text }}</h3>
        </div>

        <div class="bottom">
          <a v-for="link in item.links" :key="link" :href="link.url">{{
            link.label
          }}</a>
        </div>
      </div>
    </section>

    <section class="form-map">
      <form @submit.prevent>
        <h3>Send a mail</h3>
        <div class="span">
          <div class="input-control">
            <label for="">Name</label>
            <input type="text" required />
          </div>

          <div class="input-control">
            <label for="">email</label>
            <input type="eamil" required />
          </div>
        </div>

        <div class="textarea-control">
          <label for="">Message</label>
          <textarea required />
        </div>
        <button type="submit">
          <ctaButton buttonLabel="Send message" link="" />
        </button>
      </form>
      <div class="map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1715.1309670264927!2d4.4566802135541845!3d7.681308157424518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10382bf4cfc23a5d%3A0xdc6c4b4c1b582ddf!2sRedeemer&#39;s%20University%20Ede!5e0!3m2!1sen!2sng!4v1774012336503!5m2!1sen!2sng"
          width="600"
          height="450"
          style="border: 0"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import gsap from "gsap";

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
    links: [
      { url: "tel:+234 815 645 7041", label: "+234 815 645 7041" },
      { url: "tel:+234 808 847 7531", label: "+234 808 847 7531" },
    ],
  },
  {
    text: "Send an email",
    icon: "bi bi-envelope",
    links: [{ url: "mailto:Runacosssocial@gmail.com", label: "Runacosssocial@gmail.com" }],
  },
  {
    text: "Pay a visit",
    icon: "bi bi-geo-alt",
    links: [{ url: "https://maps.app.goo.gl/eG3mAH9n9Kn7Jmuj6", label: "P.M.B 230, Ede, Osun State, Nigeria" }],
  },
  {
    text: "Connect on Linkedin",
    icon: "bi bi-linkedin",
    links: [
      { url: "#", label: "Runacos" },
    ],
  },
  {
    text: "Follow on X",
    icon: "bi bi-twitter-x",
    links: [{ url: "#", label: "@Runacos" }],
  },
  {
    text: "Follow on Instagram",
    icon: "bi bi-instagram",
    links: [{ url: "#", label: "@Runacos" }],
  },
];

onMounted(() => {
  gsap.fromTo(
    ".bento .box",
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
    }
  );

  // 4. Form and Map Animation
  gsap.fromTo(
    [".form-map form", ".form-map .map"],
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
    }
  );
});
</script>

<style lang="scss">
#contactPage {
  padding: 50px 25px;
  display: flex;
  flex-direction: column;
  gap: 50px;

  .bento {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: 250px;
    gap: 25px;

    .box {
      padding: 25px;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 15px;
      background: linear-gradient(
        145deg,
        $translucent-alternate-color 0%,
        $translucent-secondary-color 100%
      );
      backdrop-filter: blur(10px);
      border: 1px solid $translucent-secondary-color-50;
      border-radius: 8px;

      .top {
        i {
          font-size: $text-xl;
          color: $accent-color;
        }

        h3 {
          margin-top: 15px;
          font-size: $text-xl;
        }
      }

      .bottom {
        display: flex;
        flex-direction: column;

        a {
          transition: 0.3s;

          &:hover {
            color: $accent-color;
          }
        }
      }
    }
  }

  /* Form & map */
  .form-map {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 25px;

    form {
      /* Matching Bento Box Styles */
      padding: 25px;
      display: flex;
      flex-direction: column;
      align-items: start;
      gap: 20px;
      background: linear-gradient(
        145deg,
        $translucent-alternate-color 0%,
        $translucent-secondary-color 100%
      );
      backdrop-filter: blur(10px);
      border: 1px solid $translucent-secondary-color-50;
      border-radius: 8px;

      h3 {
        font-size: $text-xl;
      }

      .span {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .input-control,
      .textarea-control {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 8px;

        label {
          text-transform: capitalize;
          font-weight: 500;
        }

        input,
        textarea {
          width: 100%;
          padding: 12px 15px;
          border-radius: 6px;
          border: 1px solid $translucent-secondary-color-50;
          background: rgba(255, 255, 255, 0.05);
          color: inherit;
          outline: none;
          font-family: inherit;
          transition: border-color 0.3s ease;

          &:focus {
            border-color: $accent-color;
          }
        }

        textarea {
          resize: vertical;
          min-height: 120px;
        }
      }
    }

    .map {
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid $translucent-secondary-color-50; /* Match border on map too */
      display: flex;

      iframe {
        width: 100%;
        min-height: 300px;
      }
    }
  }

  @include respond-to(600px, 1279px) {
    padding: 50px;

    .bento {
      grid-template-columns: repeat(2, 1fr);
    }

    .form-map {
      form {
        .span {
          flex-direction: row;
        }
      }
    }
  }

  @include respond-to($min: 1280px) {
    padding: 100px;

    .bento {
      grid-template-columns: repeat(18, 1fr);

      > :nth-child(1),
      > :nth-child(2) {
        grid-column: span 7;
      }

      > :nth-child(3) {
        grid-column: span 4;
      }
      > :nth-child(4),
      > :nth-child(5),
      > :nth-child(6) {
        grid-column: span 6;
      }
    }

    .form-map {
      flex-direction: row;
      align-items: stretch;

      form {
        flex: 1;
      }
      .map {
        flex: 1;
        iframe {
          height: 100%; /* Make map fill the height of the form */
        }
      }
    }
  }
}
</style>