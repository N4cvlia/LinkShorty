# 🔗 LinkShorty

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Angular](https://img.shields.io/badge/Angular-20-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen)
![Responsive](https://img.shields.io/badge/Responsive-Yes-success)

A **professional, full-stack URL shortener platform** built with modern web technologies. LinkShorty combines **Angular frontend, Supabase backend, and PostgreSQL database** to create a fast, secure, and user-friendly link management solution. Protected by **Google reCAPTCHA** to prevent abuse while maintaining seamless user experience.

---

## 📑 Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Environment Configuration](#environment-configuration)
  * [Running Locally](#running-locally)
* [Deployment](#deployment)
* [Project Structure](#project-structure)
* [Security](#security)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

---

<h2 id="overview">🔎 Overview </h2>

**LinkShorty** is a production-ready URL shortening service that transforms long URLs into clean, shareable short links. Built with **Angular 20** and powered by **Supabase** (PostgreSQL), this application demonstrates modern full-stack development practices including:

- **Serverless architecture** with cloud-native backend
- **Real-time database operations** with PostgreSQL
- **reCAPTCHA integration** for bot protection
- **RESTful API design** and integration
- **Production deployment** on Vercel and LoveableCloud
- **Responsive, mobile-first design**

This project serves as both a **functional web application** and a **portfolio showcase** of modern development practices.

---

<h2 id="features"> ✨ Features </h2>

### Core Functionality
* 🔗 **URL Shortening** – Transform long URLs into compact, shareable links
* ⚡ **Instant Redirects** – Lightning-fast URL resolution and redirection
* 🎯 **Custom Aliases** – Create memorable, branded short links
* 📊 **Click Tracking** – Monitor link usage and performance
* 📱 **Responsive Design** – Seamless experience across all devices
* 🤖 **reCAPTCHA Protection** – Google reCAPTCHA v3 prevents spam and abuse

### Technical Features
* 💾 **PostgreSQL Database** – Reliable, ACID-compliant data storage
* 🚀 **Edge Deployment** – Frontend served via Vercel's CDN
* ☁️ **Cloud Backend** – Scalable API hosted on LoveableCloud
* ✅ **URL Validation** – Smart link verification and sanitization
* 🔄 **Real-time Updates** – Live link management
* 🛡️ **Bot Protection** – reCAPTCHA prevents automated abuse
* 📈 **Analytics Ready** – Foundation for comprehensive tracking

---

<h2 id="tech-stack"> 🛠 Tech Stack </h2>

### Frontend
* **Angular 20** – Latest version of the powerful TypeScript framework
* **TypeScript 5** – Type-safe development
* **RxJS** – Reactive programming for async operations
* **Angular Router** – Client-side routing
* **CSS** – styling capabilities
* **Google reCAPTCHA v3** – Invisible bot protection

### Backend & Database
* **Supabase** – Backend-as-a-Service platform
* **PostgreSQL** – Robust relational database
* **Supabase Realtime** – Live data synchronization
* **RESTful API** – Clean, standardized endpoints

### DevOps & Deployment
* **Vercel** – Frontend hosting and CDN
* **LoveableCloud** – Backend API hosting
* **Git** – Version control
* **Angular CLI** – Build tooling and development server

---

<h2 id="getting-started"> 🚀 Getting Started </h2>

### Prerequisites

* **Node.js** (v18.x or higher)
* **npm** (v9.x or higher)
* **Angular CLI** (v20.x)
* **Supabase Account** (free tier available)
* **Google reCAPTCHA keys** (free from Google)

Install Angular CLI globally:
```bash
npm install -g @angular/cli@20
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/N4cvlia/LinkShorty.git
   cd LinkShorty
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Environment Configuration

1. **Create environment files**
   ```bash
   # Create development environment
   touch src/environments/environment.ts
   
   # Create production environment
   touch src/environments/environment.prod.ts
   ```

2. **Configure environment variables**
   
   Add the following to `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     supabaseUrl: 'YOUR_SUPABASE_PROJECT_URL',
     supabaseKey: 'YOUR_SUPABASE_ANON_KEY',
     apiUrl: 'YOUR_BACKEND_API_URL',
     recaptchaSiteKey: 'YOUR_RECAPTCHA_SITE_KEY'
   };
   ```

3. **Set up Supabase database**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Create the necessary database tables for links and analytics

4. **Configure reCAPTCHA**
   - Visit [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
   - Register your site for reCAPTCHA v3
   - Add your site key to environment configuration
   - Add your secret key to backend configuration

### Running Locally

1. **Start the development server**
   ```bash
   npm start
   # or
   ng serve
   ```

2. **Open your browser**
   Navigate to `http://localhost:4200/`

3. **Hot reload**
   The application will automatically reload when you modify source files.

---

<h2 id="deployment"> 🌐 Deployment </h2>

### Frontend Deployment (Vercel)

1. **Connect your GitHub repository to Vercel**
   - Import your project at [vercel.com](https://vercel.com)
   - Configure environment variables in project settings
   - Deploy with automatic CI/CD

2. **Manual deployment**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

### Backend Deployment (LoveableCloud)

Configure your Supabase project and deploy the backend API following LoveableCloud documentation.

---

<h2 id="project-structure"> 📂 Project Structure </h2>

```bash
LinkShorty/
├── src/
│   ├── app/
│   │   ├── Home/
│   │   ├── Redirect/  
│   │   ├── services/          # Business logic & API calls
│   │   │   └── supabase.ts
│   │   └── app.routes.ts      # Routing configuration
│   ├── environments/          # Environment configs
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   └── styles.css/           # Global styles
├── angular.json               # Angular configuration
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

---

<h2 id="security"> 🛡️ Security </h2>

LinkShorty implements multiple security layers:

* **Bot Protection** – Google reCAPTCHA v3 prevents automated abuse
* **HTTPS Only** – All communications encrypted in transit
* **Input Validation** – Comprehensive URL validation and sanitization
* **Rate Limiting** – Protection against abuse and DDoS attacks
* **CORS Configuration** – Restricted cross-origin access
* **XSS Protection** – Angular's built-in sanitization
* **Database Security** – Supabase Row Level Security policies
* **SQL Injection Prevention** – Parameterized queries via Supabase

---

<h2 id="contributing"> 🤝 Contributing </h2>

Contributions are welcome! Please follow these steps:

1. **Fork the repository**

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

4. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**

### Commit Convention
We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` – New feature
- `fix:` – Bug fix
- `docs:` – Documentation changes
- `style:` – Code style changes
- `refactor:` – Code refactoring
- `test:` – Adding or updating tests
- `chore:` – Maintenance tasks

---

<h2 id="license"> 📜 License </h2>

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

<h2 id="contact"> 📬 Contact </h2>

👤 **Nikolozi Natsvlishvili**

* **GitHub**: [@N4cvlia](https://github.com/N4cvlia)
* **Email**: [kaxa487@gmail.com](mailto:kaxa487@gmail.com)
* **LinkedIn**: [Nikolozi Natsvlishvili](http://linkedin.com/in/nikolozi-natsvlishvili-741363320/)

---

## 🌟 Show Your Support

If you find this project helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs and issues
- 💡 Suggesting new features
- 🔀 Contributing code improvements

---

## 🔮 Future Enhancements

- [ ] QR Code generation for short links
- [ ] Advanced analytics dashboard
- [ ] Custom domains support
- [ ] Link expiration scheduling
- [ ] Bulk URL shortening
- [ ] API for developers
- [ ] Social media preview customization
- [ ] Password-protected links
- [ ] Link editing capabilities

---

<div align="center">

**Built with ❤️ using Angular, Supabase & PostgreSQL**

*Transforming Ideas into Impactful Digital Solutions*

</div>
