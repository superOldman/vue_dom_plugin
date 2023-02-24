<template>
  <div>
    <div class="toolbar">
      <div style="height:39px;line-height:39px;padding:3px 15px 9px">
        <el-select class="menu-type" v-model="chartType" @change="setHeatState" style="width:100px;" title="选择查看类型">
          <el-option label="点击图1" value="1"></el-option>
          <el-option label="触达率图" value="2"></el-option>
        </el-select>

        <el-select class="menu-type" v-if="chartType==1" v-model="heatMode" @change="chooseHeatData" style="width:90px;" title="切换点击图方案">
          <el-option label="方案一" value="1"></el-option>
          <el-option label="方案二" value="2"></el-option>
        </el-select>

        <div id="sa_sdk_heatmap_toolbar_close" style="float:right;position:relative;width:30px;height:100%;cursor:pointer" title="收起打开">
          <svg style="position:absolute;top:9px;right:0" width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g transform="translate(-129.000000, -260.000000)" fill-rule="nonzero" fill="#99A9BF">
                <polygon points="132.110192 274.35347 130.5 272.842901 138.860144 265 147.23 272.842902 145.619784 274.35347 138.864999 268.016603"></polygon>
              </g>
            </g>
          </svg>
        </div>

        <div style="float:right;padding:0 10px;width:1px;color:#99A9BF">|</div>
        <div id="sa_sdk_heatmap_toolbar_refresh" style="float:right;position:relative;cursor:pointer;width:30px;height:100%" title="刷新数据">
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
            <close @click.native="showQR=false" title="分享链接" style="position:absolute;top:2px;color:#99A9BF;cursor:pointer;right:4px" />
          </div>
          <div class="the-qr" style="width:128px;height:128px;margin: 16px auto;"></div>
          <share slot="reference" class="hand" style="float:right;position:relative;width:16px;top: 10px;cursor:pointer" title="打开分享" @click.native="lookView" />
        </el-popover>

        <!-- <div id="sa_sdk_heatmap_toolbar_filter" style="float:right;position:relative;cursor:pointer;width:30px;height:100%;" title="筛选">
          <svg style="position: absolute; top: 11px; left: 5px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="17px" height="15px" viewBox="0 0 17 15"
            version="1.1">
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="操作栏" transform="translate(-1068.000000, -341.000000)" fill="#99A9BF" fill-rule="nonzero">
                <g id="screen" transform="translate(1068.000000, 341.000000)">
                  <polygon id="路径"
                    points="9.13824444 13.2863778 9.13824444 6.65411111 12.5159778 2.08801111 4.52081111 2.08801111 7.8378 6.56684444 7.8378 12.6447111 6.23534444 11.8541778 6.23534444 7.20851111 0.8 0.4 16.2 0.4 10.7646556 7.2299 10.7646556 14.0888889 9.13824444 13.2863778" />
                </g>
              </g>
            </g>
          </svg>
        </div> -->
      </div>
      <detailTips :reference="reference" :data="referenceData" @afterLeave="afterLeave" />
    </div>
  </div>
</template>

