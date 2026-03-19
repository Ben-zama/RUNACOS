import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export default defineNuxtPlugin(() => {
  const lenis = new Lenis({
    autoRaf: true,
  });

  // Optional: Provide it globally so you can call $lenis.scrollTo() if needed later
  return {
    provide: {
      lenis
    }
  };
});