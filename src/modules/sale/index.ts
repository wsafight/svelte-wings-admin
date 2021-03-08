import App from "./App.svelte";
import dom from 'dompurify'

console.log(dom)

const Sale = new App({
  target: document.body,
});

export default Sale;
