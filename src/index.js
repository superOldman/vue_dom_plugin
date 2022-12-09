import Vue from 'vue'
// import { Button, Select } from 'element-ui';
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import testDom from './toolDom/testDom.vue'
// Vue.use(ElementUI)
// Vue.use(Button)
const rootDiv = document.createElement('div') 
document.body.appendChild(rootDiv)
export default new Vue({
  render: h => h(testDom),
  // shadowRoot: shadowRootDom
}).$mount(rootDiv)