let canvas = document.querySelector("canvas.view");
let ctx = canvas.getContext("2d");

let canvasData = {
  img: {
    url: "",
    width: 0,
    height: 0,
  },
  filters: {
    brightness: "",
    saturate: "",
    invert: "",
    grayscale: "",
  },
  currentFilter: document
    .querySelector(".filter-options .active")
    .getAttribute("data-filter"),
};

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function clearCanvasObj(clearImg) {
  // ! make a loop here excluding the img
  for(property of Object.keys(canvasData.filters)) {
    canvasData.filters[property] = "";
  }

  if (!clearImg) return;

  for(property of Object.keys(canvasData.img)) {
    canvasData.img[property] = "";
  }
}

function drawImg(img = document.querySelector("#accepted-img"), x = 0, y = 0, w = canvasData.img.width, h = canvasData.img.height) {
  if (!Boolean(document.querySelector("#accepted-img"))) return;

  let xAxisFlipBtn = document.querySelector("button.flip-horizental");
  let yAxisFlipBtn = document.querySelector("button.flip-vertical");

  let [scaleX, scaleY] = [
    xAxisFlipBtn.getAttribute("data-scale-x"),
    yAxisFlipBtn.getAttribute("data-scale-y")
  ];
  let [translateX, translateY] = [0, 0]

  if (scaleX == -1) {
    x = -canvasData.img.width / 2;
    translateX = canvasData.img.width / 2;
  } else {
    x = 0;
  }
  
  if (scaleY == -1) {
    y = -canvasData.img.height / 2;
    translateY = canvasData.img.height / 2;
  } else {
    y = 0;
  }
  
  console.log("x: "+x)
  console.log("y: "+y)
  console.log("#".repeat(20))

  ctx.save();

  ctx.translate(translateX, translateY);

  ctx.scale(scaleX, scaleY);

  ctx.drawImage(
    img,
    x,
    y,
    w,
    h,
  );

  ctx.restore()
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

  canvasData.img.url = URL.createObjectURL(imgInput.files[0]);

  let img = document.createElement("img");
  img.src = URL.createObjectURL(imgInput.files[0]);
  img.id = "accepted-img";

  document.body.append(img);

  // ! make promise here instead of set Time out like a cave man
  setTimeout(() => {
    let [w, h] = [img.clientWidth ,img.clientHeight];

    if (h >= 1080 || w >= 2048) {
      w /= 8;
      h /= 8;
    } else if (h >= 1080 && w >= 1920) {
      w /= 4;
      h /= 4;
    } else {
      w /= 2;
      h /= 2;
    }

    canvasData.img.height = h;
    canvasData.img.width = w;

    canvas.width = canvasData.img.width;
    canvas.height = canvasData.img.height;

    console.log(img.clientHeight)
    console.log(img.clientWidth)
  }, 1000)

  setTimeout(drawImg, 1000);

  console.log(canvasData)
});

// ! Save Image

let saveBtn = document.querySelector(".save");

saveBtn.addEventListener("click", (e) => {
  if (!Boolean(document.querySelector("#accepted-img")))
    return e.preventDefault();

  // ! make it show small alert here
  saveBtn.href = canvas.toDataURL("image/jpg");
});

// ! Remove Image

let removeImageBtn = document.querySelector(".remove-img");

removeImageBtn.addEventListener("click", () => {
  clearCanvas();

  clearCanvasObj(true);

  resetFilterValues();

  canvas.width = "";
  canvas.height = "";

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

    canvasData.filters[currentFilter] = `${input.value}%`;

    let unEmptyFilters = [];

    for (key of Object.keys(canvasData.filters)) {
      if (canvasData.filters[`${key}`] != "") {
        unEmptyFilters.push(`${key}(${canvasData.filters[key]})`)
      }
    }

    console.log(unEmptyFilters)

    ctx.filter = unEmptyFilters.join(" ")

    // ! =========================== FIX HERE
    let xAxisFlipBtn = document.querySelector("button.flip-horizental")
    let yAxisFlipBtn = document.querySelector("button.flip-vertical");

    console.log(xAxisFlipBtn.getAttribute("data-scale-x"), yAxisFlipBtn.getAttribute("data-scale-Y"))

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

function resetFilterValues () {
  clearCanvasObj(false);

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
}

let resetFiltersBtn = document.querySelector(".reset-and-file .reset");

resetFiltersBtn.addEventListener("click", resetFilterValues);

// ! mirror image (horzintal/vertical)

let xAxisFlipBtn = document.querySelector("button.flip-horizental");
let yAxisFlipBtn = document.querySelector("button.flip-vertical");

// ! ================= FIX HERE
xAxisFlipBtn.addEventListener("click", function () {
  clearCanvas();
  let scaleX = this.getAttribute("data-scale-x");
  scaleX = -scaleX;

  this.setAttribute("data-scale-x", scaleX);
  
  drawImg(
    document.querySelector("#accepted-img"),
    -canvasData.img.width / 2,
    -canvasData.img.height / 2,
  );
});

yAxisFlipBtn.addEventListener("click", function () {
  clearCanvas();
  let scaleY = this.getAttribute("data-scale-y");
  scaleY = -scaleY;

  this.setAttribute("data-scale-y", scaleY);
  
  drawImg(
    document.querySelector("#accepted-img"),
    -canvasData.img.width / 2,
    -canvasData.img.height / 2,
  );
});