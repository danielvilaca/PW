import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lttwhbtvdveekiguimfq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dHdoYnR2ZHZlZWtpZ3VpbWZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NDM4MTEsImV4cCI6MjA2MzQxOTgxMX0.oset_JhC7Z4l9rZv5IeArWDaXZLr1g40kxxwXjwwb5I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
