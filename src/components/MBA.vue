<template>
  <div class="index" v-title="'测一测，读个MBA可好？'">
    <div class="index-col" v-if="isCol">
      <div>为了更好的体验，请竖屏使用系统</div>
    </div>
    <div v-else>
      <div>
        <div v-if="current<5" class="index-section">
          <div class="index-section-question clearfix">
            <div>{{listItem.id}}/{{list.length}}</div>
            <div>{{listItem.question}}</div>
          </div>
          <img class="index-section-image" :src="listItem.img" alt="-">
          <ul class="index-section-option">
            <li v-for="item in listItem.options" :key="item.id" :class="item.checked?'option-checked':'option-unchecked'" @click="changeOption(item, $event)">{{item.label}}</li>
          </ul>
        </div>
        <div v-else class="index-result">
          <img class="index-result-image" :src="result.img" alt="-">
          <ul class="index-result-context">
            <li v-for="(item, index) in result.context" :key="index" class="clearfix">
              <div class="context-left"></div>
              <div class="context-right">{{item}}</div>
            </li>
          </ul>
          <img class="index-result-ad" src="../assets/image/imba_result_ad.png" alt="">
        </div>
      </div>
      <img class="icon-img" src="../assets/image/imba_icon.png" alt="">
      <div class="index-footer">
        <div class="index-footer-phone clearfix">
          <div class="index-footer-phone-left">
            <input type="text" v-model="phone" placeholder="输入手机号">
          </div>
          <div class="index-footer-phone-right" @click="postPhone">申请奖学金</div>
        </div>
      </div>
      <div v-if="showDialog" class="index-dialog">
        <div class="index-dialog-content">
          <img src="../assets/image/imba_dialog.png" />
          <div @click="closeDialog"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let questions = [
      '工作中频繁的遇到新问题、新挑战，需要先学习，再处理。',
      '现有工作或事业保持不变，1年后资产能够翻倍吗？',
      '如果近期辞职，或改变事业方向，有可能收入提高50%吗？',
      '你当前的学历为',
      '可以辞职或停止工作1~2年，上学、读书、提升学历吗？',
    ],
    options = [
      [{label: '是', value: 5}, {label: '否', value: 1}, {label: '不确定', value: 3}],
      [{label: '肯定能', value: 1}, {label: '不可能', value: 5}, {label: '不确定', value: 3}],
      [{label: '肯定能', value: 1}, {label: '不可能', value: 5}, {label: '看情况', value: 3}],
      [{label: '大专', value: 3}, {label: '本科', value: 5}, {label: '硕士', value: 1}],
      [{label: '可以', value: 1}, {label: '不能', value: 5}, {label: '看情况', value: 3}]
    ],
    context = [
        ['你正处于事业的沉淀期。', '你在相对稳定且可上升的环境中沉淀自己的知识、经验或财富。', '当前，你需要在自己的“能力池”中增加一项——管理思维。', '因为沉淀过后，迎来的是事业的平庸还是晋级。', '取决于你能否站得高，看得远。', '所谓“技不压身”，在不紧不慢中增强实力，不是最完美的吗？', '当下是你读MBA的最佳时机！'],
        ['你正走向事业的成熟期，同时有下滑的可能性。', '你的勤奋、努力和坚持终于有些许回报，但一些挑战和风险让你很不安。', '因为你深知自己在“能力、知识、资本和人脉”成功四要素中有绝对短板。', '“居安思危”的意义在于，在有机会的时候努力消除潜在危机。', '读MBA能让你掌握，发现并消除危机的思维工具。'],
        ['你正在积极寻求事业的突破，或消极地窝在事业的瓶颈期。', '你多半已经看到当前事业的天花板。', '“逆水行舟，不进则退”是最能戳到你的现实。', '在重压之下，你是屈服于焦虑，还是奋起于不甘？', '取决于你能否进行思维升级。', '读MBA，可以让你习得先进的管理思维。', '识别并补足成功的短板，突破瓶颈，成功晋级。'],
        ['你正处于事业晋级的门槛，或陷入巨大的危机而不自知。', '真的不是有意激发你的焦虑和紧张。', '而是，你孜孜以求的成功，与你只差一个MBA的距离。', '读MBA, 掌握先进的管理思维，拓宽视野和人脉。', '是你一举成功、逆风翻盘的筹码。', '马上行动，选择最优的MBA项目，才是明智之举！']

    ]
