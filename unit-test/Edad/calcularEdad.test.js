const calcularEdad = require('./calcularEdad')

test('Calcula la edad correctamente con una fecha pasada',()=>{
    expect(calcularEdad("2001-01-01")).toBe(new Date().getFullYear()-2000)
})

test("Lanza error fecha futura",()=>{
    const futureYear = new Date().getFullYear()+1
    expect(()=>calcularEdad(`${futureYear}-01-01`)).toThrow("Fecha Invalida")
})

test('Lanza error formato no valido',()=>{
    expect(()=>calcularEdad("fecha-mala")).toThrow("Formato invalido")
})

test('Calcula bien si aún no ha cumplido años en este año', () => {
    // ejemplo: nació en diciembre del año 2000
    const fecha = 2001-10-21;
    const hoy = new Date();
    let edadEsperada = hoy.getFullYear() - 2000;
    if (
      hoy.getMonth() + 1 < 12 ||
      (hoy.getMonth() + 1 === 12 && hoy.getDate() < 31)
    ) {
      edadEsperada -= 1;
    }
    expect(calcularEdad(fecha)).toBe(edadEsperada);
  });