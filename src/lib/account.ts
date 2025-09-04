
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
        },
        {
            name:"RIEVKY ARDIKA PUTRA, S.Kom",
            username: "199012072022031003",
            password: "0248443792Myasn",
            token: "df491591ummrle8v912vvmbdcbnrmmom",
            phId: "605484158e9b96c0",
            phType: "GSM",
            phManufacturer: "Xiaomi",
            phModel: "22021211RG",
            phProduct: "munch_id",
        },
        {
            name:"SURIPTO, S.Kom.",
            username: "199209242023211016",
            password: "5URIPT0@bkn2024",
            token: "7na6u3bvc8ei77fgdh7u2ahg0j169fjk",
            phId: "2ce92207806d77a8",
            phType: "GSM",
            phManufacturer: "samsung",
            phModel: "SM-M325FV",
            phProduct: "m32xx",
        },
        {
            name:"DANANG TRISDIANA PUTRA, S.Kom.",
            username: "199804112024211004",
            password: "Admin54321.Ayunku",
            token: "7h4gsbcatf1v84ul5aalsp2qk17rpauc",
            phId: "97644af1e96963b5",
            phType: "GSM",
            phManufacturer: "Xiaomi",
            phModel: "22071212AG",
            phProduct: "plato_id",
        },
    ]

    for(let i = 0; i < accounts.length; i++){
        if(accounts[i].username == username){
            return accounts[i]
        }
    }
    return null
}