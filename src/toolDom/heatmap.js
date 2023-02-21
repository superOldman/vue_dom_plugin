const heatmap = {
  $zd: null,
  jsonp_timer: null,
  getServerData: {
    ajax: function (obj) {
      let me = this;
      heatmap.$zd._.ajax({
        url: obj.url.ajax,
        type: 'POST',
        cors: true,
        header: {
          cors: 'true'
        },
        success: function (data) {
          obj.success(data);
        },
        error: function (res) {
          if (heatmap.$zd._.isObject(res) && res.error) {
            obj.error(res);
          } else {
            heatmap.$zd.log('AJAX 请求失败，转换为 JSONP 请求', res);
            me.jsonp(obj);
          }
        },
        timeout: 5000
      });
    },
    start: function (config) {
      let method = window.localStorage.getItem('sensors_heatmap_method');
      if (method && method === 'jsonp') {
        this.jsonp(config);
      } else {
        this.ajax(config);
      }
    },
    jsonp: function (obj) {
      let success = function (data) {
        obj.success(data);
        window.localStorage.setItem('sensors_heatmap_method', 'jsonp');
      },
        error = heatmap.$zd._.isFunction(obj.error) ? obj.error : function () { },
        timeout = obj.timeout || 8000;
      let me = this;
      if (this.jsonp_timer !== null) {
        clearTimeout(this.jsonp_timer);
      }
      this.jsonp_timer = setTimeout(function () {
        error({
          error: '由于数据量较大，请求耗时较长，请继续等待'
        });
      }, timeout);

      heatmap.$zd._.jsonp({
        url: obj.url.jsonp,
        callbackName: 'saJSSDKHeatRender',
        success: function (data) {
          if (me.jsonp_timer !== null) {
            clearTimeout(me.jsonp_timer);
          }
          if (data && heatmap.$zd._.isObject(data) && data.is_success) {
            if (heatmap.$zd._.isObject(data.data)) {
              success(data.data);
            } else {
              error({
                error: 'JSONP 点击数据解析异常'
              });
              heatmap.$zd.log('解析数据异常', data);
            }
          } else {
            if (data && heatmap.$zd._.isObject(data) && data.is_success === false) {
              error({
                error: data.error_msg
              });
              heatmap.$zd.log('获取数据失败', data.error_msg);
            } else {
              error({
                error: 'JSONP 数据结构异常'
              });
              heatmap.$zd.log('获取数据异常', data);
            }
          }
        },
        error: function (err) {
          if (me.jsonp_timer !== null) {
            clearTimeout(me.jsonp_timer);
          }
          if (err === 'timeout') {
            error({
              error: 'JSONP 请求超时，请尝试刷新页面'
            });
          } else {
            if (heatmap.$zd._.URL(location.href).protocol === 'https:' && heatmap.$zd._.URL(obj.url.jsonp).protocol === 'http:') {
              error({
                error: '该页面协议为 https ，请使用 https 的神策后台查看热力图'
              });
            } else {
              error({
                error: '<div>后台 JSONP 地址不通，可能原因如下：</div><div style="font-size:15px;margin-top:10px;text-align:left;display:inline-block"><div>1. 检查神策分析版本是否低于 v2.2.0，如果低于此版本请联系值班同学升级版本</div><div style="margin-top:5px">2. 神策分析后台不允许访问，请贵司研发参考当前页面的控制台报错，去对应的后台配置解决</div></div>'
              });
            }
          }
        }
      });
    }
  },
  getScrollHeight: function () {
    let a = parseInt(document.body.scrollHeight, 10);
    return isNaN(a) ? 0 : a;
  },
  getBrowserWidth: function () {
    let a = window.innerWidth || document.body.clientWidth;
    return isNaN(a) ? 0 : parseInt(a, 10);
  },
  getBrowserHeight: function () {
    let a = window.innerHeight || document.body.clientHeight;
    return isNaN(a) ? 0 : parseInt(a, 10);
  },
  sendIframeData: function () {
    let me = this;
    heatmap.$zd._.bindReady(function () {
      if (window && window.parent && window.parent.window && window !== window.parent.window) {
        let iframe_height = me.getScrollHeight();
        window.parent.window.postMessage({
          method: 'setHeight',
          params: {
            height: iframe_height > 600 ? iframe_height : 600
          }
        },
          heatmap.$zd.para.web_url
        );
        window.parent.window.postMessage({
          method: 'setUrl',
          params: {
            request_type: sessionStorage.getItem('sensors_heatmap_type') || '1',
            url: location.href
          }
        },
          heatmap.$zd.para.web_url
        );
      }
    });
  },
  prepare: function (data, type, url, fn) {
    let me = this;
    if (!document.querySelectorAll) {
      alert('请更新到最新版浏览器,建议用chrome或者firefox');
      return false;
    }

    if (heatmap.$zd.errorMsg) {
      heatmap_render.showErrorInfo(2, {
        error: heatmap.$zd.errorMsg
      });
    }

    let web_url = heatmap.$zd.para.web_url || null;
    if (!web_url && heatmap.$zd._.sessionStorage.isSupport() && sessionStorage.getItem && sessionStorage.getItem('sensors_heatmap_url')) {
      web_url = sessionStorage.getItem('sensors_heatmap_url') || null;
    }

    function hasGetWebUrl() {
      setTimeout(
        function () {
          // TODO js加载完毕
          // heatmap_render.setToolbar(data, type, url);
          console.log(data);
          // self.setHeatState(data, type, url, true)
          me.sendIframeData();
          fn && fn()
        },
        heatmap.$zd._.isObject(heatmap.$zd.para.heatmap) && heatmap.$zd.para.heatmap.loadTimeout ? heatmap.$zd.para.heatmap.loadTimeout : 2500
      );
    }

    // heatmap_render.setCssStyle();

    if (web_url) {
      heatmap.$zd.para.web_url = web_url;
      sessionStorage.setItem('sensors_heatmap_url', web_url);
      hasGetWebUrl();
    } else {
      heatmap_render.showErrorInfo(2, {
        error: '获取web_url超时'
      });
      return false;
    }
  }
}

export default heatmap