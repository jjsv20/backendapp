const { createClient } = require("@supabase/supabase-js");
const env = require("./env");


const supabase = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_KEY
);


console.log("Supabase conectado correctamente");


module.exports = supabase;