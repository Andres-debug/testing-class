const validatorPassword = require('./passwordValidator')

test('Contraseña valida pasa la prueba',()=>{
    expect(validatorPassword("Password1")).toBe(true)
});

test('Contraseña demasiado corta falla',()=>{
    expect(validatorPassword("Pass1")).toBe(false)
})