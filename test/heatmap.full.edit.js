(function () {


  var QRCode;

  var QRCode$1 = QRCode;

  (function () {
    var sd = null;
    var _ = null;

    var heatmap_render = {
      originalHeatData: null,
      ajaxHeatData: null,
      heatDataElement: [],
      heatMapList: [],
      heatMode: 1,
      // 1
      getCurrentUrl: function () {
        var href = _.urlParse(location.href);
        var obj = {};

        obj['sa-request-url'] = sessionStorage.getItem('sensors_heatmap_url');
        obj['sa-request-url'] = obj['sa-request-url'] ? encodeURIComponent(obj['sa-request-url']) : '';
        obj['sa-request-id'] = sessionStorage.getItem('sensors_heatmap_id');
        obj['sa-request-type'] = sessionStorage.getItem('sensors_heatmap_type') || '1';
        $.each(obj, function (a, b) {
          if (!b) {
            delete obj[a];
          }
        });
        href.addQueryString(obj);
        return href.getUrl();
      },
      // 1
      setHeatState: function (data, type, url, isFirst) {
        if (isFirst) {
          if (type === '1') {
            this.setClickMap(data, url);
          } else if (type === '2') {
            this.setScrollMap(data, url);
          } else if (type === '3') {
            this.setNoticeMap(data, url);
          }
        } else {
          var href = sd._.urlParse(location.href);
          if (!data) {
            return false;
          }
          if (!type) {
            type = 1;
          }
          var obj = {
            'sa-request-id': data,
            'sa-request-type': type,
            'sa-request-url': sessionStorage && sessionStorage.getItem ? sessionStorage.getItem('sensors_heatmap_url') || '' : ''
          };
          try {
            var windowNameParam = {};
            if (_.isJSONString(window.name)) {
              windowNameParam = JSON.parse(window.name);
              window.name = JSON.stringify(_.extend(windowNameParam, obj));
            } else if (window.name == '') {
              window.name = JSON.stringify(obj);
            }
          } catch (e) { }
          if (this.requestType == 1) {
            href.addQueryString(obj);
            location.href = href.getUrl();
          } else {
            sessionStorage && sessionStorage.setItem && sessionStorage.setItem('sensors_heatmap_type', type);
            location.reload();
          }
        }
      },
      setDropDown: function (request_id, type, url) {
        type = type || '1';
        var version = type === '1' ? '1' : '0';
        var relation = {
          1: '点击图',
          2: '触达率图',
          3: '注意力图'
        };
        var versionObj = {
          1: '方案一',
          2: '方案二'
        };
        var offScrollAndResizeEventHandle = null;

        var me = this;

        function addScrollAndResizeEvent() {
          var timer = null;
          var clearFlag = false;
          $(window).on('scroll.v2', function () {
            if (!clearFlag) {
              $('#heatMapContainer').html('');
              clearFlag = true;
            }
            clearTimeout(timer);
            timer = setTimeout(function () {
              heatmap_render.refreshHeatData(heatmap_render.heatMode);
              clearFlag = false;
            }, sd.para.heatmap.renderRefreshTime || 1000);
          });
          $(window).on('resize.v2', function () {
            if (!clearFlag) {
              $('#heatMapContainer').html('');
              clearFlag = true;
            }
            clearTimeout(timer);
            timer = setTimeout(function () {
              heatmap_render.refreshHeatData(heatmap_render.heatMode);
              clearFlag = false;
            }, sd.para.heatmap.renderRefreshTime || 1000);
          });
          return function () {
            $(window).off('scroll.v2');
            $(window).off('resize.v2');
            if (timer) {
              clearTimeout(timer);
              timer = null;
              clearFlag = false;
            }
          };
        }

        function dropdwon(obj) {
          var state = obj.init();
          var name = obj.name;
          var out = obj.id;
          var button = $(out + '>div');
          var dropmenu = $(out + '>ul');
          var buttonContent = button.find('span:first');

          button.on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if ($(out + '>ul:visible').is(':visible')) {
              dropmenu.hide();
            } else {
              $('.sa-sdk-heatmap-toolbar-selectmap ul').css('display', 'none');
              dropmenu.css('display', 'block');

              $(document).on('click.sa-jssdk-dropdown', function () {
                dropmenu.hide();
                $(document).off('click.sa-jssdk-dropdown');
              });
            }
          });

          function changeState(text, isFirst) {
            state = text;
            obj.click(text, isFirst);
            if (name == 'type') {
              buttonContent.text(relation[state]);
            } else if (name == 'version') {
              buttonContent.text(versionObj[state]);
            }
          }

          dropmenu.on('click', 'li', function () {
            var text = $(this).attr('data-state');
            if (state !== text) {
              changeState(text);
            }
          });
          if (obj.init) {
            changeState(state, true);
          }
          if (name === 'version') {
            $(document).on('keypress', function (event) {
              if (offScrollAndResizeEventHandle) {
                offScrollAndResizeEventHandle();
                offScrollAndResizeEventHandle = null;
              }
              if (event.keyCode == 114) {
                heatmap_render.refreshHeatData(heatmap_render.heatMode);
              }
              if (event.keyCode == 122) {
                $('#chooseVersion').find('span:first').text('方案一');
                heatmap_render.refreshHeatData(1);
                state = '1';
              }
              if (event.keyCode == 120) {
                $('#chooseVersion').find('span:first').text('方案二');
                heatmap_render.refreshHeatData(2);
                offScrollAndResizeEventHandle = addScrollAndResizeEvent();
                state = '2';
              }
            });
          }
        }

        dropdwon({
          init: function () {
            return type;
          },
          id: '#chooseType',
          name: 'type',
          click: function (state, isFirst) {
            me.setHeatState(request_id, state, url, isFirst);
            $('#sa_sdk_heatmap_toolbar_filter').toggle(state == '1');
          }
        });

        if (type === '1') {
          dropdwon({
            init: function () {
              $('#chooseVersion').css('display', 'block');
              return version;
            },
            name: 'version',
            id: '#chooseVersion',
            click: function (state, isFirst) {
              if (!isFirst) {
                if (offScrollAndResizeEventHandle) {
                  offScrollAndResizeEventHandle();
                  offScrollAndResizeEventHandle = null;
                }
                if (state === '1') {
                  heatmap_render.refreshHeatData(1);
                } else if (state === '2') {
                  heatmap_render.refreshHeatData(2);
                  offScrollAndResizeEventHandle = addScrollAndResizeEvent();
                }
              }
            }
          });
        }
      },
      setScrollMap: function (id, url) {
        var me = this;
        if (typeof id === 'string' && sd.para.web_url) {
          var urlParse = new _.urlParse(sd.para.web_url);
          urlParse._values.Path = '/api/scroll_heat_map/report/' + id;

          var urlParse2 = new _.urlParse(sd.para.web_url);
          urlParse2._values.Path = '/api/scroll_heat_map/report/' + id;
          urlParse2.addQueryString({
            pathUrl: encodeURIComponent(url)
          });
          var urlParse2Value = urlParse2.getUrl();

          var jsonpUrlParse = new _.urlParse(sd.para.web_url);
          jsonpUrlParse._values.Path = '/api/v2/sa/scroll_heat_maps/report/jsonp/' + id;

          var jsonpUrlParse2 = new _.urlParse(sd.para.web_url);
          jsonpUrlParse2._values.Path = '/api/v2/sa/scroll_heat_maps/report/jsonp/' + id;
          jsonpUrlParse2.addQueryString({
            pathUrl: encodeURIComponent(url)
          });
          var jsonpUrlParse2Value = jsonpUrlParse2.getUrl();
          // TODO
          // saJSSDKHeatRender({
          //   "error_msg": "OK", "is_success": true,
          //   "data": {
          //     "result": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
          //       , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          //       1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          //       1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
          //       , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          //     "total": 1,
          //     "report_update_time": "2023-02-07 11:42:33.119",
          //     "data_update_time": "2023-02-07 11:42:08.000",
          //     "data_sufficient_update_time": "2023-02-07 11:42:08.000",
          //     "truncated": false,
          //     "sampling_factor": 64
          //   }
          // })



          var suc = function (data) {
            if (typeof data !== 'object' || !_.isArray(data.result) || data.result.length === 0) {
              me.showErrorInfo(2, {
                error: '未取到数据'
              });
              return false;
            }

            data.detail = data.result || [];

            if (!data.total || data.total === 0 || typeof data.total !== 'number' || data.total < 2) {
              me.showErrorInfo(2, {
                error: '有效的触发用户数少于2人'
              });
              return false;
            }
            data.origin_total = data.total;
            data.total = data.result[0];

            data.percent = {};

            var middlePercent = {
              setData: function (x, y, z) {
                x = String(x);
                this.data[x] = this.data[x] || {};
                this.data[x][y] = z;
              },
              data: {},
              getData: function () {
                var x = {};
                var arr = [];
                var temp = null;
                for (var i in this.data) {
                  arr = [];
                  for (var k in this.data[i]) {
                    arr.push([k, this.data[i][k]]);
                  }
                  this.data[i] = arr;
                  temp = this.data[i].sort(function (a, b) {
                    return Math.abs(a[0] - Number(i)) - Math.abs(b[0] - Number(i));
                  })[0];
                  x[temp[0]] = temp[1];
                }
                return x;
              }
            };
            _.each(data.result, function (v, k) {
              if (v / data.total == 1) {
                data.percent['100'] = (k + 1) * 10;
              } else if (v / data.total > 0.7 && v / data.total < 0.8) {
                middlePercent.setData(75, parseInt((v / data.total) * 100), (k + 1) * 10);
              } else if (v / data.total > 0.45 && v / data.total < 0.55) {
                middlePercent.setData(50, parseInt((v / data.total) * 100), (k + 1) * 10);
              } else if (v / data.total > 0.2 && v / data.total < 0.3) {
                middlePercent.setData(25, parseInt((v / data.total) * 100), (k + 1) * 10);
              }
            });

            _.extend(data.percent, middlePercent.getData());

            var percent_tpl = `<div style="border-bottom: 1px dashed #4C4C4D;height:1px;width:100%;position: absolute;top:{{top}}px;">
            <span style="font-size:12px;position:absolute;padding:0 12px;top:-24px;height:26px;line-height: 26px;left:0;background:#000;color:#eee;border-radius: 2px;">
            {{percent}}</span></div>`;
            for (var i in data.percent) {
              $(document.body).append($(percent_tpl.replace('{{top}}', data.percent[i] - 2).replace('{{percent}}', i + '%')));
            }

            var over_tpl = `<div style="z-index:99999;border-bottom: 1px solid #272727;height:1px;
            width:100%;position: absolute;top:{{top}}px;text-align:center;">
            <span style="font-size:12px;height:26px;line-height: 26px;background:#000;color:#eee;border-radius: 2px;left:50%;margin-left:-65px;
            position: absolute;top:-13px;padding: 0 5px;">{{percent}}的用户浏览到这里</span></div>`;
            var over_ele = null;

            function showLineDetail(e) {
              var y = parseInt((e.pageY + 15) / 10);
              var i = 0;
              if (y <= data.detail.length && data.detail[y]) {
                i = Math.floor((data.detail[y] / data.total) * 100 * 100) / 100;
              } else {
                i = 0;
              }
              if (over_ele) {
                over_ele.remove();
              }
              over_ele = $(over_tpl.replace('{{top}}', e.pageY + 15).replace('{{percent}}', i + '%'));
              $(document.body).append(over_ele);
            }

            $(document).on('mousemove', _.throttle(showLineDetail, 150));
          };
          var err = function (res) {
            if (_.isObject(res) && res.error) {
              me.showErrorInfo(2, {
                error: res.error
              });
            } else {
              me.showErrorInfo(2, {
                error: '服务异常'
              });
            }
            sessionStorage.removeItem('sensors_heatmap_id');
          };
          if (url) {
            this.requestType = 3;
          } else {
            this.requestType = 1;
          }
          heatmap.getServerData.start({
            url: {
              ajax: this.requestType === 3 ? urlParse2Value : urlParse.getUrl(),
              jsonp: this.requestType === 3 ? jsonpUrlParse2Value : jsonpUrlParse.getUrl()
            },
            success: suc,
            error: err
          });
        } else {
          sd.log('缺少web_url');
        }
      },
      setNoticeMap: function () { },
      setContainer: function (el) {
        if (!el) {
          return false;
        }
        el.classList.add('saContainer');
        if (el && el.children) {
          var arr = el.children;
          for (var i = 0; i < arr.length; i++) {
            this.setContainer(arr[i]);
          }
        }
      },
      setToolbar: function (requrest_id, type, url) {
        var me = this;
        var div = document.createElement('div');
        div.setAttribute('style', 'height:50px !important;z-index:9999999;background:#272727;width:100%;position:fixed;top:0;left:0; font-size:14px;color:#EFF2F7;margin:0;clear: both;');
        div.innerHTML =
          '<div style="height:39px;line-height:39px;padding:3px 15px 9px"><div class="sa-sdk-heatmap-toolbar-selectmap"  id="chooseType" style="position:relative;width:70px;float:left" title="选择查看类型"><div style="cursor:pointer"><span>点击图</span> <svg style="position:absolute;top:9px" width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="icon" transform="translate(-199.000000, -18.000000)" fill="#99A9BF"><polygon id="Triangle-1-Copy-29" transform="translate(209.000000, 28.000000) scale(1, -1) translate(-209.000000, -28.000000) " points="209 26 213 30 205 30"></polygon></g></g></svg></div><ul style="display:none;list-style:none;margin:0;padding:0;width:100px"><li data-state="1">点击图</li><li data-state="2">触达率图</li></ul></div><div class="sa-sdk-heatmap-toolbar-selectmap" id="chooseVersion" style="display:none;position:relative;width:70px;float:left" title="切换点击图方案"><div style="cursor:pointer"><span>方案一</span> <svg style="position:absolute;top:9px" width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="icon" transform="translate(-199.000000, -18.000000)" fill="#99A9BF"><polygon id="Triangle-1-Copy-29" transform="translate(209.000000, 28.000000) scale(1, -1) translate(-209.000000, -28.000000) " points="209 26 213 30 205 30"></polygon></g></g></svg></div><ul style="display:none;list-style:none;margin:0;padding:0;width:100px"><li data-state="1">方案一</li><li data-state="2">方案二</li></ul></div><div id="sa_sdk_heatmap_toolbar_close" style="float:right;position:relative;width:30px;height:100%;cursor:pointer" title="收起打开"><svg style="position:absolute;top:9px;right:0" width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-129.000000, -260.000000)" fill-rule="nonzero" fill="#99A9BF"><polygon points="132.110192 274.35347 130.5 272.842901 138.860144 265 147.23 272.842902 145.619784 274.35347 138.864999 268.016603"></polygon></g></g></svg></div><div style="float:right;padding:0 10px;width:1px;color:#99A9BF">|</div><div id="sa_sdk_heatmap_toolbar_refresh" style="float:right;position:relative;cursor:pointer;width:30px;height:100%" title="刷新数据"><svg style="position:absolute;top:9px;left:5px" width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g><g><path d="M18.1201298,5.45190941 L15.7071603,6.65839414 C14.3331082,3.91029003 11.3336531,2.11731966 7.94879319,2.56975143 C4.59744671,3.02218321 1.91636953,5.78704405 1.54772141,9.13839053 C1.04501944,13.6627083 4.58068998,17.5 9.00446733,17.5 C12.1882465,17.5 14.8693237,15.5227056 15.9585113,12.7243313 L14.098514,12.1043322 L14.0817572,12.1043322 C13.1098668,14.433518 10.5796002,15.9416239 7.7979826,15.3551383 C5.73690451,14.9194632 4.06123127,13.24379 3.62555623,11.1659552 C2.88826001,7.61352789 5.56933719,4.48001893 9.00446733,4.48001893 C11.1660858,4.48001893 13.0093264,5.72001713 13.9141899,7.52974422 L11.4006801,8.80325589 C11.3336531,8.83676935 11.3336531,8.95406648 11.4174368,8.97082321 L16.4612132,10.6297397 C16.5114834,10.6464964 16.5617536,10.612983 16.5785104,10.5627128 L18.2374269,5.51893634 C18.2876971,5.48542287 18.2039134,5.41839594 18.1201298,5.45190941 L18.1201298,5.45190941 Z" fill="#99A9BF"></path><rect x="0" y="0" width="20" height="20"></rect></g></g></g></svg></div><div style="float:right;padding:0 10px;width:1px;color:#99A9BF">|</div><div id="sa_sdk_heatmap_toolbar_share" style="float:right;position:relative;width:30px;height:100%;cursor:pointer" title="打开分享"><svg style="position:absolute;top:11px; left: 5px;" width="14px" height="15px" viewBox="0 0 14 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-42.000000, -62.000000)"><g transform="translate(39.000000, 60.000000)"><rect x="0" y="0" width="20" height="20"></rect><path d="M12.9177778,12.725 L7.76833333,9.72777778 C7.80444444,9.56166667 7.83333333,9.39555556 7.83333333,9.22222222 C7.83333333,9.04888889 7.80444444,8.88277778 7.76833333,8.71666667 L12.86,5.74833333 C13.25,6.10944444 13.7627778,6.33333333 14.3333333,6.33333333 C15.5322222,6.33333333 16.5,5.36555556 16.5,4.16666667 C16.5,2.96777778 15.5322222,2 14.3333333,2 C13.1344444,2 12.1666667,2.96777778 12.1666667,4.16666667 C12.1666667,4.34 12.1955556,4.50611111 12.2316667,4.67222222 L7.14,7.64055556 C6.75,7.27944444 6.23722222,7.05555556 5.66666667,7.05555556 C4.46777778,7.05555556 3.5,8.02333333 3.5,9.22222222 C3.5,10.4211111 4.46777778,11.3888889 5.66666667,11.3888889 C6.23722222,11.3888889 6.75,11.165 7.14,10.8038889 L12.2822222,13.8083333 C12.2461111,13.96 12.2244444,14.1188889 12.2244444,14.2777778 C12.2244444,15.4405556 13.1705556,16.3866667 14.3333333,16.3866667 C15.4961111,16.3866667 16.4422222,15.4405556 16.4422222,14.2777778 C16.4422222,13.115 15.4961111,12.1688889 14.3333333,12.1688889 C13.7844444,12.1688889 13.2933333,12.3855556 12.9177778,12.725 Z" id="Shape" fill="#99A9BF"></path></g></g></g></svg></div><div style="float:right;padding:0 10px;width:1px;color:#99A9BF">|</div><div id="sa_sdk_heatmap_toolbar_filter" style="float:right;position:relative;cursor:pointer;width:30px;height:100%;" title="筛选"><svg style="position: absolute; top: 11px; left: 5px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="17px" height="15px" viewBox="0 0 17 15" version="1.1"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="操作栏" transform="translate(-1068.000000, -341.000000)" fill="#99A9BF" fill-rule="nonzero"><g id="screen" transform="translate(1068.000000, 341.000000)"><polygon id="路径" points="9.13824444 13.2863778 9.13824444 6.65411111 12.5159778 2.08801111 4.52081111 2.08801111 7.8378 6.56684444 7.8378 12.6447111 6.23534444 11.8541778 6.23534444 7.20851111 0.8 0.4 16.2 0.4 10.7646556 7.2299 10.7646556 14.0888889 9.13824444 13.2863778"/></g></g></g></svg></div></div>';
        document.body.appendChild(div);
        this.setContainer(div);

        this.setDropDown(requrest_id, type, url);

        var toolbar_corner = $('<div id="sa_sdk_heatmap_toolbar_corner" style="cursor:pointer;display:none;position: fixed;z-index:999999;top:0;right:10px;padding:3px 8px 0;background:#000;"></div>');
        toolbar_corner.html(
          '<svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-360.000000, -119.000000)" fill-rule="nonzero" fill="#C0CCDA"><polygon transform="translate(370.365000, 129.117652) scale(1, -1) translate(-370.365000, -129.117652) " points="364.4177 133.235303 363 131.905316 370.360724 125 377.73 131.905317 376.312279 133.235302 370.364999 127.655981"></polygon></g></g></svg>'
        );
        $(document.body).append(toolbar_corner);
        this.setContainer(toolbar_corner[0]);

        $(div).on('click', '#sa_sdk_heatmap_toolbar_refresh', function () {
          if (type === '1' || type === null) {
            me.refreshHeatData(heatmap_render.heatMode);
            me.showErrorInfo(5);
          } else {
            location.reload();
          }
        });

        var current_url = this.getCurrentUrl();
        var getQrHtml = function () {
          var qrHtml = $(
            '<div style="z-index:999999;width:260px;height:260px;position:fixed;right:2px;top:55px;background:#FFF;box-shadow:0 2px 9px 3px rgba(168,173,178,.39);border-radius:3px;"><div style="height:44px;line-height:44px;border-bottom:1px solid #E9F0F7;text-align:center;color:#475669;font-size:14px;position:relative;">分享链接<span style="position:absolute;top:4px;color:#99A9BF;cursor:pointer;right:4px"><svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g><g transform="translate(-1.000000, -1.000000)"><polygon fill="#99A9BF" transform="translate(11.106602, 11.106602) rotate(-45.000000) translate(-11.106602, -11.106602) " points="12.3566017 12.3566017 12.3566017 18.6066017 9.85660172 18.6066017 9.85660172 12.3566017 3.60660172 12.3566017 3.60660172 9.85660172 9.85660172 9.85660172 9.85660172 3.60660172 12.3566017 3.60660172 12.3566017 9.85660172 18.6066017 9.85660172 18.6066017 12.3566017"></polygon><rect x="1" y="1" width="20" height="20"></rect></g></g></g></svg></span></div><div style="width:128px;height:128px;margin-left:66px;margin-top:16px"></div><div style="margin:20px"><input style="font-size:14px;outline:none;color:#475669;width:92%;border:1px solid #D3DCE6;border-radius:3px;height:32px;line-height:32px;padding:0 10px;" type="text" value=""></div></div>'
          );
          $(document.body).append(qrHtml);
          var qrCodeEle = qrHtml.find('div:eq(1)')[0];
          qrHtml.find('input').val(current_url);
          qrHtml.find('span').on('click', function () {
            qrHtml.css('display', 'none');
          });
          new QRCode$1(qrCodeEle, {
            text: current_url,
            width: 128,
            height: 128,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode$1.CorrectLevel.L
          });

          qrHtml.css('top', $(div).height() + 1);
          getQrHtml = function () {
            return qrHtml;
          };
          return qrHtml;
        };

        $(div).on('click', '#sa_sdk_heatmap_toolbar_share', function () {
          var qrEle = getQrHtml();
          qrEle.css('display', 'block');
          me.setContainer(qrEle[0]);

          setTimeout(function () {
            qrEle.find('input').focus();
            qrEle.find('input').select();
          }, 1);

        });

        var filterFlyout = '<div id="sa_sdk_heatmap_filterFlyout" style="z-index: 999999; position: fixed; right: 2px; top: 51px; width:432.5px; height: 171px; background:rgba(255,255,255,1);box-shadow:0px 2px 9px 3px; rgba(10,10,10,0.39); border-radius:3px;"><form>';
        filterFlyout += '<div style="height: 45px; text-align: center; line-height: 45px; font-size:14px; font-family:PingFangSC-Medium,PingFang SC; font-weight:500; color:rgba(32,45,61,1); border-bottom: 1px solid #E9F0F7;">';
        filterFlyout += '筛选展示元素';
        filterFlyout += '</div>';
        filterFlyout += '<div style="height: 78px; border-bottom: 1px solid #E9F0F7;">';
        filterFlyout +=
          '<p style="margin: 0; line-height: 78px; padding-left: 20px; font-size:14px; font-family:PingFangSC-Regular,PingFang SC; font-weight:400; color:rgba(71,86,105,1);">点击数 <select name="filter_type"><option value="gt" selected>&gt;</option><option value="lt">&lt;</option><option value="between">在区间</option></select><input type="text" name="filterValue"><span class="filter_between_span" style="display:none;"><input type="text" name="filterValueStart" style="margin-right: 5px;">至<input type="text" name="filterValueEnd" style="margin-left: 5px;"></span> 的元素</p>';
        filterFlyout += '</div>';
        filterFlyout += '<div style="height: 47px; overflow: hidden; padding: 10px 15px; box-sizing: border-box;">';
        filterFlyout +=
          '<div class="sa-sdk-heatmap-filterflyout-submitbtn" style="display: inline-block; float: right; width:56px; height:28px; background:rgba(4,203,148,1); border-radius:3px; font-size:13px; font-family:PingFangSC-Medium,PingFang SC; font-weight:500; color:rgba(255,255,255,1); text-align: center; line-height: 28px; cursor: pointer;">确定</div><a class="sa-sdk-heatmap-filterflyout-cancelbtn" href="#" style="float: right; display: inline-block; line-height: 28px; margin-right: 6px; font-size:13px; font-family:PingFangSC-Regular,PingFang SC; font-weight:400; color:rgba(71,86,105,1); text-decoration: none;">取消</a>';
        filterFlyout += '</div>';
        filterFlyout += '</form></div>';

        $(div).on('click', '#sa_sdk_heatmap_toolbar_filter', function (e) {
          e.stopPropagation();
          if ($('#sa_sdk_heatmap_filterFlyout').length) {
            $('#sa_sdk_heatmap_filterFlyout').toggle();
          } else {
            $(document.body).append(filterFlyout);
            me.setContainer($('#sa_sdk_heatmap_filterFlyout')[0]);
          }
        });

        $(document.body).on('change', '#sa_sdk_heatmap_filterFlyout select[name="filter_type"]', function () {
          var type = $(this).val();
          var control1 = $('#sa_sdk_heatmap_filterFlyout input[name="filterValue"]');
          var control2 = $('#sa_sdk_heatmap_filterFlyout .filter_between_span');
          if (type === 'between') {
            control1.hide();
            control2.show();
          } else {
            control1.show();
            control2.hide();
          }
        });

        $(document.body).on('click', '#sa_sdk_heatmap_filterFlyout .sa-sdk-heatmap-filterflyout-cancelbtn', function () {
          $('#sa_sdk_heatmap_filterFlyout').hide();
          $('#sa_sdk_heatmap_filterFlyout form')[0].reset();
          var control1 = $('#sa_sdk_heatmap_filterFlyout input[name="filterValue"]');
          var control2 = $('#sa_sdk_heatmap_filterFlyout .filter_between_span');
          control1.show();
          control2.hide();
          var copyData = $.extend(true, {}, me.originalHeatData);
          me.ajaxHeatData = copyData;
          refreshClickMap();
          return false;
        });

        $(document.body).on('click', '#sa_sdk_heatmap_filterFlyout .sa-sdk-heatmap-filterflyout-submitbtn', function () {
          var type = $('#sa_sdk_heatmap_filterFlyout select[name="filter_type"]').val();
          var filterInput = $('#sa_sdk_heatmap_filterFlyout input[name="filterValue"]');
          var startInput = $('#sa_sdk_heatmap_filterFlyout input[name="filterValueStart"]');
          var endInput = $('#sa_sdk_heatmap_filterFlyout input[name="filterValueEnd"]');
          var isInRange = function (x) {
            if (!$.isNumeric(x)) return false;
            var numberX = Number(x);
            return Math.floor(numberX) === numberX && numberX >= 0;
          };
          var errMsg1 = '输入的数值不合法，请输入大于等于 0 的整数';
          var errMsg2 = '区间左侧的数字大于右侧的数字，无法筛选，请修改数值';
          if (type === 'between') {
            if (!isInRange(startInput.val())) {
              me.showErrorInfo(2, {
                error: errMsg1
              });
              return;
            }
            if (!isInRange(endInput.val())) {
              me.showErrorInfo(2, {
                error: errMsg1
              });
              return;
            }
            if (Number(startInput.val()) > Number(endInput.val())) {
              me.showErrorInfo(2, {
                error: errMsg2
              });
              return;
            }
            filterClickMap(type, startInput.val(), endInput.val());
          } else {
            if (!isInRange(filterInput.val())) {
              me.showErrorInfo(2, {
                error: errMsg1
              });
              return;
            }
            filterClickMap(type, filterInput.val());
          }
        });

        function filterClickMap(type, val1, val2) {
          var inRange = function (x) {
            var n1 = Number(val1),
              n2 = Number(val2);
            if (type === 'gt') {
              return x > n1;
            } else if (type === 'lt') {
              return x < n1;
            } else {
              return x > Math.min(n1, n2) && x < Math.max(n1, n2);
            }
          };
          var copyData = $.extend(true, {}, me.processOriginalHeatData2());
          var origArr = copyData.rows;
          var newArr = [];
          for (var i = 0, len = origArr.length; i < len; i++) {
            if (inRange(origArr[i].values[0][0])) {
              newArr.push(origArr[i]);
            }
          }
          copyData.rows = newArr;
          me.ajaxHeatData = copyData;
          refreshClickMap();
        }

        function refreshClickMap() {
          var state = '' + heatmap_render.heatMode;
          if (state === '1') {
            heatmap_render.refreshHeatData(1);
          } else if (state === '2') {
            heatmap_render.refreshHeatData(2);
          }
        }

        $('#sa_sdk_heatmap_toolbar_filter')
          .on('mouseenter', function () {
            $('#sa_sdk_heatmap_toolbar_filter g[fill^="#"]').attr('fill', '#559FF0');
          })
          .on('mouseleave', function () {
            $('#sa_sdk_heatmap_toolbar_filter g[fill^="#"]').attr('fill', '#99A9BF');
          });

        $('#sa_sdk_heatmap_toolbar_share')
          .on('mouseenter', function () {
            $('#sa_sdk_heatmap_toolbar_share path').attr('fill', '#559FF0');
          })
          .on('mouseleave', function () {
            $('#sa_sdk_heatmap_toolbar_share path').attr('fill', '#99A9BF');
          });

        $('#sa_sdk_heatmap_toolbar_refresh')
          .on('mouseenter', function () {
            $('#sa_sdk_heatmap_toolbar_refresh path').attr('fill', '#559FF0');
          })
          .on('mouseleave', function () {
            $('#sa_sdk_heatmap_toolbar_refresh path').attr('fill', '#99A9BF');
          });

        $('#sa_sdk_heatmap_toolbar_close')
          .on('mouseenter', function () {
            $('#sa_sdk_heatmap_toolbar_close g').eq(1).attr('fill', '#559FF0');
          })
          .on('mouseleave', function () {
            $('#sa_sdk_heatmap_toolbar_close g').eq(1).attr('fill', '#99A9BF');
          });

        $('#sa_sdk_heatmap_toolbar_corner')
          .on('mouseenter', function () {
            $('#sa_sdk_heatmap_toolbar_corner g').eq(1).attr('fill', '#559FF0');
          })
          .on('mouseleave', function () {
            $('#sa_sdk_heatmap_toolbar_corner g').eq(1).attr('fill', '#99A9BF');
          });

        $(div).on('click', '#sa_sdk_heatmap_toolbar_close', function () {
          $(div).hide(0);
          $('#sa_sdk_heatmap_toolbar_corner').show(0);
        });

        $('#sa_sdk_heatmap_toolbar_corner').on('click', function () {
          $('#sa_sdk_heatmap_toolbar_corner').hide(0);
          $(div).show(0);
        });

      },
      showErrorInfo: function (error_type, error_msg) {
        var div = document.createElement('div');
        div.setAttribute('style', 'background:#e55b41;border:none;border-radius:4px;color:#fff;font-size:18px;left:50%;margin-left:-300px;padding:12px;position: fixed;top:60px;text-align: center;width:600px;z-index:999999;');

        if (error_type === 1) {
          div.innerHTML = '当前页面在所选时间段内暂时没有点击数据';
        } else if (error_type === 2) {
          if (error_msg.error) {
            div.innerHTML = error_msg.error;
          } else {
            div.innerHTML = '请求数据异常';
          }
        } else if (error_type === 3) {
          div.innerHTML = '当前页面在所选时间段内暂时没有点击数据';
        } else if (error_type === 4) {
          if (error_msg.error) {
            div.innerHTML = error_msg.error;
          } else {
            div.innerHTML = '请求数据异常';
          }
        } else if (error_type === 5) {
          div.style.backgroundColor = '#13CE66';
          div.innerHTML = '刷新数据成功';
        }

        document.body.appendChild(div);
        setTimeout(function () {
          document.body.removeChild(div);
        }, 5000);

      },
      requestType: 1,
      getHeatType: function () { },
      setClickMap: function (id, url) {
        var me = this;
        if (typeof id === 'string' && sd.para.web_url) {
          var urlParse = new _.urlParse(sd.para.web_url);
          urlParse._values.Path = '/api/heat_map/report/' + id;

          var urlParse2 = new _.urlParse(sd.para.web_url);
          urlParse2._values.Path = '/api/heat_map/report/path/' + id;
          var urlParse2Value = urlParse2.getUrl();
          if (urlParse2Value.indexOf('?') === -1) {
            urlParse2Value = urlParse2Value + '?pathUrl=' + encodeURIComponent(url);
          } else {
            urlParse2Value = urlParse2Value + '&pathUrl=' + encodeURIComponent(url);
          }

          var jsonpUrlParse = new _.urlParse(sd.para.web_url);
          jsonpUrlParse._values.Path = '/api/v2/sa/heat_maps/report/jsonp/' + id;

          var jsonpUrlParse2 = new _.urlParse(sd.para.web_url);
          jsonpUrlParse2._values.Path = '/api/v2/sa/heat_maps/report/path/jsonp/' + id;
          var jsonpUrlParse2Value = jsonpUrlParse2.getUrl();
          if (jsonpUrlParse2Value.indexOf('?') === -1) {
            jsonpUrlParse2Value = jsonpUrlParse2Value + '?pathUrl=' + encodeURIComponent(url);
          } else {
            jsonpUrlParse2Value = jsonpUrlParse2Value + '&pathUrl=' + encodeURIComponent(url);
          }

          $('body').append('<div id="heatMapContainer"></div>');

          if (url) {
            this.requestType = 3;
          } else {
            this.requestType = 1;
          }

          heatmap.getServerData.start({
            url: {
              ajax: this.requestType === 3 ? urlParse2Value : urlParse.getUrl(),
              jsonp: this.requestType === 3 ? jsonpUrlParse2Value : jsonpUrlParse.getUrl()
            },
            success: function (data) {
              // TODO data:
              // saJSSDKHeatRender({
              //   "error_msg": "OK", "is_success": true,
              //   "data": {
              //     "heat_map_id": "af6db35f-25dd-45ae-9737-bc9b0c5f3e29",
              //     "by_fields": ["event.$WebClick.$element_selector"],
              //     "rows": [
              //       {
              //         "top_values": ["Facebook"], "values": [[2]],
              //         "by_values": ["#login-page \u003e div:nth-of-type(1) \u003e form:nth-of-type(1) \u003e div:nth-of-type(1) \u003e div:nth-of-type(2) \u003e button:nth-of-type(1)"]
              //       },
              //       { "top_values": [""], "values": [[19]], "by_values": ["#password"] },
              //       { "top_values": [""], "values": [[37]], "by_values": ["#userId"] }
              //     ],
              //     "page_view": 68,
              //     "report_update_time": "2023-02-06 17:14:21.759",
              //     "data_update_time": "2023-02-06 17:10:43.000",
              //     "data_sufficient_update_time": "2023-02-06 11:44:52.000",
              //     "truncated": false, 
              //     "sampling_factor": 64
              //   }
              // })

              // heat_map_id: 'af6db35f-25dd-45ae-9737-bc9b0c5f3e29', // 后端生成的标识 id
              //   by_fields:  ["event.$WebClick.$element_selector"], // 未用到
              //   "page_view": 68, //  取 "event": "$pageview", 次数
              //     rows: [
              //       {
              //         "top_values": ["Facebook"], //Facebook ：$element_content
              //         "values": [[2]],  // 次数
              //         "by_values": ['#password'] // #password: $element_selector
              //       }
              //     ]

              // 处理 热力框部分数据
              me.originalHeatData = me.processOriginalHeatData(data);
              // 加载热力框dom
              me.bindEffect();
              // 计算热力数据
              me.calculateHeatData(data);
            },
            error: function (res) {
              me.showErrorInfo(2, res);
              sessionStorage.removeItem('sensors_heatmap_id');
            }
          });
        } else {
          sd.log('缺少web_url');
        }
      },
      // 1
      processOriginalHeatData: function (data) {
        var result = $.extend(true, {}, data);
        $.each(result.rows, function (index, value) {
          try {
            var ele = _.querySelectorAll(value.by_values[0]);
            if (ele.length) {
              value.ele = ele[0];
            }
          } catch (e) {
            sd.log('元素类名错误！', e);
          }
        });
        return result;
      },
      // 1

      processOriginalHeatData2: function () {
        var data = this.originalHeatData;
        var result = $.extend(true, {}, data);
        var tmp = [];
        var eletmp = [];
        var copyRows = data.rows.slice();
        $.each(copyRows, function (index, value) {
          if (!value.ele) return true;
          var idx = $.inArray(value.ele, eletmp);
          if (idx === -1) {
            eletmp.push(value.ele);
            tmp.push($.extend(true, {}, value));
          } else {
            tmp[idx].values[0][0] += value.values[0][0];
          }
        });
        result.rows = tmp;
        return result;
      },

      //  1 计算热力属性
      calculateHeatData: function (data) {
        data = $.extend(true, {}, data);
        this.ajaxHeatData = data;
        var me = this;

        if (!_.isObject(data) || !_.isArray(data.rows) || !_.isObject(data.rows[0])) {
          me.showErrorInfo(me.requestType);
          return false;
        }
        if (!data.page_view || Number(data.page_view) === 0) {
          me.showErrorInfo(2, {
            error: '点击率计算失败，没有开启autoTrack!'
          });
          return false;
        }
        var pv = parseInt(data.page_view, 10);
        var heat_map_id = data.heat_map_id;
        data = data.rows;

        var dataPageTotal = 0;
        var templeUsableData = [];
        var usableData = [];
        var usableElem = [];

        _.each(data, function (obj) {
          var elem = null;
          if (obj.by_values[0] && (elem = _.querySelectorAll(obj.by_values[0])[0])) {
            templeUsableData.push(obj);
            usableElem.push(elem);
          }
        });

        if (templeUsableData.length > 1) {
          for (var i = 0; i < usableElem.length; i++) {
            for (var j = i + 1; j < usableElem.length; j++) {
              if (usableElem[i] === usableElem[j]) {
                templeUsableData[j].values[0][0] += templeUsableData[i].values[0][0];
                templeUsableData[i].values[0][0] = 0;
                templeUsableData[i].by_values = '';
                break;
              }
            }
          }
        }

        _.each(templeUsableData, function (obj) {
          if (obj.by_values[0] && _.querySelectorAll(obj.by_values[0])[0]) {
            usableData.push(obj);
          }
        });

        usableData = _.filter(usableData, function (a) {
          return a;
        });

        if (usableData.length === 0) {
          me.showErrorInfo(me.requestType);
        }

        data = usableData;

        _.each(data, function (obj) {
          obj.value_fix = obj.values[0][0];
          dataPageTotal += obj.value_fix;
        });

        me.data_render = data;

        _.each(data, function (obj, key) {
          if (obj.by_values[0]) {
            obj.data_page_percent = Number((obj.value_fix / dataPageTotal) * 100).toFixed(2) + '%';

            obj.data_click_percent = Number((obj.value_fix / pv) * 100).toFixed(2) + '%';

            obj.data_click = Number(obj.value_fix / pv);
            obj.data_page = Number(obj.value_fix / dataPageTotal);

            var urlParse = new _.urlParse(sd.para.web_url);
            urlParse._values.Path = '/web-click/users';
            if (me.requestType === 3) {
              obj.data_user_link = urlParse.getUrl() + '#heat_map_id=' + heat_map_id + '&detail=true&element_selector=' + encodeURIComponent(obj.by_values[0]) + '&page_url=' + encodeURIComponent(location.href);
            } else {
              obj.data_user_link = urlParse.getUrl() + '#heat_map_id=' + heat_map_id + '&detail=true&element_selector=' + encodeURIComponent(obj.by_values[0]);
            }
            if (String(obj.top_values[0]) === 'null') {
              obj.data_top_value = '没有值';
            } else {
              obj.data_top_value = String(obj.top_values[0]);
            }

            var selector = _.querySelectorAll(obj.by_values[0]);
            if (typeof selector === 'object' && selector.length > 0) {
              setTimeout(function () {
                me.renderHeatData(selector, obj, key);
              }, 100);
            }
          }
        });
      },
      heatData: function (data) {
        var heat = [0.005, 0.01, 0.025, 0.05, 0.1, 0.5];
        for (var i = 0; i < heat.length; i++) {
          if (data < heat[i]) {
            return i;
          }
        }
        return 6;
      },
      heatDataTitle: function (data) {
        return '点击次数 ' + data.value_fix + '\r\n点击概率 ' + data.data_click_percent + '\r\n点击占比 ' + data.data_page_percent + '\r\n历史数据 ' + String(data.top_values[0]).slice(0, 30);
      },
      renderHeatData: function (selector, data, key) {
        var dom = _.ry(selector[0]);
        var wrap = null;

        var tagName = dom.ele.tagName.toLowerCase();
        if (this.heatMode == 1) {
          if (tagName === 'input' || tagName === 'textarea' || tagName === 'img' || tagName === 'svg') {
            dom.attr('data-heat-place', String(key));
            var width = $(selector[0]).width();
            wrap = dom.wrap('span');
            if (typeof width === 'number') {
              wrap.ele.style.width = width;
            }
            wrap.ele.style.display = 'inline-block';
            if (tagName === 'svg') {
              wrap.ele.style.minWidth = '300px';
            }
          } else {
            wrap = dom;
          }
          this.heatDataElement.push(dom);
          $(wrap.ele).data('clickdata', $.extend(true, {}, data));
          wrap.attr('data-heat-place', String(key)).attr('sa-click-area', this.heatData(data.data_click)).attr('data-click', data.data_click_percent);
          if (wrap.getStyle('display') === 'inline') {
            selector[0].style.display = 'inline-block';
            $(selector[0]).attr('sa-heatmap-inlineBlock', '');
          }
        } else if (this.heatMode === 2) {
          var eleWidth, eleHeight, eleLeft, eleTop;
          if ($(selector[0]).is(':visible') && String($(selector[0]).css('opacity')) !== '0') {
            if (tagName === 'a') {
              if ($(selector[0]).css('display') === 'inline') {
                if (selector[0].children[0]) {
                  eleWidth = $(selector[0].children[0]).outerWidth();
                  eleHeight = $(selector[0].children[0]).outerHeight();
                  eleLeft = $(selector[0]).children()[0].getBoundingClientRect().left;
                  eleTop = $(selector[0]).children()[0].getBoundingClientRect().top;
                } else {
                  $(selector[0]).css('display', 'inline-block');
                  eleWidth = $(selector[0]).outerWidth();
                  eleHeight = $(selector[0]).outerHeight();
                  eleLeft = $(selector[0]).offset().left - $(window).scrollLeft();
                  eleTop = $(selector[0]).offset().top - $(window).scrollTop();
                  $(selector[0]).css('display', 'inline');
                }
              } else {
                eleWidth = $(selector[0]).outerWidth();
                eleHeight = $(selector[0]).outerHeight();
                eleLeft = $(selector[0]).offset().left - $(window).scrollLeft();
                eleTop = $(selector[0]).offset().top - $(window).scrollTop();
              }
            } else {
              eleWidth = $(selector[0]).outerWidth();
              eleHeight = $(selector[0]).outerHeight();
              eleLeft = $(selector[0]).offset().left - $(window).scrollLeft();
              eleTop = $(selector[0]).offset().top - $(window).scrollTop();
            }

            $(dom.ele).attr('sa-click-area-v2', '');
            $(dom.ele).data('clickdata', $.extend(true, {}, data));
            if (eleHeight && eleWidth) {
              var mapDivObj = {
                width: eleWidth,
                height: eleHeight,
                left: eleLeft,
                top: eleTop,
                position: 'fixed',
                'z-index': 999998,
                'pointer-events': 'none'
              };

              var heatMapDiv = $('<div sa-click-area></div>');
              heatMapDiv.css(mapDivObj);
              heatMapDiv.attr('data-click', data.data_click_percent);
              heatMapDiv.attr('sa-click-area', this.heatData(data.data_click));
              heatMapDiv.attr('selector', selector[0]);
              heatMapDiv.attr('data-heat-place', String(key));

              $('#heatMapContainer').append(heatMapDiv);
              this.setContainer($('#heatMapContainer')[0]);
            }
          }
        }
      },
      refreshHeatData: function (targetVersion) {
        if (this.heatMode == 1) {
          _.each(this.heatDataElement, function (ele) {
            var tagName = ele.ele.tagName.toLowerCase();
            if (tagName === 'input' || tagName === 'textarea' || tagName === 'img' || tagName === 'svg') {
              var parent = ele.parent();
              if (parent && parent.ele.tagName.toLowerCase() === 'span' && !_.isUndefined($(parent.ele).attr('sa-click-area'))) {
                $(ele.ele).unwrap();
              }
            } else {
              $(ele.ele).removeAttr('sa-click-area');
            }
          });
          $('[sa-heatmap-inlineBlock]').css('display', 'inline');
          $('[sa-heatmap-inlineBlock]').removeAttr('sa-heatmap-inlineBlock');
          this.heatDataElement = [];
        }
        if (this.heatMode == 2) {
          this.heatDataElement = [];
          $('[sa-click-area-v2]').removeAttr('sa-click-area-v2');
          $('#heatMapContainer').html('');
        }

        this.heatMode = targetVersion;
        this.calculateHeatData(this.ajaxHeatData);
      },
      refreshScrollData: function () { },
      is_fix_state: null,
      showEffectBox: function (e, div, isShow) {
        if (this.is_fix_state === 'fixslidedown') {
          div.style.position = 'fixed';
          div.style.left = 'auto';
          div.style.right = 0;
          div.style.top = 0;

          if (isShow) {
            div.className = 'sa-heat-box-effect-2017314';
          }
        } else if (this.is_fix_state === 'notfix') {
          var width = heatmap.getBrowserWidth();
          var height = heatmap.getBrowserHeight();

          var target = e.target;
          var offset = _.ry(target).offset();
          var size = _.ry(target).getSize();
          var x = offset.left + size.width + 2;
          var y = offset.top + 1;

          if (width < x + 220) {
            x = offset.left - 220;
            if (offset.left < 220) {
              x = e.pageX;
            }
          }

          var boxHeight = 267;
          var target_top = target.getBoundingClientRect().top;
          if (target_top < 0) {
            y = e.pageY;
          }
          if (height && target_top + boxHeight > height) {
            y = offset.top + size.height - boxHeight;
          }

          div.style.position = 'absolute';
          div.style.left = x + 'px';
          div.style.top = y + 'px';
        }

        if (div.style.display !== 'block') {
          div.style.display = 'block';
        }
      },
      // 1
      bindEffect: function () {
        var me = this;
        var target_is_on_float = false;

        var str =
          `<div style="padding: 8px;"><div style="color: #CACACA">当前内容：</div><div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{data_current_content}}</div></div><div style="background: #444; height:1px;"></div><div style="padding: 8px;">
          <table style="width:100%;color:#fff;font-size:13px;background:#333;border:1px solid #333;"><tr><td>点击次数: </td><td style="text-align:right;">{{value_fix}}次</td></tr><tr><td style="cursor:pointer;" title="点击次数/当前页面的浏览次数"><span style="float:left;">点击率</span><span style="float:left;margin-left:3px;"><svg width="12px" height="12px" viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-1803.000000, -158.000000)" fill="#979797"><g transform="translate(1737.000000, 84.000000)"><path d="M71,74 C68.24,74 66,76.24 66,79 C66,81.76 68.24,84 71,84 C73.76,84 76,81.76 76,79 C76,76.24 73.76,74 71,74 L71,74 Z M71.5,82.5 L70.5,82.5 L70.5,81.5 L71.5,81.5 L71.5,82.5 L71.5,82.5 Z M72.535,78.625 L72.085,79.085 C71.725,79.45 71.5,79.75 71.5,80.5 L70.5,80.5 L70.5,80.25 C70.5,79.7 70.725,79.2 71.085,78.835 L71.705,78.205 C71.89,78.025 72,77.775 72,77.5 C72,76.95 71.55,76.5 71,76.5 C70.45,76.5 70,76.95 70,77.5 L69,77.5 C69,76.395 69.895,75.5 71,75.5 C72.105,75.5 73,76.395 73,77.5 C73,77.94 72.82,78.34 72.535,78.625 L72.535,78.625 Z" id="prompt"></path></g></g></g></svg></span></td><td style="text-align:right;">{{data_click_percent}}</td></tr><tr><td style="cursor:pointer;" title="点击次数/当前页面的点击总次数"><span style="float:left;">点击占比</span> <span style="float:left;margin-left:3px;"><svg width="12px" height="12px" viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-1803.000000, -158.000000)" fill="#979797"><g transform="translate(1737.000000, 84.000000)"><path d="M71,74 C68.24,74 66,76.24 66,79 C66,81.76 68.24,84 71,84 C73.76,84 76,81.76 76,79 C76,76.24 73.76,74 71,74 L71,74 Z M71.5,82.5 L70.5,82.5 L70.5,81.5 L71.5,81.5 L71.5,82.5 L71.5,82.5 Z M72.535,78.625 L72.085,79.085 C71.725,79.45 71.5,79.75 71.5,80.5 L70.5,80.5 L70.5,80.25 C70.5,79.7 70.725,79.2 71.085,78.835 L71.705,78.205 C71.89,78.025 72,77.775 72,77.5 C72,76.95 71.55,76.5 71,76.5 C70.45,76.5 70,76.95 70,77.5 L69,77.5 C69,76.395 69.895,75.5 71,75.5 C72.105,75.5 73,76.395 73,77.5 C73,77.94 72.82,78.34 72.535,78.625 L72.535,78.625 Z" id="prompt"></path></g></g></g></svg></span></td><td style="text-align:right;">{{data_page_percent}}</td></tr></table>
          </div><div style="background: #444; height:1px;"></div><div style="padding: 8px;"><div style="color: #CACACA;">历史内容：</div><div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{data_top_value}}</div></div><div style="background: #444; height:1px;"></div><div style="padding: 6px 8px;"><a style="color:#2a90e2;text-decoration: none;" href="{{data_user_link}}" target="_blank">查看用户列表</a ></div>`;

        var newStr = '';
        var isShow = true;
        var div = document.createElement('div');
        document.body.appendChild(div);
        div.setAttribute('style', 'border-radius:3px;display:none;border:1px solid #000;position: fixed; right:0; top:0; background: #333;line-height:24px;font-size:13px;width:220px;height:265px;color: #fff;font-family: "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;box-shadow: 0 2px 4px rgba(0,0,0,0.24);z-index:999999;');

        div.innerHTML = '<div id="sa_heat_float_right_box_content" style="clear:both;"></div>';

        var eleContent = document.getElementById('sa_heat_float_right_box_content');

        _.addEvent(div, 'mouseleave', function () {
          if (me.is_fix_state === 'notfix') {
            target_is_on_float = false;
            div.style.display = 'none';
          }
        });

        _.addEvent(div, 'mouseenter', function () {
          if (me.is_fix_state === 'notfix') {
            target_is_on_float = true;
          }
        });


        _.addEvent(div, 'animationend', function () {
          div.className = '';
        });

        this.is_fix_state = 'notfix';


        var timeEle = 600;

        function showBoxDetailContent(e) {
          var target = e.target;
          var currentTarget = e.currentTarget;
          var data = $(target).data('clickdata');

          while (!data && target.parentNode) {
            target = target.parentNode;
            data = $(target).data('clickdata');
            if (target === currentTarget) {
              break;
            }
          }
          if (!data) {
            return false;
          }

          var textContent;
          var heatmapCallback = _.isObject(sd.para.heatmap) ? sd.para.heatmap.setContent : null;
          if (heatmapCallback && typeof heatmapCallback === 'function') {
            textContent = heatmapCallback(target);
            if (textContent && typeof textContent === 'string') {
              textContent = _.trim(textContent);
            } else {
              textContent = '';
            }
          } else {
            textContent = _.trim(target.textContent);
          }

          if (textContent) {
            textContent = textContent
              .replace(/[\r\n]/g, ' ')
              .replace(/[ ]+/g, ' ')
              .substring(0, 255);
          }

          data.data_current_content = textContent || '没有值';
          newStr = str.replace(/\{\{[^\{\{]+\}\}/g, function (a) {
            a = a.slice(2, -2);
            if (typeof a === 'string' && typeof data === 'object') {
              return data[a];
            }
          });
          eleContent.innerHTML = newStr;
          me.showEffectBox(e, div, isShow);
          me.setContainer(div);
        }
        var showBoxDetailTimer = null;

        function showBoxDetail(e) {
          var target = e.target;
          showBoxDetailTimer && clearTimeout(showBoxDetailTimer);
          showBoxDetailTimer = setTimeout(function () {
            if (target === current_over) {
              showBoxDetailContent(e);
            }
          }, timeEle);
        }

        var current_over = null;

        if (/iPhone|Android/i.test(navigator.userAgent)) {
          $(document).on('mouseover', '[sa-click-area],[sa-click-area-v2]', function (e) {
            var target = e.target;
            current_over = target;
            $(target).on('mouseleave', function () {
              if (me.is_fix_state === 'notfix') {
                setTimeout(function () {
                  if (!target_is_on_float) {
                    target_is_on_float = false;
                    div.style.display = 'none';
                  }
                }, timeEle);
              }
            });
            showBoxDetail(e);
          });
        } else {
          $(document).on('mouseover', '[sa-click-area],[sa-click-area-v2]', function (e) {
            var target = e.target;
            current_over = target;
            showBoxDetail(e);
          });
        }
      },
      setCssStyle: function () {
        var css =
          '.saContainer{margin:0;padding:0;font-size:13px;}[sa-click-area] video{visibility:hidden;}.sa-sdk-heatmap-toolbar-selectmap ul{position:absolute;top:40px;left:0;background:#fff;box-shadow:1px 1px 1px rgba(200,200,200,.6);border-radius:3px;}.sa-sdk-heatmap-toolbar-selectmap ul li{cursor:pointer;height:32px;color:#475669;line-height:32px;padding-left:8px}.sa-sdk-heatmap-toolbar-selectmap ul li:hover{background:#00cd90;color:#fff;}.sa-sdk-heatmap-toolbar-selectmap ul li a{text-decoration:none}.sa-heat-box-head-2017322{border-bottom:1px solid rgba(0, 0, 0, .06);cursor:move;height:30px;background:#e1e1e1;color:#999;clear:both}.sa-heat-box-effect-2017314{animation-duration:.5s;animation-fill-mode:both;animation-iteration-count:1;animation-name:sa-heat-box-effect-2017314}@keyframes "sa-heat-box-effect-2017314"{0%{opacity:.6;}to{opacity:1;}} [sa-click-area]{position:relative} [sa-click-area]:before{pointer-events:none;cursor:pointer;content:"";width:100%;position:absolute;left:0;top:0;bottom:0}[sa-click-area="0"]:before{background:hsla(60, 98%, 80%, .75);box-shadow:0 0 0 2px #fefe9b inset}img[sa-click-area="0"]{border:2px solid #fefe9b}[sa-click-area="0"]:hover:before,input[sa-click-area="0"],textarea[sa-click-area="0"]{background:hsla(60, 98%, 80%, .85)}[sa-click-area="1"]:before{background:rgba(255, 236, 142, .75);box-shadow:0 0 0 2px #ffec8e inset}img[sa-click-area="1"]{border:2px solid #ffec8e}[sa-click-area="1"]:hover:before,input[sa-click-area="1"],textarea[sa-click-area="1"]{background:rgba(255, 236, 142, .85)}[sa-click-area="2"]:before{background:rgba(255, 188, 113, .75);box-shadow:0 0 0 2px #ffbc71 inset}img[sa-click-area="2"]{border:2px solid #ffbc71}[sa-click-area="2"]:hover:before,input[sa-click-area="2"],textarea[sa-click-area="2"]{background:rgba(255, 188, 113, .85)}[sa-click-area="3"]:before{background:rgba(255, 120, 82, .75);box-shadow:0 0 0 2px #ff7852 inset}img[sa-click-area="3"]{border:2px solid #ff7852}[sa-click-area="3"]:hover:before,input[sa-click-area="3"],textarea[sa-click-area="3"]{background:rgba(255, 120, 82, .85)}[sa-click-area="4"]:before{background:rgba(255, 65, 90, .75);box-shadow:0 0 0 2px #ff415a inset}img[sa-click-area="4"]{border:2px solid #ff415a}[sa-click-area="4"]:hover:before,input[sa-click-area="4"],textarea[sa-click-area="4"]{background:rgba(255, 65, 90, .85)}[sa-click-area="5"]:before{background:rgba(199, 0, 18, .75);box-shadow:0 0 0 2px #c70012 inset}img[sa-click-area="5"]{border:2px solid #c70012}[sa-click-area="5"]:hover:before,input[sa-click-area="5"],textarea[sa-click-area="5"]{background:rgba(199, 0, 18, .85)}[sa-click-area="6"]:before{background:rgba(127, 0, 79, .75);box-shadow:0 0 0 3px #7f004f inset}img[sa-click-area="6"]{border:2px solid #7f004f}[sa-click-area="6"]:hover:before,input[sa-click-area="6"],textarea[sa-click-area="6"]{background:rgba(127, 0, 79, .85)}[sa-click-area] [sa-click-area]:before{background:0 0 !important}[sa-click-area]:after{pointer-events:none;height:14px;line-height:14px;margin:-7px 0 0 -28px;width:56px;color:#fff;content:attr(data-click);font-size:14px;font-weight:700;left:50%;line-height:1em;position:absolute;text-align:center;text-indent:0;text-shadow:1px 1px 2px #000;top:50%;z-index:10}';
        css += '#sa_heat_float_right_box_content table td { color: #fff !important; font-size: 13px !important;}';
        css += '#sa_sdk_heatmap_filterFlyout select {padding-left: 10px;width: 82px; height: 32px;background:rgba(255,255,255,1); border-radius:3px; border:1px solid rgba(211,220,230,1); margin-right: 10px; margin-left: 10px; outline: none;}';
        css += '#sa_sdk_heatmap_filterFlyout select:hover {border:1px solid rgba(4,203,148,1);}';
        css += '#sa_sdk_heatmap_filterFlyout select:active, #sa_sdk_heatmap_filterFlyout select:focus {border:2px solid rgba(4,203,148,0.2);}';
        css += '#sa_sdk_heatmap_filterFlyout input {outline:none;box-sizing: border-box; width:77px; height:32px; background:rgba(255,255,255,1); border-radius:3px; border:1px solid rgba(211,220,230,1); padding-left:10px; padding-right:10px;}';
        css += '#sa_sdk_heatmap_filterFlyout input:hover {border:1px solid rgba(4,203,148,1);}';
        css += '#sa_sdk_heatmap_filterFlyout input:active #sa_sdk_heatmap_filterFlyout input:focus {border:2px solid rgba(4,203,148,0.2);}';

        var style = document.createElement('style');
        style.type = 'text/css';
        try {
          style.appendChild(document.createTextNode(css));
        } catch (e) {
          style.styleSheet.cssText = css;
        }
        document.getElementsByTagName('head')[0].appendChild(style);
      }
    };

    var heatmap = {
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
      prepare: function (data, type, url) {
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
              heatmap_render.setToolbar(data, type, url);
              me.sendIframeData();
            },
            _.isObject(sd.para.heatmap) && sd.para.heatmap.loadTimeout ? sd.para.heatmap.loadTimeout : 2500
          );
        }

        heatmap_render.setCssStyle();

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
    };

    window.sa_jssdk_heatmap_render = function (se, data, type, url) {
      sd = se;
      sd.heatmap_version = '1.23.5';
      _ = sd._;
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
      heatmap.prepare(data, type, url);
    };
  })();

}());