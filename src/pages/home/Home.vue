<template>
  <div>

    <svg width="5000px" height="5000px" version="1.1" xmlns="http://www.w3.org/2000/svg">

      <line v-for="line in lineArr" :x1="line.start.x" :y1="line.start.y" :x2="line.end.x" :y2="line.end.y"
        style="stroke:rgb(99,99,99); stroke-width:1; fill:black" />
    </svg>

    <template v-for="item in list">
      <template v-if="item.type === 'normal' || item.type === 'start' || item.type === 'end'">

        <div class="item" v-if="item.type === 'normal'"
          :class="item.action === 'notice' ? 'action' : ''" :style="{ left: item.x + 'px', top: item.y + 'px' }">
          <p class="name">{{ String(item.id).slice(0, 8) }}</p>
          <i v-if="item.type === 'normal'" class="icon el-icon-error" @click="deleteItem(item)"></i>
        </div>

        <div class="item sd" v-if="item.type === 'start' || item.type === 'end'"
          :style="{ left: item.x + 'px', top: item.y + 'px' }">
          <p class="name">{{ String(item.id).slice(0, 8) }}</p>
          <i v-if="item.type === 'normal'" class="el-icon-error" @click="deleteItem(item)"></i>
        </div>

        <div class="circle" @click="addCircle(item)" v-if="item.type !== 'end'"
          :style="{ left: item.x + 'px', top: (item.y + 37) + 'px' }">
        </div>

      </template>


      <div class="circle" @click="addCircle(item)" v-if="item.type === 'if'"
        :style="{ left: item.x + 'px', top: item.y + 'px' }"></div>


      <div @click="addReact(item)" class="rect" v-if="item.type === 'else'"
        :style="{ left: item.x + 'px', top: item.y + 'px' }">

        <div class="rect-bg"></div>
        <button></button>
      </div>

    </template>

    <!-- <button style="position: absolute; left: 100px; top: 100px; cursor: pointer" @click="click()">click</button> -->

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span slot="footer" class="dialog-footer">
        <el-button @click="addOthers()">其 他</el-button>
        <el-button @click="addOthers2()">条 件</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

