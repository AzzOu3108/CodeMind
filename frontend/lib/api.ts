const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function apiFetch(
    path: string,
    options: RequestInit = {}
){
    const res = await fetch (`${API_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    })

    if(!res.ok){
        const error = await res.json().catch(() => ({}))
        throw new Error(error.message || "API error")
    }
    return res.json()
}