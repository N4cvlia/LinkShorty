import { environment } from "../../environments/environment";

export function LoadReCaptcha(): Promise<void> {
    return new Promise((resolve, reject) => {
        if((window as any).grecaptcha) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${environment.reCaptchaKey}`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            resolve();
        };
        script.onerror = (err) => {
            reject(err);
        };
        document.head.appendChild(script);
    });
}

export async function getReCaptchaToken(): Promise<string> {
    await LoadReCaptcha();
    
    return new Promise((resolve, reject) => {
        (window as any).grecaptcha.ready(() => {
            (window as any).grecaptcha.execute(environment.reCaptchaKey, { action: 'submit' })
            .then((token: string) => {
                resolve(token);
            })
            .catch((err: any) => {
                reject(err);
            });
        });
    });
}