require('dotenv').config()
require('full-icu')

const express = require('express')
const cors = require('cors')
const fs = require('fs')
const morgan = require('morgan')
const path = require('path')
const app = express()
const port = 3001

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(cors())
app.use(morgan('common', { stream: accessLogStream }))

app.get('/', (req, res) => res.redirect('/currentTime'))

app.get('/currentTime', function (req, res) {
	/* 
	Request:
	locale: string, "hu-HU" | "en-EN" | ...
	type: string, "date" | "time", defaults to full date if omitted
	is12: string, "true", defaults to false if omitted or not "true"
	showSeconds: string, "true", defaults to false if omitted or not "true"
	Response:
	{"date": "2020. 05. 19.", "time": "15:44:46"} or just one of them based on the type in request
	*/
	console.log("-------------------------REQUEST-----------------------")
	console.log(req.query)
	
	try {
		const {locale, type, is12, showSeconds} = req.query
		const commonOptions = {
			timeZone: process.env.TIME_ZONE
		}
		const timeOptions = {
			hour12: is12 === 'true',
			hour: '2-digit',
			minute: '2-digit',
			... (showSeconds === 'true') && {second: '2-digit'}
		}
		//console.log(timeOptions)
	
		const date = new Date()
		const dateResponse = {
			date: date.toLocaleDateString(locale, commonOptions),
			time: date.toLocaleTimeString(locale, {...commonOptions, ...timeOptions}),
		}

		console.log("++++++++++++++++++++++++RESPONSE++++++++++++++++++++")
		//console.log(date)

		switch(type) {
			case 'date':
				res.status(200).json({date: dateResponse.date})
				break;
			case 'time':
				res.status(200).json({time: dateResponse.time})
				break;
			default:
				res.status(200).json(dateResponse)
		}
	} catch (e) {
		res.status(500).json({message: e.message})
	}
	
	
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))