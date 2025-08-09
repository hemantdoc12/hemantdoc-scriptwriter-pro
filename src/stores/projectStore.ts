import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Project {
  id: string
  title: string
  description: string
  scriptContent: string
  createdAt: Date
  updatedAt: Date
  author: string
  genre: string
  logline?: string
  pageCount: number
  wordCount: number
  characterCount: number
}

interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  isLoading: boolean
  
  // Actions
  createProject: (title: string, description?: string) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  setCurrentProject: (project: Project | null) => void
  updateScriptContent: (content: string) => void
  getProjectById: (id: string) => Project | undefined
  duplicateProject: (id: string) => void
  exportProject: (id: string, format: 'fdx' | 'pdf' | 'txt') => void
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProject: null,
      isLoading: false,

      createProject: (title: string, description?: string) => {
        const newProject: Project = {
          id: `project_${Date.now()}`,
          title,
          description: description || '',
          scriptContent: `FADE IN:

EXT. ${title.toUpperCase()} - DAY

A new story begins...

FADE OUT.`,
          createdAt: new Date(),
          updatedAt: new Date(),
          author: 'Writer',
          genre: 'Drama',
          pageCount: 1,
          wordCount: 8,
          characterCount: 50
        }

        set(state => ({
          projects: [...state.projects, newProject],
          currentProject: newProject
        }))
      },

      updateProject: (id: string, updates: Partial<Project>) => {
        set(state => ({
          projects: state.projects.map(project =>
            project.id === id 
              ? { ...project, ...updates, updatedAt: new Date() }
              : project
          ),
          currentProject: state.currentProject?.id === id 
            ? { ...state.currentProject, ...updates, updatedAt: new Date() }
            : state.currentProject
        }))
      },

      deleteProject: (id: string) => {
        set(state => ({
          projects: state.projects.filter(project => project.id !== id),
          currentProject: state.currentProject?.id === id ? null : state.currentProject
        }))
      },

      setCurrentProject: (project: Project | null) => {
        set({ currentProject: project })
      },

      updateScriptContent: (content: string) => {
        const { currentProject } = get()
        if (!currentProject) return

        // Calculate stats
        const words = content.split(/\\s+/).filter(word => word.length > 0).length
        const pages = Math.ceil(content.split('\\n').length / 55)
        const characters = content.length

        const updates = {
          scriptContent: content,
          wordCount: words,
          pageCount: pages,
          characterCount: characters,
          updatedAt: new Date()
        }

        set(state => ({
          currentProject: { ...currentProject, ...updates },
          projects: state.projects.map(project =>
            project.id === currentProject.id 
              ? { ...project, ...updates }
              : project
          )
        }))
      },

      getProjectById: (id: string) => {
        return get().projects.find(project => project.id === id)
      },

      duplicateProject: (id: string) => {
        const { projects } = get()
        const projectToDuplicate = projects.find(p => p.id === id)
        
        if (projectToDuplicate) {
          const duplicatedProject: Project = {
            ...projectToDuplicate,
            id: `project_${Date.now()}`,
            title: `${projectToDuplicate.title} (Copy)`,
            createdAt: new Date(),
            updatedAt: new Date()
          }

          set(state => ({
            projects: [...state.projects, duplicatedProject]
          }))
        }
      },

      exportProject: (id: string, format: 'fdx' | 'pdf' | 'txt') => {
        const project = get().getProjectById(id)
        if (!project) return

        // Export logic would go here
        console.log(`Exporting project ${project.title} as ${format}`)
      }
    }),
    {
      name: 'hemantdoc-scriptwriter-projects',
      version: 1,
    }
  )
)