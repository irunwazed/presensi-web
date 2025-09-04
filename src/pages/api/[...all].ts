import type { APIRoute } from 'astro';
import { HTTPResponse, requestGet, requestPost } from '../../lib/request';
import { getTimeRangeResult } from '../../lib/time';
import { getAccount } from '../../lib/account';
import { getAddress, getPosisi } from '../../lib/map';

type Handler = (req: Request, params: Record<string, string>) => Promise<Response> | Response;

// Router map: key = "METHOD:/path", value = handler function
const routes = new Map<string, Handler>();

const API_URL:string = import.meta.env.API_URL ?? ""


// Register route POST /api/echo
routes.set('GET:/', async (req) => {
    return HTTPResponse({
        status: 200,
        message: "selamat data"
    })
});

// Register route GET /api/hello
routes.set('POST:/login', async (req) => {
    const { username, password, totp } = await req.json();

    const ph = getAccount(username)
    if(!ph){
        return HTTPResponse({
            status: 401, message: "tidak terdaftar"
        })
    }

    const payload = {
        u: username,
        p: password,
        otp: totp,
        d: '4ndr01d-0pt1mu5-p121m3',
        "ph-id": ph.phId,
        "ph-type": ph.phType,
        "ph-manufacturer": ph.phManufacturer,
        "ph-model": ph.phModel,
        "ph-product": ph.phProduct
    };
    const pre: any = await requestPost(API_URL + "/login", payload)
    if (!pre?.session_id) {
        return HTTPResponse({
            status: 400, message:  pre?.message || 'username, password, otp tidak cocok'
        })
    }

    const token = pre?.session_id
    return new Response(JSON.stringify({ message: 'Berhasil login', token: token }), {
        headers: { 'Content-Type': 'application/json' },
    });
});


routes.set('GET:/resume', async (req) => {

    const auth = req.headers.get('authorization');
    let bearerToken: string | null = null;
    if (auth && auth.startsWith('Bearer ')) {
        bearerToken = auth.slice(7);
    }
    if (!bearerToken) {
        return HTTPResponse({
            status: 401, message: "Invalid token"
        })
    }

    const data: any = await requestGet(API_URL + "/resume", "lbp_presence=" + bearerToken)
    if (!data?.data) {
        return HTTPResponse({
            status: 400, message: data?.message || "Bad Request"
        })
    }

    return HTTPResponse({
        status: 200, message: "Berhasil get data", data: {
            "PAGI": data?.data?.PAGI,
            "SIANG": data?.data?.SIANG,
            "SORE": data?.data?.SORE,
        }
    })
});


routes.set('GET:/riwayat', async (req) => {

    const auth = req.headers.get('authorization');
    let bearerToken: string | null = null;
    if (auth && auth.startsWith('Bearer ')) {
        bearerToken = auth.slice(7);
    }
    if (!bearerToken) {
        return HTTPResponse({
            status: 401, message: "Invalid token"
        })
    }

    const date = new Date()
    const bulan = date.getMonth() + 1
    const tahun = date.getFullYear()

    const data: any = await requestGet(API_URL + "/transactionlog?bulan=" + bulan + "&tahun=" + tahun, "lbp_presence=" + bearerToken)
    if (data?.status != '1') {
        return HTTPResponse({
            status: 400, message: data?.message || "Bad Request"
        })
    }


    return HTTPResponse({
        status: 200, message: "Berhasil get data", data: data?.data
    })
});


routes.set('POST:/faceverification', async (req) => {

    const auth = req.headers.get('authorization');
    let bearerToken: string | null = null;
    if (auth && auth.startsWith('Bearer ')) {
        bearerToken = auth.slice(7);
    }
    if (!bearerToken) {
        return HTTPResponse({
            status: 401, message: "Invalid token"
        })
    }

    const { image } = await req.json();

    const data:any = await requestPost(API_URL + "/faceverification", {"img": image}, "lbp_presence="+bearerToken)
    if(data?.status != '1'){
        return HTTPResponse({
            status: 400, message: data?.message || "Bad Request"
        })
    }

    console.log("data", data)


    return HTTPResponse({
        status: 200, message: "Berhasil get data", data: data
    })
});




