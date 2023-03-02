<template>
  <div>
    <div class="toolbar" v-show="toolbarShow">
      <div style="height:39px;line-height:39px;padding:3px 15px 9px">
        <el-select class="menu-type" v-model="chartType" @change="setHeatState" style="width:100px;" title="选择查看类型">
          <el-option label="点击图" value="1"></el-option>
          <el-option label="触达率图" value="2"></el-option>
        </el-select>

        <el-select class="menu-type" v-if="chartType==1" v-model="heatMode" @change="changeHeatData" style="width:90px;" title="切换点击图方案">
          <el-option label="方案一" value="1"></el-option>
          <el-option label="方案二" value="2"></el-option>
        </el-select>

        <div id="sa_sdk_heatmap_toolbar_close" style="float:right;position:relative;width:30px;height:100%;cursor:pointer" title="收起打开" @click="pickupPane">
          <svg style="position:absolute;top:9px;right:0" width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g transform="translate(-129.000000, -260.000000)" fill-rule="nonzero" fill="#99A9BF">
                <polygon points="132.110192 274.35347 130.5 272.842901 138.860144 265 147.23 272.842902 145.619784 274.35347 138.864999 268.016603"></polygon>
              </g>
            </g>
          </svg>
        </div>

        <div style="float:right;padding:0 10px;width:1px;color:#99A9BF">|</div>
        <div id="sa_sdk_heatmap_toolbar_refresh" style="float:right;position:relative;cursor:pointer;width:30px;height:100%" title="刷新数据" @click="refreshData">
          <svg style="position:absolute;top:9px;left:5px" width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g>
                <g>
                  <path
                    d="M18.1201298,5.45190941 L15.7071603,6.65839414 C14.3331082,3.91029003 11.3336531,2.11731966 7.94879319,2.56975143 C4.59744671,3.02218321 1.91636953,5.78704405 1.54772141,9.13839053 C1.04501944,13.6627083 4.58068998,17.5 9.00446733,17.5 C12.1882465,17.5 14.8693237,15.5227056 15.9585113,12.7243313 L14.098514,12.1043322 L14.0817572,12.1043322 C13.1098668,14.433518 10.5796002,15.9416239 7.7979826,15.3551383 C5.73690451,14.9194632 4.06123127,13.24379 3.62555623,11.1659552 C2.88826001,7.61352789 5.56933719,4.48001893 9.00446733,4.48001893 C11.1660858,4.48001893 13.0093264,5.72001713 13.9141899,7.52974422 L11.4006801,8.80325589 C11.3336531,8.83676935 11.3336531,8.95406648 11.4174368,8.97082321 L16.4612132,10.6297397 C16.5114834,10.6464964 16.5617536,10.612983 16.5785104,10.5627128 L18.2374269,5.51893634 C18.2876971,5.48542287 18.2039134,5.41839594 18.1201298,5.45190941 L18.1201298,5.45190941 Z"
                    fill="#99A9BF"></path>
                  <rect x="0" y="0" width="20" height="20"></rect>
                </g>
              </g>
            </g>
          </svg>
        </div>
        <div style="float:right;padding:0 10px;width:1px;color:#99A9BF">|</div>

        <el-popover placement="top-start" width="260" trigger="manual" v-model="showQR">
          <div style="height:24px;line-height:24px;border-bottom:1px solid #E9F0F7;text-align:center;color:#475669;font-size:14px;position:relative;">
            分享链接
            <close @click.native="showQR=false" style="position:absolute;top:2px;color:#99A9BF;cursor:pointer;right:4px" />
          </div>
          <div class="the-qr" style="width:128px;height:128px;margin: 16px auto;"></div>
          <share slot="reference" class="hand" style="float:right;position:relative;width:16px;top: 10px;cursor:pointer" title="打开分享" @click.native="lookView" />
        </el-popover>
      </div>
      <detailTips :key="detailTipsKey" :reference="reference" :data="referenceData" @afterLeave="afterLeave" />
    </div>

    <div id="sa_sdk_heatmap_toolbar_corner" v-show="!toolbarShow" @click="expandPane" style="cursor:pointer;position: fixed;z-index:999999;top:0;right:10px;padding:3px 8px 0;background:#000;">
      <svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g transform="translate(-360.000000, -119.000000)" fill-rule="nonzero" fill="#C0CCDA">
            <polygon transform="translate(370.365000, 129.117652) scale(1, -1) translate(-370.365000, -129.117652) "
              points="364.4177 133.235303 363 131.905316 370.360724 125 377.73 131.905317 376.312279 133.235302 370.364999 127.655981"></polygon>
          </g>
        </g>
      </svg>
    </div>

  </div>
