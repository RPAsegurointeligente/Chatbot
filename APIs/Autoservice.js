
const axios = require('axios');
//const {tokenMag} = require('./tokenMag.js');

let tokenMag = '';

const regenerarTokenMag = async () => {
  setInterval(async () => {
        //tokenMag = await getToken();
        await getTokenMAG();
        //console.log('tokenMag generado correctamente :', token);
  },55 * 60 * 1000); //55 minutos en milisegundos55 * 60 * 1000
};

const getTokenMAG =async () => {
    let data = JSON.stringify({
        "usuario": "RPA",
        "contrasena": "Gmag2023*"
      });
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://apis.segurointeligente.mx/api/Autenticacion/GetToken',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
      try {
        let response = await axios(config);
        tokenMag = await response.data.token;
        console.log('TokenMag regenerado correctamente: ',tokenMag)
        return response.data.token;
      } catch (error) {
        console.log(error)
      }

}








//SE OBTIENEN MARCAS
const getMarcas = async () => {
    let marcasAll = '';
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://apis.segurointeligente.mx/api/Catalogos/GetMarcas',
        headers: { 
            'Authorization': `Bearer ${tokenMag}`
        }
    };

    try {
        const response = await axios(config);
        let marcas = await response.data.response;

        for (const item of marcas) {
            marcasAll += item.nombre + ',';
        }

        // Eliminar la coma adicional al final
        marcasAll = marcasAll.slice(0, -1);
        console.log(marcasAll)
        return marcasAll;
    } catch (error) {
        return 'Ocurrio un error al obtener las marcas';
    }
};

//SE OBTIENEN MODELOS
const getModelos = async (modelo) => {
    let data = JSON.stringify({
        nombreMarca: modelo,
        rango: "2000",
      });
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://apis.segurointeligente.mx/api/Catalogos/GetModelos',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenMag}`
        },
        data: data
    };
    try {
        const response = await axios(config);
        let modelos = await response.data;
        //console.log(modelos.response.anio)
        //console.log(modelos.response.nombreMarca)
        //console.log(modelos.response.rango)
        console.log('MODELOS DE ',modelo, 'respuesta', modelos )
        return modelos;
        } catch (error) {
            return  'Ocurrio un error al obtener los modelos';
    }
}

//SE OBTIENEN SUBMARCAS
const getSubMarcas = async(anio, marca) => {
    let data = JSON.stringify({
        "anio": anio,
        "nombreMarca": marca
      });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://apis.segurointeligente.mx/api/Catalogos/GetLineaSubMarca',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenMag}`
          },
        data : data
      };
      
      try {
        const response = await axios(config)
        let submarcas = response.data;
        console.log(submarcas)
        //console.log('validacion',submarcas.response.subMarca == '[]')
        //console.log('validacion',submarcas.response.subMarca == '')
        return submarcas;
        //console.log(submarcas.response.anio)
        //console.log(submarcas.response.nombreMarca)
        //console.log(submarcas.response.subMarca)
      } catch (error) {
        return 'Ocurrio un error al obtener los submodelos';
      }
}
//setTimeout(()=>{getSubMarcas('2004', 'Acura')},3000)




const getCotizar = async (marca,modelo,submarca,codigoPostal,fechaNacimiento, Genero, RFC) => {
    let data = JSON.stringify({
        marca: marca,
        modelo: modelo,
        subMarca: submarca,
        cPostal: codigoPostal,
        idGrupo: 64, //35  43 roberto el 23 de noviembre le paso a daniel por cliq el idgrupo
        emailVendedor: 'rmatinez@segurointeligente.mx',
        formaPago: 'CONTADO',
        fechaNacimiento: fechaNacimiento,
        cobertura: 'AMPLIA',
        genero: Genero,
        rfc: RFC,// QUAA740806BX9 MESG990108PS5
        /*marca: 'volkswagen',
        modelo: '2019',
        subMarca: 'jetta',
        cPostal: '04730',
        idGrupo: 43,
        emailVendedor: 'rmatinez@segurointeligente.mx',
        formaPago: 'CONTADO',
        fechaNacimiento: '1995-08-06T00:00:00.00Z',
        cobertura: 'AMPLIA',
        genero: '0',
        rfc: 'QUAA740806BX9',*/
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://apis.segurointeligente.mx/api/Cotizacion/GetCotizacion',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${tokenMag}`
      },
      data : data
    };
    try {
        let response = await axios(config);
        console.log(response.data)
        let contenido = await response.data.response;
        console.log(contenido)
        //if(response.data.message !== 'ok') throw error;
        return contenido;
    } catch (error) {
        console.log(error);
    }
    
    }

    module.exports = {
        getMarcas,
        getSubMarcas,
        getModelos,
        getCotizar,
        regenerarTokenMag,
        getTokenMAG
    }