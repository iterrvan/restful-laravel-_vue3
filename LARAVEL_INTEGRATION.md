
# Guía de Integración Laravel + Vue.js Portfolio

Esta guía te explica paso a paso cómo conectar este portafolio Vue.js con un backend Laravel.

## 📋 Tabla de Contenidos

1. [Configuración del Backend Laravel](#backend-laravel)
2. [Estructura de Base de Datos](#base-de-datos)
3. [Controladores API](#controladores-api)
4. [Configuración CORS](#cors)
5. [Configuración del Frontend](#frontend)
6. [Testing y Debugging](#testing)
7. [Deployment](#deployment)

## 🚀 Backend Laravel

### 1. Crear nuevo proyecto Laravel

```bash
# Crear proyecto Laravel
composer create-project laravel/laravel portfolio-backend
cd portfolio-backend

# Instalar dependencias adicionales
composer require fruitcake/laravel-cors
composer require intervention/image
```

### 2. Configurar base de datos

Editar `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=portfolio_db
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password

# Para Replit con PostgreSQL
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=portfolio_db
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
```

## 🗄️ Base de Datos

### 1. Crear migraciones

```bash
# Migración para tabla portfolio
php artisan make:migration create_portfolio_table
```

**database/migrations/xxxx_create_portfolio_table.php:**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('portfolio', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('title');
            $table->string('subtitle');
            $table->text('description');
            $table->text('about');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->text('contact_message')->nullable();
            $table->string('profile_image')->nullable();
            $table->json('social_links')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('portfolio');
    }
};
```

```bash
# Migración para tabla projects
php artisan make:migration create_projects_table
```

**database/migrations/xxxx_create_projects_table.php:**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->text('content')->nullable();
            $table->string('image');
            $table->json('gallery')->nullable();
            $table->json('tags');
            $table->string('demo_url')->nullable();
            $table->string('github_url')->nullable();
            $table->json('technologies')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('projects');
    }
};
```

```bash
# Migración para tabla contacts
php artisan make:migration create_contacts_table
```

**database/migrations/xxxx_create_contacts_table.php:**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('subject');
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('contacts');
    }
};
```

```bash
# Migración para tabla skills
php artisan make:migration create_skills_table
```

**database/migrations/xxxx_create_skills_table.php:**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category')->nullable();
            $table->integer('level')->default(1); // 1-5
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('skills');
    }
};
```

### 2. Ejecutar migraciones

```bash
php artisan migrate
```

### 3. Crear modelos

```bash
php artisan make:model Portfolio
php artisan make:model Project
php artisan make:model Contact
php artisan make:model Skill
```

**app/Models/Portfolio.php:**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Portfolio extends Model
{
    use HasFactory;

    protected $table = 'portfolio';

    protected $fillable = [
        'name',
        'title',
        'subtitle',
        'description',
        'about',
        'email',
        'phone',
        'contact_message',
        'profile_image',
        'social_links',
        'is_active'
    ];

    protected $casts = [
        'social_links' => 'array',
        'is_active' => 'boolean'
    ];

    public function skills()
    {
        return $this->hasMany(Skill::class);
    }
}
```

**app/Models/Project.php:**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'content',
        'image',
        'gallery',
        'tags',
        'demo_url',
        'github_url',
        'technologies',
        'order',
        'featured',
        'is_active'
    ];

    protected $casts = [
        'gallery' => 'array',
        'tags' => 'array',
        'technologies' => 'array',
        'featured' => 'boolean',
        'is_active' => 'boolean'
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc')->orderBy('created_at', 'desc');
    }
}
```

**app/Models/Contact.php:**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'subject',
        'message',
        'is_read',
        'read_at'
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime'
    ];

    public function markAsRead()
    {
        $this->update([
            'is_read' => true,
            'read_at' => now()
        ]);
    }
}
```

**app/Models/Skill.php:**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'level',
        'order',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc')->orderBy('name', 'asc');
    }
}
```

## 🎯 Controladores API

### 1. Crear controladores

```bash
php artisan make:controller API/PortfolioController
php artisan make:controller API/ProjectController
php artisan make:controller API/ContactController
php artisan make:controller API/SkillController
```

**app/Http/Controllers/API/PortfolioController.php:**

```php
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use App\Models\Skill;
use Illuminate\Http\Request;

class PortfolioController extends Controller
{
    public function index()
    {
        try {
            $portfolio = Portfolio::where('is_active', true)->first();
            
            if (!$portfolio) {
                return response()->json([
                    'message' => 'Portfolio data not found'
                ], 404);
            }

            // Obtener skills activas
            $skills = Skill::active()->ordered()->get();

            $data = [
                'name' => $portfolio->name,
                'title' => $portfolio->title,
                'subtitle' => $portfolio->subtitle,
                'description' => $portfolio->description,
                'about' => $portfolio->about,
                'email' => $portfolio->email,
                'phone' => $portfolio->phone,
                'contact_message' => $portfolio->contact_message,
                'profile_image' => $portfolio->profile_image,
                'social_links' => $portfolio->social_links ?? [],
                'skills' => $skills
            ];

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching portfolio data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'title' => 'required|string|max:255',
                'subtitle' => 'required|string|max:255',
                'description' => 'required|string',
                'about' => 'required|string',
                'email' => 'required|email',
                'phone' => 'nullable|string',
                'contact_message' => 'nullable|string',
                'social_links' => 'nullable|array'
            ]);

            $portfolio = Portfolio::where('is_active', true)->first();
            
            if (!$portfolio) {
                $portfolio = Portfolio::create($request->all());
            } else {
                $portfolio->update($request->all());
            }

            return response()->json([
                'message' => 'Portfolio updated successfully',
                'data' => $portfolio
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating portfolio',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
```

**app/Http/Controllers/API/ProjectController.php:**

```php
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        try {
            $projects = Project::active()->ordered()->get();
            
            return response()->json($projects);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching projects',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $project = Project::active()->findOrFail($id);
            
            return response()->json($project);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Project not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'content' => 'nullable|string',
                'image' => 'required|string',
                'gallery' => 'nullable|array',
                'tags' => 'required|array',
                'demo_url' => 'nullable|url',
                'github_url' => 'nullable|url',
                'technologies' => 'nullable|array',
                'order' => 'nullable|integer',
                'featured' => 'nullable|boolean'
            ]);

            $project = Project::create($request->all());

            return response()->json([
                'message' => 'Project created successfully',
                'data' => $project
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating project',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $project = Project::findOrFail($id);
            
            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'content' => 'nullable|string',
                'image' => 'required|string',
                'gallery' => 'nullable|array',
                'tags' => 'required|array',
                'demo_url' => 'nullable|url',
                'github_url' => 'nullable|url',
                'technologies' => 'nullable|array',
                'order' => 'nullable|integer',
                'featured' => 'nullable|boolean'
            ]);

            $project->update($request->all());

            return response()->json([
                'message' => 'Project updated successfully',
                'data' => $project
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating project',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $project = Project::findOrFail($id);
            $project->delete();

            return response()->json([
                'message' => 'Project deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting project',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function featured()
    {
        try {
            $projects = Project::active()->featured()->ordered()->get();
            
            return response()->json($projects);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching featured projects',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
```

**app/Http/Controllers/API/ContactController.php:**

```php
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'subject' => 'required|string|max:255',
                'message' => 'required|string|max:2000'
            ]);

            // Guardar en base de datos
            $contact = Contact::create($request->all());

            // Enviar notificación por email (opcional)
            $this->sendContactNotification($contact);

            return response()->json([
                'success' => true,
                'message' => 'Mensaje enviado correctamente. Te contactaré pronto.'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Por favor verifica los datos enviados.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar el mensaje. Inténtalo de nuevo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index()
    {
        try {
            $contacts = Contact::orderBy('created_at', 'desc')->get();
            
            return response()->json($contacts);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching contacts',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $contact = Contact::findOrFail($id);
            $contact->markAsRead();
            
            return response()->json($contact);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Contact not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    private function sendContactNotification($contact)
    {
        // Implementar envío de email
        // Puedes usar Laravel Mail o servicios como SendGrid, Mailgun, etc.
        
        try {
            // Ejemplo básico con Mail
            /*
            Mail::send('emails.contact', ['contact' => $contact], function ($message) use ($contact) {
                $message->to(config('mail.admin_email', 'admin@ejemplo.com'))
                        ->subject('Nuevo mensaje de contacto: ' . $contact->subject);
            });
            */
        } catch (\Exception $e) {
            // Log error pero no fallar la request
            \Log::error('Failed to send contact notification: ' . $e->getMessage());
        }
    }
}
```

### 2. Configurar rutas API

**routes/api.php:**

```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\PortfolioController;
use App\Http\Controllers\API\ProjectController;
use App\Http\Controllers\API\ContactController;
use App\Http\Controllers\API\SkillController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('api')->group(function () {
    // Portfolio routes
    Route::get('/portfolio', [PortfolioController::class, 'index']);
    Route::put('/portfolio', [PortfolioController::class, 'update']);

    // Projects routes
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/featured', [ProjectController::class, 'featured']);
    Route::get('/projects/{id}', [ProjectController::class, 'show']);
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::put('/projects/{id}', [ProjectController::class, 'update']);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);

    // Contact routes
    Route::post('/contact', [ContactController::class, 'store']);
    Route::get('/contacts', [ContactController::class, 'index']);
    Route::get('/contacts/{id}', [ContactController::class, 'show']);

    // Skills routes
    Route::get('/skills', [SkillController::class, 'index']);
    Route::post('/skills', [SkillController::class, 'store']);
    Route::put('/skills/{id}', [SkillController::class, 'update']);
    Route::delete('/skills/{id}', [SkillController::class, 'destroy']);

    // Health check
    Route::get('/health', function () {
        return response()->json([
            'status' => 'OK',
            'timestamp' => now()->toISOString(),
            'version' => '1.0.0'
        ]);
    });
});
```

## 🔗 CORS

### Configurar CORS

**config/cors.php:**

```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://tu-dominio.replit.app',
        'https://tu-dominio-personalizado.com'
    ],

    'allowed_origins_patterns' => [
        '/^https:\/\/.*\.replit\.app$/',
        '/^https:\/\/.*\.replit\.dev$/'
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,
];
```

### Registrar middleware CORS

**app/Http/Kernel.php:**

```php
protected $middleware = [
    // ...
    \Fruitcake\Cors\HandleCors::class,
    // ...
];
```

## ⚙️ Frontend

### 1. Actualizar configuración de API

**src/config/environment.js:**

```javascript
// Cambiar estas URLs por las reales
const config = {
  api: {
    development: {
      baseUrl: 'http://localhost:8000/api', // Tu Laravel local
      timeout: 10000
    },
    production: {
      baseUrl: 'https://tu-backend-laravel.herokuapp.com/api', // Tu Laravel en producción
      timeout: 15000
    }
  }
}
```

### 2. Test de conexión

Agregar esta función temporal para probar la conexión:

**src/services/portfolioService.js:**

```javascript
// Función de test - agregar temporalmente
export const testConnection = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/health`)
    const data = await response.json()
    console.log('✅ Conexión exitosa:', data)
    return true
  } catch (error) {
    console.error('❌ Error de conexión:', error)
    return false
  }
}
```

## 🧪 Testing

### 1. Crear seeders para datos de prueba

```bash
php artisan make:seeder PortfolioSeeder
php artisan make:seeder ProjectSeeder
php artisan make:seeder SkillSeeder
```

**database/seeders/PortfolioSeeder.php:**

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Portfolio;

class PortfolioSeeder extends Seeder
{
    public function run()
    {
        Portfolio::create([
            'name' => 'Juan Pérez',
            'title' => 'Desarrollador Full Stack',
            'subtitle' => 'Especialista en Vue.js y Laravel',
            'description' => '<p>Desarrollador con 5+ años de experiencia creando aplicaciones web modernas y escalables.</p>',
            'about' => '<p>Soy un desarrollador apasionado por las tecnologías web modernas. Me especializo en Vue.js para el frontend y Laravel para el backend, creando aplicaciones completas y robustas.</p><p>Mi enfoque se centra en escribir código limpio, seguir las mejores prácticas y crear experiencias de usuario excepcionales.</p>',
            'email' => 'juan@ejemplo.com',
            'phone' => '+52 123 456 7890',
            'contact_message' => 'Estoy disponible para nuevos proyectos y colaboraciones. ¡Hablemos!',
            'social_links' => [
                ['platform' => 'LinkedIn', 'url' => 'https://linkedin.com/in/juanperez'],
                ['platform' => 'GitHub', 'url' => 'https://github.com/juanperez'],
                ['platform' => 'Twitter', 'url' => 'https://twitter.com/juanperez']
            ],
            'is_active' => true
        ]);
    }
}
```

