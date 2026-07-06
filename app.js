const cards = document.querySelector(".cards");
const input = document.querySelector("#search");
const backButton = document.querySelector("#back-products");
const main = document.querySelector("main");
let carrito = [];
const toast = document.querySelector("#toast");

function mostrarToast(mensaje) {
  toast.textContent = mensaje;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}
function createCard(product) {
  const card = document.createElement("div");
  card.classList.add("card");
  const front = createFront(product);
  card.appendChild(front);
  const back = createBack(product);
  const btnView = front.querySelector(".btn-view");
  const btnBuy = back.querySelector(".btn-buy");
  const btnBack = back.querySelector(".btn-back");
  btnView.addEventListener("click", () => {
    front.style.display = "none";
    back.style.display = "flex";
  });

  btnBuy.addEventListener("click", (e) => {
    e.preventDefault();

    const existingItem = carritoList.querySelector(
      `li[data-name="${product.name}"]`,
    );

    if (existingItem) {
      const quantitySpan = existingItem.querySelector(".quantity");
      quantitySpan.textContent = parseInt(quantitySpan.textContent) + 1;
    } else {
      const listItem = document.createElement("li");
      listItem.setAttribute("data-name", product.name);
      const price = product.price;
      // const price = parseFloat(
      //   product.price.replace("$", "").replace(".", "").replace(",", "."),
      // );
      listItem.dataset.price = price;

      listItem.innerHTML = `
          <span>
              ${product.name} - $${price.toFixed(2)}
          </span>

          <div class="cart-controls">
              <button class="btnMinus">-</button>

              <span class="quantity">1</span>

              <button class="btnPlus">+</button>

              <button class="btnDelete">✖</button>
          </div>
      `;

      const btnPlus = listItem.querySelector(".btnPlus");
      const btnMinus = listItem.querySelector(".btnMinus");
      const btnDelete = listItem.querySelector(".btnDelete");
      const quantitySpan = listItem.querySelector(".quantity");
      btnPlus.addEventListener("click", () => {
        quantitySpan.textContent = parseInt(quantitySpan.textContent) + 1;
        actualizarTotal();
        actualizarContador();
      });
      btnMinus.addEventListener("click", () => {
        let cantidad = parseInt(quantitySpan.textContent);

        if (cantidad > 1) {
          quantitySpan.textContent = cantidad - 1;
        } else {
          listItem.remove();
        }
        actualizarTotal();
        actualizarContador();
      });

      btnDelete.addEventListener("click", () => {
        listItem.remove();
        actualizarTotal();
        actualizarContador();
      });
      carritoList.appendChild(listItem);
      actualizarTotal();
      actualizarContador();
    }

    mostrarToast(`${product.name} agregado al carrito.`);
  });
  btnBack.addEventListener("click", () => {
    front.style.display = "flex";
    back.style.display = "none";
  });
  card.appendChild(back);
  cards.appendChild(card);
}

function createFront(product) {
  const front = document.createElement("div");
  front.classList.add("front-div");

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("image-container");

  const image = createImage(product);

  imageContainer.appendChild(image);

  front.appendChild(createTitle(product));
  front.appendChild(imageContainer);
  front.appendChild(createPrice(product));
  front.appendChild(createButton("View More", "btn-view"));

  return front;
}
function createBack(product) {
  const back = document.createElement("div");
  const btnBuy = createButton("Add to cart", "btn-buy");
  const btnBack = createButton("Go back", "btn-back");
  const title = createTitle(product);
  const ul = createSpecs(product);
  back.classList.add("back-div");
  back.appendChild(title);
  back.appendChild(ul);
  back.appendChild(btnBack);
  back.appendChild(btnBuy);
  return back;
}
function createButton(text, classname) {
  const button = document.createElement("button");
  button.classList.add("buttons");
  button.classList.add(classname);
  button.textContent = text;
  return button;
}

function createTitle(product) {
  const title = document.createElement("h2");
  title.classList.add("title");
  title.textContent = product.name;
  return title;
}
function createImage(product) {
  const image = document.createElement("img");
  image.classList.add("product-image");
  image.src = product.image;
  image.alt = product.name;
  return image;
}

