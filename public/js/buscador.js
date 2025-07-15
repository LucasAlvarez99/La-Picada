document.getElementById('buscador').addEventListener('input', function () {
  const texto = this.value.toLowerCase();
  const tarjetas = document.querySelectorAll('#contenedorProductos .card');

  tarjetas.forEach(tarjeta => {
    const nombre = tarjeta.querySelector('.card-title').textContent.toLowerCase();
    tarjeta.parentElement.style.display = nombre.includes(texto) ? '' : 'none';
  });
});
