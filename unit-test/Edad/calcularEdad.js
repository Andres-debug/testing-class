function calcularEdad(fechaNacimiento) {
    const fecha = new Date(fechaNacimiento);
    const hoy = new Date();
  
    if (isNaN(fecha)) throw new Error("Formato inválido");
    if (fecha > hoy) throw new Error("Fecha inválida");
  
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const noCumplio =
      hoy.getMonth() < fecha.getMonth() ||
      (hoy.getMonth() === fecha.getMonth() && hoy.getDate() < fecha.getDate());
  
    return noCumplio ? edad - 1 : edad;
  }
  
  module.exports = calcularEdad;