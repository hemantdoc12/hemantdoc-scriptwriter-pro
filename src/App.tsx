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
  FilmIcon,
  ChevronDownIcon,
  ArrowDownTrayIcon,
  KeyIcon,
  CalendarIcon,
  UsersIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'
import ProfessionalVerticalStackEditor, { ScriptEditorRef } from './components/ProfessionalVerticalStackEditor'
import { formatScriptProfessionally, detectElementType, addSceneNumbers } from './utils/professionalFormatter'
import { useKeyboardShortcuts, KEYBOARD_SHORTCUTS } from './hooks/useKeyboardShortcuts'

export default function App() {
  const { currentProject, createProject, updateScriptContent } = useProjectStore()
  const { user, initializeUser } = useAuthStore()
  
  const [content, setContent] = useState('')

  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [showExportOptions, setShowExportOptions] = useState(false)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [showBreakdownModal, setShowBreakdownModal] = useState(false)
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
    { type: 'SceneHeading', label: 'Scene Heading', icon: FilmIcon, shortcut: '⌘1', color: 'bg-blue-500' },
    { type: 'Action', label: 'Action', icon: PlayIcon, shortcut: '⌘2', color: 'bg-green-500' },
    { type: 'Character', label: 'Character', icon: UserIcon, shortcut: '⌘3', color: 'bg-red-500' },
    { type: 'Dialogue', label: 'Dialogue', icon: ChatBubbleLeftRightIcon, shortcut: '⌘4', color: 'bg-purple-500' },
    { type: 'Parenthetical', label: 'Parenthetical', icon: DocumentTextIcon, shortcut: '⌘5', color: 'bg-yellow-500' },
    { type: 'Transition', label: 'Transition', icon: ArrowRightIcon, shortcut: '⌘6', color: 'bg-pink-500' },
    { type: 'Shot', label: 'Shot', icon: CameraIcon, shortcut: '⌘7', color: 'bg-indigo-500' }
  ]

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent)
    
    // Update statistics
    const words = newContent.split(/\\s+/).filter(word => word.length > 0).length
    const pages = Math.ceil(newContent.split('\\n').length / 55)
    setWordCount(words)
    setPageCount(pages)
    
    // Auto-save to project store with debouncing
    clearTimeout((window as any).saveTimer)
    ;(window as any).saveTimer = setTimeout(() => {
      updateScriptContent(newContent)
    }, 1000)
  }, [updateScriptContent])

  const handleElementFormat = (elementType: string) => {
    console.log('🔥 Format button clicked in App:', elementType)
    console.log('📋 Script editor ref:', scriptEditorRef.current)
    
    if (scriptEditorRef.current) {
      console.log('✅ Calling formatCurrentLine...')
      scriptEditorRef.current.formatCurrentLine(elementType)
      toast.success(`🎯 Formatted as ${elementType}`, {
        duration: 2000,
        style: { background: '#fed7aa', color: '#9a3412', fontWeight: '600' }
      })
    } else {
      console.error('❌ Script editor ref is null!')
      toast.error('Editor not ready. Please try again.')
    }
  }

  // Keyboard shortcuts handlers
  const handleFormatShortcut = (format: string) => {
    handleElementFormat(format)
  }

  const handleFileOperation = (operation: string) => {
    switch (operation) {
      case 'new':
        setContent('')
        toast.success('📄 New script created')
        break
      case 'save':
        toast.success('💾 Script saved')
        break
      case 'exportPDF':
        handleExportPDF()
        break
      case 'exportTXT':
        handleExportTXT()
        break
      case 'exportFDX':
        handleExportFDX()
        break
      default:
        toast(`${operation} feature coming soon!`, { icon: 'ℹ️' })
    }
  }

  const handleNavigation = (action: string) => {
    switch (action) {
      case 'togglePreview':
        setIsPreviewMode(!isPreviewMode)
        break
      case 'keyboardShortcuts':
        setShowKeyboardShortcuts(true)
        break
      case 'find':
        toast('🔍 Find feature coming soon!', { icon: 'ℹ️' })
        break
      default:
        toast(`${action} feature coming soon!`, { icon: 'ℹ️' })
    }
  }

  const handleEditing = (action: string) => {
    toast(`${action} handled by browser`, { icon: 'ℹ️' })
  }

  const handleSmartFeature = (action: string) => {
    switch (action) {
      case 'autoFormat':
        handleAutoFormat()
        break
      case 'toggleComment':
        toast('💬 Comment feature coming soon!', { icon: 'ℹ️' })
        break
      case 'duplicateLine':
        toast('📋 Duplicate line feature coming soon!', { icon: 'ℹ️' })
        break
      default:
        toast(`${action} feature coming soon!`, { icon: 'ℹ️' })
    }
  }

  const handleProduction = (action: string) => {
    switch (action) {
      case 'scriptBreakdown':
        setShowBreakdownModal(true)
        break
      default:
        toast(`${action} feature coming soon!`, { icon: 'ℹ️' })
    }
  }

  // Initialize keyboard shortcuts
  useKeyboardShortcuts({
    onFormatShortcut: handleFormatShortcut,
    onFileOperation: handleFileOperation,
    onNavigation: handleNavigation,
    onEditing: handleEditing,
    onSmartFeature: handleSmartFeature,
    onProduction: handleProduction
  })

  const handleAutoFormat = () => {
    const formattedContent = formatScriptProfessionally(content)
    // Also add scene numbers during auto-format
    const finalContent = addSceneNumbers(formattedContent)
    setContent(finalContent)
    toast.success('✨ Script formatted with industry standards & scene numbers!', { 
      duration: 3000,
      style: { background: '#fed7aa', color: '#9a3412', fontWeight: '600' }
    })
  }

  const handleExportTXT = () => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'screenplay.txt'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('📝 TXT file exported!', { duration: 2000 })
  }

  const handleExportFDX = () => {
    // Basic FDX format structure
    const fdxContent = `<?xml version="1.0" encoding="UTF-8"?>
<FinalDraft DocumentType="Script" Template="No">
  <Content>
    <Paragraph Type="Scene Heading">
      <Text>${content.split('\n')[0]}</Text>
    </Paragraph>
  </Content>
</FinalDraft>`
    
    const blob = new Blob([fdxContent], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'screenplay.fdx'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('🎬 FDX file exported!', { duration: 2000 })
  }

  const handleExportPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf')
      const pdf = new jsPDF('portrait', 'pt', 'letter')
      
      // AGGRESSIVE DEBUGGING - CHECK REF AND FORMATTED LINES
      console.log('🔍 CHECKING SCRIPT EDITOR REF:', {
        refExists: !!scriptEditorRef.current,
        refCurrent: scriptEditorRef.current,
        refMethods: scriptEditorRef.current ? Object.keys(scriptEditorRef.current) : 'NO REF'
      })
      
      let formattedLines: any[] = []
      if (scriptEditorRef.current && scriptEditorRef.current.getFormattedLines) {
        console.log('✅ REF EXISTS - Getting formatted lines...')
        formattedLines = scriptEditorRef.current.getFormattedLines()
        console.log('🔥 GOT FORMATTED LINES FROM EDITOR:', {
          count: formattedLines.length,
          firstFew: formattedLines.slice(0, 3),
          sample: formattedLines.find(line => line.format !== 'Action')
        })
      } else {
        console.log('❌ NO REF OR METHOD - falling back to text processing')
        console.log('Content being processed:', content.substring(0, 200) + '...')
        // Fallback to text processing
        const contentWithSceneNumbers = addSceneNumbers(content)
        formattedLines = contentWithSceneNumbers.split('\n').map((text, index) => ({
          text,
          format: detectElementType(text, contentWithSceneNumbers.split('\n'), index)
        }))
        console.log('📝 FALLBACK LINES:', {
          count: formattedLines.length, 
          firstFew: formattedLines.slice(0, 3)
        })
      }
      
      // INDUSTRY STANDARD MEASUREMENTS (in points) - ROOT CAUSE FIX
      const pageWidth = 612
      const pageHeight = 792
      const margins = {
        left: 108,      // 1.5 inches
        right: 72,      // 1 inch  
        top: 72,        // 1 inch
        bottom: 72      // 1 inch
      }
      
      // PROFESSIONAL POSITIONING (in points from left edge) - INDUSTRY STANDARD
      const positions = {
        sceneHeading: margins.left,                    // 1.5" from left
        action: margins.left,                          // 1.5" from left  
        character: 266,                                // 3.7" from left edge (exact)
        dialogue: 144,                                 // 2.0" from left edge
        parenthetical: 216,                            // 3.0" from left edge  
        transition: pageWidth - margins.right - 150   // Right-aligned with space
      }
      
      const maxWidths = {
        sceneHeading: pageWidth - margins.left - margins.right,  // Full width
        action: pageWidth - margins.left - margins.right,        // Full width
        character: 200,                                          // Narrow for character names
        dialogue: 252,                                           // 3.5" wide (professional standard)
        parenthetical: 144,                                      // 2" wide for parentheticals
        transition: 200                                          // Sufficient for transitions
      }
      
      let yPosition = margins.top
      const lineHeight = 14.4  // 12pt * 1.2 line height
      
      pdf.setFont('courier', 'normal')
      pdf.setFontSize(12)
      
      // Proper text wrapping
      const wrapText = (text: string, maxWidth: number) => {
        const words = text.split(' ')
        const lines = []
        let currentLine = ''
        
        for (const word of words) {
          const testLine = currentLine + (currentLine ? ' ' : '') + word
          const testWidth = pdf.getTextWidth(testLine)
          
          if (testWidth <= maxWidth) {
            currentLine = testLine
          } else {
            if (currentLine) {
              lines.push(currentLine)
              currentLine = word
            } else {
              lines.push(word)
            }
          }
        }
        
        if (currentLine) {
          lines.push(currentLine)
        }
        
        return lines
      }
      
      console.log('📝 Processing formatted lines:', formattedLines.length)
      
      // Count scenes for numbering
      let sceneCount = 0
      
      for (let i = 0; i < formattedLines.length; i++) {
        const lineObj = formattedLines[i]
        const text = lineObj.text?.trim() || ''
        const format = lineObj.format || 'Action'
        
        if (!text) {
          yPosition += lineHeight
          continue
        }
        
        let elementType = 'action'
        let xPosition = positions.action
        let maxWidth = maxWidths.action
        
        console.log(`\n🔥 Processing formatted line ${i}: "${text}" (format: ${format})`)
        
        // Map editor format names to PDF positioning
        const formatMapping = {
          'SceneHeading': 'sceneHeading',
          'Character': 'character',
          'Dialogue': 'dialogue', 
          'Parenthetical': 'parenthetical',
          'Action': 'action',
          'Transition': 'transition',
          'Shot': 'action'
        }
        
        // Set positioning based on editor format - DIRECT MAPPING! 🔥
        let processedText = text
        if (format === 'SceneHeading') {
          sceneCount++
          xPosition = positions.sceneHeading
          maxWidth = maxWidths.sceneHeading
          // Add scene number if not already present
          const upperText = text.toUpperCase()
          processedText = upperText.match(/^\d+\./) ? upperText : `${sceneCount}. ${upperText}`
          yPosition += 8
          console.log(`   ✅ SCENE HEADING from editor - xPos: ${xPosition}, scene: ${sceneCount}`)
        } else if (format === 'Character') {
          xPosition = positions.character  // 266pt = 3.7"
          maxWidth = maxWidths.character
          processedText = text.toUpperCase()
          yPosition += 8
          console.log(`   ✅ CHARACTER from editor - xPos: ${xPosition}`)
        } else if (format === 'Parenthetical') {
          xPosition = positions.parenthetical  // 216pt = 3.0"
          maxWidth = maxWidths.parenthetical
          console.log(`   ✅ PARENTHETICAL from editor - xPos: ${xPosition}`)
        } else if (format === 'Dialogue') {
          xPosition = positions.dialogue  // 144pt = 2.0"
          maxWidth = maxWidths.dialogue
          console.log(`   ✅ DIALOGUE from editor - xPos: ${xPosition}`)
        } else if (format === 'Transition') {
          processedText = text.toUpperCase()
          const textWidth = pdf.getTextWidth(processedText)
          xPosition = positions.transition - textWidth
          maxWidth = maxWidths.transition
          yPosition += 8
          console.log(`   ✅ TRANSITION from editor - xPos: ${xPosition}`)
        } else {
          // Default to action
          xPosition = positions.action
          maxWidth = maxWidths.action
          console.log(`   ✅ ACTION from editor - xPos: ${xPosition}`)
        }
        
        console.log(`   📍 Final positioning: format="${format}", xPosition=${xPosition}, yPosition=${yPosition}`)
        
        // Word wrap and render with processed text
        const wrappedLines = wrapText(processedText, maxWidth)
        console.log(`   🖨️ Rendering ${wrappedLines.length} lines at xPosition=${xPosition}`)
        for (const wrappedLine of wrappedLines) {
          if (yPosition > pageHeight - margins.bottom - 50) {
            pdf.addPage()
            yPosition = margins.top
          }
          
          console.log(`   📝 pdf.text("${wrappedLine}", ${xPosition}, ${yPosition})`)
          pdf.text(wrappedLine, xPosition, yPosition)
          yPosition += lineHeight
        }
      }
      
      // Page numbering will be added later when we fix the API issue
      
      // MINIMAL POSITIONING TEST - Add test lines to verify jsPDF positioning works
      console.log('🧪 ADDING POSITIONING TEST LINES')
      pdf.setFontSize(12)
      pdf.setFont('courier', 'normal')
      
      // Test line at different positions
      pdf.text('LEFT MARGIN (108pt)', 108, 100)  // Should be at left margin
      pdf.text('CHARACTER POSITION (266pt)', 266, 120)  // Should be at 3.7"  
      pdf.text('DIALOGUE POSITION (144pt)', 144, 140)  // Should be at 2.0"
      pdf.text('PARENTHETICAL (216pt)', 216, 160)  // Should be at 3.0"
      
      console.log('🧪 TEST LINES ADDED - Check positioning in PDF')
      
      pdf.save('professional-screenplay.pdf')
      toast.success('📄 Professional screenplay exported with positioning test!')
    } catch (error) {
      console.error('PDF export failed:', error)
      toast.error('❌ PDF export failed.')
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
              {/* Quick Actions Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-lg transition-all"
                >
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  Quick Actions
                  <ChevronDownIcon className="h-3 w-3 ml-1" />
                </button>
                {showQuickActions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-orange-200 z-50">
                    <div className="py-2">
                      <button onClick={handleAutoFormat} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 flex items-center">
                        <SparklesIcon className="h-4 w-4 mr-2 text-orange-500" />
                        Auto-Format Script
                      </button>
                      <button onClick={() => setShowKeyboardShortcuts(true)} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 flex items-center">
                        <KeyIcon className="h-4 w-4 mr-2 text-blue-500" />
                        Keyboard Shortcuts
                      </button>
                      <button onClick={() => setShowBreakdownModal(true)} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-green-500" />
                        Scene Breakdown
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Export Options Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowExportOptions(!showExportOptions)}
                  className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-lg transition-all"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Export
                  <ChevronDownIcon className="h-3 w-3 ml-1" />
                </button>
                {showExportOptions && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-orange-200 z-50">
                    <div className="py-2">
                      <button onClick={handleExportPDF} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 flex items-center">
                        <DocumentTextIcon className="h-4 w-4 mr-2 text-red-500" />
                        Export PDF
                      </button>
                      <button onClick={handleExportTXT} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 flex items-center">
                        <DocumentTextIcon className="h-4 w-4 mr-2 text-blue-500" />
                        Export TXT
                      </button>
                      <button onClick={handleExportFDX} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 flex items-center">
                        <FilmIcon className="h-4 w-4 mr-2 text-purple-500" />
                        Export FDX
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Version Revision */}
              <button
                onClick={() => toast.success('🔄 Version saved as v3.0.1', { duration: 2000 })}
                className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-lg transition-all"
              >
                <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
                v4.0.0
              </button>

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
                  Auto-Format Script
                </button>
                
                <button
                  onClick={() => setShowBreakdownModal(true)}
                  className="w-full flex items-center px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Scene Breakdown
                </button>
                
                <button
                  onClick={() => toast.success('🗓️ Schedule feature coming soon!', { duration: 2000 })}
                  className="w-full flex items-center px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-sm"
                >
                  <ClockIcon className="h-4 w-4 mr-2" />
                  Schedule
                </button>
                
                <button
                  onClick={() => toast.success('👥 Collaborate feature coming soon!', { duration: 2000 })}
                  className="w-full flex items-center px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-sm"
                >
                  <UsersIcon className="h-4 w-4 mr-2" />
                  Collaborate
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

            {/* Export Options */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-orange-800 mb-3">Export Options</h3>
              <div className="space-y-2">
                <button
                  onClick={handleExportPDF}
                  className="w-full flex items-center px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-sm"
                >
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Export PDF
                </button>
                
                <button
                  onClick={handleExportTXT}
                  className="w-full flex items-center px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
                >
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Export TXT
                </button>
                
                <button
                  onClick={handleExportFDX}
                  className="w-full flex items-center px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-sm"
                >
                  <FilmIcon className="h-4 w-4 mr-2" />
                  Export FDX
                </button>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-orange-800 mb-3">Help & Shortcuts</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowKeyboardShortcuts(true)}
                  className="w-full flex items-center px-3 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all shadow-sm"
                >
                  <KeyIcon className="h-4 w-4 mr-2" />
                  Keyboard Shortcuts
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-8 flex flex-col">
            <div className="bg-white rounded-2xl shadow-xl border-2 border-orange-200 flex-1 flex flex-col min-h-0">
              <ProfessionalVerticalStackEditor
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

      {/* Keyboard Shortcuts Modal */}
      {showKeyboardShortcuts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowKeyboardShortcuts(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-orange-800">Keyboard Shortcuts</h2>
              <button onClick={() => setShowKeyboardShortcuts(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                ✕
              </button>
            </div>
            
            <div className="mb-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-800 font-semibold">Pro Tip:</p>
              <p className="text-sm text-orange-700">All shortcuts work in both editing and preview modes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Script Formatting */}
              <div>
                <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                  <FilmIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Script Formatting
                </h3>
                <div className="space-y-2 text-sm">
                  {KEYBOARD_SHORTCUTS.formatting.map((shortcut, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700">{shortcut.label}</span>
                      <div className="flex">
                        {shortcut.shortcut.split('+').map((key, i) => (
                          <span key={i} className="font-mono bg-gray-100 px-2 py-1 rounded text-xs mx-0.5">
                            {key}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* File Operations */}
              <div>
                <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2 text-green-500" />
                  File Operations
                </h3>
                <div className="space-y-2 text-sm">
                  {KEYBOARD_SHORTCUTS.fileOperations.map((shortcut, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700">{shortcut.label}</span>
                      <div className="flex">
                        {shortcut.shortcut.split('+').map((key, i) => (
                          <span key={i} className="font-mono bg-gray-100 px-2 py-1 rounded text-xs mx-0.5">
                            {key}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation & View */}
              <div>
                <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                  <EyeIcon className="h-5 w-5 mr-2 text-purple-500" />
                  Navigation & View
                </h3>
                <div className="space-y-2 text-sm">
                  {KEYBOARD_SHORTCUTS.navigation.map((shortcut, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700">{shortcut.label}</span>
                      <div className="flex">
                        {shortcut.shortcut.split('+').map((key, i) => (
                          <span key={i} className="font-mono bg-gray-100 px-2 py-1 rounded text-xs mx-0.5">
                            {key}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Editing */}
              <div>
                <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                  <KeyIcon className="h-5 w-5 mr-2 text-red-500" />
                  Editing
                </h3>
                <div className="space-y-2 text-sm">
                  {KEYBOARD_SHORTCUTS.editing.map((shortcut, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700">{shortcut.label}</span>
                      <div className="flex">
                        {shortcut.shortcut.split('+').map((key, i) => (
                          <span key={i} className="font-mono bg-gray-100 px-2 py-1 rounded text-xs mx-0.5">
                            {key}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Smart Features */}
              <div>
                <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                  <SparklesIcon className="h-5 w-5 mr-2 text-yellow-500" />
                  Smart Features
                </h3>
                <div className="space-y-2 text-sm">
                  {KEYBOARD_SHORTCUTS.smartFeatures.map((shortcut, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700">{shortcut.label}</span>
                      <div className="flex">
                        {shortcut.shortcut.split('+').map((key, i) => (
                          <span key={i} className="font-mono bg-gray-100 px-2 py-1 rounded text-xs mx-0.5">
                            {key}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Production Tools */}
              <div>
                <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-indigo-500" />
                  Production Tools
                </h3>
                <div className="space-y-2 text-sm">
                  {KEYBOARD_SHORTCUTS.production.map((shortcut, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700">{shortcut.label}</span>
                      <div className="flex">
                        {shortcut.shortcut.split('+').map((key, i) => (
                          <span key={i} className="font-mono bg-gray-100 px-2 py-1 rounded text-xs mx-0.5">
                            {key}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Start Tips */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-bold text-blue-800 mb-2">Quick Start Tips</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Type "INT." or "EXT." and the line will auto-format as a scene heading</li>
                <li>• Character names in ALL CAPS will be auto-detected and formatted</li>
                <li>• Press Tab to accept autocomplete suggestions</li>
                <li>• Use Enter after character names for automatic dialogue indentation</li>
                <li>• The script auto-saves every 2 seconds while typing</li>
              </ul>
              <div className="mt-3 text-center">
                <button 
                  onClick={() => setShowKeyboardShortcuts(false)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Got it, thanks!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBreakdownModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowBreakdownModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 h-3/4 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-orange-800">Scene Breakdown & Analysis</h2>
              <button onClick={() => setShowBreakdownModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="space-y-6">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">Script Statistics</h3>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div><strong>Total Lines:</strong> {content.split('\n').length}</div>
                  <div><strong>Scene Headings:</strong> {content.split('\n').filter(line => /^(INT\.|EXT\.)/i.test(line.trim())).length}</div>
                  <div><strong>Characters:</strong> {Array.from(new Set(content.split('\n').filter(line => /^[A-Z][A-Z\s\-']{1,}(\s\(.*\))?$/.test(line.trim()) && line.trim().length < 50).map(line => line.trim().replace(/\s\(.*\)$/, '')))).length}</div>
                  <div><strong>Dialogue Lines:</strong> {content.split('\n').filter(line => line.trim() && !/^(INT\.|EXT\.|[A-Z][A-Z\s\-']{1,}(\s\(.*\))?$|\(.*\)|CUT TO:|FADE)/.test(line.trim())).length}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Scene Headings</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {content.split('\n')
                      .map((line, index) => ({ line: line.trim(), index }))
                      .filter(item => /^(INT\.|EXT\.)/i.test(item.line))
                      .map((scene, sceneIndex) => (
                        <div key={sceneIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <span className="font-semibold text-blue-600">Scene {sceneIndex + 1}</span>
                            <span className="ml-3 text-gray-700 text-sm">{scene.line}</span>
                          </div>
                          <div className="text-xs text-gray-500">Line {scene.index + 1}</div>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Characters</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {Array.from(new Set(
                      content.split('\n')
                        .filter(line => /^[A-Z][A-Z\s\-']{1,}(\s\(.*\))?$/.test(line.trim()) && line.trim().length < 50)
                        .map(line => line.trim().replace(/\s\(.*\)$/, ''))
                    )).sort().map((character, index) => {
                      const dialogueCount = content.split('\n')
                        .filter((line, i) => {
                          const prevLine = content.split('\n')[i - 1]
                          return prevLine && prevLine.trim().startsWith(character) && line.trim() && !line.trim().startsWith('(')
                        }).length
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="font-medium text-red-600">{character}</span>
                          <span className="text-xs text-gray-500">{dialogueCount} lines</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Format Breakdown</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <div className="font-bold text-blue-600 text-lg">
                      {content.split('\n').filter(line => /^(INT\.|EXT\.)/i.test(line.trim())).length}
                    </div>
                    <div className="text-blue-800 text-xs">Scene Headings</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg text-center">
                    <div className="font-bold text-red-600 text-lg">
                      {Array.from(new Set(content.split('\n').filter(line => /^[A-Z][A-Z\s\-']{1,}(\s\(.*\))?$/.test(line.trim()) && line.trim().length < 50))).length}
                    </div>
                    <div className="text-red-800 text-xs">Characters</div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg text-center">
                    <div className="font-bold text-yellow-600 text-lg">
                      {content.split('\n').filter(line => /^\(.*\)$/.test(line.trim())).length}
                    </div>
                    <div className="text-yellow-800 text-xs">Parentheticals</div>
                  </div>
                  <div className="bg-pink-50 p-3 rounded-lg text-center">
                    <div className="font-bold text-pink-600 text-lg">
                      {content.split('\n').filter(line => /^(CUT TO:|FADE TO:|DISSOLVE TO:)/i.test(line.trim())).length}
                    </div>
                    <div className="text-pink-800 text-xs">Transitions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="bg-gradient-to-r from-orange-100 to-orange-200 border-t-2 border-orange-300 px-6 py-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6 text-orange-800">
            <span className="font-semibold">Format: Professional Screenplay</span>
            <span>Font: Courier New 12pt</span>
            <span className="flex items-center">
              <QuestionMarkCircleIcon className="h-4 w-4 mr-1" />
              Vertical Line Stack • Real Screenplay Editor
            </span>
          </div>
          <div className="flex items-center space-x-6 text-orange-700">
            <span className="font-bold text-orange-600 flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
              Critical Fixes Professional Editor v4.1.1
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}