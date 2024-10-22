import NextAuth, { User } from "next-auth";
import { db } from "@/app/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";
type Credentials = {
  username: string;
  password: string;
};
interface CustomUser extends User {
  id: string;
  name: string;
  username: string;
  image: string;
}
const handler = NextAuth({
  pages: {
    signIn: '/dashboard',
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials): Promise<User | null> => {
        if(credentials?.username)
        {
        const finduser= await db.user.findUnique(
          {
            where: {username:credentials?.username }
          }
        )
        if(finduser?.password!==credentials?.password)
          return null;
        else 
          return {
        id: finduser.id,
        name: finduser.name,
        username: finduser.username,
        image: finduser.image} as CustomUser; 
        } else {
          return null;
        }
      },
    }),
  ],
  debug: true, // Enable this to get more detailed logs in the console
});
export { handler as GET, handler as POST }