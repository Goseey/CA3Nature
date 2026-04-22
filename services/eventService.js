import { supabase } from "../config/supabaseClient.js"

export async function getEvents() {
    const { data, error } = await supabase.from("events").select("*")
    if (error) console.error(error)
    return data
}

export async function addEvent(event) {
    const { data, error } = await supabase.from("events").insert([event])
    if (error) console.error(error)
    return data
}
