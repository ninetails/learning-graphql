import jwt from 'jsonwebtoken'

export const APP_SECRET = process.env.APP_SECRET ?? 'GraphQL-is-aw3some'

type Context = any

interface JWTVerifyObject {
  userId: String
}

export function getUserId (context: Context): String {
  const Authorization = context.request.get('Authorization')
  if (typeof Authorization === 'string' && Authorization.length > 0) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, APP_SECRET) as JWTVerifyObject

    return userId
  }

  throw new Error('Not authenticated')
}
