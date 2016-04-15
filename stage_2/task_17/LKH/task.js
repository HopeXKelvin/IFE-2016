/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/
var $ = function(id) {
    return document.getElementById(id);
}
var getTagName = function(element, TagName) {
    return element.getElementsByTagName(TagName);
}

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {
};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: "北京",
  nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
  var aqiChartWrap = document.getElementById("chart-wrap");
  //渲染前需要先把之前的图表结构清除
  var childs = aqiChartWrap.childNodes;
  for(var i = childs.length-1; i >=0; i--){
      aqiChartWrap.removeChild(childs[i]);
  }

  //根据nowGraTime来进行数据的宽度的设置
  var nowGra = pageState.nowGraTime;
  var dataBarWid = 0;
  if(nowGra == "day"){
    dataBarWid = 1000/91;
  }else if(nowGra == "week"){
    dataBarWid = 1000/13;
  }else{
    dataBarWid = 1000/3;
  }

  var chartBoxDom = document.createElement("div");
  chartBoxDom.className = "chart-box";

  //渲染纵坐标
  var verticalBarDom = document.createElement("span");
  verticalBarDom.className = "vertical-bar";
  var verticalListDom = document.createElement("ul");
  verticalListDom.className = "vertical-list";
  var increment = 500;
  for(var i=0 ;i <10;i++){
    var verticalItemDom = document.createElement("li");
    verticalItemDom.className = "vertical-item";
    verticalItemDom.innerHTML = increment;
    increment -= 50;
    verticalListDom.appendChild(verticalItemDom);
  }
  verticalBarDom.appendChild(verticalListDom);
  chartBoxDom.appendChild(verticalBarDom);

  //渲染数据主体部分
  //遍历chartData得到想要的数据在进行渲染
  var nowCity = pageState.nowSelectCity;
  var targetObj = chartData[nowCity];
  var dataBarDom = document.createElement("span");
  dataBarDom.className = "datas-bar"
  var dataListDom = document.createElement("ul");
  dataListDom.className = "datas-list"
  dataBarDom.appendChild(dataListDom);
  var colorNum = 1;
  for(key in targetObj){
    var dataItemDom = document.createElement("li");
    dataItemDom.className = "data-item";
    dataItemDom.style.height = targetObj[key];
    dataItemDom.style.width = dataBarWid;
    dataItemDom.style.background = randomColor(colorNum);
    var thisKey = key,
        thisTarget = targetObj[key];
    //添加title属性，使鼠标移入到数据主体的时候，显示详细信息
    dataItemDom.setAttribute("title",thisKey+" : "+thisTarget);
    if(nowGra != "day"){
      dataItemDom.style.margin = "0 1px";
    }
    dataListDom.appendChild(dataItemDom);
    colorNum++;
  }
  chartBoxDom.appendChild(dataBarDom);
  aqiChartWrap.appendChild(chartBoxDom);

  //渲染横坐标
  var horizontalBarDom = document.createElement("div");
  horizontalBarDom.className = "horizontal-bar";
  var horizontalListDom = document.createElement("ul");
  horizontalListDom.className = "horizontal-list";
  horizontalBarDom.appendChild(horizontalListDom);
  var yearStr = "";
  if(nowGra == "day"){
    yearStr = "2016(日空气质量)";
    var titleYearDom = document.createElement("p");
    titleYearDom.innerHTML = yearStr;
    titleYearDom.style.textAlign = "center";
    horizontalBarDom.appendChild(titleYearDom);
  }
  for(key in targetObj){
    var horizontalItemDom = document.createElement("li");
    horizontalItemDom.className = "horizontal-item";
    var firstStr = "";
    if(nowGra != "day"){
      var firstStr = key;
    }
    horizontalItemDom.innerHTML = firstStr;
    horizontalItemDom.style.width = dataBarWid;
    horizontalListDom.appendChild(horizontalItemDom);
  }
  chartBoxDom.appendChild(horizontalBarDom);
  aqiChartWrap.appendChild(chartBoxDom);
}

//产生随机颜色方法
function randomColor(colorNum){
  var colorArray = ["#000000","#000099","#00CC00","#00CC99","#660000","#CCCC00","#FF0066","#FFFF00","#444444","#0099FF","#336600"];
  return colorArray[colorNum%(colorArray.length)];
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
 function graTimeChange() {
     if (this.value == pageState.nowGraTime)
         return;
     else {
         pageState.nowGraTime = this.value;

     }
     initAqiChartData();
     renderChart();
     // 调用图表渲染函数
 }

/**
 * select发生变化时的处理函数
 */
 function citySelectChange() {
     // 确定是否选项发生了变化
     if (this.value == pageState.nowSelectCity)
         return;
     else {
         pageState.nowSelectCity = this.value;
        //  alert(pageState.nowSelectCity);
     }
     renderChart();
     // 设置对应数据

     // 调用图表渲染函数
 }

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
 function initGraTimeForm() {
     var form = $('form-gra-time');
     var input = getTagName(form, 'input');
     for (var i = 0; i < input.length; i++) {
         input[i].onclick = graTimeChange;
     }
 }

/**
 * 初始化城市Select下拉选择框中的选项
 */
 function initCitySelector() {
     // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
     var city = $('city-select');
     var cList = [];
     for (var item in aqiSourceData) {
         var text = "<option value=" + item + ">" + item + "</option>";
         cList.push(text);
     }
     text = cList.join('');
     city.innerHTML = text;
     // 给select设置事件，当选项发生变化时调用函数citySelectChange
     city.onchange = citySelectChange;

 }

/**
 * 初始化图表需要的数据格式
 */
 function initAqiChartData() {
     // 将原始的源数据处理成图表需要的数据格式
     // 处理好的数据存到 chartData 中
     aqiSourceData1 = aqiSourceData;
     if (pageState.nowGraTime == 'day')
         chartData = aqiSourceData;
     else if (pageState.nowGraTime == 'week') {
         chartData = {};
         for (var city in aqiSourceData1) {
             var cityAqi = aqiSourceData1[city];
             var sum = 0,
                 i = 1,
                 num = 0,
                 data = {};
             for (var dayAqi in cityAqi) {
                 var date = new Date(dayAqi)
                 if (date.getDay() != 0) {
                     sum += cityAqi[dayAqi];
                     num++;
                 } else {
                     sum += cityAqi[dayAqi];
                     num++;
                     data['第' + i + '周'] = parseInt(sum / num);
                     i++;
                     sum = 0;
                     num = 0;
                 }
             }
             chartData[city] = data;
         }
     } else if (pageState.nowGraTime == 'month') {
         chartData = {};
         for (var city in aqiSourceData1) {
             var cityAqi = aqiSourceData1[city];
             var lastmonth = -1,
                 first = false,
                 num = 0,
                 sum = 0,
                 data = {};
             for (dayAqi in cityAqi) {
                 var date = new Date(dayAqi);
                 if (first == false) {
                     lastmonth = date.getMonth();
                     first = true;
                     num++;
                     sum += cityAqi[dayAqi];

                 } else {
                     if (lastmonth != date.getMonth()) {
                         lastmonth = date.getMonth();
                         data['第' + (date.getMonth()) + '月'] = parseInt(sum / num);
                         num = 1;
                         sum = cityAqi[dayAqi];
                     } else {
                         num++;
                         sum += cityAqi[dayAqi];
                     }
                 }

             }
             data['第' + (date.getMonth() + 1) + '月'] = parseInt(sum / num);
             chartData[city] = data;
         }
     }
     //初始化第一次也需要渲染一次图表？
     renderChart();
 }

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

init();
