import { env } from '$env/dynamic/private';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => ({ analyticsId: env.VERCEL_ANALYTICS_ID });