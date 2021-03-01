import App from "../../App.svelte";

const index = new App({
  target: document.body,
  props: {
    name: "sale world",
  },
});

window.app = index;

export default index;
