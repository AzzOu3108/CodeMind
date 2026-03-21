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

    if(res.status === 401 && path !== '/auth/refresh' ){
        const refreshed = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include'
        })
        if (refreshed.ok) {
            return apiFetch(path, options)
        }
        throw new Error('Unauthorized')
    }

    if (!res.ok) {
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
            name: data.fullname,
            email: data.email,
            avatar: data.avatar || "",
        }
    } catch (error) {
        console.error("Failed to fetch user:", error)
        return null
    }
}

export async function updateUser(data: {
  fullname?: string
  email?: string
  avatar?: string
  password?: string
  confirmPassword?: string
}) {
  return apiFetch("/user/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteUser() {
  return apiFetch("/user/me", {
    method: "DELETE",
  })
}