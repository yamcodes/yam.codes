import { rewrite } from '@vercel/edge';
// Trigger this middleware to run on the `/about` route
export const config = {
  matcher: '/ark.env',
};
 
export default function middleware(_request: Request) {
  return rewrite(new URL('https://yamcodes.github.com/ark.env'));
}