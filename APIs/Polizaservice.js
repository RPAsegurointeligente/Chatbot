const axios = require('axios');



const sendPolicy = async (poliza,correo) => {
    try {
      const response = await axios('https://legacy.segurointeligente.mx/Formularios/descargar-poliza.aspx/enviarpoliza',{
      method: 'post',
      maxBodyLength: Infinity,  
      data: JSON.stringify({
          "IdCont": "894225",
          "IdDocto": "1397880",
          "NoPoliza": poliza,
          "Correo": correo
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log(response)
      if(response.status >= 200 && response.status <= 299)return response;
      else throw new Error('Error en la peticion');
    } catch (error) {
      console.log('se presento el siguiente error: ', error)
      return error;
    }
  };

const searchPolicy = async (poliza) =>{
    try {
    const response = await axios('https://wsservicios.gmag.com.mx/SI/Formularios/PagaTuPoliza/ConsultaPolizasDocumento',{
    method: 'post',
    maxBodyLength: Infinity,  
    data:  JSON.stringify({
            "API_USUARIO": {
                "USUARIO": "ADMIN",
                "CONTRASENIA": "Hola123"
              },
              "POLIZA": {
                "DOCUMENTO": poliza
              }
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    console.log(response)
    console.log(response.data)
    if(response.status >= 200 && response.status <= 299) return response.data;
    else throw new Error('Error en la peticion')
    
    } catch (error) {
      console.log(error)
        return error;
    }
    
}

//setTimeout(()=>{sendPolicy()},3000)

module.exports = {
  sendPolicy,
  searchPolicy
}