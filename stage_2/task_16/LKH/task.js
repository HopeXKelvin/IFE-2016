/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
  //获取dom节点
  var cityDom = document.getElementById("aqi-city-input"),
      valueDom = document.getElementById("aqi-value-input"),
      cityValue = cityDom.value,
      aqiValue = valueDom.value,
      errorMsgList = [];
  //进行两个值的检验
  if(!isChinese(cityValue) && !isEnglish(cityValue)){
    var errMsg = "请在城市一栏输入中英文字符"
    errorMsgList.push(errMsg);
  }
  if(!isInteger(aqiValue)){
    var errMsg = "请在空气质量一栏输入整数";
    errorMsgList.push(errMsg);
  }
  //最后判断errorMsgList这个数组是否有值，有的话表示出错，显示出错信息
  if(errorMsgList.length){
    var errorStr = errorMsgList.join(" & ");
    alert(errorStr);
    errorMsgList.length = 0;//清空
  }else{
    aqiData[cityValue] = aqiValue;
  }
}

// 判断输入是否为中文字符的方法
function isChinese(str){
  var reg = /[\u4e00-\u9fa5]/;//匹配任何在[]范围内的字符
  //利用split方法分割字符串，使它变成字符串数组
  var strArr = str.split("");
  for(var i=0; i<strArr.length;i++){
    if(!reg.test(strArr[i])){
      return false;
    }
  }
  return true;
}
//判断输入是否为英文字符的方法
function isEnglish(str){
  //小写字母
  var lowerReg = /[\u0061-\u007a]/,
      upperReg = /[\u0041-\u005a]/;
  var strArr = str.split("");
  for(var i=0; i<strArr.length;i++){
    if(!lowerReg.test(strArr[i]) && !upperReg.test(strArr[i])){
      return false;
    }
  }
  return true;
}
//判断是否为整数
function isInteger(num){
  if(num%1==0){//任何整数对1求余都为0
    return true;
  }
  return false;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
  var table = document.getElementById("aqi-table");
  //每次渲染前 先删除table下面的所有子节点
  var childs = table.childNodes;
  for(var i = childs.length-1; i >=0; i--){
      // alert(childs[i].nodeName);
      table.removeChild(childs[i]);
  }
  //先判断aqiData里面是否有值，有值的情况下才渲染出表头
  if(isObj(aqiData)){
    //创建表头
    var tHeader = document.createElement("tr");
    tHeader.innerHTML = '<td>城市</td><td>空气质量</td><td>操作</td>';
    table.appendChild(tHeader);
  }
  //根据 aqiData的数据来重新渲染新的dom结构
  for(key in aqiData){
    var tr = document.createElement("tr");
    tr.innerHTML = '<td>'+key+'</td><td>'+aqiData[key]+'</td><td><button>删除</button></td>';
    table.appendChild(tr);
  }
}

//判断一个{}对象是否为空
function isObj(obj){
  for(key in obj){
    return true;
  }
  return false;
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(e) {
  // do sth.
  //判断e.target是否为button
  if(e.target && e.target.nodeName == "BUTTON"){
    var deleteTr = e.target.parentNode.parentNode;
    var deleteTd = deleteTr.firstChild;
    var delContent = deleteTd.innerHTML;
    //根据key值删除对象里面的成员
    delete aqiData[delContent];
  }
  renderAqiList();
}

function init() {
  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  var addBtn = document.getElementById("add-btn");
  addBtn.onclick = addBtnHandle;
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  //在table的tr还没有被渲染出来之前，只能给table这个父节点绑定事件
  var aqiTable = document.getElementById("aqi-table");
  aqiTable.onclick = delBtnHandle;
}

init();
