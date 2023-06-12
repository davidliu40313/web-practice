var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var brushColor = '#000000'; // 預設筆刷顏色為黑色
var brushSize = 5;
var pos = { x: 0, y: 0 };
var isErasing = false; // 新增變數以追蹤橡皮擦狀態
var isStraightLine = false;
var isRectangle = false; // 新增變數，用於判斷是否繪製矩形
var isCircle = false; // 新增變數，用於判斷是否繪製圓形
var isLine = false; // 新增變數，用於判斷是否繪製直線
var rulerStartPos = { x: 0, y: 0 };
var rulerEndPos = { x: 0, y: 0 };
var startPos = { x: 0, y: 0 };


canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseenter', setPosition);
canvas.addEventListener('mouseup', endDraw); // 新的 mouseup 事件

function startDrawing(e) {
  rulerStartPos.x = e.clientX - canvas.getBoundingClientRect().left;
  rulerStartPos.y = e.clientY - canvas.getBoundingClientRect().top;
  setPosition(e);
}

function setPosition(e) {
  pos.x = e.clientX - canvas.getBoundingClientRect().left;
  pos.y = e.clientY - canvas.getBoundingClientRect().top;
}

function draw(e) {
  if (e.buttons !== 1) return;

  var x = e.clientX - canvas.getBoundingClientRect().left;
  var y = e.clientY - canvas.getBoundingClientRect().top;

  if (isRectangle) {
    context.beginPath();
    context.lineWidth = brushSize;
    context.strokeStyle = brushColor;
    var width = x - rulerStartPos.x;
    var height = y - rulerStartPos.y;
    context.rect(rulerStartPos.x, rulerStartPos.y, width, height);
  } else if (isCircle) {
    context.beginPath();
    context.lineWidth = brushSize;
    context.strokeStyle = brushColor;
    var radius = Math.sqrt(Math.pow(x - rulerStartPos.x, 2) + Math.pow(y - rulerStartPos.y, 2));
    context.arc(rulerStartPos.x, rulerStartPos.y, radius, 0, 2 * Math.PI);
  } else if (isLine) {
    context.beginPath();
    context.lineWidth = brushSize;
    context.strokeStyle = brushColor;
    context.moveTo(rulerStartPos.x, rulerStartPos.y);
    context.lineTo(x, y);
  } else if (isErasing) {
    setPosition(e);
    context.clearRect(pos.x - brushSize / 2, pos.y - brushSize / 2, brushSize, brushSize);
  } else {
    context.beginPath();
    context.lineWidth = brushSize;
    context.lineCap = 'round';
    context.strokeStyle = brushColor;
    context.fillStyle = brushColor;
    context.moveTo(pos.x, pos.y);
    setPosition(e);
    context.lineTo(pos.x, pos.y);
    context.stroke();
  }
}

function endDraw(e) {
  if (isRectangle || isCircle || isLine) {
    context.stroke();
  }
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function saveImage() {
  var link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = 'painting.png';
  link.click();
}

function changeColor(color) {
  brushColor = color;
}

function enableEraser() {
  isErasing = !isErasing;

  var eraserButton = document.getElementById('eraserButton');
  if (isErasing) {
    eraserButton.classList.add('active');
  } else {
    eraserButton.classList.remove('active');
  }
}

function changeBrushSize(size) {
  brushSize = parseInt(size);
}

const straightLineCheckbox = document.getElementById('straightLine');
straightLineCheckbox.addEventListener('change', () => {
  isStraightLine = straightLineCheckbox.checked;
});

function enableRectangleTool() {
  isRectangle = !isRectangle;
  isCircle = false;
  isLine = false;
  canvas.style.cursor = 'crosshair';
  if (isRectangle) {
    reactButton.classList.add('active');
    lineButton.classList.remove('active');
    circleButton.classList.remove('active');
  } else {
    reactButton.classList.remove('active');
  }
}

function enableCircleTool() {
  isRectangle = false;
  isCircle = !isCircle;
  isLine = false;
  canvas.style.cursor = 'crosshair';
  if (isCircle) {
    circleButton.classList.add('active');
    lineButton.classList.remove('active');
    reactButton.classList.remove('active');
  } else {
    circleButton.classList.remove('active');
  }
}

function enableLineTool() {
  isRectangle = false;
  isCircle = false;
  isLine = !isLine;
  canvas.style.cursor = 'crosshair';
  if (isLine) {
    lineButton.classList.add('active');
    reactButton.classList.remove('active');
    circleButton.classList.remove('active');
  } else {
    lineButton.classList.remove('active');
  }
}

function handleImageUpload(event) {
  var file = event.target.files[0];
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  var reader = new FileReader();
  reader.onload = function(event) {
    var image = new Image();

    image.onload = function() {
      // 調整圖片大小以符合Canvas的尺寸
      var aspectRatio = image.width / image.height;
      var maxWidth = canvas.width;
      var maxHeight = canvas.height;

      if (aspectRatio > 1) {
        // 圖片寬度大於高度，根據寬度進行縮放
        var newWidth = maxWidth;
        var newHeight = maxWidth / aspectRatio;
        if (newHeight > maxHeight) {
          newHeight = maxHeight;
          newWidth = maxHeight * aspectRatio;
        }
      } else {
        // 圖片高度大於寬度，根據高度進行縮放
        var newHeight = maxHeight;
        var newWidth = maxHeight * aspectRatio;
        if (newWidth > maxWidth) {
          newWidth = maxWidth;
          newHeight = maxWidth / aspectRatio;
        }
      }

      // 將圖片繪製到Canvas上，根據調整後的尺寸
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.drawImage(image, 0, 0, newWidth, newHeight);
    };

    image.src = event.target.result;
  };

  reader.readAsDataURL(file);
}