**database/seeders/ProjectSeeder.php:**

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;

class ProjectSeeder extends Seeder
{
    public function run()
    {
        $projects = [
            [
                'title' => 'E-commerce Vue & Laravel',
                'description' => 'Tienda online completa con carrito de compras, pasarela de pagos y panel administrativo.',
                'content' => '<p>Desarrollo completo de una plataforma de e-commerce utilizando Vue.js 3 en el frontend y Laravel en el backend.</p><p><strong>Características principales:</strong></p><ul><li>Catálogo de productos con filtros avanzados</li><li>Carrito de compras persistente</li><li>Integración con pasarelas de pago</li><li>Panel administrativo completo</li><li>Sistema de inventarios</li></ul>',
                'image' => '/images/projects/ecommerce.jpg',
                'gallery' => [
                    '/images/projects/ecommerce-1.jpg',
                    '/images/projects/ecommerce-2.jpg',
                    '/images/projects/ecommerce-3.jpg'
                ],
                'tags' => ['Vue.js', 'Laravel', 'MySQL', 'Stripe', 'Tailwind CSS'],
                'demo_url' => 'https://demo-ecommerce.com',
                'github_url' => 'https://github.com/usuario/ecommerce',
                'technologies' => [
                    ['name' => 'Vue.js 3', 'category' => 'Frontend'],
                    ['name' => 'Laravel 10', 'category' => 'Backend'],
                    ['name' => 'MySQL', 'category' => 'Database'],
                    ['name' => 'Stripe', 'category' => 'Payment'],
                    ['name' => 'Tailwind CSS', 'category' => 'Styling']
                ],
                'order' => 1,
                'featured' => true,
                'is_active' => true
            ],
            [
                'title' => 'Sistema de Gestión de Inventarios',
                'description' => 'Aplicación empresarial para control de inventarios con reportes en tiempo real.',
                'content' => '<p>Sistema web para gestión integral de inventarios diseñado para empresas medianas y grandes.</p>',
                'image' => '/images/projects/inventario.jpg',
                'tags' => ['Vue.js', 'Laravel', 'Chart.js', 'MySQL', 'PDF Reports'],
                'demo_url' => 'https://demo-inventario.com',
                'github_url' => 'https://github.com/usuario/inventario',
                'technologies' => [
                    ['name' => 'Vue.js', 'category' => 'Frontend'],
                    ['name' => 'Laravel', 'category' => 'Backend'],
                    ['name' => 'Chart.js', 'category' => 'Visualization'],
                    ['name' => 'MySQL', 'category' => 'Database']
                ],
                'order' => 2,
                'featured' => true,
                'is_active' => true
            ],
            [
                'title' => 'Blog Personal con CMS',
                'description' => 'Blog responsive con sistema de gestión de contenidos y optimización SEO.',
                'image' => '/images/projects/blog.jpg',
                'tags' => ['Vue.js', 'Nuxt.js', 'Laravel', 'SEO', 'Markdown'],
                'demo_url' => 'https://mi-blog.com',
                'github_url' => 'https://github.com/usuario/blog',
                'order' => 3,
                'featured' => false,
                'is_active' => true
            ]
        ];

        foreach ($projects as $project) {
            Project::create($project);
        }
    }
}
```

**database/seeders/SkillSeeder.php:**

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Skill;

class SkillSeeder extends Seeder
{
    public function run()
    {
        $skills = [
            ['name' => 'Vue.js', 'category' => 'Frontend', 'level' => 5, 'order' => 1],
            ['name' => 'Laravel', 'category' => 'Backend', 'level' => 5, 'order' => 2],
            ['name' => 'JavaScript', 'category' => 'Frontend', 'level' => 5, 'order' => 3],
            ['name' => 'PHP', 'category' => 'Backend', 'level' => 4, 'order' => 4],
            ['name' => 'MySQL', 'category' => 'Database', 'level' => 4, 'order' => 5],
            ['name' => 'Tailwind CSS', 'category' => 'Frontend', 'level' => 4, 'order' => 6],
            ['name' => 'Node.js', 'category' => 'Backend', 'level' => 3, 'order' => 7],
            ['name' => 'Docker', 'category' => 'DevOps', 'level' => 3, 'order' => 8],
            ['name' => 'Git', 'category' => 'Tools', 'level' => 4, 'order' => 9],
            ['name' => 'AWS', 'category' => 'Cloud', 'level' => 3, 'order' => 10]
        ];

        foreach ($skills as $skill) {
            Skill::create($skill);
        }
    }
}
```

