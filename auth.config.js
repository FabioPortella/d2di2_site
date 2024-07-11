import { Obter } from "./app/login/api";

export const authConfig = {
    pages: {
        signIn: '/login',
    }, callbacks: {
        authorized({ auth, request: { nextUrl } }) {

            const isLoggedIn = !!auth?.user;

            //Se não estiver autenticado, vai para a tela de login
            if (!isLoggedIn)
                return false;

            //Se tentar acessar a tela de login, vai pra tela principal
            if (nextUrl.pathname.startsWith('/login'))
                return Response.redirect(new URL('/', nextUrl));

            //Só deixa acessar a tela de tipo de curso se for admin
            if (nextUrl.pathname.startsWith('/tipocurso')) {
                if (auth.user.tipo == 1)
                    return true;
                else
                    return Response.redirect(new URL('/notfound', nextUrl));
            }

            //Retorna verdadeiro para todos os outros casos
            return true;
        },
        async session({ session }) {
            const user = await Obter(session.user);
            session.user.tipo = user.data.tipo;

            return session;
        }
    },
    
    providers: []
}