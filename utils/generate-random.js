function Unique() {
    function random(min, max) {
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        return num;
    }
    const alphanum = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    let name = ''
    let n = random(5,12)
    for (let i = 0; i < n; i++) {
        name += alphanum[random(0,35)]
    }
    return name
}

module.exports = {Unique}