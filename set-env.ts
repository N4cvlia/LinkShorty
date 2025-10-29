import { writeFileSync } from 'fs';

const targetPath = './src/environments/environment.prod.ts';

const envFileContent = `
export const environment = {
    production: true,
    supabase: {
    url: '${process.env.SUPABASE_URL}',
    anonKey: '${process.env.SUPABASE_ANON_KEY}',
    storageKey: ''
    },
    reCaptchaKey: '${process.env.RECAPTCHA_KEY}'
};
`;

writeFileSync(targetPath, envFileContent);

console.log(`Environment file generated at ${targetPath}`);