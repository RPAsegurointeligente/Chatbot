const OpenAI =  require('openai') ;
require("dotenv").config();
const deleteThreads  = require('./deleteThreads')
// COMERCIO 2 ID ASISTENTE: asst_4U0qPOZhXNCvdUeauNR7mxtj
// COMERCIO ID ASISTENTE : asst_kLmUulGX9pcp9xEPassQiL1z
const openai = new OpenAI({ apiKey: process.env.KEY});

async function runAssis(id){
  let run = await openai.beta.threads.runs.create(
      id,
      { 
        assistant_id: 'asst_kLmUulGX9pcp9xEPassQiL1z',
      }
  );
  while (['queued', 'in_progress', 'cancelling'].includes(run.status)) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1 segundo
      run = await openai.beta.threads.runs.retrieve(run.thread_id, run.id);
  }
  console.log('RUN*********', run)
  if(run.status === 'requires_action'){
    console.log(run.required_action.submit_tool_outputs.tool_calls[0])
    console.log(run.required_action.submit_tool_outputs.tool_calls[0].function.name)
    await new Promise(resolve => setTimeout(resolve,1000));
    if(['get_status_poliza','get_datos_cotizacion','get_seguimiento_cotizacion','get_carga_comprobante','get_consulta_poliza', 'get_solicitud_ejecutivo', 'get_configuracion_aseguradoras'].includes(run.required_action.submit_tool_outputs.tool_calls[0].function.name)) return run.required_action.submit_tool_outputs.tool_calls[0].function;
      
  }
  if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(run.thread_id);
      console.log('Lista de mensajes del asistente', messages)
      let lastMessageContent = ''; // Inicializa una variable para almacenar el último mensaje
      for (const message of messages.data.reverse()) {
          console.log(`${message.role} > ${message.content[0].text.value}`);
          lastMessageContent = message.content[0].text.value; // Almacena el contenido del mensaje
      }
      console.log('VARIABLE RETORNADA', lastMessageContent)
      return lastMessageContent;
  } else {
      console.log('ESTATUS DE EJECUCION DEL ASISTENTE',run.status);
      //if(run.status === 'requires_action') return {func: true}
      return ''; 
  }
}

module.exports = runAssis;