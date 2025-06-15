
<template>
  <div id="app">
    <!-- Navigation Header -->
    <header class="navbar">
      <div class="nav-container">
        <div class="logo">
          <h2>{{ portfolioData.name }}</h2>
        </div>
        <nav>
          <ul class="nav-menu">
            <li><a href="#home" @click="activeSection = 'home'">Inicio</a></li>
            <li><a href="#about" @click="activeSection = 'about'">Acerca</a></li>
            <li><a href="#gallery" @click="activeSection = 'gallery'">Galería</a></li>
            <li><a href="#contact" @click="activeSection = 'contact'">Contacto</a></li>
          </ul>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <!-- Home Section -->
      <section v-if="activeSection === 'home'" id="home" class="section home-section">
        <div class="hero-content">
          <h1>{{ portfolioData.title }}</h1>
          <p class="hero-subtitle">{{ portfolioData.subtitle }}</p>
          <div class="hero-description" v-html="portfolioData.description"></div>
          <button @click="activeSection = 'gallery'" class="cta-button">Ver Trabajos</button>
        </div>
      </section>

      <!-- About Section -->
      <section v-if="activeSection === 'about'" id="about" class="section about-section">
        <div class="container">
          <h2>Acerca de Mí</h2>
          <div class="about-content">
            <div class="about-text" v-html="portfolioData.about"></div>
            <div class="skills">
              <h3>Habilidades</h3>
              <div class="skills-grid">
                <span v-for="skill in portfolioData.skills" :key="skill.id" class="skill-tag">
                  {{ skill.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Gallery Section -->
      <section v-if="activeSection === 'gallery'" id="gallery" class="section gallery-section">
        <div class="container">
          <h2>Mi Trabajo</h2>
          <div class="gallery-grid">
            <div v-for="project in projects" :key="project.id" class="project-card" @click="openProjectModal(project)">
              <div class="project-image">
                <img :src="project.image" :alt="project.title" @error="handleImageError">
              </div>
              <div class="project-info">
                <h3>{{ project.title }}</h3>
                <p>{{ project.description }}</p>
                <div class="project-tags">
                  <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>
                <div class="project-links">
                  <a v-if="project.demo_url" :href="project.demo_url" target="_blank" class="btn-demo">Demo</a>
                  <a v-if="project.github_url" :href="project.github_url" target="_blank" class="btn-code">Código</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section v-if="activeSection === 'contact'" id="contact" class="section contact-section">
        <div class="container">
          <h2>Contacto</h2>
          <div class="contact-content">
            <div class="contact-info">
              <h3>¡Hablemos!</h3>
              <p>{{ portfolioData.contact_message }}</p>
              <div class="contact-details">
                <p><strong>Email:</strong> {{ portfolioData.email }}</p>
                <p><strong>Teléfono:</strong> {{ portfolioData.phone }}</p>
                <div class="social-links">
                  <a v-for="social in portfolioData.social_links" :key="social.platform" 
                     :href="social.url" target="_blank" class="social-link">
                    {{ social.platform }}
                  </a>
                </div>
              </div>
            </div>
            <form @submit.prevent="submitContact" class="contact-form">
              <div class="form-group">
                <label for="name">Nombre:</label>
                <input type="text" id="name" v-model="contactForm.name" required>
              </div>
              <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="contactForm.email" required>
              </div>
              <div class="form-group">
                <label for="subject">Asunto:</label>
                <input type="text" id="subject" v-model="contactForm.subject" required>
              </div>
              <div class="form-group">
                <label for="message">Mensaje:</label>
                <textarea id="message" v-model="contactForm.message" rows="5" required></textarea>
              </div>
              <button type="submit" :disabled="isSubmitting" class="submit-btn">
                {{ isSubmitting ? 'Enviando...' : 'Enviar Mensaje' }}
              </button>
              <div v-if="submitMessage" class="submit-message" :class="submitStatus">
                {{ submitMessage }}
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} {{ portfolioData.name }}. Todos los derechos reservados.</p>
      </div>
    </footer>

    <!-- Project Modal -->
    <ProjectModal 
      :project="selectedProject" 
      :isVisible="isModalVisible" 
      @close="closeProjectModal" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { portfolioService } from './services/portfolioService'
import ProjectModal from './components/ProjectModal.vue'

// Reactive data
const activeSection = ref('home')
const projects = ref([])
const portfolioData = ref({
  name: 'Mi Portafolio',
  title: 'Desarrollador Full Stack',
  subtitle: 'Creando experiencias digitales increíbles',
  description: 'Bienvenido a mi portafolio profesional...',
  about: 'Soy un desarrollador apasionado...',
  skills: [],
  email: 'contacto@ejemplo.com',
  phone: '+1234567890',
  contact_message: 'Estoy disponible para nuevos proyectos.',
  social_links: []
})

// Contact form
const contactForm = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})
const isSubmitting = ref(false)
const submitMessage = ref('')
const submitStatus = ref('')

// Modal data
const selectedProject = ref({})
const isModalVisible = ref(false)

// Methods
const loadPortfolioData = async () => {
  try {
    // Cargar datos del portafolio desde Laravel API
    const data = await portfolioService.getPortfolioData()
    portfolioData.value = { ...portfolioData.value, ...data }
  } catch (error) {
    console.error('Error loading portfolio data:', error)
    // Usar datos por defecto si hay error
  }
}

