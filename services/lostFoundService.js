import { supabase } from "../config/supabaseClient.js"

export async function getLostItems() {
    const { data, error } = await supabase.from("lost_found").select("*")
    if (error) console.error(error)
    return data
}

export async function addLostItem(item) {
    const { data, error } = await supabase.from("lost_found").insert([item])
    if (error) console.error(error)
    return data
}
