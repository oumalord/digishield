import { supabase, hasValidConfig } from "./supabase"

type CreateUserParams = {
  name: string
  email: string
  password: string
}

export async function createUser({ name, email, password }: CreateUserParams): Promise<{ user: any | null; error?: string }> {
  try {
    if (!hasValidConfig || !supabase) {
      return { user: null, error: "Supabase not configured" }
    }

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    })

    if (signUpError) {
      return { user: null, error: signUpError.message }
    }

    const user = authData.user
    return { user }
  } catch (error: any) {
    return { user: null, error: error?.message || "Failed to create user" }
  }
}