export default {
  data () {
    return {
      list1: [],
      list2: [],
      list: [],
      gapX: 100,
      gapY: 50,
      dialogVisible: false,
      cacheItem: null,
      idx: 1,
      lineArr: [],
    }
  },

  watch: {

    list() {
      
      setTimeout(() => {
        this.createLine();
      }, 0)      
    }

  },

  created() {
    const listTest = [
      { id: '开始', x: 800, y: 100, type: 'start', source: null, target: [1] },
      { id: '结束', source: [16], type: 'end' },
      { id: 1, source: ['开始'], target: [3, 4, 5], type: 'else', final: [2] },
      { id: 3, source: [1], target: [2], type: 'normal', action: 'logic' },
      { id: 4, source: [1], target: [10], type: 'normal', action: 'logic' },
      { id: 2, source: [3, 5, 7], target: [15], type: 'if' },
      { id: 5, source: [1], target: [2], type: 'normal', action: 'logic' },
      { id: 6, source: [11], target: [8, 9], type: 'else', final: [7] },
      { id: 8, source: [6], target: [7], type: 'normal', action: 'logic' },
      { id: 9, source: [6], target: [7], type: 'normal', action: 'logic' },
      { id: 7, source: [8, 9], target: [2], type: 'if' },
      { id: 10, source: [4], target: [12, 13, 14], type: 'else', final: [11] },
      { id: 12, source: [10], target: [11], type: 'normal', action: 'logic' },
      { id: 13, source: [10], target: [11], type: 'normal', action: 'logic' },
      { id: 11, source: [12, 13, 14], target: [6], type: 'if' },
      { id: 14, source: [10], target: [11], type: 'normal', action: 'logic' },
      { id: 15, source: [2], target: [17, 18, 19, 20], type: 'else', final: [16] },
      { id: 17, source: [15], target: [16], type: 'normal', action: 'logic' },
      { id: 18, source: [15], target: [16], type: 'normal', action: 'logic' },
      { id: 16, source: [17, 18, 19, 20], target: ['结束'], type: 'if' },
      { id: 19, source: [15], target: [16], type: 'normal', action: 'logic' },
      { id: 20, source: [15], target: [16], type: 'normal', action: 'logic' },
    ]

    const list = [
      {
        id: '开始',
        x: 1000,
        y: 100,
        type: 'start',
        source: null,
        target: ['结束'],
      },
      {
        id: '结束',
        source: ['开始'],
        type: 'end',
      },
    ];

    this.list2 = list;

    this.list = this.foo(this.list2)

    const list2 = [
      {
        id: 0,
        x: 500,
        y: 100,
        type: 'start',
        source: null,
        target: [1],
        layer: 0,
      },
      {
        id: 1,
        source: [0],
        target: [2, 3],
        type: 'else',
        layer: 1,
      },
      {
        id: 2,
        source: [1],
        target: [4],
        type: 'normal',
        layer: 2,
      },
      {
        id: 3,
        source: [1],
        target: [5],
        type: 'normal',
        layer: 2,
      },
      {
        id: 4,
        source: [2],
        target: [6 ,7],
        type: 'else',
        layer: 3,
      },
      {
        id: 5,
        source: [3],
        target: [9],
        type: 'normal',
        layer: 3,
      },
      {
        id: 6,
        source: [4],
        target: [8],
        type: 'normal',
        layer: 4,
      },
      {
        id: 7,
        source: [4],
        target: [8],
        type: 'normal',
        layer: 4,
      },
      { 
        id: 8,
        source: [6, 7],
        target: [9],
        type: 'if',
        layer: 5,
      },
      {
        id: 9,
        source: [8, 5],
        target: [10],
        type: 'if',
        layer: 6,
      },
      {
        id: 10,
        source: [9],
        type: 'end',
        layer: 7,
      },
    ];
  },

  methods: {

    click () {
      const iArr = [];
      this.getPath(1, 2, iArr);
    },

    getPath(start, end, iArr) {
      const item = this.getItem(start);

      if (iArr.indexOf(start) < 0) {
        iArr.push(item.id);

        for (let id of item.target) {
          if (id !== end) {
            this.getPath(id, end, iArr);
          }
        }
      }
    },

    deleteItem (item) {

      const curItem = this.getItem(item.id);
      const sourceItem = this.getItem(item.source[0]);
      const targetItem = this.getItem(item.target[0]);

      // 通知
      if (item.action === 'notice') {

        this.removeItem(sourceItem.target, curItem.id);
        this.removeItem(targetItem.source, curItem.id);
        sourceItem.target.push(targetItem.id);
        targetItem.source.push(sourceItem.id)
        this.removeNode(curItem.id);

      // 逻辑
      } else if (item.action === 'logic') {
        const len = sourceItem.target.length;

        console.log(len);

        if (len <= 2) {
          const ids = [];

          const final = this.getItem(sourceItem.final[0]);
          const ssItem = this.getItem(sourceItem.source[0]);
          const ffItem = this.getItem(final.target[0]);

          this.removeItem(ssItem.target, sourceItem.id);
          this.removeItem(ffItem.source, final.id);
          ssItem.target.push(ffItem.id);
          ffItem.source.push(ssItem.id);

          this.getPath(sourceItem.id, final.id, ids);

          for (let id of ids) {
            this.removeNode(id);
          }

          this.removeNode(final.id);
          

        } else {
          const ids = [];

          const final = this.getItem(sourceItem.final[0]);
          this.getPath(item.id, final.id, ids);

          for (let id of ids) {
            this.removeItem(sourceItem.target, id);
            this.removeItem(targetItem.source, id);
          }

          for (let id of ids) {
            this.removeNode(id);
          }

        }

      }

      this.list = this.foo(this.list2)
    },

    removeNode (id) {
      let _index = -1;

      for (let [index, item] of this.list2.entries()) {
        if (item.id === id) {
          _index = index;
        }
      }

      this.list2.splice(_index, 1);
    },

    createLine() {
      const lineArr = [];

      const start = this.list[0];
      const self = this;

      renderLine(start);

      function renderLine(item) {

        if (item.type === 'end') return;

        let start = {
          x: item.x,
          y: item.y,
        }

        const targetArr = [];
        const targetLineArr = [];

        for (let item2 of self.list) {
          if (item.target.indexOf(item2.id) > -1) {
            targetArr.push(item2);
            targetLineArr.push({
              x: item2.x,
              y: item2.y,
            })
          }
        }

        for (let end of targetLineArr) {

          if (start.x === end.x) {
            lineArr.push({
              start: start,
              end: end,
            })
          } else {

            if (item.type === 'else') {

              lineArr.push({
                start: start,
                end: {
                  x: end.x,
                  y: start.y,
                }
              }, {
                start: {
                  x: end.x,
                  y: start.y,
                },
                end: end,
              })

            } else {
              lineArr.push({
                start: start,
                end: {
                  x: start.x,
                  y: end.y
                },
              }, {
                start: {
                  x: start.x,
                  y: end.y
                },
                end: end,
              })
            }

            

          }
         
        }

        for (let item2 of targetArr) {
          renderLine(item2);
        }
      }

      

      this.lineArr = lineArr;
    },

    addOthers2 () {
      this.dialogVisible = false;

      const curItem = this.getItem(this.cacheItem.id);
      const tarItem = this.getItem(this.cacheItem.target[0]);

      const item1 = {
        id: this.uuid(),
        source: [],
        target: [],
        type: 'else',
      };

      const item4 = {
        id: this.uuid(),
        source: [],
        target: curItem.target,
        type: 'if',
      };

      item1.final = [item4.id];
      item1.source = [curItem.id];

      const item2 = {
        id: this.uuid(),
        source: [item1.id],
        target: [item4.id],
        type: 'normal',
        action: 'logic',
      };

      const item3 = {
        id: this.uuid(),
        source: [item1.id],
        target: [item4.id],
        type: 'normal',
        action: 'logic',
      };

      item1.target = [item2.id, item3.id];
      item4.source = [item2.id, item3.id];

      curItem.target = [item1.id];
      this.removeItem(tarItem.source, curItem.id);
      tarItem.source.push(item4.id);

      this.list2.push(item1, item2, item3, item4);

      this.list = this.foo(this.list2)
    },

    addOthers() {
      this.dialogVisible = false;

      const curItem = this.getItem(this.cacheItem.id);
      const tarItem = this.getItem(this.cacheItem.target[0]);

      const newItem = {
        id: this.uuid(),
        source: [curItem.id],
        target: curItem.target,
        type: 'normal',
        action: 'notice',
      }

      curItem.target = [newItem.id];
      this.removeItem(tarItem.source, curItem.id);
      tarItem.source.push(newItem.id);

      this.list2.push(newItem);
      this.list = this.foo(this.list2)
    },

    removeItem(arr, str){
      let _index = -1;

      for (let [index, item] of arr.entries()) {
        if (item === str) {
          _index = index;
        }
      }

      if (_index > -1) {
        arr.splice(_index, 1)
      }
    },

    getItem(id) {
      let item = null;

      for (let item2 of this.list2) {
        if (item2.id === id) {
          item = item2;
        }
      }

      return item;
    },

    addIf () {
      this.dialogVisible = false;
    },

    addCircle(item) {
      this.cacheItem = item;

      this.dialogVisible = true;
    },

    render () {
      this.list2.push(newItem);
      this.list = this.foo(this.list2)
    },

    addReact(item) {

      const curItem = this.getItem(item.id);
      const tarItem = this.getItem(item.final[0]);

      const newItem = {
        id: this.uuid(),
        source: [item.id],
        target: [...item.final],
        type: 'normal',
        action: 'logic',
      }

      curItem.target.push(newItem.id);
      tarItem.source.push(newItem.id)

      // for (let item2 of this.list2) {
      //   if (item2.id === item.id) {
      //     item2.target.push(newItem.id);
      //   }

      //   if (item.target.indexOf(item2.id) > -1) {
      //     item2.source.push(newItem.id);
      //   }
      // }

      this.list2.push(newItem);
      this.list = this.foo(this.list2)
    },

    // 获取不重复id值
    uuid() {

      return this.idx++;

      // var s = [];
      // var hexDigits = "0123456789abcdef";
      // for (var i = 0; i < 36; i++) {s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);}
      // s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      // s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      // s[8] = s[13] = s[18] = s[23] = "-";

      // var uuid = s.join("");
      // return uuid;
    },

    foo(listll) {
      const self = this;
      const list = JSON.parse(JSON.stringify(listll));
      const gapX = 30;
      const gapY = 80;
      const rel = [];
      const arr = [];
      let start = null;
      let end = null;

      for (let item of list) {
        if (item.type === 'start') {
          start = item;
        }

        if (item.type === 'end') {
          end = item;
        }
      }

      foo2(end);

      foo3(start)

      return list;

      function foo3(node) {

        if (node.type === 'end') {
          return;
        } else if (node.type === 'if') {

          const sourceArr = [];
          const targetArr = [];
          let isMeetFlag = true;
          const sourceAreaArr = [];
          const xArr = [];
          let xAdd = 0;
          const yArr = [];

          for (let item of list) {
            if (node.target.indexOf(item.id) > -1) {
              targetArr.push(item);
            }

            if (node.source.indexOf(item.id) > -1) {
              sourceArr.push(item);

              if (item.x === undefined || item.y === undefined) {
                isMeetFlag = false;
              }

              xArr.push(item.x);
              xAdd += item.x;
              yArr.push(item.y);
            }
          }

          if (isMeetFlag) {
            const maxY = Math.max(...yArr);
            const mX = xAdd / sourceArr.length;

            node.x = mX;
            node.y = maxY + gapY;


            const targetArr = [];
            let add = 0;
            const widthArr = [];
            const { x, y } = node;
            let ifFlag = false;

            for (let item of list) {
              if (node.target.indexOf(item.id) > -1) {
                targetArr.push(item);
                add += item.width;
                widthArr.push(item.width);

                if (item.type === 'if') {
                  ifFlag = true;
                }
              }
            }

            if (ifFlag) {

              for (let item6 of targetArr) {
                foo3(item6);
              }

            } else {
              const maxWidth = add + (widthArr.length - 1) * gapX;
              let left = x - maxWidth / 2;

              for (let [index, item5] of targetArr.entries()) {
                item5.y = y + gapY;
                item5.x = left + item5.width / 2;

                left = left + (item5.width) + gapX;
              }

              for (let item6 of targetArr) {
                foo3(item6);
              }
            }
          }


        } else {

          const targetArr = [];
          let add = 0;
          const widthArr = [];
          const { x, y } = node;
          let ifFlag = false;

          for (let item of list) {
            if (node.target.indexOf(item.id) > -1) {
              targetArr.push(item);
              add += item.width;
              widthArr.push(item.width);

              if (item.type === 'if') {
                ifFlag = true;
              }
            }
          }

          if (ifFlag) {

            for (let item6 of targetArr) {
              foo3(item6);
            }


          } else {
            const maxWidth = add + (widthArr.length - 1) * gapX;
            let left = x - maxWidth / 2;

            for (let [index, item5] of targetArr.entries()) {
              item5.y = y + gapY;
              item5.x = left + item5.width / 2;

              left = left + (item5.width) + gapX;
            }

            for (let item6 of targetArr) {
              foo3(item6);
            }
          }
        }
      }

      function foo2(item) {
        if (item.type === 'end') {
          item.width = 0;

          const sourceArr = [];

          for (let item2 of list) {
            if (item.source.indexOf(item2.id) > -1) {
              sourceArr.push(item2);
            }
          }

          for (let item4 of sourceArr) {
            foo2(item4);
          }

        } else if (item.type === 'if') {
          item.width = 0;

          const sourceArr = [];

          for (let item2 of list) {
            if (item.source.indexOf(item2.id) > -1) {
              sourceArr.push(item2);
            }
          }

          for (let item4 of sourceArr) {
            foo2(item4);
          }

        } else {

          const targetArr = [];
          const sourceArr = [];
          let prepareFlag = true;

          for (let item2 of list) {
            if (item.target.indexOf(item2.id) > -1) {
              targetArr.push(item2);

              if (item2.width === undefined) {
                prepareFlag = false;
              }
            }

            if (item.source && item.source.indexOf(item2.id) > -1) {
              sourceArr.push(item2);
            }
          }

          if (prepareFlag) {
            let add = 0;

            for (let item3 of targetArr) {
              add += item3.width;
            }

            item.width = add + (targetArr.length - 1) * gapX;

            if (item.type === 'normal') {
              const wArr = foo4(item) || [];
              wArr.push(item.width);

              const max = Math.max(...wArr);

              item.width = max;
            }

            if (item.width <= 100) item.width = 100;

            for (let item4 of sourceArr) {
              foo2(item4);
            }
          }

        }

        function foo4(node) {

          const sourceArr = [];

          for (let item of list) {
            if (node.source.indexOf(item.id) > -1) {
              sourceArr.push(item);
            }
          }

          const sourceItem = sourceArr[0];
          const finalArr = [];

          if (sourceItem.final === undefined) return;

          const start = node.id;
          const end = sourceItem.final[0];
          const iArr = [];

          self.getPath(start, end, iArr);

          const iiArr = [];
          const wArr = []

          for (let item of list) {
            if (iArr.indexOf(item.id) > -1) {
              iiArr.push(item);
              wArr.push(item.width || 0)
            }
          }

          return wArr;

        //   const sourceItem = sourceArr[0];
        //   const finalArr = [];

        //   if (sourceItem.final === undefined) return;

        //   for (let item of list) {
        //     if (sourceItem.final.indexOf(item.id) > -1) {
        //       finalArr.push(item);
        //     }
        //   }

        //   const finalIndex = sourceItem.final[0];
        //   const finalItem = finalArr[0];
        //   const widthArr = [];

        //   foo5(node, finalIndex);

        //   return widthArr;
          
        //   function foo5(node, final) {
        //     widthArr.push(node.width);

        //     const targetArr = [];
        //     let flag = true;


        //     if (node.target === undefined) return;

        //     for (let item of list) {
        //       if (node.target.indexOf(item.id) > -1) {
        //         targetArr.push(item);

        //         if (item.id === final) {
        //           flag = false;
        //         }
        //       }
        //     }

        //     if (flag === false) {
        //       return;
        //     }

        //     if (flag) {
        //       for (let item2 of targetArr) {
        //         foo5(item2);
        //       }
        //     }
        //   }
        // }
        }
      }

      return rel;
    }
  }
}

