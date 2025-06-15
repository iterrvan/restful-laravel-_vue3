
/**
 * Servicio para conectar el frontend Vue.js con el backend Laravel
 * 
 * CONFIGURACIÓN REQUERIDA EN LARAVEL:
 * 
 * 1. Instalar Laravel CORS:
 *    composer require fruitcake/laravel-cors
 * 
 * 2. Configurar CORS en config/cors.php:
 *    'allowed_origins' => ['http://localhost:5173', 'https://tu-dominio.replit.app'],
 *    'allowed_methods' => ['*'],
 *    'allowed_headers' => ['*'],
 * 
 * 3. Crear rutas API en routes/api.php:
 *    Route::get('/portfolio', [PortfolioController::class, 'index']);
 *    Route::get('/projects', [ProjectController::class, 'index']);
 *    Route::post('/contact', [ContactController::class, 'store']);
 * 
 * 4. Crear controladores correspondientes
 */

// Configuración de la API - CAMBIAR ESTAS URLs POR LAS DE TU BACKEND LARAVEL
const API_CONFIG = {
  // URL base de tu API Laravel (cambiar por la URL real)
  BASE_URL: 'http://localhost:8000/api',
  // Para producción, usar algo como: 'https://tu-backend-laravel.com/api'
  
  // Headers por defecto
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // Si usas autenticación con tokens:
    // 'Authorization': `Bearer ${getAuthToken()}`
  }
}

