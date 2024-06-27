const OpenAI =  require('openai') ;
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.KEY});

async function messageInit(id){
    const message = await openai.beta.threads.messages.create(
        id,
        {
          role: "user",
          content: "Hola"
        }
      );
}

async function messages(id,messageUser){
    const message = await openai.beta.threads.messages.create(
        id,
        {
          role: "user",
          content: messageUser
        }
      );
}

//Messages();
module.exports = {
    messageInit,
    messages
}