</script>

<style>
  .rect button{
    position: absolute;
    left: 50%;
    width: 30px;
    cursor: pointer;
    background: none;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .rect{
    cursor: pointer;
    position: absolute;
    width: 20px;
    height: 20px;
    transform: translate(-50%, -50%);
    background: none;
  }
  .rect-bg{
    width: 20px;
    height: 20px;
    background: red;
    transform: rotate(45deg);
  }
  .circle button{
    cursor: pointer;
    font-size: 12px;
  }
  .circle{
    cursor: pointer;
    position: absolute;
    background: yellow;
    width: 20px;
    height: 20px;
    overflow: hidden;
    text-align: center;
    transform: translate(-50%, -50%);
    border-radius: 50%;
  }
  body{
    width: 5000px;
    height: 5000px;
    overflow: scroll;
  }
  .item{
    width: 100px;
    height: 50px;
    background: #83c4cb;
    position: absolute;
    transform: translate(-50%, -50%);
  }
  .item i{
    position: absolute;
     right: 5px;
     top: 5px;
     cursor: pointer;
  }
  .name{
    text-align: center;
    color:red
  }
  .bottom button{
    cursor: pointer;
  }
  .bottom{
    display: flex;
    justify-content: space-between;
  }
  .svgbox{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .line1{
    border: 1px solid #666;
    position: absolute;
    width: 2px;
    height: 2px;
  }
  .logic{
    background: #93b4e4 !important;
  }
  .action{
    background: #93b4e4 !important;
  }
  .sd{
    background: #efdbdd;
  }
  .item:hover .icon{
    display: block;
  }
  .item .icon{
    display: none;
  }
</style>
