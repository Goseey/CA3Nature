import { supabase } from "../config/supabaseClient.js"

export async function getTimetable(userId) {
    const { data, error } = await supabase
        .from("timetable")
        .select("*")
        .eq("user_id", userId)

    if (error) console.error(error)
    return data
}

export async function addTimetable(entry) {
    const { data, error } = await supabase.from("timetable").insert([entry])
    if (error) console.error(error)
    return data
}
