import moment from 'moment';
import * as configField from '@/constant/config';
import api from '@/api';
let util = {};
let dictMap = [];//需要复制的字典
let dictTermMap = {};//所有字典数据

util.inOf = function (arr, targetArr) {
  let res = true;
  arr.forEach(item => {
    if (targetArr.indexOf(item) < 0) {
      res = false;
    }
  });
  return res;
};

util.oneOf = function (ele, targetArr) {
  if (targetArr.indexOf(ele) >= 0) {
    return true;
  } else {
    return false;
  }
};

util.handleTitle = function (vm, item) {
  if (typeof item.title === 'object') {
    return vm.$t(item.title.i18n);
  } else {
    return item.title;
  }
};

util.getMinTime = function (date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

util.getMaxTime = function (date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
}
util.ieNewDate = function (str){
    var date,time;
    date = str.split(' ')[0].split('-');
    time = str.split(' ')[1].split(':');
    var number = [];
    for (var i = 0; i < 3; i++) {
      number[i] = Number(date[i]);
    }
    for (var j = 3; j < 6; j++) {
      number[j] = Number(time[j - 3]);
    }
    return new Date(number[0],number[1],number[2],number[3],number[4],number[5]);
}

util.getYear = function (date) {
  return date.getFullYear();
}

util.getTimeString = function(date, format = 'YYYY-MM-DD HHmm') {
  if(date == '') {
    return ''
  }
  if(date === null){
    return ''
  }
  if(date ==='Invalid date' ){
    return ''
  }
  return moment(date).format(format);
}
//只针对年
util.setTimeString = function(dateStr) {
  if(dateStr == ''||dateStr === null||dateStr ==='Invalid date' ) {
    return new Date();
  }
  dateStr=dateStr+"-01-01 00:00:01";
  return util.ieNewDate(dateStr);
}

util.formatDuration = function(durationMs) {
  if (parseInt(durationMs, 10) >= 1000) {
    return `${parseInt(durationMs, 10) / 1000} s`;
  }
  return `${durationMs} ms`;
}

/**
 * 对金额进行格式化并且赋值
 * @param my
 * @return
 */
util.DigitalFormatVal = function(val){
  if(isNaN(val)){
    val="0.00";
  }
  if(val!=""){
    var m=Math.round(val*100)/100;
    if(parseInt(m)==m){
      m=m+".00";
    }else{
      var n1=m.toString().length;
      var n2=parseInt(m).toString().length;
      if((n1-n2)==2){
        m=m+"0";
      }
    }
    if(m<0){
      m="0.00";
    }
    return m;
  }else{
    return "0.00";
  }
}

util.uuid = function(){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){
    var r=Math.random()*16|0,
      v=c=='x'?r:(r&0x3|0x8);
    return v.toString(16)
  }).toUpperCase()
}

/*util.getFlowStateMap =function(){
  var flowStateMap =[];
  flowStateMap.push({  "0" : configField.comm_flowstate_0})
  flowStateMap.push({  "1" : configField.comm_flowstate_1})
  flowStateMap.push({  "2" : configField.comm_flowstate_2})
  flowStateMap.push({  "3" : configField.comm_flowstate_3})
  flowStateMap.push({  "4" : configField.comm_flowstate_4})
  return flowStateMap;
}

util.getWorkStateMap =function(){
  var workStateMap =[];
  workStateMap.push({  "1" : configField.comm_work_state_1})
  workStateMap.push({  "2" : configField.comm_work_state_2})
  workStateMap.push({  "3" : configField.comm_work_state_3})
  workStateMap.push({  "4" : configField.comm_work_state_4})
  return workStateMap;
}

util.getpStateMap =function(){
  var pStateMap =[];
  pStateMap.push({  "A" : configField.comm_pstate_A})
  pStateMap.push({  "B" : configField.comm_pstate_B})
  pStateMap.push({  "C" : configField.comm_pstate_C})
  pStateMap.push({  "D" : configField.comm_pstate_D})
  pStateMap.push({  "E" : configField.comm_pstate_E})
  return pStateMap;
}*/

