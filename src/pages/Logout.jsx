async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) console.error(error)
  }