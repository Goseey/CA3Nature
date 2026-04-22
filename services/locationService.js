import { supabase } from "../config/supabaseClient.js"

export async function getLocations() {
    const { data, error } = await supabase.from("locations").select("*")
    if (error) console.error(error)
    return data
}

export async function addLocation(location) {
    const { data, error } = await supabase.from("locations").insert([location])
    if (error) console.error(error)
    return data
}
