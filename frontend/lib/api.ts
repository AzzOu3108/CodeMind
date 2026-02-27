const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function apiFetch(
    path: string,
    options: RequestInit = {}
){
      console.log('Fetching:', `${API_URL}${path}`)
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

export async function getCurrentUser() {
    try {
        const data = await apiFetch("/auth/me", {
            method: "GET",
        })
        return {
            name: data.name,
            email: data.email,
            avatar: data.avatar || "",
        }
    } catch (error) {
        window.location.href = '/login'
        console.error("Failed to fetch user:", error)
        return null
    }
}