let canvas = document.querySelector("canvas.view");
let ctx = canvas.getContext("2d");

// ! Select image from folders
let imgInput = document.querySelector("#img-input");

imgInput.addEventListener("change", () => {
  if (Boolean(document.querySelector("#accepted-img"))) {
    document.querySelector("#accepted-img").remove();
  }

  let img = document.createElement("img");
  img.src = URL.createObjectURL(imgInput.files[0]);
  img.id = "accepted-img";

  document.body.append(img)

  setTimeout(() => {
    ctx.drawImage(document.querySelector("#accepted-img"), 0, 0, canvas.width,canvas.height)

  }, 1000)
})

// ! Save Image

let saveBtn = document.querySelector(".save");

saveBtn.addEventListener("click", (e) => {
  if (!Boolean(document.querySelector("#accepted-img"))) return e.preventDefault();

  // * show small alert
  saveBtn.href = canvas.toDataURL("image/jpg");
})