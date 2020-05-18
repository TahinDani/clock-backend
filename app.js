require('dotenv').config()
require('full-icu')
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/currentTime', function (req, res) {
	const {locale, type, is12} = req.query
	//console.log(locale, type, is12)
	switch(type) {
		case 'date':
			res.send(new Date().toLocaleDateString(locale, { timeZone: process.env.TIME_ZONE }))
			break;
		case 'time':
			res.send(new Date().toLocaleTimeString(locale, { timeZone: process.env.TIME_ZONE, hour12: is12 === 'true' }))
			break;
		default:
			res.send(new Date().toLocaleString(locale, { timeZone: process.env.TIME_ZONE, hour12: is12 === 'true' }))
	}
	
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))