routes.set('POST:/profile', async (req) => {

    const auth = req.headers.get('authorization');
    let bearerToken: string | null = null;
    if (auth && auth.startsWith('Bearer ')) {
        bearerToken = auth.slice(7);
    }
    if (!bearerToken) {
        return HTTPResponse({
            status: 401, message: "Invalid token"
        })
    }

    const {username}  =  await req.json();
    console.log("username", username)
    const ph = getAccount(username)
    if(!ph){
        return HTTPResponse({
            status: 400, message: "tidak terdaftar"
        })
    }


    const payload = {
        "ph-id": ph.phId,
        "ph-type": ph.phType,
        "ph-manufacturer": ph.phManufacturer,
        "ph-model": ph.phModel,
        "ph-product": ph.phProduct,
    };

    const data:any = await requestPost(API_URL + "/updatedata", payload, "lbp_presence="+bearerToken)
    if(data?.status != '1'){
        return HTTPResponse({
            status: 400, message: data?.message || "Bad Request"
        })
    }

    console.log("data", data)


    return HTTPResponse({
        status: 200, message: "Berhasil get data", data: data
    })
});


routes.set('POST:/presensi', async (req) => {

    const auth = req.headers.get('authorization');
    let bearerToken: string | null = null;
    if (auth && auth.startsWith('Bearer ')) {
        bearerToken = auth.slice(7);
    }
    if (!bearerToken) {
        return HTTPResponse({
            status: 401, message: "Invalid token"
        })
    }

    const { workfrom, timezone, username } = await req.json();

    if(parseInt(workfrom) != 0 && parseInt(workfrom) != 1){
        return HTTPResponse({
            status: 400, message: "Pilih kerja dari mana"
        })
    }

    const ph = getAccount(username)
    if(!ph){
        return HTTPResponse({
            status: 400, message: "tidak terdaftar"
        })
    }

    const lokasi = getPosisi()
    const add = await getAddress(lokasi.pos.lat, lokasi.pos.lng)


    const payload = {
        "timezone": timezone || "Asia/Jakarta",
        "latt": lokasi.pos.lat,
        "lng": lokasi.pos.lng,
        "workfrom": workfrom, // 0 || 1
        "checkintype": getTimeRangeResult(), // 1, // 0 - 2
        "address":  add,
        "kesehatan": "sehat",
        "devicetype": "0",
        "accu": lokasi.jarak,
        "ph-id": ph.phId,
        "ph-type": ph.phType,
        "ph-manufacturer": ph.phManufacturer,
        "ph-model": ph.phModel,
        "ph-product": ph.phProduct,
        "fg": 0,
    };

    console.log("payload", payload)

    // const data:any = await requestPost(API_URL + "/absensi", payload, "lbp_presence="+bearerToken)
    // if(data?.status != '1'){
    //     return HTTPResponse({
    //         status: 400, message: data?.message || "Bad Request"
    //     })
    // }

    return HTTPResponse({
        status: 200, message: "Berhasil get data", data: payload
    })
});

// Register route POST /api/echo
routes.set('POST:/echo', async (req) => {
    const data = await req.json();
    return new Response(JSON.stringify({ youSent: data }), {
        headers: { 'Content-Type': 'application/json' },
    });
});

// Register route GET /api/users/:id (dynamic param)
routes.set('GET:/users/:id', (req, params) => {
    const userId = params.id;
    return new Response(
        JSON.stringify({ userId, message: `User data for ID ${userId}` }),
        { headers: { 'Content-Type': 'application/json' } }
    );
});

export const prerender = false;

export const ALL: APIRoute = async ({ request, params }) => {
    const method = request.method.toUpperCase();
    const pathSegments = Array.isArray(params.all)
        ? params.all
        : typeof params.all === 'string'
            ? [params.all]
            : [];

    // Try exact match first
    const exactKey = `${method}:/${pathSegments.join('/')}`;
    if (routes.has(exactKey)) {
        return routes.get(exactKey)!(request, {});
    }

    // Try dynamic routes
    for (const [key, handler] of routes.entries()) {
        if (!key.startsWith(method)) continue;

        const routePath = key.split(':')[1]; // e.g. "/users/:id"
        const routeSegments = routePath.slice(1).split('/'); // ['users', ':id']

        if (routeSegments.length !== pathSegments.length) continue;

        let matched = true;
        const paramsObj: Record<string, string> = {};

        for (let i = 0; i < routeSegments.length; i++) {
            if (routeSegments[i].startsWith(':')) {
                const paramName = routeSegments[i].slice(1);
                paramsObj[paramName] = pathSegments[i];
            } else if (routeSegments[i] !== pathSegments[i]) {
                matched = false;
                break;
            }
        }

        if (matched) {
            return handler(request, paramsObj);
        }
    }

    return new Response('Not Found', { status: 404 });
};