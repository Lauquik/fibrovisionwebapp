import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://gskpjdogmznoeapqoekl.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_RDeJZwS08-wA6QE4ApQHDQ_Jh9H6Y6K'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)