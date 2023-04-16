var topic = [
    "尚未開學",
    "國定假日",
    "環境準備",
    "隨機性",
    "重複性"
  ];
  
  var startDate= new Date();
  
  function setMonthAndDay(startMonth, startDay){
    startDate.setMonth(startMonth-1,startDay);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
  }
  
  function handleDate() {
    // 獲取日期輸入元素的值
    const dateInput = document.getElementById("date");
    const dateValue = dateInput.value;
  
    // 創建Date對象
    const selectedDate = new Date(dateValue);
  
    // 從Date對象中獲取月份和日期
    const month = selectedDate.getMonth() + 1; // 月份從0開始，所以需要加1
    const day = selectedDate.getDate();
  
    // 設置社團的第一天
    setMonthAndDay(month, day);
  
    // 生成課程時間表
    $("#courseTable").empty(); // 清空表格內容
    $("#courseTable").append("<tr><th>場次</th><th>時間</th><th>主題</th></tr>");
  
    let topicCount = topic.length;
    let millisecsPerDay = 24*60*60*1000;
  
    for(var x=0;x<topicCount;x++){
      $("#courseTable").append(
        "<tr>"+
        `<td>${x+1}</td>`+
        `<td>${(new Date(startDate.getTime()+7*x*millisecsPerDay)).toLocaleDateString()}</td>`+
        `<td>${topic[x]}</td>`+
        "</tr>");
    }
  }



