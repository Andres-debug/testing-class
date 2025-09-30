const calcularPrecioFinal = require('./calcularPrecioFinal')

test('Devuelve el precio original si el descuento es 0 y el impuesto es igual a 0',()=>{
    expect(calcularPrecioFinal(100,0,0)).toBe(100)
})

test('Aplica descuento valido correctamente',()=>{
    expect(calcularPrecioFinal(200,10,0)).toBe(180)
})

test('Aplica descuento y luego impuesto',()=>{
    expect(calcularPrecioFinal(100,10,19)).toBe(107.10)
})

test('Lanza error si descuento es mayor al 50%',()=>{
    expect(()=> calcularPrecioFinal(200,60,0)).toThrow("Descuento no permitido")
})

test('Lanza error si el impuesto es mayor a 30%',()=>{
    expect(()=>calcularPrecioFinal(100,10,50)).toThrow("Impuesto no valido")
})

test('Lanza error si el precio es negativo',()=>{
    expect(()=>calcularPrecioFinal(-50,10)).toThrow("Precio Invalido")
})

test('Resultado con decimales redondeados a 2 cifras',()=>{
    expect(calcularPrecioFinal(100,5,10)).toBe(104.50)
})