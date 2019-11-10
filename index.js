const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const { promisify } = require('util')
const sgMail = require('@sendgrid/mail')

const docId = '12kpCYB19fKFmosqWACPzss9F7NtcLxFSYrmW-W2crgE' 
const worksheetIndex = 0 
const sendKey = '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'
const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (request, response) => {
    response.render('home')
})

app.post('/', async (request, response) => {
    try{
    const doc = new GoogleSpreadsheet(docId)
    await promisify (doc.useServiceAccountAuth)(credentials)
    console.log('planilha aberta com sucesso')
    const info = await promisify(doc.getInfo)()
    const worksheet = info.worksheets[worksheetIndex]
    await promisify(worksheet.addRow)(
    { 
        name: request.body.name, 
        email: request.body.email,
        userAgent: request.body.userAgent,
        userDate: request.body.userDate,
        issueType: request.body.issueType,
        source: request.query.source || 'direct'
    })

    //Erro critico
    if(request.body.issueType === 'CRITICAL')
    {
        sgMail.setApiKey(sendGridKey)
        const msg = {
        to: 'lclucasgr2019@gmail.com',
        from: 'lclucasgr2019@gmail.com',
        subject: 'Bug Critico Reportado',
        text: `O usuario ${request.body.name} reportou um problema.`,
        html: `O usuario ${request.body.name} reportou um problema.`
        };
        sgMail.send(msg);
    }

        response.render('success')
   }catch(err)
   {
        response.send('Erro ao enviar formulario')
        console.log(err)
   }
})

app.listen(3000, (err) =>
{
    if(err)
    {
        console.log('ocorreu um erro')
    }

    else
    {
        console.log('bug tracker rodando na porta 3000')
    }
})