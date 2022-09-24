export function localBodyParser(req, res, next) {
    if (typeof req.body !== 'object') {
        return next()
    }
    let keys = []
    let val = []
    let inputsArr 
    let finalInputsArr = []
    for (const key in req.body) {
        keys.push(key)
        val.push(req.body[key])
    }
    if (keys.length > 0) {
        if (keys[0].split('')[0] === '-') {
            inputsArr = val[0].split('=')
            for (let i = 0; i < inputsArr.length; i++) {
                const fieldGroup = []
                fieldGroup.push(inputsArr[i].split('\"')[1])
                fieldGroup.push(inputsArr[i].split('\"')[2].split('\n')[2].split('\r')[0])
                finalInputsArr.push(fieldGroup)
            }
            let body = {}
            for (let i = 0; i < finalInputsArr.length; i++) {
                body[`${finalInputsArr[i][0]}`] = finalInputsArr[i][1]
            }
            req.body = body
            return next()
        }
        return next()
    }
    next()
}