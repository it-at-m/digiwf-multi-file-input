import Vue, { VNode } from 'vue';
import Dev from './serve.vue';
import vuetify from './plugins/vuetify'
import multifilePlugin from "@/entry.esm";
import Vue2PdfEmbed from 'vue-pdf-embed/dist/vue2-pdf-embed';

Vue.component('Vue2PdfEmbed', Vue2PdfEmbed);

Vue.use(multifilePlugin);

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: (h): VNode => h(Dev),
}).$mount('#app');