// Función helper para hacer peticiones HTTP
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`
  
  const config = {
    headers: API_CONFIG.HEADERS,
    ...options
  }

  try {
    console.log(`Making ${config.method || 'GET'} request to:`, url)
    
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('API Response:', data)
    
    return data
  } catch (error) {
    console.error('API Request failed:', error)
    throw error
  }
}

// Servicio principal del portafolio
export const portfolioService = {
  /**
   * Obtener datos generales del portafolio
   * 
   * ESTRUCTURA ESPERADA DEL ENDPOINT LARAVEL /portfolio:
   * {
   *   "name": "Tu Nombre",
   *   "title": "Tu Título Profesional",
   *   "subtitle": "Tu Subtítulo",
   *   "description": "Descripción HTML",
   *   "about": "Descripción sobre ti HTML",
   *   "email": "tu@email.com",
   *   "phone": "+1234567890",
   *   "contact_message": "Mensaje de contacto",
   *   "skills": [
   *     {"id": 1, "name": "Vue.js"},
   *     {"id": 2, "name": "Laravel"}
   *   ],
   *   "social_links": [
   *     {"platform": "LinkedIn", "url": "https://..."},
   *     {"platform": "GitHub", "url": "https://..."}
   *   ]
   * }
   */
  async getPortfolioData() {
    return await apiRequest('/portfolio')
  },

  /**
   * Obtener lista de proyectos
   * 
   * ESTRUCTURA ESPERADA DEL ENDPOINT LARAVEL /projects:
   * [
   *   {
   *     "id": 1,
   *     "title": "Nombre del Proyecto",
   *     "description": "Descripción del proyecto",
   *     "image": "url-de-la-imagen.jpg",
   *     "tags": ["Vue.js", "Laravel", "MySQL"],
   *     "demo_url": "https://demo.com",
   *     "github_url": "https://github.com/...",
   *     "created_at": "2024-01-01",
   *     "updated_at": "2024-01-01"
   *   }
   * ]
   */
  async getProjects() {
    return await apiRequest('/projects')
  },

  /**
   * Enviar formulario de contacto
   * 
   * ESTRUCTURA ESPERADA DEL ENDPOINT LARAVEL POST /contact:
   * Request: {
   *   "name": "Nombre del usuario",
   *   "email": "email@usuario.com",
   *   "subject": "Asunto del mensaje",
   *   "message": "Contenido del mensaje"
   * }
   * 
   * Response: {
   *   "success": true,
   *   "message": "Mensaje enviado correctamente"
   * }
   */
  async submitContact(contactData) {
    return await apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData)
    })
  },

  /**
   * Obtener un proyecto específico por ID
   * 
   * ESTRUCTURA ESPERADA DEL ENDPOINT LARAVEL /projects/{id}:
   * {
   *   "id": 1,
   *   "title": "Nombre del Proyecto",
   *   "description": "Descripción completa",
   *   "content": "Contenido HTML detallado",
   *   "image": "url-principal.jpg",
   *   "gallery": ["img1.jpg", "img2.jpg"],
   *   "tags": ["Vue.js", "Laravel"],
   *   "demo_url": "https://demo.com",
   *   "github_url": "https://github.com/...",
   *   "technologies": [
   *     {"name": "Vue.js", "category": "Frontend"},
   *     {"name": "Laravel", "category": "Backend"}
   *   ],
   *   "created_at": "2024-01-01"
   * }
   */
  async getProject(id) {
    return await apiRequest(`/projects/${id}`)
  },

  /**
   * Obtener categorías de proyectos
   * 
   * ESTRUCTURA ESPERADA DEL ENDPOINT LARAVEL /project-categories:
   * [
   *   {"id": 1, "name": "Web Development", "slug": "web-development"},
   *   {"id": 2, "name": "Mobile Apps", "slug": "mobile-apps"}
   * ]
   */
  async getProjectCategories() {
    return await apiRequest('/project-categories')
  },

  /**
   * Buscar proyectos con filtros
   * 
   * ESTRUCTURA ESPERADA DEL ENDPOINT LARAVEL /projects/search:
   * Query params: ?category=web-development&tag=vue&search=portfolio
   */
  async searchProjects(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    const endpoint = queryParams ? `/projects/search?${queryParams}` : '/projects/search'
    return await apiRequest(endpoint)
  }
}

// Función helper para manejar autenticación (si es necesaria)
export const authService = {
  /**
   * Login de administrador (para panel de administración)
   * 
   * ESTRUCTURA ESPERADA DEL ENDPOINT LARAVEL POST /auth/login:
   * Request: { "email": "admin@example.com", "password": "password" }
   * Response: { "token": "bearer-token", "user": {...} }
   */
  async login(credentials) {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
    
    // Guardar token en localStorage
    if (response.token) {
      localStorage.setItem('auth_token', response.token)
    }
    
    return response
  },

  /**
   * Logout del sistema
   */
  async logout() {
    try {
      await apiRequest('/auth/logout', { method: 'POST' })
    } finally {
      localStorage.removeItem('auth_token')
    }
  },

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated() {
    return !!localStorage.getItem('auth_token')
  },

  /**
   * Obtener token de autenticación
   */
  getAuthToken() {
    return localStorage.getItem('auth_token')
  }
}

// Función helper para manejar errores de API
export const handleApiError = (error) => {
  console.error('API Error:', error)
  
  if (error.message.includes('404')) {
    return 'Recurso no encontrado'
  } else if (error.message.includes('500')) {
    return 'Error interno del servidor'
  } else if (error.message.includes('403')) {
    return 'No tienes permisos para realizar esta acción'
  } else if (error.message.includes('401')) {
    return 'No estás autenticado'
  } else {
    return 'Error de conexión. Verifica tu conexión a internet.'
  }
}

// Configuración para desarrollo local
export const DEV_CONFIG = {
  // Datos de prueba para desarrollo sin backend
  MOCK_PORTFOLIO: {
    name: 'Juan Pérez',
    title: 'Desarrollador Full Stack',
    subtitle: 'Vue.js & Laravel Specialist',
    description: '<p>Desarrollador con 5+ años de experiencia en aplicaciones web modernas.</p>',
    about: '<p>Soy un desarrollador apasionado por crear soluciones digitales innovadoras...</p>',
    email: 'juan@ejemplo.com',
    phone: '+52 123 456 7890',
    contact_message: 'Estoy disponible para nuevos proyectos y colaboraciones.',
    skills: [
      { id: 1, name: 'Vue.js' },
      { id: 2, name: 'Laravel' },
      { id: 3, name: 'MySQL' },
      { id: 4, name: 'JavaScript' },
      { id: 5, name: 'PHP' }
    ],
    social_links: [
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/juanperez' },
      { platform: 'GitHub', url: 'https://github.com/juanperez' },
      { platform: 'Twitter', url: 'https://twitter.com/juanperez' }
    ]
  },

  MOCK_PROJECTS: [
    {
      id: 1,
      title: 'E-commerce Vue & Laravel',
      description: 'Tienda online completa con carrito de compras, pasarela de pagos y panel administrativo.',
      image: '/api/placeholder/400/300',
      tags: ['Vue.js', 'Laravel', 'MySQL', 'Stripe'],
      demo_url: 'https://demo-ecommerce.com',
      github_url: 'https://github.com/usuario/ecommerce'
    },
    {
      id: 2,
      title: 'Sistema de Gestión de Inventarios',
      description: 'Aplicación empresarial para control de inventarios con reportes en tiempo real.',
      image: '/api/placeholder/400/300',
      tags: ['Vue.js', 'Laravel', 'Chart.js', 'MySQL'],
      demo_url: 'https://demo-inventario.com',
      github_url: 'https://github.com/usuario/inventario'
    },
    {
      id: 3,
      title: 'Blog Personal con CMS',
      description: 'Blog responsive con sistema de gestión de contenidos y optimización SEO.',
      image: '/api/placeholder/400/300',
      tags: ['Vue.js', 'Nuxt.js', 'Laravel', 'SEO'],
      demo_url: 'https://mi-blog.com',
      github_url: 'https://github.com/usuario/blog'
    }
  ]
}

/*
INSTRUCCIONES PARA CONECTAR CON LARAVEL:

1. BACKEND LARAVEL - Crear migraciones:
   
   php artisan make:migration create_portfolio_table
   php artisan make:migration create_projects_table
   php artisan make:migration create_contacts_table
   php artisan make:migration create_skills_table
   php artisan make:migration create_social_links_table

2. BACKEND LARAVEL - Crear modelos:
   
   php artisan make:model Portfolio
   php artisan make:model Project
   php artisan make:model Contact
   php artisan make:model Skill
   php artisan make:model SocialLink

3. BACKEND LARAVEL - Crear controladores:
   
   php artisan make:controller API/PortfolioController
   php artisan make:controller API/ProjectController
   php artisan make:controller API/ContactController

4. FRONTEND VUE - Cambiar URL de API:
   
   En este archivo, cambiar API_CONFIG.BASE_URL por la URL de tu backend Laravel.

5. CORS - Configurar en Laravel:
   
   En config/cors.php, agregar el dominio de tu frontend Vue.js en 'allowed_origins'.

6. TESTING - Probar conexión:
   
   Usar las funciones de DEV_CONFIG para probar sin backend primero.
*/
