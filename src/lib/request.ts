
type ResponseStatus = 200 | 201 | 400 | 401 | 402 | 403 | 404 | 500
export const HTTPResponse = ({
    status, message, data }: {
        status: ResponseStatus,
        message?: string,
        data?: any
    }
) => {
    return new Response(JSON.stringify({ message: message, data: data }), {
        status: status,
        headers: { 'Content-Type': 'application/json' },

    });
}

export const readQuery = (req: Request): Record<string, string> => {
    const url = new URL(req.url);
    const query: Record<string, string> = {};
    url.searchParams.forEach((value: string, key: string) => {
        query[key] = value;
    });
    return query;
}



export async function requestGet<T = unknown>(
    url: string,
    cookie?: string,
    options?: RequestInit
): Promise<T> {
    try {

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'okhttp/4.9.0',
                ...(cookie ? { 'Cookie': cookie } : {}),
                ...(options?.headers || {}),
            },
            ...options,
        });
        if (!res.ok) {
            throw new Error(`Request failed: ${res.status} ${res.statusText}`);
        }
        return res.json() as Promise<T>;
    } catch (err) { }
    return {} as T
}

export async function requestPost<T = unknown>(
    url: string,
    data: unknown,
    cookie?: string,
    options?: RequestInit
): Promise<T> {


    try {

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'okhttp/4.9.0',
                ...(cookie ? { 'Cookie': cookie } : {}),
                ...(options?.headers || {}),
            },
            body: JSON.stringify(data),
            ...options,
        });
        if (!res.ok) {
            throw new Error(`Request failed: ${res.status} ${res.statusText}`);
        }
        return res.json() as Promise<T>;

    } catch (err) {

    }

    return {} as T
}