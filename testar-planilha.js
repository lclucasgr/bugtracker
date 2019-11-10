const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')
const { promisify } = require('util')

const addRowToSheet = async() => {
    const doc = new GoogleSpreadsheet('12kpCYB19fKFmosqWACPzss9F7NtcLxFSYrmW-W2crgE')
    await promisify(doc.useServiceAccountAuth)(credentials)
    console.log('planilha aberta')
    const info = await promisify(doc.getInfo)()
    const worksheet = info.worksheets[0]
    await promisify(worksheet.addRow)({ name: 'Lucas', email: 'lclucasgr@gmail' })
}
addRowToSheet()

/*
const doc = new GoogleSpreadsheet('12kpCYB19fKFmosqWACPzss9F7NtcLxFSYrmW-W2crgE')
doc.useServiceAccountAuth(credentials, (err) => {
    if(err)
    {
        console.log('nao foi possivel abrir a planilha')
    }
    else
    {
        console.log('planilha aberta com sucesso')
        doc.getInfo((err, info) => {
            console.log(info)
            const worksheet = info.worksheets[0]
            worksheet.addRow({ name: 'Fernando', email: 'test' }, error)
            console.log('Linha inserida com sucesso')
        })
    }
})
*/