//自动补充0并+1      num:当前值,wantNum:想要几位数
util.addPreZero = function(num,wantNum){
  var str='';
  for (var i=0;i<wantNum;i++){
    str+="0";
  }
  return (str+(parseInt(num)+1)).slice(-(wantNum));
}
//自动补充0
util.addZero = function(num,wantNum){
  var str='';
  for (var i=0;i<wantNum;i++){
    str+="0";
  }
  return (str+(parseInt(num))).slice(-(wantNum));
}
util.getRandNum = function(){
  return (this.getTimeString(new Date(),"YYMM")+""+this.addZero(Math.floor ( Math.random ( ) * 90 + 10 ),2)+""+this.addZero(new Date().getSeconds(),2));
}

//version 1
util.fetchSelectOptions=function(typeCode, options) {

  var obj = {};
  obj.typeCode = typeCode;
  obj.option = options;
  dictMap.push(obj);
}
util.fetchAll=function() {
  api.dictType.getDictAll().then(res => {
    dictMap.map(item=>{
      var tmp = res.data[item.typeCode];
      if(tmp){
        tmp.map(objs=>{
          let obj = {};
          obj.value = objs.dictCode;
          obj.label = objs.dictName;
          item.option.push(obj);
        })
      }
    })
    dictMap=[];
  })
},


/*
 //version 2
util.fetchSelectOptions=function(typeCode, options) {
  var obj = {};
  obj.typeCode = typeCode;
  obj.option = options;
  dictMap.push(obj);
}
util.fetchAll=function() {
  if(JSON.stringify(dictTermMap)!='{}'){
    util.dictOperation(dictTermMap);
  }else{
    api.dictType.getDictAll().then(res => {
      dictTermMap = res.data;
      util.dictOperation(dictTermMap);
    })
  }
},
util.dictOperation=function(res){
    dictMap.map(item=>{
      var tmp = res[item.typeCode];
      if(tmp){
        tmp.map(objs => {
          let obj = {};
          obj.value = objs.dictCode;
          obj.label = objs.dictName;
          item.option.push(obj);
        })
      }
    })
    dictMap=[];
},*/
util.getRoleAll=function(roleArr){

  api.roles.getRoles({
    queryParams: {
      page:0,
      size:100000
    },
  }).then(res=>{
    console.log((res.data))
    res.data.content.map(item => {
      roleArr.push({'key':item.roleCode,"label":item.roleName,"disabled":false});
    })
    console.log((roleArr))
  });
}

util.getDeptALL=function(id,arr){

  api.orgManager.getOrgListTree({
    queryParams: {
      parentId:id,
      orgOnly:false
    }
  }).then(res => {
    arr.push(id);
    res.data.map(item => {
      arr.push(item.id);
    })
  });
}

util.getDeptByChild=function(id,arr){
  api.orgManager.getOrgChildById({
    pathParams: {
      id: id,
    }
  }).then(res => {
    arr.push(id);
    res.data.map(item => {
      arr.push(item.id);
    })
    console.log(JSON.stringify(arr))
  })
}
util.getDeptType=function (depId,deptype){
  var count=0;
  api.dictType.getUnderDictByCode({
    pathParams: {
      dictTypeCode: "KJ_CATEGORY_DEP",
    }
  }).then(res => {
    if(util.isInArrayDict(res.data.content,depId)){
      res.data.content.map(item => {
        let str ='';
        if(item.dictCode==depId){
          str=item.dictName;
          api.dictType.getUnderDictByCode({
            pathParams: {
              dictTypeCode: "KJ_CATEGORY",
            }
          }).then(res => {
            let obj = {};
            res.data.content.map(item1 => {
              if(str==item1.dictCode){
                count=1;
                obj.value = item1.dictCode;
                obj.label = item1.dictName;
                deptype.push(obj);
              }
            })
          }).then(res => {
            if(count==0){
              deptype.push({value:"ZY00",label:"未明确牵头科研机构"});
            }
          })
        }
      })
    }else{
      deptype.push({value:"ZY00",label:"未明确牵头科研机构"});
    }

  })
}
util.isInArray=function(arr,value){
  for(var i = 0; i < arr.length; i++){
    if(value === arr[i]){
      return true;
    }
  }
  return false;
}
/**
 * 在arr中是否包含arr2的值
 * @param arr
 * @param arr2
 * @returns {boolean}
 */
