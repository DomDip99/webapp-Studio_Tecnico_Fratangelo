export async function getHealth() {
    const res = await fetch('/api/health')

    if (!res.ok) throw Error(`Server Error: status code ${res.status}`)
    return res.json()
}