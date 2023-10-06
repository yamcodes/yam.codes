import { PlaywrightTestConfig } from '@playwright/test';

export default {
	webServer: {
		command: 'bun build && bun preview',
		port: 4173
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
} as PlaywrightTestConfig;
