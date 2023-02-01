// GLOBAL VARIABLES
const canvas = document.querySelector("canvas"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColor = document.querySelector("#fill-color"),
  sizeSlider = document.querySelector("#size-slider"),
  colorBtns = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#color-picker"),
  clearCanvasBtn = document.querySelector(".clear-canvas"),
  saveImgBtn = document.querySelector(".save-img");

// VARIABLES
let ctx = canvas.getContext("2d"),
  isdrawing = false,
  brushWidth = 5,
  selectedTool = "brush",
  selectedColor = "#000",
  prevMouseX,
  prevMouseY,
  snapshot;

// SET BACKGROUND WHEN DOWNLOADED

const setCanvasBackground = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

// SET CANVAS WIDTH AND HEIGHT
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

// START DRAWING
const startdrawing = (e) => {
  isdrawing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.beginPath();
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  ctx.lineWidth = brushWidth;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
  console.log(snapshot);
};

// DRAW RECTANGLE
const drawRectangle = (e) => {
  !fillColor.checked
    ? ctx.strokeRect(
        e.offsetX,
        e.offsetY,
        prevMouseX - e.offsetX,
        prevMouseY - e.offsetY
      )
    : ctx.fillRect(
        e.offsetX,
        e.offsetY,
        prevMouseX - e.offsetX,
        prevMouseY - e.offsetY
      );
};

// DRAW CIRCLE
const drawCircle = (e) => {
  ctx.beginPath();
  const radius =
    Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2)) +
    Math.pow(prevMouseY - e.offsetY, 2);
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  !fillColor.checked ? ctx.stroke() : ctx.fill();
};

// DRAW TRIANGE

const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  !fillColor.checked ? ctx.stroke() : ctx.fill();
};

// DRAWING
const drawing = (e) => {
  if (!isdrawing) return;
  ctx.putImageData(snapshot, 0, 0);
  switch (selectedTool) {
    case "brush":
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      break;
    case "rectangle":
      drawRectangle(e);
      break;
    case "circle":
      drawCircle(e);
      break;
    case "triangle":
      drawTriangle(e);
      break;
    case "eraser":
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      ctx.strokeStyle = "#fff";
    default:
      break;
  }
};

// TOOL BUTTONS
toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
    console.log(selectedTool);
  });
});

// STOP DRAWING
const stopdrawing = () => {
  isdrawing = false;
};

// CHANGE TOOL SIZE

sizeSlider.addEventListener("change", () => {
  brushWidth = sizeSlider.value;
});

// CHANGE TOOL COLORS

colorBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    const bgColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
    selectedColor = bgColor;
    console.log(selectedColor);
  });
});

// CHANGE COLORPICKER COLORS

colorPicker.addEventListener("change", () => {
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

// CLEAR CANVAS IMAGE

clearCanvasBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();
});

// SAVE PAINT IMAGE

saveImgBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `Asqar-paint${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});

// EVENT LISTENERS
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mousedown", startdrawing);
canvas.addEventListener("mouseup", stopdrawing);