function createPrice(product) {
  const price = document.createElement("span");
  price.classList.add("price");
  price.textContent = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(product.price);
  // price.textContent = product.price;
  return price;
}
function createListItem(spec) {
  const li = document.createElement("li");
  li.classList.add("list-item");
  li.textContent = spec;
  return li;
}
function createSpecs(product) {
  const ul = document.createElement("ul");
  const specs = product.specs;
  ul.classList.add("list");
  specs.forEach((spec) => {
    const li = createListItem(spec);
    ul.appendChild(li);
  });
  return ul;
}
function renderCards(listaProductos) {
  cards.innerHTML = "";

  listaProductos.forEach(createCard);
}
function searchProduct() {
  const searchedProduct = input.value.toLowerCase();

  const filtrados = productos.filter((p) => {
    return p.name.toLowerCase().includes(searchedProduct);
  });
  if (filtrados.length === 0) {
    alert("No se encontró ningún producto.");
    return;
  }
  renderCards(filtrados);
  backButton.style.display = "block";
}

renderCards(productos);

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchProduct();
    input.value = "";
  }
});
backButton.addEventListener("click", () => {
  renderCards(productos);

  backButton.style.display = "none";

  input.value = "";
});

const btnCarrito = document.querySelector("#btn-carrito");
const modal = document.querySelector(".modal");
const closeModal = document.querySelector(".close-modal");
const modalContent = document.querySelector(".modal-content");
const carritoList = document.querySelector("#cart-items");

btnCarrito.addEventListener("click", () => {
  modalContent.style.display = "block";
  main.style.filter = "blur(5px)";
});

closeModal.addEventListener("click", () => {
  modalContent.style.display = "none";
  main.style.filter = "none";
});
const cartTotal = document.querySelector("#total-amount");
function actualizarTotal() {
  let total = 0;

  document.querySelectorAll("#cart-items li").forEach((item) => {
    const precio = Number(item.dataset.price);
    const cantidad = Number(item.querySelector(".quantity").textContent);

    total += precio * cantidad;
  });

  cartTotal.textContent = total.toFixed(2);
}
const btnComprar = document.querySelector("#btn-comprar");

btnComprar.addEventListener("click", async () => {
  if (carritoList.children.length === 0) {
    mostrarToast("El carrito está vacío.");
    return;
  }

  const items = obtenerItemsCarrito();
  localStorage.setItem(
    "ultimaCompra",
    JSON.stringify({
      productos: obtenerItemsCarrito(),
      total: cartTotal.textContent,
    }),
  );

  try {
    const response = await fetch(
      "https://tecno-store-api.onrender.com/crear-preferencia",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      },
    );

    const data = await response.json();

    window.location.href = data.init_point;
  } catch (error) {
    console.error(error);
    mostrarToast("Error al iniciar el pago.");
  }
});
function obtenerItemsCarrito() {
  const items = [];

  carritoList.querySelectorAll("li").forEach((item) => {
    items.push({
      title: item.dataset.name,
      quantity: parseInt(item.querySelector(".quantity").textContent),
      unit_price: parseFloat(item.dataset.price),
      currency_id: "ARS",
    });
  });

  return items;
}
const cartCounter = document.querySelector("#cart-counter");
function actualizarContador() {
  let total = 0;

  document.querySelectorAll("#cart-items li").forEach((item) => {
    total += Number(item.querySelector(".quantity").textContent);
  });

  cartCounter.textContent = total;

  cartCounter.style.display = total === 0 ? "none" : "flex";
}
const params = new URLSearchParams(window.location.search);
const status = params.get("status");

if (status === "success") {
  mostrarToast("¡Pago realizado con éxito!");

  carritoList.innerHTML = "";
  cartTotal.textContent = "0.00";
  actualizarContador();
  const compra = JSON.parse(localStorage.getItem("ultimaCompra"));

  if (compra) {
    document.querySelector("#order-products").innerHTML = "";

    compra.productos.forEach((producto) => {
      document.querySelector("#order-products").innerHTML += `
        <li>${producto.title} x${producto.quantity}</li>
      `;
    });

    document.querySelector("#order-total").textContent =
      `Total: $${compra.total}`;

    document.querySelector("#order-number").textContent =
      `Pedido #${Date.now()}`;

    document.querySelector("#order-modal").style.display = "block";

    localStorage.removeItem("ultimaCompra");
  }
}

if (status === "failure") {
  mostrarToast("El pago fue rechazado.");
}

if (status === "pending") {
  mostrarToast("El pago quedó pendiente.");
}
