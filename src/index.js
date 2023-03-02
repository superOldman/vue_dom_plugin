import Vue from 'vue'
import { Button, Select, Option, Popover } from 'element-ui';
// import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import toolbar from './toolDom/toolbar.vue'
// Vue.use(ElementUI)
Vue.use(Button)
Vue.use(Popover)
Vue.use(Select)
Vue.use(Option)

import heatmap from './toolDom/heatmap'



window.sa_jssdk_heatmap_render = function (se, data, type, url) {
  const _ = se._
  const sd = se

  Vue.prototype.$zd = heatmap.$zd = sd
  Vue.prototype.$zd.heatmap_version = '1.24.2'
  Vue.prototype.$ELEMENT = { size: 'small', zIndex: 999999 };
  _.querySelectorAll = function (val) {
    if (typeof val !== 'string') {
      sd.log('选择器错误', val);
      return [];
    }
    var sp = val.split(' ');
    if (sp.length === 1) {
      if (/^#\d+/.test(sp[0])) {
        val = '#' + _.strToUnicode(sp[0].slice(1));
      }
    } else {
      if (/^#\d+/.test(sp[0])) {
        sp[0] = '#' + _.strToUnicode(sp[0].slice(1));
        val = sp.join(' ');
      }
    }

    try {
      return document.querySelectorAll(val);
    } catch (e) {
      sd.log('错误', val);
      return [];
    }
  };
  heatmap.prepare(data, type, url, () => {
    const rootDiv = document.createElement('div')
    document.body.appendChild(rootDiv)
    new Vue({
      render: h => h(toolbar),
      // shadowRoot: shadowRootDom
    }).$mount(rootDiv)
  });
};

