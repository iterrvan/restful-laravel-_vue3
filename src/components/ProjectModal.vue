
<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ project.title }}</h2>
        <button @click="closeModal" class="close-btn">&times;</button>
      </div>
      
      <div class="modal-body">
        <div class="project-image-gallery">
          <img :src="project.image" :alt="project.title" class="main-image">
          <div v-if="project.gallery && project.gallery.length" class="gallery-thumbnails">
            <img v-for="(img, index) in project.gallery" :key="index"
                 :src="img" :alt="`${project.title} ${index + 1}`"
                 class="thumbnail" @click="changeMainImage(img)">
          </div>
        </div>
        
        <div class="project-details">
          <div class="project-description">
            <p>{{ project.description }}</p>
            <div v-if="project.content" v-html="project.content" class="project-content"></div>
          </div>
          
          <div class="project-meta">
            <div class="project-tags">
              <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            
            <div v-if="project.technologies" class="technologies">
              <h4>Tecnologías Utilizadas:</h4>
              <div class="tech-grid">
                <div v-for="tech in project.technologies" :key="tech.name" class="tech-item">
                  <span class="tech-name">{{ tech.name }}</span>
                  <span class="tech-category">{{ tech.category }}</span>
                </div>
              </div>
            </div>
            
            <div class="project-links">
              <a v-if="project.demo_url" :href="project.demo_url" target="_blank" class="btn-demo">
                Ver Demo
              </a>
              <a v-if="project.github_url" :href="project.github_url" target="_blank" class="btn-code">
                Ver Código
              </a>
            </div>
            
            <div v-if="project.created_at" class="project-date">
              <small>Creado: {{ formatDate(project.created_at) }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// Props
const props = defineProps({
  project: {
    type: Object,
    default: () => ({})
  },
  isVisible: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close'])

// Reactive data
const mainImage = ref('')

// Methods
const closeModal = () => {
  emit('close')
}

const changeMainImage = (imageUrl) => {
  mainImage.value = imageUrl
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Watchers
watch(() => props.project.image, (newImage) => {
  mainImage.value = newImage
}, { immediate: true })

// Handle escape key
const handleEscape = (e) => {
  if (e.key === 'Escape' && props.isVisible) {
    closeModal()
  }
}

// Lifecycle
watch(() => props.isVisible, (visible) => {
  if (visible) {
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleEscape)
    document.body.style.overflow = 'auto'
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  color: var(--primary-color);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-body {
  padding: 1.5rem;
}

.project-image-gallery {
  margin-bottom: 2rem;
}

.main-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.gallery-thumbnails {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem 0;
}

.thumbnail {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.thumbnail:hover {
  border-color: var(--secondary-color);
}

.project-details {
  display: grid;
  gap: 2rem;
}

.project-description {
  font-size: 1.1rem;
  line-height: 1.7;
}

.project-content {
  margin-top: 1rem;
  color: #666;
}

.project-meta {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tag {
  background: var(--secondary-color);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
}

.technologies {
  margin-bottom: 1.5rem;
}

.technologies h4 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.8rem;
}

.tech-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 0.8rem;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.tech-name {
  font-weight: 600;
  color: var(--primary-color);
}

.tech-category {
  font-size: 0.8rem;
  color: #666;
  background: #e9ecef;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
}

.project-links {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.btn-demo, .btn-code {
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  text-align: center;
}

.btn-demo {
  background: var(--secondary-color);
  color: white;
}

.btn-code {
  background: var(--primary-color);
  color: white;
}

.btn-demo:hover, .btn-code:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.project-date {
  color: #666;
  font-style: italic;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-content {
    margin: 1rem;
    max-height: 95vh;
  }
  
  .modal-header, .modal-body {
    padding: 1rem;
  }
  
  .main-image {
    height: 250px;
  }
  
  .tech-grid {
    grid-template-columns: 1fr;
  }
  
  .project-links {
    flex-direction: column;
  }
}
</style>
