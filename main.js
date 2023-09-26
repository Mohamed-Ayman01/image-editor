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

  // * show small alert
  saveBtn.href = canvas.toDataURL("image/jpg");
});

// ! Remove Image

let removeImageBtn = document.querySelector(".remove-img");

removeImageBtn.addEventListener("click", () => {
  clearCanvas();

  canvasData.img = "";
  canvasData.brightness = 0;
  canvasData.saturation = 0;
  canvasData.inversion = 0;
  canvasData.grayscale = 0;

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

    ctx.filter = `${currentFilter}(${canvasData[currentFilter]})`;

    drawImg();

    input.parentNode.querySelector(".precent").textContent = `${input.value}%`;
  });
});
