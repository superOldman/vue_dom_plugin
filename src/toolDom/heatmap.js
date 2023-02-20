const heatmap = {
  jsonp_timer: null,
  getServerData: {
    ajax: function (obj) {
      var _this = this;
      _.ajax({
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
          if (_.isObject(res) && res.error) {
            obj.error(res);
          } else {
            sd.log('AJAX 请求失败，转换为 JSONP 请求', res);
            _this.jsonp(obj);
          }
        },
        timeout: 5000
      });
    },
    start: function (config) {
      var method = window.localStorage.getItem('sensors_heatmap_method');
      if (method && method === 'jsonp') {
        this.jsonp(config);
      } else {
        this.ajax(config);
      }
    },
    jsonp: function (obj) {
      var success = function (data) {
        obj.success(data);
        window.localStorage.setItem('sensors_heatmap_method', 'jsonp');
      },
        error = _.isFunction(obj.error) ? obj.error : function () { },
        timeout = obj.timeout || 8000;
      var me = this;
      if (this.jsonp_timer !== null) {
        clearTimeout(this.jsonp_timer);
      }
      this.jsonp_timer = setTimeout(function () {
        error({
          error: '由于数据量较大，请求耗时较长，请继续等待'
        });
      }, timeout);

      _.jsonp({
        url: obj.url.jsonp,
        callbackName: 'saJSSDKHeatRender',
        success: function (data) {
          if (me.jsonp_timer !== null) {
            clearTimeout(me.jsonp_timer);
          }
          if (data && _.isObject(data) && data.is_success) {
            if (_.isObject(data.data)) {
              success(data.data);
            } else {
              error({
                error: 'JSONP 点击数据解析异常'
              });
              sd.log('解析数据异常', data);
            }
          } else {
            if (data && _.isObject(data) && data.is_success === false) {
              error({
                error: data.error_msg
              });
              sd.log('获取数据失败', data.error_msg);
            } else {
              error({
                error: 'JSONP 数据结构异常'
              });
              sd.log('获取数据异常', data);
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
            if (_.URL(location.href).protocol === 'https:' && _.URL(obj.url.jsonp).protocol === 'http:') {
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
    var a = parseInt(document.body.scrollHeight, 10);
    return isNaN(a) ? 0 : a;
  },
  getBrowserWidth: function () {
    var a = window.innerWidth || document.body.clientWidth;
    return isNaN(a) ? 0 : parseInt(a, 10);
  },
  getBrowserHeight: function () {
    var a = window.innerHeight || document.body.clientHeight;
    return isNaN(a) ? 0 : parseInt(a, 10);
  },
  sendIframeData: function () {
    var me = this;
    _.bindReady(function () {
      if (window && window.parent && window.parent.window && window !== window.parent.window) {
        var iframe_height = me.getScrollHeight();
        window.parent.window.postMessage({
          method: 'setHeight',
          params: {
            height: iframe_height > 600 ? iframe_height : 600
          }
        },
          sd.para.web_url
        );
        window.parent.window.postMessage({
          method: 'setUrl',
          params: {
            request_type: sessionStorage.getItem('sensors_heatmap_type') || '1',
            url: location.href
          }
        },
          sd.para.web_url
        );
      }
    });
  },
  prepare: function (data, type, url, fn) {
    var me = this;
    if (!document.querySelectorAll) {
      alert('请更新到最新版浏览器,建议用chrome或者firefox');
      return false;
    }

    if (sd.errorMsg) {
      heatmap_render.showErrorInfo(2, {
        error: sd.errorMsg
      });
    }

    var web_url = sd.para.web_url || null;
    if (!web_url && _.sessionStorage.isSupport() && sessionStorage.getItem && sessionStorage.getItem('sensors_heatmap_url')) {
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
        _.isObject(sd.para.heatmap) && sd.para.heatmap.loadTimeout ? sd.para.heatmap.loadTimeout : 2500
      );
    }

    // heatmap_render.setCssStyle();

    if (web_url) {
      sd.para.web_url = web_url;
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