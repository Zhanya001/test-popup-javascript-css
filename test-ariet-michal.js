const productImages = document.querySelectorAll(".link-wrapper");
let popupProduct = null;
let backdropPopup = null;
let infoCarousel = null;
let indexCarousel = 0;
let carouselContainer = null;

const createPopup = () => {
  popupProduct = document.createElement("div");
  backdropPopup = document.createElement("div");
  backdropPopup.id = "backdrop-popup";
  backdropPopup.addEventListener("click", closePopup);
  popupProduct.className = "popup-product";
  popupProduct.id = "popup-model";

  const header = document.createElement("header");
  header.className = "popup-header";

  const btnClose = document.createElement("button");
  btnClose.className = "btn-close";
  btnClose.innerText = "+";
  btnClose.style.cssText = "transform: rotate(45deg);";
  btnClose.setAttribute("aria-label", "Close");
  btnClose.addEventListener("click", closePopup);

  header.appendChild(btnClose);
  popupProduct.appendChild(header);
  document.body.append(backdropPopup, popupProduct);
};

const getInfoCarousel = async (url) => {
  const response = await fetch(url);
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const imageElements = doc.querySelectorAll(
    ".product-details .main-content .image-list .images .item .link"
  );
  const imgs = Array.from(imageElements).map((img) => ({ src: img.href }));
  const title =
    doc.querySelector(".product-details .product-name")?.innerText || "Product";

  return { imgs, title };
};

const updateCarousel = async (url) => {
  infoCarousel = await getInfoCarousel(url);

  if (carouselContainer) {
    carouselContainer.remove();
  }

  carouselContainer = document.createElement("div");
  carouselContainer.className = "wrapper-carousel";
  const titleElement = document.createElement("h2");
  titleElement.className = "carousel-title";
  titleElement.innerText = infoCarousel.title;

  const imagesContainer = document.createElement("div");
  imagesContainer.className = "container-carousel";

  infoCarousel.imgs.forEach((img) => {
    const imageElement = document.createElement("img");
    imageElement.src = img.src;
    imagesContainer.appendChild(imageElement);
  });

  const thumbsContainer = document.createElement("div");
  thumbsContainer.className = "thumbs-container";

  infoCarousel.imgs.forEach((img, index) => {
    const thumbElement = document.createElement("img");
    thumbElement.src = img.src;
    thumbElement.className = "thumb";
    thumbElement.addEventListener("click", () =>
      changeImage(index, infoCarousel.imgs.length, imagesContainer)
    );
    thumbsContainer.appendChild(thumbElement);
  });

  carouselContainer.appendChild(titleElement);
  carouselContainer.appendChild(imagesContainer);
  carouselContainer.appendChild(thumbsContainer);
  popupProduct.appendChild(carouselContainer);

  includeCarouselArrows(imagesContainer, infoCarousel.imgs.length);
};

const includeCarouselArrows = (imagesContainer, length) => {
  const arrowLeft = createArrowButton("arrow-left", () =>
    changeImage(-1, length, imagesContainer)
  );
  const arrowRight = createArrowButton("arrow-right", () =>
    changeImage(1, length, imagesContainer)
  );

  carouselContainer.append(arrowLeft, arrowRight);
};

const createArrowButton = (className, onClick) => {
  const button = document.createElement("button");
  button.className = `arrow ${className}`;
  button.innerText = className.includes("left") ? "<" : ">";
  button.addEventListener("click", onClick);
  return button;
};

const changeImage = (direction, length, imagesContainer) => {
  indexCarousel = (indexCarousel + direction + length) % length;
  imagesContainer.style.transform = `translateX(-${indexCarousel * 100}%)`;
};

// Create Popup

const setPopup = () => {
  if (!popupProduct) return;
  popupProduct.classList.add("open");
  backdropPopup.classList.add("open");
};

const closePopup = () => {
  if (!popupProduct) return;
  popupProduct.classList.remove("open");
  backdropPopup.classList.remove("open");
};

// Iterate over each element
productImages.forEach((wrapperBox) => {
  const imageWrapper = wrapperBox.querySelector(".image");

  // Create a new button element
  const wrapper = document.createElement("div");
  const wrapperLinkImage = document.createElement("a");

  wrapperLinkImage.href = wrapperBox.href;

  wrapper.className = "image-wrapper";
  const cloneImg = imageWrapper.cloneNode(true);

  const btn = document.createElement("button");
  btn.className = "quick-view-btn";
  btn.innerText = "Quick View";

  wrapper.appendChild(wrapperLinkImage);
  wrapperLinkImage.appendChild(cloneImg);
  wrapper.appendChild(btn);

  imageWrapper.parentNode.replaceChild(wrapper, imageWrapper);

  const newCard = document.createElement("div");
  const link = wrapperBox.href;

  newCard.innerHTML = wrapperBox.innerHTML;
  newCard.className = wrapperBox.className;
  wrapperBox.replaceWith(newCard);
  const btnQuickView = newCard.querySelector(".quick-view-btn");

  btnQuickView.addEventListener("click", async (event) => {
    event.preventDefault();
    await updateCarousel(wrapperBox.href);
    setPopup();
  });
});

createPopup();
