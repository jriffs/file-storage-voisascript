export function Unique() {
    function random(min, max) {
            //check if ma and min are numbers
            if(Number(min) != 'NaN' && Number(max) != 'NaN'){
                const num = Math.floor(Math.random() * (max - min + 1)) + min;
                return num;
            }else{
                console.error('min and max should be numbers')
            }
       
    }
    const alphanum = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    let name = ''
    let n = random(5,12)
    for (let i = 0; i < n; i++) {
        name += alphanum[random(0,35)]
    }
    return name
}

