const {getMarcas} = require('../APIs/Autoservice.js')

const marcaValida = async (marca) => {
    let marcas = await getMarcas();
    if(marcas === 'Ocurrio un error al obtener las marcas') return marcas;
    let arr = marcas.split(',');
    return arr.some(element => element.toString() === marca.toUpperCase());
};

const modeloValido = (modelos,modelo_usuario) =>{
    return modelos.some(element => element === Number(modelo_usuario))
};
const subMarcaValido = (submarcas, submarca_usuario) => {
    return submarcas.some(element => element === submarca_usuario)
};
const aseguradoraValida = (aseguradora) => {
    const aseguradoras = ['AXA', 'GNP', 'QUALITAS', 'ANA', 'MAPFRE', 'CHUBB']
    return aseguradoras.some(element => element === aseguradora.toUpperCase());
};

const rfcValido = (fecha, paterno, materno,nombre) => {
    const arr = fecha.split('-');
    let rfc = paterno.substring(0,2)+materno.substring(0,1)+nombre.substring(0,1)+arr[0].substring(2,4)+arr[1]+arr[2];
    return rfc;
};
const nombreValidoEjecutivo = (nombre) => {
    if(/[0-9$%_\-#"]/.test(nombre)) return false;
    let arr = nombre.split(' ');
        if(arr && arr.length === 3) {
            if (arr[0].length > 1 && arr[1].length > 1 && arr[2].length > 1)return {len: 3, data: arr};
        }
        if(arr && arr.length === 4) {
            if (arr[0].length > 1 && arr[1].length > 1 && arr[2].length > 1 && arr[3].length > 1 )return {len: 4, data: arr};
        }
        if (arr && arr.length === 5) {
            if (arr[0].length > 1 && arr[1].length > 1 && arr[2].length > 1 && arr[3].length > 1 && arr[4].length > 1) return {len: 5, data: arr};
        }
        
    return false;
};
const numeroValido = ((numero) => {
    if(/^(?!^(\d)\1{9}$)\d{10}$/.test(numero)) return numero;
    return false;
});

const correoValido = (correo) => {
    if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return correo;
    return false;
};

let numero = 8498.117822620165;

const truncate = (numero) => {
  let s = numero.toString();
  
  let puntoDecimal = s.indexOf('.');
  
  if (puntoDecimal === -1 || s.length - puntoDecimal <= 3) {
    return numero;
  }

  let resultado = s.substring(0, puntoDecimal + 3);

  return parseFloat(resultado);
}

const returnName = (nombre) => {
    let a = nombre.split(" ");
    if(a.length === 3) return a[2];
    if(a.length === 4) return a[2] + " " + a[3];
    if(a.length === 5) return a[2] + " " + a[3] + " " + a[4];
}

const VALIDACIONES = {
    marcaValida,
    modeloValido,
    subMarcaValido,
    aseguradoraValida,
    rfcValido,
    nombreValidoEjecutivo,
    correoValido,
    numeroValido,
    truncate,
    returnName
}

module.exports = VALIDACIONES;