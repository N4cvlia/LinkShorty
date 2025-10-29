import { writeFileSync, readFileSync } from 'fs';

const targetPathProd = './src/environments/environment.prod.ts';
const targetPath = './src/environments/environment.ts';
const examplePath = './src/environments/environment.example.ts';

const exampleContent = readFileSync(examplePath, 'utf8');

writeFileSync(targetPath, exampleContent);

const envFileContent = `
export const environment = {
    production: true,
    supabase: {
    url: '${process.env['SUPABASE_URL']}',
    anonKey: '${process.env['SUPABASE_ANON_KEY']}',
    storageKey: ''
    },
    reCaptchaKey: '${process.env['RECAPTCHA_KEY']}'
};
`;

writeFileSync(targetPathProd, envFileContent);

console.log(`Environment file generated at ${targetPath}`);