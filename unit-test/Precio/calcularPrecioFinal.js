function calcularPrecioFinal(precio,descuento,impuesto){

    if(precio<0) throw new Error("Precio Invalido")
    if(descuento<0 || descuento>50) throw new Error("Descuento no permitido")
    if(impuesto <0 || impuesto>30) throw new Error("Impuesto no valido")

    let precioConDescuento = precio*(1-descuento/100)
    let precioConImpuesto = precioConDescuento * (1+impuesto/100)

    return Number(precioConImpuesto.toFixed(2))
}

module.exports = calcularPrecioFinal