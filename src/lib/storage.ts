
export const setCookie = (
    name: string,
    value: string,
    second?: number,
): void => {
    let expires = "";
    if (second) {
        const date = new Date();
        date.setTime(date.getTime() + second * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie =
        name +
        "=" +
        encodeURIComponent(value) +
        expires +
        "; path=/";
}

export const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return decodeURIComponent(
                cookie.substring(nameEQ.length),
            );
        }
    }
    return null;
}

export const removeCookie = (name: string): void => {
  document.cookie =
    name +
    "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};


function saveToStorage(key: string, value: any): void {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error saving to storage', error);
  }
}


function loadFromStorage<T>(key: string): T | null {
  try {
    const serializedValue = localStorage.getItem(key);
    if (!serializedValue) return null;
    return JSON.parse(serializedValue) as T;
  } catch (error) {
    console.error('Error loading from storage', error);
    return null;
  }
}

type Profile = {
    username:string,
    name:string,
    jabatan:string,
    radius:number,
    radiusWFH:number
}


export const saveProfile = (username: string, name: string, jabatan:string, radius:number, radiusWFH:number) => {
    const data:Profile = {
        username,
        name,
        jabatan,
        radius,
        radiusWFH
    }
    saveToStorage("profile", data)
}

export const getProfile = () => {
    const data = loadFromStorage<Profile>("profile")
    return data
}