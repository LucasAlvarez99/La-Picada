let carrito = [];

function agregarAlCarrito(id, nombre, precio) {
  const existe = carrito.find(item => item.id === id);
  if (!existe) {
    carrito.push({ id, nombre, precio });
    actualizarContador();
  } else {
    alert('Este producto ya está en el carrito.');
  }
}

function actualizarContador() {
  document.getElementById('contadorCarrito').textContent = carrito.length;
}

function mostrarCarrito() {
  const lista = document.getElementById('listaCarrito');
  lista.innerHTML = '';

  carrito.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      ${item.nombre} - $${item.precio.toFixed(2)}
      <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${index})">✕</button>
    `;
    lista.appendChild(li);
  });

  document.getElementById('popupCarrito').style.display = 'block';
}

function cerrarCarrito() {
  document.getElementById('popupCarrito').style.display = 'none';
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarContador();
  mostrarCarrito();
}

function enviarPorWhatsApp() {
  if (carrito.length === 0) {
    alert('El carrito está vacío');
    return;
  }

  const mensaje = carrito.map(p => `• ${p.nombre} - $${p.precio.toFixed(2)}`).join('\n');
  const url = `https://wa.me/5491112345678?text=${encodeURIComponent("Hola, quiero estos productos:\n\n" + mensaje)}`;
  window.open(url, '_blank');
}
