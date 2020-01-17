const express = require('express')
const app = express()

const jsdom = require('jsdom');
const request = require('request-promise-native');
const moment = require('moment');
moment.locale('fr');

app.get('/schedule/day', async (req, res) => {
    let date = req.query.date
    let name = req.query.name
    let lastName = req.query.lastName
    const today = moment(date + "T12:00:00")
    date = today.clone();
    let schedule = await processForOneFixedDay(date, name, lastName);
    res.send(schedule)
})

app.get('/schedule/weekDate', async (req, res) => {
    let date = req.query.date
    let name = req.query.name
    let lastName = req.query.lastName
    const today = moment(date + "T12:00:00")
    date = today.clone();
    let schedule = await processForAWeekFixedDate(date, name, lastName);
    res.send(schedule)
})

app.get('/schedule/week', async (req, res) => {
    let name = req.query.name
    let lastName = req.query.lastName
    const today = moment()
    let date = today.clone();
    let schedule = await processForAWeekFixedDate(date, name, lastName);
    res.send(schedule)
})

app.get('/schedule/nextweek', async (req, res) => {
    let name = req.query.name
    let lastName = req.query.lastName
    const today = moment()
    let date = today.clone();
    date.weekday(7);
    let schedule = await processForAWeekFixedDate(date, name, lastName);
    res.send(schedule)
})

app.get('/schedule/today', async (req, res) => {
    let name = req.query.name
    let lastName = req.query.lastName
    const today = moment()
    let date = today.clone();
    let schedule = await processForOneFixedDay(date, name, lastName);
    res.send(schedule)
})

app.get('/schedule/tomorrow', async (req, res) => {
    let name = req.query.name
    let lastName = req.query.lastName
    const today = moment()
    let date = today.clone();
    date.date(date.date() + 1);
    let schedule = await processForOneFixedDay(date, name, lastName);
    res.send(schedule)
})

app.listen(3000, () => console.log('Api listening on port 3000...'))


//Functions relative to epsi calendar behavior

async function getData (url) {
    return request(url);
}
  
function getLessonInfos (htmlBody, schedule, date, id) {
    const { JSDOM } = jsdom;
    const dom = new JSDOM(htmlBody);
    const $ = (require('jquery'))(dom.window);
    let dayOfWeek = moment(date).format('dddd');
    dayOfWeek = firstLetterToUpper(dayOfWeek);
    let month = moment(date).format('MMMM');
    month = firstLetterToUpper(month);
  
    const tab = $('.Ligne');
  
    for (let i = 0; i < tab.length; i++) {
        var dateLesson = `${dayOfWeek} ${date.date()} ${month}`;
        const matiere = $($(tab[i]).find('.Matiere')).html();
        const debut = $($(tab[i]).find('.Debut')).html();
        const fin = $($(tab[i]).find('.Fin')).html();
        let prof = $($(tab[i]).find('.Prof')).html();
        prof = prof.replace('\n', "")
        const salle = $($(tab[i]).find('.Salle')).html();
        id = id + i
        let isoDate = date.toDate()

        schedule.push(
            {
                id: id.toString(),
                date: dateLesson,
                ISOdate: isoDate,
                matiere: matiere,
                debut: debut,
                fin: fin,
                salle: salle,
                prof: prof
            }
        )
    }
    return schedule, id;
}
  
function getUrl (day, month, year, name, lastName) {
    return `http://edtmobilite.wigorservices.net/WebPsDyn.aspx?Action=posETUD&serverid=i&tel=${name}.${lastName}&date=${month}/${day}/${year}%208:00`;
}
  
function firstLetterToUpper (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
  
async function processForOneFixedDay (date, name, lastName) {
    let schedule = []
    const url = getUrl(date.date(), date.month() + 1, date.year(), name, lastName);
    const htmlBody = await getData(url);
    schedule, id = getLessonInfos(htmlBody, schedule, date, 0);
    
    return schedule;
}
  
async function processForAWeekFixedDate(date, name, lastName) {
    let schedule = []
    let id = 0
    for (let i = 0; i < 5; i++) {
        date.weekday(i);
        const url = getUrl(date.date(), date.month() + 1, date.year(), name, lastName);
        const htmlBody = await getData(url);
        schedule, id = getLessonInfos(htmlBody, schedule, date, id);
        id++
    }
  
    return schedule;
}