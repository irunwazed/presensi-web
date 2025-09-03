
type Account = {
    name: string,
    username: string,
    password: string,
    token: string,
    phId: string,
    phType: string,
    phManufacturer: string,
    phModel: string,
    phProduct: string
}

export const getAccount = (username: string):Account|null => {
    const accounts:Account[] = [
        {
            name:"AHMAD KHAIRUN ARSYAD",
            username: "199710262023211003",
            password: "Qwerty12345@",
            token: "df491591ummrle8v912vvmbdcbnrmmom",
            phId: "49b956bf737edce5",
            phType: "GSM",
            phManufacturer: "Xiaomi",
            phModel: "24069PC21G",
            phProduct: "peridot_global",
        }
    ]

    for(let i = 0; i < accounts.length; i++){
        if(accounts[i].username == username){
            return accounts[i]
        }
    }
    return null
}