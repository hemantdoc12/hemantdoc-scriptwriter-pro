import { useState, useRef, useCallback, useEffect } from 'react'
import { useProjectStore } from './stores/projectStore'
import { useAuthStore } from './stores/authStore'
import toast, { Toaster } from 'react-hot-toast'
import { 
  DocumentTextIcon,
  SparklesIcon,
  EyeIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  PlayIcon,
  ArrowRightIcon,
  CameraIcon,
  FilmIcon
} from '@heroicons/react/24/outline'
import ProfessionalScriptEditor, { ScriptEditorRef } from './components/ProfessionalScriptEditor'
import { formatScriptProfessionally, detectElementType } from './utils/professionalFormatter'

export default function App() {
  const { currentProject, createProject, updateScriptContent } = useProjectStore()
  const { user, initializeUser } = useAuthStore()
  
  const [content, setContent] = useState(`FADE IN:

EXT. HEMANTDOC SCRIPTWRITER PRO - DAY

A revolutionary screenplay writing application comes to life with professional formatting, industry-standard positioning, and Celtx-style character/dialogue layout.

WRITER
(excited)
Finally! Character buttons that actually format text, cursor positioning that works, and consistent formatting across all modes!

The Writer begins typing, experiencing the seamless professional formatting system with scene numbering, enhanced PDF export, and AI script analysis.

FADE OUT.`)

  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const scriptEditorRef = useRef<ScriptEditorRef>(null)
  
  // Initialize user and project on app start
  useEffect(() => {
    initializeUser()
    
    // Create default project if none exists
    if (!currentProject) {
      createProject('My First Screenplay', 'A professional screenplay with industry-standard formatting')
    }
  }, [])
  
  // Sync content with current project
  useEffect(() => {
    if (currentProject) {
      setContent(currentProject.scriptContent)
    }
  }, [currentProject])

  // Format buttons configuration
  const formatButtons = [
    { type: 'scene_heading', label: 'Scene Heading', icon: FilmIcon, shortcut: '⌘1', color: 'bg-blue-500' },
    { type: 'action', label: 'Action', icon: PlayIcon, shortcut: '⌘2', color: 'bg-green-500' },
    { type: 'character', label: 'Character', icon: UserIcon, shortcut: '⌘3', color: 'bg-red-500' },
    { type: 'dialogue', label: 'Dialogue', icon: ChatBubbleLeftRightIcon, shortcut: '⌘4', color: 'bg-purple-500' },
    { type: 'parenthetical', label: 'Parenthetical', icon: DocumentTextIcon, shortcut: '⌘5', color: 'bg-yellow-500' },
    { type: 'transition', label: 'Transition', icon: ArrowRightIcon, shortcut: '⌘6', color: 'bg-pink-500' },
    { type: 'shot', label: 'Shot', icon: CameraIcon, shortcut: '⌘7', color: 'bg-indigo-500' }
  ]

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent)
    
    // Update statistics
    const words = newContent.split(/\\s+/).filter(word => word.length > 0).length
    const pages = Math.ceil(newContent.split('\\n').length / 55)
    setWordCount(words)
    setPageCount(pages)
    
    // Auto-save to project store
    updateScriptContent(newContent)
  }, [updateScriptContent])

  const handleElementFormat = (elementType: string) => {
    if (scriptEditorRef.current) {
      scriptEditorRef.current.formatCurrentLine(elementType)
      toast.success(`🎯 Formatted as ${elementType.replace('_', ' ').toUpperCase()}`, {
        duration: 1000,
        style: { background: '#fed7aa', color: '#9a3412', fontWeight: '600' }
      })
    }
  }

  const handleAutoFormat = () => {
    const formattedContent = formatScriptProfessionally(content)
    setContent(formattedContent)
    toast.success('✨ Script formatted with industry standards!', { 
      duration: 3000,
      style: { background: '#fed7aa', color: '#9a3412', fontWeight: '600' }
    })
  }

  const handleExportPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf')
      const pdf = new jsPDF('portrait', 'pt', 'letter')
      
      // Professional PDF export with proper positioning
      const pageWidth = 612
      const pageHeight = 792
      const leftMargin = 90
      const rightMargin = 54
      const topMargin = 54
      const lineHeight = 12
      let yPosition = topMargin + 36
      
      // Title page
      pdf.setFont('courier', 'bold')
      pdf.setFontSize(24)
      const titleY = pageHeight / 2 - 100
      pdf.text('PROFESSIONAL SCREENPLAY', pageWidth / 2, titleY, { align: 'center' })
      
      pdf.setFont('courier', 'normal')
      pdf.setFontSize(12)
      pdf.text('Written with HemantDoc ScriptWriter Pro', pageWidth / 2, titleY + 60, { align: 'center' })
      pdf.text('Professional Formatting System', pageWidth / 2, titleY + 80, { align: 'center' })
      
      // Script content
      pdf.addPage()
      yPosition = topMargin + 36
      
      const lines = content.split('\\n')
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue
        
        const elementType = detectElementType(line, lines, i)
        let xPosition = leftMargin
        let text = line
        
        // Professional positioning
        switch (elementType) {
          case 'scene_heading':
            text = text.toUpperCase()
            pdf.setFont('courier', 'bold')
            yPosition += lineHeight
            break
          case 'character':
            text = text.toUpperCase()
            xPosition = leftMargin + 220 // Centered position
            pdf.setFont('courier', 'bold')
            yPosition += lineHeight / 2
            break
          case 'dialogue':
            xPosition = leftMargin + 100 // Dialogue indent
            pdf.setFont('courier', 'normal')
            break
          case 'parenthetical':
            if (!text.startsWith('(')) text = '(' + text
            if (!text.endsWith(')')) text = text + ')'
            xPosition = leftMargin + 160
            pdf.setFont('courier', 'normal')
            break
          case 'transition':
            text = text.toUpperCase()
            if (!text.endsWith(':')) text = text + ':'
            const textWidth = pdf.getTextWidth(text)
            xPosition = pageWidth - rightMargin - textWidth
            pdf.setFont('courier', 'bold')
            yPosition += lineHeight
            break
          default:
            pdf.setFont('courier', 'normal')
            yPosition += lineHeight / 2
            break
        }
        
        if (yPosition > pageHeight - 100) {
          pdf.addPage()
          yPosition = topMargin
        }
        
        pdf.setFontSize(12)
        pdf.text(text, xPosition, yPosition)
        yPosition += lineHeight
      }
      
      pdf.save('professional-screenplay.pdf')
      toast.success('📄 Professional PDF exported!', { 
        duration: 3000,
        style: { background: '#dcfce7', color: '#166534', fontWeight: '600' }
      })
    } catch (error) {
      console.error('PDF export failed:', error)
      toast.error('❌ PDF export failed. Please try again.')
    }
  }

  return (
    <div className="h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)' }}>
      <Toaster position="top-right" />
      
      {/* Orange Header */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <DocumentTextIcon className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white drop-shadow-sm">HemantDoc ScriptWriter Pro</h1>
                  <p className="text-sm text-orange-100">Professional Screenplay Formatting System</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="hidden md:flex items-center space-x-8 text-white">
              <div className="text-center">
                <div className="text-2xl font-bold">{wordCount}</div>
                <div className="text-xs text-orange-100">WORDS</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{pageCount}</div>
                <div className="text-xs text-orange-100">PAGES</div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                  isPreviewMode 
                    ? 'bg-white text-orange-600 shadow-lg' 
                    : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                }`}
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                {isPreviewMode ? 'Edit' : 'Preview'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Formatting Toolbar */}
        <div className="w-64 bg-gradient-to-b from-orange-50 to-orange-100 border-r-2 border-orange-200 p-4 shadow-lg">
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-orange-800 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={handleAutoFormat}
                  className="w-full flex items-center px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm"
                >
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  Auto-Format
                </button>
                
                <button
                  onClick={handleExportPDF}
                  className="w-full flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                >
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Export PDF
                </button>
              </div>
            </div>

            {/* Formatting Tools */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-orange-800 mb-3">Format Elements</h3>
              <div className="space-y-1">
                {formatButtons.map((button) => {
                  const Icon = button.icon
                  return (
                    <button
                      key={button.type}
                      onClick={() => handleElementFormat(button.type)}
                      className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-800 rounded-lg transition-all group"
                      title={`${button.label} (${button.shortcut})`}
                    >
                      <div className={`w-3 h-3 rounded-full mr-3 ${button.color} group-hover:scale-110 transition-transform`} />
                      <Icon className="h-4 w-4 mr-2 text-gray-500 group-hover:text-orange-600" />
                      <span className="flex-1 text-left">{button.label}</span>
                      <span className="text-xs text-gray-400 group-hover:text-orange-500">{button.shortcut}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-8 flex flex-col">
            <div className="bg-white rounded-2xl shadow-xl border-2 border-orange-200 flex-1 flex flex-col min-h-0">
              <ProfessionalScriptEditor
                ref={scriptEditorRef}
                value={content}
                onChange={handleContentChange}
                isPreviewMode={isPreviewMode}
                className="flex-1 rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gradient-to-r from-orange-100 to-orange-200 border-t-2 border-orange-300 px-6 py-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6 text-orange-800">
            <span className="font-semibold">Format: Professional Screenplay</span>
            <span>Font: Courier New 12pt</span>
          </div>
          <div className="flex items-center space-x-6 text-orange-700">
            <span className="font-bold text-orange-600 flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
              Professional Formatting System v3.0.0
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}