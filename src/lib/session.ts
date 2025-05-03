import { User, getServerSession } from 'next-auth'
// @ts-ignore
export const session = async ({ session, token }: any) => {
  session.user.id = token.id
  return session
}

export const getUserSession = async (): Promise<User | null> => {
  const authUserSession = await getServerSession({
    callbacks: {
      session,
    },
  })
  return authUserSession?.user || null
}
