import OpenAI from 'openai';

const config =useRuntimeConfig();

const openai = new OpenAI({
    apiKey: config.openaiKey,
});

export default defineEventHandler(async(event)=>{
    //TODO: Verify and get user
    const {messages} = await readBody(event);

    if(!openai.apiKey){
        throw createError({
            statusCode:500,
            statusMessage:'OpenAI API Key configured'
        })
    }
    if(!messages){
        throw createError({
            statusCode:400,
            statusMessage:'Messages are required'
        })
    }

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages
    });

    return response.choices[0].message.content
});