**database/seeders/DatabaseSeeder.php:**

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            PortfolioSeeder::class,
            SkillSeeder::class,
            ProjectSeeder::class,
        ]);
    }
}
```

### 2. Ejecutar seeders

```bash
php artisan db:seed
```

### 3. Probar endpoints

```bash
# Test de salud
curl http://localhost:8000/api/health

# Test portfolio
curl http://localhost:8000/api/portfolio

# Test projects
curl http://localhost:8000/api/projects

# Test contact (POST)
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Test message"}'
```

## 🚀 Deployment

### Opción 1: Deployment en Replit (Recomendado)

#### Backend Laravel en Replit:

1. Crear nuevo Repl con PHP
2. Subir código Laravel
3. Configurar `.replit`:

```toml
run = "php artisan serve --host=0.0.0.0 --port=8000"
entrypoint = "public/index.php"

[env]
PORT = "8000"
```

4. Configurar base de datos PostgreSQL desde el panel de Replit
5. Configurar variables de entorno en Secrets

#### Frontend Vue en Replit:

1. Tu proyecto actual ya está configurado
2. Actualizar `src/config/environment.js` con la URL de tu backend
3. Deploy usando el botón Deploy de Replit

### Opción 2: Otros servicios

- **Backend**: Heroku, DigitalOcean, AWS
- **Frontend**: Vercel, Netlify, GitHub Pages

## 🔧 Troubleshooting

### Problemas comunes:

1. **Error CORS**: Verificar configuración en `config/cors.php`
2. **Error 404 API**: Verificar rutas en `routes/api.php`
3. **Error conexión DB**: Verificar configuración `.env`
4. **Error permisos**: `chmod -R 775 storage bootstrap/cache`

### Debugging:

```bash
# Ver logs Laravel
tail -f storage/logs/laravel.log

# Debug rutas
php artisan route:list

# Limpiar cache
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

## 📝 Notas Importantes

1. **Seguridad**: En producción, configurar rate limiting y validación CSRF
2. **Performance**: Implementar cache para endpoints que no cambien frecuentemente
3. **Backup**: Configurar backups automáticos de la base de datos
4. **Monitoring**: Implementar logging y monitoreo de errores
5. **Testing**: Crear tests unitarios y de integración

## 🔄 Siguientes Pasos

1. Implementar autenticación para panel de administración
2. Agregar sistema de categorías para proyectos
3. Implementar búsqueda y filtros avanzados
4. Agregar sistema de comentarios/testimonios
5. Implementar analytics y métricas
6. Agregar internacionalización (i18n)
7. Optimizar para SEO
8. Implementar PWA features

¡Tu portafolio Vue.js + Laravel está listo! 🎉