util.isInArrays=function(arr,arr2){
  for(var i = 0; i < arr.length; i++){
    for (const arr2Key in arr2) {
      if(arr2[arr2Key] == arr[i]){
        return true;
      }
    }
  }
  return false;
}
//
util.isInArrayDict=function(arr,value){
  for(var i = 0; i < arr.length; i++){
    return arr[i].dictCode == value;
  }
  return false;
}

util.fNumber=function (s,n){
    /*
    * 参数说明：
    * s：要格式化的数字
    * n：保留几位小数
    * */
    n = n >=0 && n <= 20 ? n : 2;
    s = parseFloat((s + "")).toFixed(n);
    return s;
}
//手机号码验证
util.isPhoneAvailable=function (val){
  var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
  if (!myreg.test(val)) {
    return false;
  } else {
    return true;
  }
}

/**
 * 座机(固定电话)校验
 * @param val
 * @returns {boolean}
 */
util.isTelPhoneAvailable=function(val){
  var isMob= /^0\d{2,3}-?\d{7,8}$/;;// 座机格式
  if(!isMob.test(val)){
    return false;
  }
  return true;
}

//邮编验证
util.isAddressAvailable=function (val){
  var myreg=/^[0-9]{6}$/;
  if (!myreg.test(val)) {
    return false;
  } else {
    return true;
  }
}
//身份证件号验证
/*
* return 1 ok
* return 0  身份证号码错误！
* return -1  身份证格式不正确!
* */
util.isIdCode=function (val){
  //15位和18位身份证号码的正则表达式
  var regIdCard=/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
  var num =1;
  var idCard =val;
  //如果通过该验证，说明身份证格式正确，但准确性还需计算
  if(regIdCard.test(idCard)){
    if(idCard.length==18){
      var idCardWi=new Array( 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ); //将前17位加权因子保存在数组里
      var idCardY=new Array( 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
      var idCardWiSum=0; //用来保存前17位各自乖以加权因子后的总和
      for(var i=0;i<17;i++){
        idCardWiSum+=idCard.substring(i,i+1)*idCardWi[i];
      }
      var idCardMod=idCardWiSum%11;//计算出校验码所在数组的位置
      var idCardLast=idCard.substring(17);//得到最后一位身份证号码
      //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
      if(idCardMod==2){
        if(!(idCardLast=="X"||idCardLast=="x")){
          num= 0;
        }
      }else{
        //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
        if(idCardLast!=idCardY[idCardMod]){
          num= 0;
        }
      }
    }
  }else{
    num= -1;
  }

  return num;
}
util.encode64=function(input) {
// base64加密开始开始
  var keyStr = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv" +
    "wxyz0123456789+/" + "=";
  var output = "";
  var chr1, chr2, chr3 = "";
  var enc1, enc2, enc3, enc4 = "";
  var i = 0;
  do {
    chr1 = input.charCodeAt(i++);
    chr2 = input.charCodeAt(i++);
    chr3 = input.charCodeAt(i++);
    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;
    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) +
      keyStr.charAt(enc3) + keyStr.charAt(enc4);
    chr1 = chr2 = chr3 = "";
    enc1 = enc2 = enc3 = enc4 = "";
  } while (i < input.length);

  return output;
}

import {PROJECT_SORT} from '@/constant/config.js';

util.sortByProjectType = function(apctype, bpctype){
  let apctypeSort = Number(PROJECT_SORT[apctype]);
  let bpctypeSort = Number(PROJECT_SORT[bpctype]);
  if(isNaN(apctypeSort)){
    apctypeSort = 0;
  }
  if(isNaN(bpctypeSort)){
    bpctypeSort = 0;
  }
  return apctypeSort - bpctypeSort;
};

export default util;