const loadProjects = async () => {
  try {
    // Cargar proyectos desde Laravel API
    const data = await portfolioService.getProjects()
    projects.value = data
  } catch (error) {
    console.error('Error loading projects:', error)
    // Usar proyectos por defecto si hay error
    projects.value = [
      {
        id: 1,
        title: 'Proyecto Demo',
        description: 'Descripción del proyecto demo',
        image: '/placeholder-project.jpg',
        tags: ['Vue.js', 'Laravel'],
        demo_url: '#',
        github_url: '#'
      }
    ]
  }
}

const submitContact = async () => {
  isSubmitting.value = true
  submitMessage.value = ''
  
  try {
    // Enviar formulario a Laravel API
    await portfolioService.submitContact(contactForm.value)
    submitMessage.value = '¡Mensaje enviado exitosamente!'
    submitStatus.value = 'success'
    
    // Limpiar formulario
    contactForm.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  } catch (error) {
    console.error('Error submitting contact form:', error)
    submitMessage.value = 'Error al enviar el mensaje. Inténtalo de nuevo.'
    submitStatus.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}

const handleImageError = (event) => {
  // Imagen por defecto si la imagen del proyecto falla
  event.target.src = '/placeholder-project.jpg'
}

const openProjectModal = async (project) => {
  try {
    // Obtener detalles completos del proyecto
    const fullProject = await portfolioService.getProject(project.id)
    selectedProject.value = fullProject
  } catch (error) {
    console.error('Error loading project details:', error)
    selectedProject.value = project
  }
  isModalVisible.value = true
}

const closeProjectModal = () => {
  isModalVisible.value = false
  selectedProject.value = {}
}

// Lifecycle
onMounted(() => {
  loadPortfolioData()
  loadProjects()
})
</script>

<style scoped>
/* Variables CSS */
:root {
  --primary-color: #2c3e50;
  --secondary-color: #3498db;
  --accent-color: #e74c3c;
  --text-color: #333;
  --bg-color: #f8f9fa;
  --white: #ffffff;
  --border-radius: 8px;
  --box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  --transition: all 0.3s ease;
}

/* Reset y base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Inter', sans-serif;
  color: var(--text-color);
  line-height: 1.6;
}

/* Navigation */
.navbar {
  background: var(--white);
  box-shadow: var(--box-shadow);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h2 {
  color: var(--primary-color);
  font-weight: 700;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-menu a {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  transition: var(--transition);
  cursor: pointer;
}

.nav-menu a:hover {
  color: var(--secondary-color);
}

/* Sections */
.section {
  min-height: 100vh;
  padding: 100px 0 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Home Section */
.home-section {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.hero-content h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-description {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-button {
  background: var(--accent-color);
  color: var(--white);
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  font-weight: 600;
}

.cta-button:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

/* About Section */
.about-section {
  background: var(--bg-color);
}

.about-section h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: var(--primary-color);
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

.about-text {
  font-size: 1.1rem;
  line-height: 1.8;
}

.skills h3 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  background: var(--secondary-color);
  color: var(--white);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
}

/* Gallery Section */
.gallery-section h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: var(--primary-color);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.project-card {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  transition: var(--transition);
  cursor: pointer;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0,0,0,0.15);
}

.project-image {
  height: 250px;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition);
}

.project-card:hover .project-image img {
  transform: scale(1.05);
}

.project-info {
  padding: 1.5rem;
}

.project-info h3 {
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.project-info p {
  margin-bottom: 1rem;
  color: #666;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  background: var(--bg-color);
  color: var(--text-color);
  padding: 0.3rem 0.8rem;
  border-radius: var(--border-radius);
  font-size: 0.8rem;
}

.project-links {
  display: flex;
  gap: 1rem;
}

.btn-demo, .btn-code {
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
}

.btn-demo {
  background: var(--secondary-color);
  color: var(--white);
}

.btn-code {
  background: var(--primary-color);
  color: var(--white);
}

.btn-demo:hover, .btn-code:hover {
  transform: translateY(-2px);
}

/* Contact Section */
.contact-section {
  background: var(--bg-color);
}

.contact-section h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: var(--primary-color);
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.contact-info h3 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.contact-details {
  margin-top: 2rem;
}

.contact-details p {
  margin-bottom: 0.5rem;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.social-link {
  color: var(--secondary-color);
  text-decoration: none;
  font-weight: 500;
}

.contact-form {
  background: var(--white);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--primary-color);
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
}

.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: var(--secondary-color);
}

.submit-btn {
  background: var(--secondary-color);
  color: var(--white);
  border: none;
  padding: 1rem 2rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: var(--transition);
  width: 100%;
}

.submit-btn:hover:not(:disabled) {
  background: #2980b9;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-message {
  margin-top: 1rem;
  padding: 0.8rem;
  border-radius: var(--border-radius);
  text-align: center;
  font-weight: 500;
}

.submit-message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.submit-message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Footer */
.footer {
  background: var(--primary-color);
  color: var(--white);
  text-align: center;
  padding: 2rem 0;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
  }

  .hero-content h1 {
    font-size: 2.5rem;
  }

  .about-content, .contact-content {
    grid-template-columns: 1fr;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }

  .container {
    padding: 0 1rem;
  }
}
</style>
