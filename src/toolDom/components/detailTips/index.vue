<template>
  <el-popover v-if="reference.show" popper-class="popper-style" placement="top-start" width="200" trigger="hover" :visible-arrow="false" @hide="hide" @after-leave="handleAfterLeave" :reference="reference.dom">
    <div style="padding: 8px;">
      <div style="color: #CACACA">当前内容</div>
      <div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{data.data_current_content}}</div>
    </div>
    <div style="background: #444; height:1px;"></div>
    <div style="padding: 8px;">
      <table style="width:100%;color:#fff;font-size:13px;background:#333;border:1px solid #333;">
        <tr>
          <td>点击次数: </td>
          <td style="text-align:right;">{{data.value_fix}}次</td>
        </tr>
        <tr>
          <td style="cursor:pointer;" title="点击次数/当前页面的浏览次数"><span style="float:left;">点击率</span>
            <span style="float:left;margin-left:3px;">
              <svg width="12px" height="12px" viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g transform="translate(-1803.000000, -158.000000)" fill="#979797">
                    <g transform="translate(1737.000000, 84.000000)">
                      <path
                        d="M71,74 C68.24,74 66,76.24 66,79 C66,81.76 68.24,84 71,84 C73.76,84 76,81.76 76,79 C76,76.24 73.76,74 71,74 L71,74 Z M71.5,82.5 L70.5,82.5 L70.5,81.5 L71.5,81.5 L71.5,82.5 L71.5,82.5 Z M72.535,78.625 L72.085,79.085 C71.725,79.45 71.5,79.75 71.5,80.5 L70.5,80.5 L70.5,80.25 C70.5,79.7 70.725,79.2 71.085,78.835 L71.705,78.205 C71.89,78.025 72,77.775 72,77.5 C72,76.95 71.55,76.5 71,76.5 C70.45,76.5 70,76.95 70,77.5 L69,77.5 C69,76.395 69.895,75.5 71,75.5 C72.105,75.5 73,76.395 73,77.5 C73,77.94 72.82,78.34 72.535,78.625 L72.535,78.625 Z"
                        id="prompt"></path>
                    </g>
                  </g>
                </g>
              </svg>
            </span>
          </td>
          <td style="text-align:right;">{{data.data_click_percent}}</td>
        </tr>
        <tr>
          <td style="cursor:pointer;" title="点击次数/当前页面的点击总次数">
            <span style="float:left;">点击占比</span>
            <span style="float:left;margin-left:3px;">
              <svg width="12px" height="12px" viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g transform="translate(-1803.000000, -158.000000)" fill="#979797">
                    <g transform="translate(1737.000000, 84.000000)">
                      <path
                        d="M71,74 C68.24,74 66,76.24 66,79 C66,81.76 68.24,84 71,84 C73.76,84 76,81.76 76,79 C76,76.24 73.76,74 71,74 L71,74 Z M71.5,82.5 L70.5,82.5 L70.5,81.5 L71.5,81.5 L71.5,82.5 L71.5,82.5 Z M72.535,78.625 L72.085,79.085 C71.725,79.45 71.5,79.75 71.5,80.5 L70.5,80.5 L70.5,80.25 C70.5,79.7 70.725,79.2 71.085,78.835 L71.705,78.205 C71.89,78.025 72,77.775 72,77.5 C72,76.95 71.55,76.5 71,76.5 C70.45,76.5 70,76.95 70,77.5 L69,77.5 C69,76.395 69.895,75.5 71,75.5 C72.105,75.5 73,76.395 73,77.5 C73,77.94 72.82,78.34 72.535,78.625 L72.535,78.625 Z"
                        id="prompt"></path>
                    </g>
                  </g>
                </g>
              </svg>
            </span>
          </td>
          <td style="text-align:right;">{{data.data_page_percent}}</td>
        </tr>
      </table>
    </div>
    <div style="background: #444; height:1px;"></div>
    <div style="padding: 8px;">
      <div style="color: #CACACA;">历史内容：</div>
      <div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{data.data_top_value}}</div>
    </div>
    <!-- <div style="background: #444; height:1px;"></div>
    <div style="padding: 6px 8px;"><a style="color:#2a90e2;text-decoration: none;" :href="data.data_user_link" target="_blank">查看用户列表</a></div> -->

  </el-popover>
</template>

<script>
export default {
  name: 'detailTips',
  components: {},
  props: {
    reference: {
      type: Object,
      default: () => ({
        show: false,
        dom: null
      })
    },
    data: {
      type: Object,
      default: () => ({}),
    },


  },
  data() {
    return {

    }
  },
  mounted() {
    // this.reference = document.querySelector('.qw')
  },
  methods: {
    handleAfterLeave() {
      this.$emit('afterLeave')
    },
    hide() {
      console.log('afterLeave-hide');
    }
  }
}
</script>

<style lang="scss">
.popper-style {
  background: rgb(51, 51, 51);
  border: 1px solid rgb(51, 51, 51);
  color: #fff;
}
</style>
