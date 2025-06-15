
/**
 * Configuración de entorno para el portafolio
 * 
 * Este archivo centraliza toda la configuración del entorno
 * para facilitar el cambio entre desarrollo y producción
 */

// Detectar entorno automáticamente
const isDevelopment = import.meta.env.DEV
const isProduction = import.meta.env.PROD

// Configuración base
const config = {
  // Información del desarrollador (cambiar por tus datos)
  developer: {
    name: 'Tu Nombre Completo',
    email: 'tu@email.com',
    phone: '+52 123 456 7890',
    location: 'Ciudad, País'
  },

  // URLs de API según el entorno
  api: {
    // Para desarrollo local
    development: {
      baseUrl: 'http://localhost:8000/api',
      timeout: 10000
    },
    // Para producción
    production: {
      baseUrl: 'https://tu-backend-laravel.herokuapp.com/api',
      // O la URL donde tengas desplegado tu backend Laravel
      timeout: 15000
    }
  },

  // Configuración de la aplicación
  app: {
    name: 'Mi Portafolio',
    version: '1.0.0',
    description: 'Portafolio profesional desarrollado con Vue.js y Laravel',
    keywords: ['portafolio', 'desarrollador', 'vue.js', 'laravel', 'full-stack']
  },

  // Configuración de imágenes
  images: {
    // URL base para imágenes (si usas CDN o almacenamiento en nube)
    baseUrl: isDevelopment 
      ? '/images' 
      : 'https://tu-cdn.com/images',
    
    // Imagen por defecto para proyectos
    defaultProject: '/images/placeholder-project.jpg',
    
    // Imagen de perfil por defecto
    defaultProfile: '/images/profile-placeholder.jpg',
    
    // Formatos aceptados
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'svg']
  },

  // Configuración de redes sociales
  socialMedia: {
    // Agregar tus perfiles reales aquí
    profiles: [
      {
        platform: 'LinkedIn',
        url: 'https://linkedin.com/in/tu-perfil',
        icon: 'fab fa-linkedin',
        color: '#0077B5'
      },
      {
        platform: 'GitHub',
        url: 'https://github.com/tu-usuario',
        icon: 'fab fa-github',
        color: '#333333'
      },
      {
        platform: 'Twitter',
        url: 'https://twitter.com/tu-usuario',
        icon: 'fab fa-twitter',
        color: '#1DA1F2'
      },
      {
        platform: 'Instagram',
        url: 'https://instagram.com/tu-usuario',
        icon: 'fab fa-instagram',
        color: '#E4405F'
      }
    ]
  },

  // Configuración de Google Analytics (opcional)
  analytics: {
    enabled: isProduction,
    trackingId: 'GA_TRACKING_ID', // Cambiar por tu ID real
  },

  // Configuración de SEO
  seo: {
    defaultTitle: 'Tu Nombre - Desarrollador Full Stack',
    defaultDescription: 'Portafolio profesional de desarrollo web con Vue.js, Laravel y más tecnologías modernas.',
    defaultImage: '/images/og-image.jpg',
    twitterHandle: '@tu_usuario'
  },

  // Configuración de características
  features: {
    // Habilitar/deshabilitar funcionalidades
    contactForm: true,
    projectModal: true,
    darkMode: false, // Para implementar en el futuro
    animations: true,
    lazyLoading: true,
    
    // Configuración del formulario de contacto
    contact: {
      enableRecaptcha: isProduction,
      recaptchaSiteKey: 'TU_RECAPTCHA_SITE_KEY',
      emailService: 'laravel', // 'laravel' | 'emailjs' | 'formspree'
      
      // Si usas EmailJS como alternativa
      emailjs: {
        serviceId: 'TU_SERVICE_ID',
        templateId: 'TU_TEMPLATE_ID',
        publicKey: 'TU_PUBLIC_KEY'
      }
    }
  },

  // Configuración de performance
  performance: {
    enableServiceWorker: isProduction,
    enableLazyLoading: true,
    imageOptimization: isProduction,
    
    // Configuración de cache
    cache: {
      apiResponseTime: 5 * 60 * 1000, // 5 minutos
      imagesCacheTime: 24 * 60 * 60 * 1000, // 24 horas
    }
  },

  // Configuración de errores y logging
  logging: {
    enabled: isDevelopment,
    level: isDevelopment ? 'debug' : 'error',
    apiErrors: true,
    userActions: isDevelopment
  }
}

// Función para obtener la configuración actual
export const getConfig = () => {
  const currentEnv = isDevelopment ? 'development' : 'production'
  
  return {
    ...config,
    env: {
      current: currentEnv,
      isDevelopment,
      isProduction
    },
    api: {
      ...config.api[currentEnv],
      baseUrl: config.api[currentEnv].baseUrl
    }
  }
}

// Exportar configuraciones específicas
export const API_CONFIG = getConfig().api
export const APP_CONFIG = getConfig().app
export const FEATURES_CONFIG = getConfig().features
export const SEO_CONFIG = getConfig().seo
export const SOCIAL_CONFIG = getConfig().socialMedia
export const IMAGES_CONFIG = getConfig().images

// Función helper para construir URLs de API
export const buildApiUrl = (endpoint) => {
  const baseUrl = API_CONFIG.baseUrl.replace(/\/$/, '') // Remover slash final
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${baseUrl}${cleanEndpoint}`
}

// Función helper para construir URLs de imágenes
export const buildImageUrl = (imagePath) => {
  if (!imagePath) return IMAGES_CONFIG.defaultProject
  
  // Si ya es una URL completa, devolverla tal como está
  if (imagePath.startsWith('http')) return imagePath
  
  const baseUrl = IMAGES_CONFIG.baseUrl.replace(/\/$/, '')
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  return `${baseUrl}${cleanPath}`
}

// Configuración por defecto exportada
export default getConfig()

/*
INSTRUCCIONES DE USO:

1. PERSONALIZACIÓN BÁSICA:
   - Cambiar developer.name, developer.email, etc. con tus datos reales
   - Actualizar las URLs de redes sociales en socialMedia.profiles
   - Modificar app.name y app.description según tu portafolio

2. CONFIGURACIÓN DE API:
   - En development: cambiar localhost:8000 por la URL de tu Laravel local
   - En production: cambiar por la URL donde esté desplegado tu backend

3. CONFIGURACIÓN DE IMÁGENES:
   - Si usas un CDN, actualizar images.baseUrl
   - Asegúrate de tener las imágenes por defecto en /public/images/

4. FUNCIONALIDADES OPCIONALES:
   - Google Analytics: agregar tu tracking ID real
   - reCAPTCHA: configurar las keys si quieres protección anti-spam
   - EmailJS: como alternativa si no quieres usar Laravel para emails

5. USO EN COMPONENTES:
   import { API_CONFIG, buildApiUrl } from '@/config/environment'
   
   const apiUrl = buildApiUrl('/projects')
   // Resultado: http://localhost:8000/api/projects

EJEMPLO DE ESTRUCTURA DE CARPETAS PARA IMÁGENES:
/public/
  /images/
    /projects/
      proyecto1.jpg
      proyecto2.jpg
    /profile/
      avatar.jpg
    placeholder-project.jpg
    og-image.jpg
*/
