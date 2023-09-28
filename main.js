let canvas = document.querySelector("canvas.view");
let ctx = canvas.getContext("2d");

let canvasData = {
  img: "",
  brightness: "",
  saturate: "",
  invert: "",
  grayscale: "",
  currentFilter: document
    .querySelector(".filter-options .active")
    .getAttribute("data-filter"),
};

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function clearCanvasObj() {
  canvasData.img = "";
  canvasData.brightness = "";
  canvasData.saturate = "";
  canvasData.invert = "";
  canvasData.grayscale = "";
}

function drawImg() {
  if (!Boolean(document.querySelector("#accepted-img"))) return;

  ctx.drawImage(
    document.querySelector("#accepted-img"),
    0,
    0,
    canvas.width,
    canvas.height,
  );
}

// ! Toggle Current Filter

let allFilterBtns = document.querySelectorAll(".filter-options button");
let activeFilterBtn = document.querySelector(".filter-options .active");

let allFilterBoxes = document.querySelectorAll(".current-filter .box");
let activeFilterBox = document.querySelector(".current-filter .box.active");

allFilterBtns.forEach((btn) => {
  btn.addEventListener("click", (_) => {
    allFilterBtns.forEach((btn) => {
      btn.classList.remove("active");
    });

    allFilterBoxes.forEach((box) => {
      box.classList.remove("active");
    });

    allFilterBoxes.forEach((box) => {
      if (box.getAttribute("data-filter") === btn.getAttribute("data-filter")) {
        box.classList.add("active");
      }
    });

    btn.classList.add("active");
    canvasData.currentFilter = btn.getAttribute("data-filter");

    console.log(canvasData.currentFilter);
  });
});

// ! Select image from folders
let imgInput = document.querySelector("#img-input");

imgInput.addEventListener("change", () => {
  if (Boolean(document.querySelector("#accepted-img"))) {
    document.querySelector("#accepted-img").remove();
  }

  canvasData.img = URL.createObjectURL(imgInput.files[0]);
  
  let img = document.createElement("img");
  img.src = URL.createObjectURL(imgInput.files[0]);
  img.id = "accepted-img";
  
  document.body.append(img);

  setTimeout(drawImg, 1000);
});

// ! Save Image

let saveBtn = document.querySelector(".save");

saveBtn.addEventListener("click", (e) => {
  if (!Boolean(document.querySelector("#accepted-img")))
    return e.preventDefault();

  // ! show small alert
  saveBtn.href = canvas.toDataURL("image/jpg");
});

// ! Remove Image

let removeImageBtn = document.querySelector(".remove-img");

removeImageBtn.addEventListener("click", () => {
  clearCanvas();

  clearCanvasObj()

  document.querySelector("#accepted-img").remove();
});

// ! Adjust filter value

let allFilterInputRange = document.querySelectorAll("#current-filter-range");

allFilterInputRange.forEach((input) => {
  input.addEventListener("input", () => {
    clearCanvas();

    let currentFilter = document
      .querySelector(".filter-options .active")
      .getAttribute("data-filter");

    canvasData[currentFilter] = `${input.value}%`;

    let listOfFilters = [];

    for (key of Object.keys(canvasData)) {
      if (canvasData[`${key}`] != "" && key != "img" && key != "currentFilter") {
        listOfFilters.push(`${key}(${canvasData[key]})`)
      }
    }

    console.log(listOfFilters)

    ctx.filter = listOfFilters.join(" ")

    drawImg();

    input.parentNode.querySelector(".precent").textContent = `${input.value}%`;
  });
});

// ! Rotate image 

let rotateLeftBtn = document.querySelector(".rotate-left");

rotateLeftBtn.addEventListener("click", _ => {
  clearCanvas();

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-90 * Math.PI / 180);
  ctx.translate(-(canvas.width / 2), -(canvas.height / 2));

  drawImg()
});

let rotateRighBtn = document.querySelector(".rotate-right");

rotateRighBtn.addEventListener("click", _ => {
  clearCanvas();

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(90 * Math.PI / 180);
  ctx.translate(-(canvas.width / 2), -(canvas.height / 2));

  drawImg()
});

// ! Reset Filters

let resetFiltersBtn = document.querySelector(".reset-and-file .reset");

resetFiltersBtn.addEventListener("click", _ => {
  canvasData.brightness = "";
  canvasData.saturate = "";
  canvasData.invert = "";
  canvasData.grayscale = "";

  clearCanvas();

  ctx.filter = "none"

  drawImg();

  allFilterInputRange.forEach(input => {
    let filterName = input.parentNode.getAttribute("data-filter");

    if (filterName == "saturate" || filterName == "brightness") {
      input.value = 100;
      input.parentNode.querySelector(".precent").textContent = "100%";
    } else {
      input.value = 0;
      input.parentNode.querySelector(".precent").textContent = "0%";
    }

  })
});