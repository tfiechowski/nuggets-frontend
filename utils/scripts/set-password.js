require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function resetPassword(email, newPassword) {
  try {
    // Fetch user from Supabase by email
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      throw error;
    }

    if (!users) {
      throw new Error('User not found');
    }

    const user = users;

    // Set new password for the user
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });

    if (updateError) {
      throw updateError;
    }

    console.log(`Password reset successfully for user ${email}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Usage
const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.error('Usage: node script.js <email> <new_password>');
  process.exit(1);
}

resetPassword(email, newPassword);
