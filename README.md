# vue_dom_plugin


网站挂件新思路

yarn

yarn serve


触发某些条件时加载js 可以获得该插件
```
  var g = document.createElement('script');
  g.async = 'async';
  g.setAttribute('charset', 'UTF-8');
  g.src = 'http://localhost:7777/core.js';
  g.type = 'text/javascript';
  document.body.appendChild(g)
```