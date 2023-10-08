import adapter from '@sveltejs/adapter-vercel';
import { Config } from '@sveltejs/kit';
import { vitePreprocess } from '@sveltejs/kit/vite';

export default {
  kit: {
    adapter: adapter()
  },
  preprocess: vitePreprocess()
} as Config;
