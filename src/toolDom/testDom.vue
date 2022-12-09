<template>
  <div>
    <!-- <el-button type="primary" class="tt">按钮</el-button> -->
    <div class="toolbar">
      <div style="height:39px;line-height:39px;padding:3px 15px 9px">
        <div class="sa-sdk-heatmap-toolbar-selectmap" id="chooseType" style="position:relative;width:70px;float:left" title="选择查看类型">
          <div style="cursor:pointer"><span>点击图</span> <svg style="position:absolute;top:9px" width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink">
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="icon" transform="translate(-199.000000, -18.000000)" fill="#99A9BF">
                  <polygon id="Triangle-1-Copy-29" transform="translate(209.000000, 28.000000) scale(1, -1) translate(-209.000000, -28.000000) " points="209 26 213 30 205 30"></polygon>
                </g>
              </g>
            </svg></div>
          <ul style="display:none;list-style:none;margin:0;padding:0;width:100px">
            <li data-state="1">点击图</li>
            <li data-state="2">触达率图</li>
          </ul>
        </div>
        <div class="sa-sdk-heatmap-toolbar-selectmap" id="chooseVersion" style="display:none;position:relative;width:70px;float:left" title="切换点击图方案">
          <div style="cursor:pointer"><span>方案一</span> <svg style="position:absolute;top:9px" width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink">
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="icon" transform="translate(-199.000000, -18.000000)" fill="#99A9BF">
                  <polygon id="Triangle-1-Copy-29" transform="translate(209.000000, 28.000000) scale(1, -1) translate(-209.000000, -28.000000) " points="209 26 213 30 205 30"></polygon>
                </g>
              </g>
            </svg></div>
          <ul style="display:none;list-style:none;margin:0;padding:0;width:100px">
            <li data-state="1">方案一</li>
            <li data-state="2">方案二</li>
          </ul>
        </div>
        <div id="sa_sdk_heatmap_toolbar_close" style="float:right;position:relative;width:30px;height:100%;cursor:pointer" title="收起打开"><svg style="position:absolute;top:9px;right:0" width="20px"
            height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g transform="translate(-129.000000, -260.000000)" fill-rule="nonzero" fill="#99A9BF">
                <polygon points="132.110192 274.35347 130.5 272.842901 138.860144 265 147.23 272.842902 145.619784 274.35347 138.864999 268.016603"></polygon>
              </g>
            </g>
          </svg></div>
        <div style="float:right;padding:0 10px;width:1px;color:#99A9BF">|</div>
        <div id="sa_sdk_heatmap_toolbar_refresh" style="float:right;position:relative;cursor:pointer;width:30px;height:100%" title="刷新数据"><svg style="position:absolute;top:9px;left:5px" width="20px"
            height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
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
          </svg></div>
        <div style="float:right;padding:0 10px;width:1px;color:#99A9BF">|</div>
        <div id="sa_sdk_heatmap_toolbar_share" style="float:right;position:relative;width:30px;height:100%;cursor:pointer" title="打开分享" @click="lookView">
          <svg style="position:absolute;top:11px; left: 5px;" width="14px" height="15px" viewBox="0 0 14 15" version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g transform="translate(-42.000000, -62.000000)">
                <g transform="translate(39.000000, 60.000000)">
                  <rect x="0" y="0" width="20" height="20"></rect>
                  <path
                    d="M12.9177778,12.725 L7.76833333,9.72777778 C7.80444444,9.56166667 7.83333333,9.39555556 7.83333333,9.22222222 C7.83333333,9.04888889 7.80444444,8.88277778 7.76833333,8.71666667 L12.86,5.74833333 C13.25,6.10944444 13.7627778,6.33333333 14.3333333,6.33333333 C15.5322222,6.33333333 16.5,5.36555556 16.5,4.16666667 C16.5,2.96777778 15.5322222,2 14.3333333,2 C13.1344444,2 12.1666667,2.96777778 12.1666667,4.16666667 C12.1666667,4.34 12.1955556,4.50611111 12.2316667,4.67222222 L7.14,7.64055556 C6.75,7.27944444 6.23722222,7.05555556 5.66666667,7.05555556 C4.46777778,7.05555556 3.5,8.02333333 3.5,9.22222222 C3.5,10.4211111 4.46777778,11.3888889 5.66666667,11.3888889 C6.23722222,11.3888889 6.75,11.165 7.14,10.8038889 L12.2822222,13.8083333 C12.2461111,13.96 12.2244444,14.1188889 12.2244444,14.2777778 C12.2244444,15.4405556 13.1705556,16.3866667 14.3333333,16.3866667 C15.4961111,16.3866667 16.4422222,15.4405556 16.4422222,14.2777778 C16.4422222,13.115 15.4961111,12.1688889 14.3333333,12.1688889 C13.7844444,12.1688889 13.2933333,12.3855556 12.9177778,12.725 Z"
                    id="Shape" fill="#99A9BF"></path>
                </g>
              </g>
            </g>
          </svg>
        </div>
        <div style="float:right;padding:0 10px;width:1px;color:#99A9BF">|</div>
        <div id="sa_sdk_heatmap_toolbar_filter" style="float:right;position:relative;cursor:pointer;width:30px;height:100%;" title="筛选">
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
        </div>
      </div>

      <div v-show="showQR" style="z-index:999999;width:260px;height:260px;position:fixed;right:2px;top:55px;background:#FFF;box-shadow:0 2px 9px 3px rgba(168,173,178,.39);border-radius:3px;">
        <div style="height:44px;line-height:44px;border-bottom:1px solid #E9F0F7;text-align:center;color:#475669;font-size:14px;position:relative;">分享链接
          <span style="position:absolute;top:4px;color:#99A9BF;cursor:pointer;right:4px"><svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink">
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g>
                  <g transform="translate(-1.000000, -1.000000)">
                    <polygon fill="#99A9BF" transform="translate(11.106602, 11.106602) rotate(-45.000000) translate(-11.106602, -11.106602) "
                      points="12.3566017 12.3566017 12.3566017 18.6066017 9.85660172 18.6066017 9.85660172 12.3566017 3.60660172 12.3566017 3.60660172 9.85660172 9.85660172 9.85660172 9.85660172 3.60660172 12.3566017 3.60660172 12.3566017 9.85660172 18.6066017 9.85660172 18.6066017 12.3566017">
                    </polygon>
                    <rect x="1" y="1" width="20" height="20"></rect>
                  </g>
                </g>
              </g>
            </svg></span>
        </div>
        <div class="the-qr" style="width:128px;height:128px;margin-left:66px;margin-top:16px"></div>
        <div style="margin:20px">
          <input style="font-size:14px;outline:none;color:#475669;width:92%;border:1px solid #D3DCE6;border-radius:3px;height:32px;line-height:32px;padding:0 10px;" type="text" value="">
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import QRCode from './QRcode'
export default {
  name: 'test',
  components: {

  },
  props: {

  },
  data() {
    return {
      showQR: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      const qrCodeEle = document.querySelector('.the-qr')
      new QRCode(qrCodeEle, {
        text: window.location.href,
        width: 128,
        height: 128,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.L
      });
    })
  },
  methods: {
    lookView() {
      this.showQR = !this.showQR
    }
  },
}
</script>

<style scoped lang="scss">
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
