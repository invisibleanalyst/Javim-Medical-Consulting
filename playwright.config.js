import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests/browser',timeout:60000,use:{baseURL:process.env.TEST_BASE_URL || 'http://127.0.0.1:5173',headless:true,launchOptions:{executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']}},reporter:'list',workers:1});
