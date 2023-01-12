export function getDate_TimeStamp() {
    let InitDate = new Date()
    const IntlDate = new Intl.DateTimeFormat('en-us', {dateStyle: 'full', timeStyle: 'full'}).format(InitDate)
    let splt = IntlDate.split(' ')
    let dateMonth, dateDay, dateYear, timeStmp, date
    dateMonth = splt[1]
    dateDay = splt[2].split(',')[0]
    dateYear = splt[3]
    timeStmp = splt[5].split('', 5).join('')
    date = `${dateDay} ${dateMonth} ${dateYear}`
    return {date, timeStmp}
}
