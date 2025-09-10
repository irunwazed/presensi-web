import { requestGet, requestPost } from "../lib/request";
import { getCookie, getProfile, setCookie } from "../lib/storage";


export const serviceLogin = async (username: string, password: string, totp: string): Promise<{ status: boolean, message: string }> => {

    const data: any = await requestPost("/api/login", {
        username: username,
        password: password,
        totp: totp
    });

    if (!data?.token) {
        return {
            status: false,
            message: data?.message
        }
    }

    setCookie("token", data?.token, 365)
    return {
        status: true,
        message: "Berhasil login"
    }
}


export const serviceProfile = async (username: string): Promise<{ status: boolean, data?: any, message: string }> => {

    const token = getCookie("token");
    const data: any = await requestPost("/api/profile", {
        username: username,
    }, "", {
        headers: {
            Authorization: "Bearer " + token,
        },
    });

    if (!data?.data) {
        return {
            status: false,
            message: data?.message
        }
    }
    return {
        status: true,
        data: data?.data?.data,
        message: ""
    }
}

export const serviceResume = async (): Promise<{
    status: boolean,
    message?: string,
    data: {
        PAGI: string,
        SIANG: string,
        SORE: string,
    }
}> => {
    const token = getCookie("token");
    const data: any = await requestGet("/api/resume", "token", {
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    if (!data?.data) {
        return {
            status: false,
            message: data?.message,
            data: {
                PAGI: "",
                SIANG: "",
                SORE: "",
            }
        }
    }
    const result = {
        PAGI: data?.data?.PAGI,
        SIANG: data?.data?.SIANG,
        SORE: data?.data?.SORE,
    }

    return {
        status: true,
        data: result
    }
}


type Riwayat = {
    device: string //'Android',
    itgl: string //'1/8/2025',
    jam: string //'07:44:51',
    WF: string //'WFO',
    check: string //'Pagi'
}

export const serviceRiwayat = async (): Promise<{
    status: boolean,
    message?: string,
    data: Riwayat[]
}> => {
    const token = getCookie("token");
    const data: any = await requestGet("/api/riwayat", "token", {
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    if (!data?.data) {
        return {
            status: false,
            message: data?.message,
            data: []
        }
    }

    return {
        status: true,
        data: data?.data
    }
}


export const serviceFaceverification = async (image: string): Promise<{
    status: boolean,
    message?: string,
}> => {
    const token = getCookie("token");
    // const image = ""
    const data: any = await requestPost("/api/faceverification", { image: image }, "token", {
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    if (!data?.data) {
        return {
            status: false,
            message: data?.message,
        }
    }

    return {
        status: true,
    }
}


export const servicePresensi = async (): Promise<{
    status: boolean,
    message?: string,
}> => {
    const token = getCookie("token");
    const pegawai = getProfile()

    const payload = {
        timezone: "Asia/Jakarta",
        workfrom: 1,
        username: pegawai?.username
    };

    const image = ""
    const data: any = await requestPost("/api/presensi", payload, "token", {
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    if (!data?.data) {
        return {
            status: false,
            message: data?.message,
        }
    }

    return {
        status: true,
        message: "berhasil"
    }
}