</template>

<script>
import heatmap from '@/toolDom/heatmap'
import { $ } from '@/toolDom/jq'
import urlParse from '@/toolDom/urlParse'
import QRCode from './QRcode'
import Clickoutside from 'element-ui/src/utils/clickoutside'
import detailTips from '@/toolDom/components/detailTips/index.vue'
import share from '@/svg/share.vue'
import close from '@/svg/close.vue'

export default {
  name: 'toolbar',
  components: {
    detailTips, share, close
  },
  props: {

  },
  directives: { Clickoutside },
  data() {
    return {
      toolbarShow: true,
      showQR: false,
      selectShow: false,
      selectClickShow: false,
      chartType: '1',
      heatMode: '1',
      originalHeatData: null,
      ajaxHeatData: null,
      heatDataElement: [],
      heatMapList: [],
      is_fix_state: null,
      reference: {
        show: false,
        dom: null
      },
      detailTipsKey: 0,
      referenceData: {},
      referenceList: [],
      offScrollAndResizeEventHandle: null
    }
  },
  created() {
    this.setHeatState(this.getQueryString('sa-request-type'), true)
  },
  mounted() {
    this.chartType = this.getQueryString('sa-request-type') || '1'
    // 二维码
    this.$nextTick(() => {
      let qrCodeEle = document.querySelector('.the-qr')
      new QRCode(qrCodeEle, {
        text: window.location.href,
        width: 128,
        height: 128,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.L
      });
    })
    // 

  },
  methods: {
    afterLeave() {
      this.reference.show = false
      // let self = this
      // if(this.referenceList.length){
      //   setTimeout(e=>{
      //     self.reference.show = true
      //     self.reference.dom = self.referenceList[self.referenceList.length-1]
      //     self.referenceList = []
      //   },1000)
      // }
    },

    bindEffect() {
      let current_over = null;
      let self = this
      if (/iPhone|Android/i.test(navigator.userAgent)) {
        $(document).on('mouseover', '[sa-click-area],[sa-click-area-v2]', function (e) {
          let target = e.target;
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
          self.showBoxDetailContent(e)

        });
      } else {
        // mouseover
        $(document).on('mouseenter', '[sa-click-area],[sa-click-area-v2]', function (e) {
          let target = e.target;
          current_over = target;
          // showBoxDetail(e);
          self.showBoxDetailContent(e)
        });
      }
    },
    // 整合数据 弹窗
    showBoxDetailContent(e) {
      let target = e.target
      let currentTarget = e.currentTarget
      let data = $(target).data('clickdata')
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

      let textContent;
      let heatmapCallback = this.$zd._.isObject(this.$zd.para.heatmap) ? this.$zd.para.heatmap.setContent : null;
      if (heatmapCallback && typeof heatmapCallback === 'function') {
        textContent = heatmapCallback(target);
        if (textContent && typeof textContent === 'string') {
          textContent = this.$zd._.trim(textContent);
        } else {
          textContent = '';
        }
      } else {
        textContent = this.$zd._.trim(target.textContent);
      }

      if (textContent) {
        textContent = textContent
          .replace(/[\r\n]/g, ' ')
          .replace(/[ ]+/g, ' ')
          .substring(0, 255);
      }
      data.data_current_content = textContent || '没有值';

      this.referenceData = data
      if (this.reference.show) {
        this.detailTipsKey++
      }

      this.reference.show = true
      this.reference.dom = target

    },

    addScrollAndResizeEvent() {
      let timer = null;
      let clearFlag = false;
      let self = this
      $(window).on('scroll.v2', function () {
        if (!clearFlag) {
          $('#heatMapContainer').html('');
          clearFlag = true;
        }
        clearTimeout(timer);
        timer = setTimeout(function () {
          self.refreshHeatData(self.heatMode);
          clearFlag = false;
        }, self.$zd.para.heatmap.renderRefreshTime || 1000);
      });
      $(window).on('resize.v2', function () {
        if (!clearFlag) {
          $('#heatMapContainer').html('');
          clearFlag = true;
        }
        clearTimeout(timer);
        timer = setTimeout(function () {
          self.refreshHeatData(self.heatMode);
          clearFlag = false;
        }, self.$zd.para.heatmap.renderRefreshTime || 1000);
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
    },

    setClickMap(id, url) {
      let me = this;
      if (typeof id === 'string') {

        $('body').append('<div id="heatMapContainer"></div>');

        if (url) {
          this.requestType = 3;
        } else {
          this.requestType = 1;
        }

        let BASE_API = 'https://preapiconsole.71360.com/api/app/cdp-analysis/'
        // process.env === 'development' ? BASE_API = 'http://192.168.26.106:8888/' : BASE_API = 'https://preapiconsole.71360.com/api/app/obor-nginx-php-ydyl/'
        heatmap.getServerData.start({
          url: {
            ajax: BASE_API + 'heatMapPage/clickGraph?heatMapId=' + id,
            jsonp: BASE_API + 'heatMapPage/clickGraph?heatMapId=' + id
          },
          success: function (data) {
            console.log('success', data);
            // 处理 热力框部分数据
            me.originalHeatData = me.processOriginalHeatData(data);
            // 加载热力框dom
            me.bindEffect();
            // 计算热力数据
            me.calculateHeatData(data);

          },
          error: function (res) {
            console.log('error', res);
          }
        })
      }
    },

    showErrorInfo(error_type, error_msg) {
      console.log('报错了');
      let div = document.createElement('div');
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

    processOriginalHeatData: function (data) {
      let result = Object.assign({}, data)

      result.rows.forEach((index, value) => {
        try {
          let ele = this.$zd._.querySelectorAll(value.byValues[0]);
          if (ele.length) {
            value.ele = ele[0];
          }
        } catch (e) {
          this.$zd.log('元素类名错误！', e);
        }
      })
      return result;
    },
    processOriginalHeatData2: function () {
      let data = this.originalHeatData;
      let result = Object.assign({}, data)
      let tmp = [];
      let eletmp = [];
      let copyRows = data.rows.slice();
      copyRows.forEach((index, value) => {
        if (!value.ele) return true;
        let idx = eletmp.findIndex(e => e === value.ele);
        if (idx === -1) {
          eletmp.push(value.ele);
          tmp.push(Object.assign({}, data));
        } else {
          tmp[idx].values[0][0] += value.values[0][0];
        }
      })
      result.rows = tmp;
      return result;
    },

    //  计算热力属性
    calculateHeatData: function (data) {
      data = Object.assign({}, data);
      this.ajaxHeatData = data;
      let me = this;

      if (!this.$zd._.isObject(data) || !this.$zd._.isArray(data.rows) || !this.$zd._.isObject(data.rows[0])) {
        me.showErrorInfo(me.requestType);
        return false;
      }
      if (!data.viewCount || Number(data.viewCount) === 0) {
        me.showErrorInfo(2, {
          error: '点击率计算失败，没有开启autoTrack!'
        });
        return false;
      }
      let pv = parseInt(data.viewCount, 10);
      let heat_map_id = data.heat_map_id;
      data = data.rows;

      let dataPageTotal = 0;
      let templeUsableData = [];
      let usableData = [];
      let usableElem = [];

      data.forEach(obj => {
        let elem = null;
        if (obj.byValues[0] && (elem = this.$zd._.querySelectorAll(obj.byValues[0])[0])) {
          templeUsableData.push(obj);
          usableElem.push(elem);
        }
      });

      if (templeUsableData.length > 1) {
        for (let i = 0; i < usableElem.length; i++) {
          for (let j = i + 1; j < usableElem.length; j++) {
            if (usableElem[i] === usableElem[j]) {
              templeUsableData[j].values[0][0] += templeUsableData[i].values[0][0];
              templeUsableData[i].values[0][0] = 0;
              templeUsableData[i].byValues = '';
              break;
            }
          }
        }
      }

      templeUsableData.forEach(obj => {
        if (obj.byValues[0] && this.$zd._.querySelectorAll(obj.byValues[0])[0]) {
          usableData.push(obj);
        }
      });

      usableData = usableData.filter(e => e)

      if (usableData.length === 0) {
        me.showErrorInfo(me.requestType);
      }

      data = usableData;

      data.forEach(obj => {
        obj.value_fix = obj.clickCount[0][0];
        dataPageTotal += obj.value_fix;
      });


      me.data_render = data;

      data.forEach((obj, key) => {
        if (obj.byValues[0]) {
          obj.data_page_percent = Number((obj.value_fix / dataPageTotal) * 100).toFixed(2) + '%';

          obj.data_click_percent = Number((obj.value_fix / pv) * 100).toFixed(2) + '%';

          obj.data_click = Number(obj.value_fix / pv);
          obj.data_page = Number(obj.value_fix / dataPageTotal);

          let urlParse = new this.$zd._.urlParse(this.$zd.para.web_url);
          urlParse._values.Path = '/web-click/users';
          if (me.requestType === 3) {
            obj.data_user_link = urlParse.getUrl() + '#heat_map_id=' + heat_map_id + '&detail=true&element_selector=' + encodeURIComponent(obj.byValues[0]) + '&page_url=' + encodeURIComponent(location.href);
          } else {
            obj.data_user_link = urlParse.getUrl() + '#heat_map_id=' + heat_map_id + '&detail=true&element_selector=' + encodeURIComponent(obj.byValues[0]);
          }
          if (String(obj.topValues[0]) === 'null') {
            obj.data_top_value = '没有值';
          } else {
            obj.data_top_value = String(obj.topValues[0]);
          }

          let selector = this.$zd._.querySelectorAll(obj.byValues[0]);
          if (typeof selector === 'object' && selector.length > 0) {
            setTimeout(function () {
              me.renderHeatData(selector, obj, key);
            }, 100);
          }
        }
      })


    },
    renderHeatData: function (selector, data, key) {
      let dom = this.$zd._.ry(selector[0]);
      let wrap = null;

      let tagName = dom.ele.tagName.toLowerCase();

      if (this.heatMode == 1) {
        if (tagName === 'input' || tagName === 'textarea' || tagName === 'img' || tagName === 'svg') {
          dom.attr('data-heat-place', String(key));
          let width = $(selector[0]).width();
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
        $(wrap.ele).data('clickdata', Object.assign({}, data));
        wrap.attr('data-heat-place', String(key)).attr('sa-click-area', this.heatData(data.data_click)).attr('data-click', data.data_click_percent);
        if (wrap.getStyle('display') === 'inline') {
          selector[0].style.display = 'inline-block';
          $(selector[0]).attr('sa-heatmap-inlineBlock', '');
        }
      } else if (this.heatMode == 2) {
        let eleWidth, eleHeight, eleLeft, eleTop;
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
          $(dom.ele).data('clickdata', Object.assign({}, data));
          if (eleHeight && eleWidth) {
            let mapDivObj = {
              width: eleWidth,
              height: eleHeight,
              left: eleLeft,
              top: eleTop,
              position: 'fixed',
              'z-index': 999998,
              'pointer-events': 'none'
            };

            let heatMapDiv = $('<div sa-click-area></div>');
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
    clearMode1() {
      this.heatDataElement.forEach(ele => {
        let tagName = ele.ele.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea' || tagName === 'img' || tagName === 'svg') {
          let parent = ele.parent();
          if (parent && parent.ele.tagName.toLowerCase() === 'span' && !this.$zd._.isUndefined($(parent.ele).attr('sa-click-area'))) {
            $(ele.ele).unwrap();
          }
        } else {
          $(ele.ele).removeAttr('sa-click-area');
        }
      })


      $('[sa-heatmap-inlineBlock]').css('display', 'inline');
      $('[sa-heatmap-inlineBlock]').removeAttr('sa-heatmap-inlineBlock');
      this.heatDataElement = [];
    },
    clearMode2() {
      this.heatDataElement = [];
      $('[sa-click-area-v2]').removeAttr('sa-click-area-v2');
      $('#heatMapContainer').html('');
    },

    changeHeatData() {
      if (this.heatMode == 2) {
        this.clearMode1()
        this.offScrollAndResizeEventHandle = this.addScrollAndResizeEvent()

      }
      if (this.heatMode == 1) {
        this.clearMode2()
      }

      this.calculateHeatData(this.ajaxHeatData);
    },
    refreshHeatData: function (targetVersion) {
      if (this.heatMode == 1) {

        this.heatDataElement.forEach(ele => {
          let tagName = ele.ele.tagName.toLowerCase();
          if (tagName === 'input' || tagName === 'textarea' || tagName === 'img' || tagName === 'svg') {
            let parent = ele.parent();
            if (parent && parent.ele.tagName.toLowerCase() === 'span' && !this.$zd._.isUndefined($(parent.ele).attr('sa-click-area'))) {
              $(ele.ele).unwrap();
            }
          } else {
            $(ele.ele).removeAttr('sa-click-area');
          }
        })


        $('[sa-heatmap-inlineBlock]').css('display', 'inline');
        $('[sa-heatmap-inlineBlock]').removeAttr('sa-heatmap-inlineBlock');
        this.heatDataElement = [];
      }
      if (this.heatMode == 2) {
        this.heatDataElement = [];
        $('[sa-click-area-v2]').removeAttr('sa-click-area-v2');
        $('#heatMapContainer').html('');

      }

      // if (this.offScrollAndResizeEventHandle) {
      //   this.offScrollAndResizeEventHandle();
      //   this.offScrollAndResizeEventHandle = null;
      // }
      // if (state === '1') {
      //   heatmap_render.refreshHeatData(1);
      // } else if (state === '2') {
      //   heatmap_render.refreshHeatData(2);
      //   this.offScrollAndResizeEventHandle = addScrollAndResizeEvent();
      // }
      this.calculateHeatData(this.ajaxHeatData);
    },
    setNoticeMap: function () { },
    setContainer: function (el) {
      if (!el) {
        return false;
      }
      el.classList.add('saContainer');
      if (el && el.children) {
        let arr = el.children;
        for (let i = 0; i < arr.length; i++) {
          this.setContainer(arr[i]);
        }
      }
    },
    heatData: function (data) {
      let heat = [0.005, 0.01, 0.025, 0.05, 0.1, 0.5];
      for (let i = 0; i < heat.length; i++) {
        if (data < heat[i]) {
          return i
        }
      }
      return 6
    },
    getQueryString(name) {
      let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      let r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]); return null;
    },
    lookView() {
      this.showQR = !this.showQR
    },
    handleClose() {
      this.selectClickShow = false
    },
    setScrollMap: function (id, url) {
      let me = this;
      if (typeof id === 'string') {

        let suc = function (data) {
          if (typeof data !== 'object' || !me.$zd._.isArray(data.result) || data.result.length === 0) {
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

          let middlePercent = {
            setData: function (x, y, z) {
              x = String(x);
              this.data[x] = this.data[x] || {};
              this.data[x][y] = z;
            },
            data: {},
            getData: function () {
              let x = {};
              let arr = [];
              let temp = null;
              for (let i in this.data) {
                arr = [];
                for (let k in this.data[i]) {
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
          me.$zd._.each(data.result, function (v, k) {
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

          me.$zd._.extend(data.percent, middlePercent.getData());

          let percent_tpl = `<div style="border-bottom: 1px dashed #4C4C4D;height:1px;width:100%;position: absolute;top:{{top}}px;">
            <span style="font-size:12px;position:absolute;padding:0 12px;top:-24px;height:26px;line-height: 26px;left:0;background:#000;color:#eee;border-radius: 2px;">
            {{percent}}</span></div>`;
          for (let i in data.percent) {
            $(document.body).append($(percent_tpl.replace('{{top}}', data.percent[i] - 2).replace('{{percent}}', i + '%')));
          }

          let over_tpl = `<div style="z-index:99999;border-bottom: 1px solid #272727;height:1px;
            width:100%;position: absolute;top:{{top}}px;text-align:center;">
            <span style="font-size:12px;height:26px;line-height: 26px;background:#000;color:#eee;border-radius: 2px;left:50%;margin-left:-65px;
            position: absolute;top:-13px;padding: 0 5px;">{{percent}}的用户浏览到这里</span></div>`;
          let over_ele = null;

          function showLineDetail(e) {
            let y = parseInt((e.pageY + 15) / 10);
            let i = 0;
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

          $(document).on('mousemove', me.$zd._.throttle(showLineDetail, 150));
        }
        let err = function (res) {
          if (me.$zd._.isObject(res) && res.error) {
            me.showErrorInfo(2, {
              error: res.error
            });
          } else {
            me.showErrorInfo(2, {
              error: '服务异常'
            });
          }
          sessionStorage.removeItem('sensors_heatmap_id');
        }
        if (url) {
          this.requestType = 3
        } else {
          this.requestType = 1
        }
        let BASE_API = 'https://preapiconsole.71360.com/api/app/cdp-analysis/'
        // process.env === 'development' ? BASE_API = 'http://192.168.26.106:8888/' : BASE_API = 'https://preapiconsole.71360.com/api/app/obor-nginx-php-ydyl/'

        heatmap.getServerData.start({
          url: {
            ajax: BASE_API + 'heatMapPage/toggleRateGraph?heatMapId=' + id,
            jsonp: BASE_API + 'heatMapPage/toggleRateGraph?heatMapId=' + id
          },
          success: suc,
          error: err
        });
      } else {
        // sd.log('缺少web_url');
      }
    },
    setNoticeMap: function () { },
    setHeatState: function (type, isFirst) {
      const data = this.getQueryString('sa-request-id')
      const url = window.location.href
      if (isFirst) {
        if (type === '1') {
          this.setClickMap(data, url)
        } else if (type === '2') {
          this.setScrollMap(data, url)
        } else if (type === '3') {
          this.setNoticeMap(data, url)
        }
      } else {
        let href = urlParse(location.href);
        if (!data) {
          return false;
        }
        let obj = {
          'sa-request-id': data,
          'sa-request-type': type || this.chartType
          // 'sa-request-url': sessionStorage && sessionStorage.getItem ? sessionStorage.getItem('sensors_heatmap_url') || '' : ''
        };
        try {
          let windowNameParam = {};
          if (this.$zd._.isJSONString(window.name)) {
            windowNameParam = JSON.parse(window.name);
            window.name = JSON.stringify(this.$zd._.extend(windowNameParam, obj));
          } else if (window.name == '') {
            window.name = JSON.stringify(obj);
          }
        } catch (e) { }
        href.addQueryString(obj);
        location.href = href.getUrl();
      }
    },
    refreshData() {
      location.reload()
    },
    pickupPane() {
      this.toolbarShow = false
    },
    expandPane() {
      this.toolbarShow = true
    }
  },
}
</script>
<style>
.saContainer {
  margin: 0;
  padding: 0;
  font-size: 13px;
}
[sa-click-area] video {
  visibility: hidden;
}

.sa-heat-box-head-2017322 {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  cursor: move;
  height: 30px;
  background: #e1e1e1;
  color: #999;
  clear: both;
}
[sa-click-area] {
  position: relative;
}
[sa-click-area]:before {
  pointer-events: none;
  cursor: pointer;
  content: "";
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
}
[sa-click-area="0"]:before {
  background: hsla(60, 98%, 80%, 0.75);
  box-shadow: 0 0 0 2px #fefe9b inset;
}
img[sa-click-area="0"] {
  border: 2px solid #fefe9b;
}
[sa-click-area="0"]:hover:before,
input[sa-click-area="0"],
textarea[sa-click-area="0"] {
  background: hsla(60, 98%, 80%, 0.85);
}
[sa-click-area="1"]:before {
  background: rgba(255, 236, 142, 0.75);
  box-shadow: 0 0 0 2px #ffec8e inset;
}
img[sa-click-area="1"] {
  border: 2px solid #ffec8e;
}
[sa-click-area="1"]:hover:before,
input[sa-click-area="1"],
textarea[sa-click-area="1"] {
  background: rgba(255, 236, 142, 0.85);
}
[sa-click-area="2"]:before {
  background: rgba(255, 188, 113, 0.75);
  box-shadow: 0 0 0 2px #ffbc71 inset;
}
img[sa-click-area="2"] {
  border: 2px solid #ffbc71;
}
[sa-click-area="2"]:hover:before,
input[sa-click-area="2"],
textarea[sa-click-area="2"] {
  background: rgba(255, 188, 113, 0.85);
}
[sa-click-area="3"]:before {
  background: rgba(255, 120, 82, 0.75);
  box-shadow: 0 0 0 2px #ff7852 inset;
}
img[sa-click-area="3"] {
  border: 2px solid #ff7852;
}
[sa-click-area="3"]:hover:before,
input[sa-click-area="3"],
textarea[sa-click-area="3"] {
  background: rgba(255, 120, 82, 0.85);
}
[sa-click-area="4"]:before {
  background: rgba(255, 65, 90, 0.75);
  box-shadow: 0 0 0 2px #ff415a inset;
}
img[sa-click-area="4"] {
  border: 2px solid #ff415a;
}
[sa-click-area="4"]:hover:before,
input[sa-click-area="4"],
textarea[sa-click-area="4"] {
  background: rgba(255, 65, 90, 0.85);
}
[sa-click-area="5"]:before {
  background: rgba(199, 0, 18, 0.75);
  box-shadow: 0 0 0 2px #c70012 inset;
}
img[sa-click-area="5"] {
  border: 2px solid #c70012;
}
[sa-click-area="5"]:hover:before,
input[sa-click-area="5"],
textarea[sa-click-area="5"] {
  background: rgba(199, 0, 18, 0.85);
}
[sa-click-area="6"]:before {
  background: rgba(127, 0, 79, 0.75);
  box-shadow: 0 0 0 3px #7f004f inset;
}
img[sa-click-area="6"] {
  border: 2px solid #7f004f;
}
[sa-click-area="6"]:hover:before,
input[sa-click-area="6"],
textarea[sa-click-area="6"] {
  background: rgba(127, 0, 79, 0.85);
}
[sa-click-area] [sa-click-area]:before {
  background: 0 0 !important;
}
[sa-click-area]:after {
  pointer-events: none;
  height: 14px;
  line-height: 14px;
  margin: -7px 0 0 -28px;
  width: 66px;
  color: #fff;
  content: attr(data-click);
  font-size: 14px;
  font-weight: 700;
  left: 50%;
  line-height: 1em;
  position: absolute;
  text-align: center;
  text-indent: 0;
  text-shadow: 1px 1px 2px #000;
  top: 50%;
  z-index: 10;
}
#sa_heat_float_right_box_content table td {
  color: #fff !important;
  font-size: 13px !important;
}
#sa_sdk_heatmap_filterFlyout select {
  padding-left: 10px;
  width: 82px;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  border-radius: 3px;
  border: 1px solid rgba(211, 220, 230, 1);
  margin-right: 10px;
  margin-left: 10px;
  outline: none;
}
#sa_sdk_heatmap_filterFlyout select:hover {
  border: 1px solid rgba(4, 203, 148, 1);
}
#sa_sdk_heatmap_filterFlyout select:active,
#sa_sdk_heatmap_filterFlyout select:focus {
  border: 2px solid rgba(4, 203, 148, 0.2);
}
#sa_sdk_heatmap_filterFlyout input {
  outline: none;
  box-sizing: border-box;
  width: 77px;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  border-radius: 3px;
  border: 1px solid rgba(211, 220, 230, 1);
  padding-left: 10px;
  padding-right: 10px;
}
#sa_sdk_heatmap_filterFlyout input:hover {
  border: 1px solid rgba(4, 203, 148, 1);
}
#sa_sdk_heatmap_filterFlyout
  input:active
  #sa_sdk_heatmap_filterFlyout
  input:focus {
  border: 2px solid rgba(4, 203, 148, 0.2);
}
</style>
<style scoped lang="scss">
.hand {
  cursor: pointer;
}
.menu-type {
  ::v-deep .el-input__inner {
    background-color: transparent;
    border: none;
    color: #fff;
  }
}
.toolbar {
  height: 50px !important;
  z-index: 9999999;
  background: #272727;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  font-size: 14px;
  color: #eff2f7;
  margin: 0;
  clear: both;
  &.toolbar-hidden {
    display: none;
  }
}
</style>