<script>
import heatmap from '@/toolDom/heatmap'
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
      referenceData: {},
      referenceList: []
    }
  },
  created() {
    // this.setHeatState()
    this.setHeatState(this.getQueryString('sa-request-id'), '1', window.location.href, true);
    // this.addScrollAndResizeEvent()
  },
  mounted() {
    console.log(this.getQueryString('id'));
    this.heatMode = this.getQueryString('sa-request-type') || '1'
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
    },
    getCurrentUrl() {
      let href = urlParse(location.href);
      let obj = {};

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
        console.log('mouseover-准备show');
        setTimeout(() => {
          console.log('mouseover-准备show好了');
          this.reference.show = true
          this.reference.dom = target
        }, 200)
      } else {
        console.log('mouseover-show');
        this.reference.show = true
        this.reference.dom = target
      }
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
      if (typeof id === 'string' && this.$zd.para.web_url) {

        $('body').append('<div id="heatMapContainer"></div>');

        if (url) {
          this.requestType = 3;
        } else {
          this.requestType = 1;
        }
        let test = {
          "error_msg": "OK", "is_success": true,
          "data": { "heat_map_id": "193b91c8-dc03-4bd7-a041-3f7e0d6a0c94", "by_fields": ["event.$WebClick.$element_selector"], "rows": [{ "top_values": [""], "values": [[3]], "by_values": ["#c-name"] }, { "top_values": [""], "values": [[6]], "by_values": ["#container \u003e footer:nth-of-type(1) \u003e div:nth-of-type(1) \u003e a:nth-of-type(1)"] }, { "top_values": [""], "values": [[3]], "by_values": ["#country"] }, { "top_values": ["Save"], "values": [[1]], "by_values": ["#edit \u003e div:nth-of-type(1) \u003e div:nth-of-type(2) \u003e form:nth-of-type(1) \u003e div:nth-of-type(7) \u003e div:nth-of-type(1) \u003e button:nth-of-type(1)"] }, { "top_values": [""], "values": [[1]], "by_values": ["#email"] }, { "top_values": ["UI Elements"], "values": [[1]], "by_values": ["#nav-accordion \u003e li:nth-of-type(2) \u003e a:nth-of-type(1)"] }, { "top_values": ["Forms"], "values": [[2]], "by_values": ["#nav-accordion \u003e li:nth-of-type(5) \u003e a:nth-of-type(1)"] }, { "top_values": [""], "values": [[1]], "by_values": ["#phone"] }, { "top_values": [""], "values": [[1]], "by_values": ["#overview \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e button:nth-of-type(2)"] }, { "top_values": [""], "values": [[3]], "by_values": ["#edit \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e form:nth-of-type(1) \u003e div:nth-of-type(5) \u003e div:nth-of-type(1) \u003e textarea:nth-of-type(1)"] }, { "top_values": ["Overview"], "values": [[5]], "by_values": ["#main-content \u003e section:nth-of-type(1) \u003e div:nth-of-type(1) \u003e div:nth-of-type(2) \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e ul:nth-of-type(1) \u003e li:nth-of-type(1) \u003e a:nth-of-type(1)"] }, { "top_values": ["Contact"], "values": [[11]], "by_values": ["#main-content \u003e section:nth-of-type(1) \u003e div:nth-of-type(1) \u003e div:nth-of-type(2) \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e ul:nth-of-type(1) \u003e li:nth-of-type(2) \u003e a:nth-of-type(1)"] }, { "top_values": ["Edit Profile"], "values": [[7]], "by_values": ["#main-content \u003e section:nth-of-type(1) \u003e div:nth-of-type(1) \u003e div:nth-of-type(2) \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e ul:nth-of-type(1) \u003e li:nth-of-type(3) \u003e a:nth-of-type(1)"] }, { "top_values": ["Extra Pages"], "values": [[2]], "by_values": ["#nav-accordion \u003e li:nth-of-type(4) \u003e a:nth-of-type(1)"] }, { "top_values": [""], "values": [[2]], "by_values": ["#overview \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e button:nth-of-type(1)"] }, { "top_values": ["Components"], "values": [[2]], "by_values": ["#nav-accordion \u003e li:nth-of-type(3) \u003e a:nth-of-type(1)"] }, { "top_values": ["Mail 2"], "values": [[1]], "by_values": ["#nav-accordion \u003e li:nth-of-type(7) \u003e a:nth-of-type(1)"] }, { "top_values": [""], "values": [[6]], "by_values": ["#overview \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e textarea:nth-of-type(1)"] }, { "top_values": [""], "values": [[2]], "by_values": ["#skype"] }, { "top_values": [""], "values": [[2]], "by_values": ["#lives-in"] }], "page_view": 22, "report_update_time": "2023-02-20 09:54:31.932", "data_update_time": "2023-02-20 09:50:08.000", "data_sufficient_update_time": "2023-02-20 09:43:40.000", "truncated": false, "sampling_factor": 64 }
        }
        // let test = {
        //   "error_msg": "OK", "is_success": true,
        //   "data": {
        //     "heat_map_id": "d88e6ff5-b63f-4a7c-ba51-b4292277ec71", "by_fields": ["event.$WebClick.$element_selector"],
        //     "rows": [{ "top_values": [""], "values": [[1]], "by_values": ["#exampleInputFile"] }, { "top_values": [""], "values": [[5]], "by_values": ["#c-name"] }, { "top_values": [""], "values": [[4]], "by_values": ["#container \u003e footer:nth-of-type(1) \u003e div:nth-of-type(1) \u003e a:nth-of-type(1)"] }, { "top_values": [""], "values": [[1]], "by_values": ["#edit \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e form:nth-of-type(1) \u003e div:nth-of-type(5) \u003e div:nth-of-type(1) \u003e textarea:nth-of-type(1)"] }, { "top_values": ["Send Message"], "values": [[1]], "by_values": ["#main-content \u003e section:nth-of-type(1) \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e div:nth-of-type(2) \u003e p:nth-of-type(2) \u003e button:nth-of-type(1)"] }, { "top_values": ["Overview"], "values": [[7]], "by_values": ["#main-content \u003e section:nth-of-type(1) \u003e div:nth-of-type(1) \u003e div:nth-of-type(2) \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e ul:nth-of-type(1) \u003e li:nth-of-type(1) \u003e a:nth-of-type(1)"] }, { "top_values": ["Contact"], "values": [[7]], "by_values": ["#main-content \u003e section:nth-of-type(1) \u003e div:nth-of-type(1) \u003e div:nth-of-type(2) \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e ul:nth-of-type(1) \u003e li:nth-of-type(2) \u003e a:nth-of-type(1)"] }, { "top_values": ["Edit Profile"], "values": [[4]], "by_values": ["#main-content \u003e section:nth-of-type(1) \u003e div:nth-of-type(1) \u003e div:nth-of-type(2) \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e ul:nth-of-type(1) \u003e li:nth-of-type(3) \u003e a:nth-of-type(1)"] }, { "top_values": [""], "values": [[1]], "by_values": ["#lives-in"] }, { "top_values": [""], "values": [[1]], "by_values": ["#overview \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e textarea:nth-of-type(1)"] }], "page_view": 4, "report_update_time": "2023-02-14 20:32:34.189", "data_update_time": "2023-02-14 20:31:49.000", "data_sufficient_update_time": "2023-02-14 20:19:49.000", "truncated": false, "sampling_factor": 64
        //   }
        // }
        console.log('插件加载完毕');
        // 处理 热力框部分数据
        me.originalHeatData = me.processOriginalHeatData(test.data);
        // 加载热力框dom
        // me.bindEffect();
        me.bindEffect();
        // 计算热力数据
        me.calculateHeatData(test.data);

        heatmap.getServerData.start({
          url: {
            ajax: 'http://192.168.26.106:8888/heatMapPage/clickGraph?heatMapId=123123',
            jsonp: 'http://192.168.26.106:8888/heatMapPage/clickGraph?heatMapId=123123'
          },
          success: function (data) {
            console.log('success', data);
          },
          error: function (res) {
            console.log('error', res);
          }
        });


        // heatmap.getServerData.start({
        //   url: {
        //     ajax: this.requestType === 3 ? urlParse2Value : urlParse.getUrl(),
        //     jsonp: this.requestType === 3 ? jsonpUrlParse2Value : jsonpUrlParse.getUrl()
        //   },
        //   success: function (data) {
        //     // 假数据

        //     let test = {
        //       "error_msg": "OK", "is_success": true,
        //       "data": { "heat_map_id": "193b91c8-dc03-4bd7-a041-3f7e0d6a0c94", "by_fields": ["event.$WebClick.$element_selector"], "rows": [{ "top_values": [""], "values": [[3]], "by_values": ["#c-name"] }, { "top_values": [""], "values": [[6]], "by_values": ["#container \u003e footer:nth-of-type(1) \u003e div:nth-of-type(1) \u003e a:nth-of-type(1)"] }, { "top_values": [""], "values": [[3]], "by_values": ["#country"] }, { "top_values": ["Save"], "values": [[1]], "by_values": ["#edit \u003e div:nth-of-type(1) \u003e div:nth-of-type(2) \u003e form:nth-of-type(1) \u003e div:nth-of-type(7) \u003e div:nth-of-type(1) \u003e button:nth-of-type(1)"] }, { "top_values": [""], "values": [[1]], "by_values": ["#email"] }, { "top_values": ["UI Elements"], "values": [[1]], "by_values": ["#nav-accordion \u003e li:nth-of-type(2) \u003e a:nth-of-type(1)"] }, { "top_values": ["Forms"], "values": [[2]], "by_values": ["#nav-accordion \u003e li:nth-of-type(5) \u003e a:nth-of-type(1)"] }, { "top_values": [""], "values": [[1]], "by_values": ["#phone"] }, { "top_values": [""], "values": [[1]], "by_values": ["#overview \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e button:nth-of-type(2)"] }, { "top_values": [""], "values": [[3]], "by_values": ["#edit \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e form:nth-of-type(1) \u003e div:nth-of-type(5) \u003e div:nth-of-type(1) \u003e textarea:nth-of-type(1)"] }, { "top_values": ["Overview"], "values": [[5]], "by_values": ["#main-content \u003e section:nth-of-type(1) \u003e div:nth-of-type(1) \u003e div:nth-of-type(2) \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e ul:nth-of-type(1) \u003e li:nth-of-type(1) \u003e a:nth-of-type(1)"] }, { "top_values": ["Contact"], "values": [[11]], "by_values": ["#main-content \u003e section:nth-of-type(1) \u003e div:nth-of-type(1) \u003e div:nth-of-type(2) \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e ul:nth-of-type(1) \u003e li:nth-of-type(2) \u003e a:nth-of-type(1)"] }, { "top_values": ["Edit Profile"], "values": [[7]], "by_values": ["#main-content \u003e section:nth-of-type(1) \u003e div:nth-of-type(1) \u003e div:nth-of-type(2) \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e ul:nth-of-type(1) \u003e li:nth-of-type(3) \u003e a:nth-of-type(1)"] }, { "top_values": ["Extra Pages"], "values": [[2]], "by_values": ["#nav-accordion \u003e li:nth-of-type(4) \u003e a:nth-of-type(1)"] }, { "top_values": [""], "values": [[2]], "by_values": ["#overview \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e button:nth-of-type(1)"] }, { "top_values": ["Components"], "values": [[2]], "by_values": ["#nav-accordion \u003e li:nth-of-type(3) \u003e a:nth-of-type(1)"] }, { "top_values": ["Mail 2"], "values": [[1]], "by_values": ["#nav-accordion \u003e li:nth-of-type(7) \u003e a:nth-of-type(1)"] }, { "top_values": [""], "values": [[6]], "by_values": ["#overview \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e textarea:nth-of-type(1)"] }, { "top_values": [""], "values": [[2]], "by_values": ["#skype"] }, { "top_values": [""], "values": [[2]], "by_values": ["#lives-in"] }], "page_view": 22, "report_update_time": "2023-02-20 09:54:31.932", "data_update_time": "2023-02-20 09:50:08.000", "data_sufficient_update_time": "2023-02-20 09:43:40.000", "truncated": false, "sampling_factor": 64 }
        //     }
        //     // let test = {
        //     //   "error_msg": "OK", "is_success": true,
        //     //   "data": {
        //     //     "heat_map_id": "d88e6ff5-b63f-4a7c-ba51-b4292277ec71", "by_fields": ["event.$WebClick.$element_selector"],
        //     //     "rows": [{ "top_values": [""], "values": [[1]], "by_values": ["#exampleInputFile"] }, { "top_values": [""], "values": [[5]], "by_values": ["#c-name"] }, { "top_values": [""], "values": [[4]], "by_values": ["#container \u003e footer:nth-of-type(1) \u003e div:nth-of-type(1) \u003e a:nth-of-type(1)"] }, { "top_values": [""], "values": [[1]], "by_values": ["#edit \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e form:nth-of-type(1) \u003e div:nth-of-type(5) \u003e div:nth-of-type(1) \u003e textarea:nth-of-type(1)"] }, { "top_values": ["Send Message"], "values": [[1]], "by_values": ["#main-content \u003e section:nth-of-type(1) \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e div:nth-of-type(2) \u003e p:nth-of-type(2) \u003e button:nth-of-type(1)"] }, { "top_values": ["Overview"], "values": [[7]], "by_values": ["#main-content \u003e section:nth-of-type(1) \u003e div:nth-of-type(1) \u003e div:nth-of-type(2) \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e ul:nth-of-type(1) \u003e li:nth-of-type(1) \u003e a:nth-of-type(1)"] }, { "top_values": ["Contact"], "values": [[7]], "by_values": ["#main-content \u003e section:nth-of-type(1) \u003e div:nth-of-type(1) \u003e div:nth-of-type(2) \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e ul:nth-of-type(1) \u003e li:nth-of-type(2) \u003e a:nth-of-type(1)"] }, { "top_values": ["Edit Profile"], "values": [[4]], "by_values": ["#main-content \u003e section:nth-of-type(1) \u003e div:nth-of-type(1) \u003e div:nth-of-type(2) \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e ul:nth-of-type(1) \u003e li:nth-of-type(3) \u003e a:nth-of-type(1)"] }, { "top_values": [""], "values": [[1]], "by_values": ["#lives-in"] }, { "top_values": [""], "values": [[1]], "by_values": ["#overview \u003e div:nth-of-type(1) \u003e div:nth-of-type(1) \u003e textarea:nth-of-type(1)"] }], "page_view": 4, "report_update_time": "2023-02-14 20:32:34.189", "data_update_time": "2023-02-14 20:31:49.000", "data_sufficient_update_time": "2023-02-14 20:19:49.000", "truncated": false, "sampling_factor": 64
        //     //   }
        //     // }
        //     console.log('插件加载完毕');
        //     // 处理 热力框部分数据
        //     me.originalHeatData = me.processOriginalHeatData(test.data);
        //     // 加载热力框dom
        //     me.bindEffect();
        //     // 计算热力数据
        //     me.calculateHeatData(test.data);
        //   },
        //   error: function (res) {
        //     me.showErrorInfo(2, res);
        //     sessionStorage.removeItem('sensors_heatmap_id');
        //   }
        // });
      } else {
        this.$zd.log('缺少web_url');
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
      let result = $.extend(true, {}, data);

      result.rows.forEach((index, value) => {
        try {
          let ele = this.$zd._.querySelectorAll(value.by_values[0]);
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
      let result = $.extend(true, {}, data);
      let tmp = [];
      let eletmp = [];
      let copyRows = data.rows.slice();
      copyRows.forEach((index, value) => {
        if (!value.ele) return true;
        let idx = $.inArray(value.ele, eletmp);
        if (idx === -1) {
          eletmp.push(value.ele);
          tmp.push($.extend(true, {}, value));
        } else {
          tmp[idx].values[0][0] += value.values[0][0];
        }
      })
      result.rows = tmp;
      return result;
    },

    //  计算热力属性
    calculateHeatData: function (data) {
      data = $.extend(true, {}, data);
      this.ajaxHeatData = data;
      let me = this;

      if (!this.$zd._.isObject(data) || !this.$zd._.isArray(data.rows) || !this.$zd._.isObject(data.rows[0])) {
        me.showErrorInfo(me.requestType);
        return false;
      }
      if (!data.page_view || Number(data.page_view) === 0) {
        me.showErrorInfo(2, {
          error: '点击率计算失败，没有开启autoTrack!'
        });
        return false;
      }
      let pv = parseInt(data.page_view, 10);
      let heat_map_id = data.heat_map_id;
      data = data.rows;

      let dataPageTotal = 0;
      let templeUsableData = [];
      let usableData = [];
      let usableElem = [];

      data.forEach(obj => {
        let elem = null;
        if (obj.by_values[0] && (elem = this.$zd._.querySelectorAll(obj.by_values[0])[0])) {
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
              templeUsableData[i].by_values = '';
              break;
            }
          }
        }
      }

      templeUsableData.forEach(obj => {
        if (obj.by_values[0] && this.$zd._.querySelectorAll(obj.by_values[0])[0]) {
          usableData.push(obj);
        }
      });

      usableData = usableData.filter(e => e)

      if (usableData.length === 0) {
        me.showErrorInfo(me.requestType);
      }

      data = usableData;

      data.forEach(obj => {
        obj.value_fix = obj.values[0][0];
        dataPageTotal += obj.value_fix;
      });


      me.data_render = data;

      data.forEach((obj, key) => {
        if (obj.by_values[0]) {
          obj.data_page_percent = Number((obj.value_fix / dataPageTotal) * 100).toFixed(2) + '%';

          obj.data_click_percent = Number((obj.value_fix / pv) * 100).toFixed(2) + '%';

          obj.data_click = Number(obj.value_fix / pv);
          obj.data_page = Number(obj.value_fix / dataPageTotal);

          let urlParse = new this.$zd._.urlParse(this.$zd.para.web_url);
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

          let selector = this.$zd._.querySelectorAll(obj.by_values[0]);
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
        $(wrap.ele).data('clickdata', $.extend(true, {}, data));
        wrap.attr('data-heat-place', String(key)).attr('sa-click-area', this.heatData(data.data_click)).attr('data-click', data.data_click_percent);
        if (wrap.getStyle('display') === 'inline') {
          selector[0].style.display = 'inline-block';
          $(selector[0]).attr('sa-heatmap-inlineBlock', '');
        }
      } else if (this.heatMode === 2) {
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
          $(dom.ele).data('clickdata', $.extend(true, {}, data));
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
    chooseHeatData() {
      if (this.heatMode == 2) {
        this.clearMode1()
      }
      if (this.heatMode == 1) {
        this.clearMode2()
      }
      this.calculateHeatData(this.ajaxHeatData);
    },
    refreshHeatData: function (targetVersion) {
      if (this.heatMode == 1) {
        this.clearMode1()
      }
      if (this.heatMode == 2) {
        this.clearMode2()
      }
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
    setHeatState: function (data, type, url, isFirst) {

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


        let obj = {
          'sa-request-id': data,
          'sa-request-type': type,
          'sa-request-url': sessionStorage && sessionStorage.getItem ? sessionStorage.getItem('sensors_heatmap_url') || '' : ''
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
        if (this.requestType == 1) {
          href.addQueryString(obj);
          location.href = href.getUrl();
        } else {
          sessionStorage && sessionStorage.setItem && sessionStorage.setItem('sensors_heatmap_type', this.chartType);
          // location.reload();
        }
      }
    },
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
  width: 56px;
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
}
</style>
