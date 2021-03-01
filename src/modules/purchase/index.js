import App from "../../App.svelte";

const index = new App({
  target: document.body,
  props: {
    name: "purchase world",
  },
});

window.app = index;

export default index;
