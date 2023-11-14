import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
 
export default authMiddleware({
  publicRoutes: [
    '/',
    '/api/webhook',
    // '/question/:id',
    '/tags',
    '/tags/:id',
    '/profile/:id',
    '/community',
    '/jobs'
  ],
  afterAuth(auth, req, evt){
    if(!auth.userId && !auth.isPublicRoute){
      return redirectToSignIn({returnBackUrl: req.url})
    }
  },
  ignoredRoutes:[
    '/api/webhook', '/api/chatgpt'
  ]
});
 
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
 