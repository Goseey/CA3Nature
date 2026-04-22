import { supabase } from "../config/supabaseClient.js"

export async function getUsers() {
    const { data, error } = await supabase.from("users").select("*")
    if (error) console.error(error)
    return data
}

export async function addUser(user) {
    const { data, error } = await supabase.from("users").insert([user])
    if (error) console.error(error)
    return data
}