let repeat = false; // 重复提交
export default {
  name: 'MBA',
  props: {
    msg: String
  },
  data() {
    return {
      list:[],
      current: 0,
      listItem: {},
      phone: '',
      score: 0,
      result: {},
      showDialog: false,
      isCol: false
    }
  },
  mounted() {
    let self = this;
    this.getList();
    this.verticalScreen();
    window.addEventListener('orientationchange', function () {
      self.verticalScreen()
    });
    this.share();
  },
  methods: {
    verticalScreen(){
      if (window.orientation == 180 || window.orientation == 0) {
        this.isCol = false;
      }else if(window.orientation == 90 || window.orientation == -90) {
        this.isCol = true;
      }
    },
    getList() {
      let item = {};
      let result = [];
      for (let i = 0; i < questions.length; i++) {
        item = {
          id: i + 1,
          question: questions[i],
          options: options[i].map((temp, index) => {
            temp.checked = false;
            temp.index = index;
            return temp
          }),
          img: this.imgSrc('imba_list_' + (i + 1))
        }
        result.push(item)
      }
      this.list = result;
      this.getListItem()
    },
    imgSrc(str) {
      return require('../assets/image/' + str + '.png');
    },
    getListItem() {
      this.listItem = this.list[this.current]
    },
    changeOption(item, e) {
      if(!repeat) {
        repeat = true;
        this.listItem.options[item.index].checked = !this.listItem.options[item.index].checked;
        this.score += this.listItem.options[item.index].value;
        setTimeout(() =>{
          this.current += 1;
          if (this.current == this.list.length) {
            this.score *= 4;
            let id = Math.floor(this.score / 20); // 当前位次
            // 结果处理
            this.result = {
              img: this.imgSrc('imba_result_title_' + id),
              context: context[id-1]
            }
          } else {
            this.getListItem();
          }
          repeat = false;
        }, 300)
        let {label, value} = item;
        this.$log.click(e, {
          targetName: '答题',
          index: this.current,
            ...{label, value}
        })
      }
    },
    postPhone(e) {
      // 提交手机号
      let phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
      if(!phoneReg.test(this.phone)) {
        this.$toast('请输入有效的手机号码！');
        return false;
      }
      this.showDialog = true;
      this.$log.click(e, {
        phone: this.phone,
        index: this.current
      })
    },
    closeDialog(e) {
      this.showDialog = false
      this.$log.click(e, {targetName: 'close dialog'})
    },
    share() {
      let result = {
        title: '真像|答完这五个问题，薪资翻倍了', // 分享标题
        desc: '简介：这个测试确实很有道理，你也来试试吧', // 分享标题
        imgUrl: 'https://ananas-img.tdf.ministudy.com/project/imba_share.png', // 分享图标
      }
      this.$share.commonShare(result)
      this.$wx.miniProgram.getEnv((res) => {
        if(res.miniProgram) {
          this.$wx.miniProgram.postMessage({data: result})
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @rem: 50rem;
  .index{
    width: 750/@rem;
    height: 100%;
    min-height: 1202/@rem;
    background: url("../assets/image/imba_bg.png") no-repeat;
    background-size: 100% 100%;
    background-color: #000;
    overflow-y: scroll;
    position: relative;

  }
  .index-section, .index-result{
    margin-top: 28/@rem;
  }
  .index-section-question{
    width: 658/@rem;
    height: 100/@rem;
    font-size: 36/@rem;
    color: #fff;
    margin-left: 30/@rem;
    div{
      width: 60/@rem;
      float: left;
    }
    div:first-child{
      padding-top: 8/@rem;
      color: #3ebade;
    }
    div:nth-child(2) {
      width: 578/@rem;
      height: 100/@rem;
      font-size: 40/@rem;
    }
  }
  .index-section-image{
    width: 750/@rem;
    height: 480/@rem;
    display: block;
  }
  .option-checked, .option-unchecked{
    width: 564/@rem;
    height: 110/@rem;
    color: #fff;
    font-size: 36/@rem;
    line-height: 110/@rem;
    text-align: center;
    margin: 22/@rem auto;
  }
  .option-checked{
    background: url("../assets/image/imba_option_checked.png") no-repeat;
    background-size: 100% 100%;
  }
  .option-unchecked{
    background: url("../assets/image/imba_option.png") no-repeat;
    background-size: 100% 100%;
  }
  .index-footer{
    position: fixed;
    bottom: 34/@rem;
  }
  .icon-img{
    display: block;
    width: 282/@rem;
    height: 40/@rem;
    margin: 50/@rem 0 30/@rem 50/@rem;
  }
  .index-footer-phone{
    >div{
     float: left;
    }
  }
  .index-footer-phone-left{
    width: 431/@rem;
    height: 78/@rem;
    background: url("../assets/image/imba_phone.png");
    background-size: 100% 100%;
    margin-left: 34/@rem;
    input{
      height: 78/@rem;
      width: 300/@rem;
      margin-left: 60/@rem;
      font-size: 28/@rem;
      color: #fff;
      background: rgba(0,0,0,0);
    }
    input::-webkit-input-placeholder{
      font-size: 28/@rem;
      color: #f8fbf8;
    }
  }
  .index-footer-phone-right{
    width: 225/@rem;
    height: 78/@rem;
    background: #ad0f01;
    border-radius: 39/@rem;
    color: #fff;
    line-height: 78/@rem;
    text-align: center;
    margin-left: 32/@rem;
  }

  /*结果页*/
  .index-result{
    .index-result-image{
      width: 429/@rem;
      height: 147/@rem;
      display: block;
      margin: 0 auto;
    }
    .index-result-context{
      width: 750/@rem;
      height: 616/@rem;
      background: url("../assets/image/imba_result_con_bg.png") no-repeat;
      background-size: 100% 100%;
      margin-top: 18/@rem;
      box-sizing: border-box;
      padding: 18/@rem 0;
      display: flex;
      align-content: space-around;
      flex-wrap: wrap;
      li{
        margin-left: 56/@rem;
        padding: 10/@rem 0;
        width: 640/@rem;
        align-self: baseline;
        div{
          float: left;
        }
        .context-left{
          width: 0;
          height: 0;
          border-top: 12/@rem solid transparent;
          border-bottom: 12/@rem solid transparent;
          border-left: 18/@rem solid skyblue;
          margin: 6/@rem 10/@rem 0 0;
        }
        .context-right{
          color: #fff;
          font-size: 28/@rem;
          width: 610/@rem;
        }
      }
    }
    .index-result-ad{
      width: 661/@rem;
      height: 222/@rem;
      display: block;
      margin: 10/@rem auto;
    }
  }
  .index-dialog{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.4);
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .index-dialog-content{
      img{
        width: 625/@rem;
        height: 660/@rem;
        display: block;
        margin: 0 auto;
      }
      div{
        width: 386/@rem;
        height: 88/@rem;
        background: url('../assets/image/imba_dialog_btn.png') no-repeat;
        background-size: 100%;
        margin: 20/@rem auto;
      }
    }
  }
  /*横屏处理*/
  .index-col{
    width: 100%;
    height: 100%;
    position: fixed;
    overflow-y: hidden;
    left: 0;
    bottom: 0;
    background-color: #313131;
    z-index: 10;
    div{
      margin-top: 150/@rem;
      text-align: center;
      color: #e5e5e5;
    }
  }
</style>
