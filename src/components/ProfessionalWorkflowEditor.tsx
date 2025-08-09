import React, { useRef, forwardRef, useImperativeHandle, useCallback, useEffect, useState } from 'react'
import { detectElementType } from '../utils/professionalFormatter'

// Industry-standard color coding for screenplay elements
const ELEMENT_COLORS = {
  scene_heading: { bg: '#e3f2fd', border: '#1976d2', text: '#0d47a1' }, // Blue
  character: { bg: '#ffebee', border: '#d32f2f', text: '#c62828' }, // Red
  dialogue: { bg: '#f3e5f5', border: '#7b1fa2', text: '#4a148c' }, // Purple
  parenthetical: { bg: '#fff3e0', border: '#f57c00', text: '#e65100' }, // Orange
  action: { bg: '#e8f5e8', border: '#388e3c', text: '#1b5e20' }, // Green
  transition: { bg: '#fce4ec', border: '#c2185b', text: '#880e4f' }, // Pink
  shot: { bg: '#e1f5fe', border: '#0288d1', text: '#01579b' } // Light Blue
}

// Professional screenplay formatting positions
const FORMAT_POSITIONS = {
  scene_heading: { indent: 0, align: 'left', transform: 'uppercase', weight: 'bold' },
  character: { indent: 220, align: 'center', transform: 'uppercase', weight: 'bold' }, // 3.7"
  dialogue: { indent: 100, align: 'left', transform: 'none', weight: 'normal' }, // 1.5"
  parenthetical: { indent: 160, align: 'left', transform: 'none', weight: 'normal' }, // 2.6" 
  action: { indent: 0, align: 'left', transform: 'none', weight: 'normal' },
  transition: { indent: 0, align: 'right', transform: 'uppercase', weight: 'bold' },
  shot: { indent: 0, align: 'left', transform: 'uppercase', weight: 'bold' }
}

export interface ScriptEditorRef {
  formatCurrentLine: (elementType: string) => void
  insertTextAtCursor: (text: string) => void
  focus: () => void
  getCurrentLine: () => string
  getCurrentElementType: () => string
}

interface ProfessionalWorkflowEditorProps {
  value: string
  onChange: (value: string) => void
  isPreviewMode: boolean
  className?: string
  placeholder?: string
}

// Line-based formatting storage - each line remembers its format
interface LineFormat {
  lineIndex: number
  elementType: string
  content: string
}

const ProfessionalWorkflowEditor = forwardRef<ScriptEditorRef, ProfessionalWorkflowEditorProps>(
  ({ value, onChange, isPreviewMode, className = '', placeholder }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [currentFormatMode, setCurrentFormatMode] = useState<string>('action')
    const [cursorPosition, setCursorPosition] = useState({ line: 0, col: 0 })
    const [showTooltip, setShowTooltip] = useState(false)
    const [lineFormats, setLineFormats] = useState<Record<number, string>>({}) // Track format per line

    useImperativeHandle(ref, () => ({
      formatCurrentLine: (elementType: string) => {
        console.log('🎯 PROFESSIONAL: Format mode set to:', elementType)
        
        // Set the active format mode for NEW lines
        setCurrentFormatMode(elementType)
        
        // If there's text on current line, format it immediately
        if (textareaRef.current) {
          const currentLine = getCurrentLine()
          const currentLineIndex = getCurrentLineIndex()
          
          if (currentLine.trim()) {
            // Format existing text on current line
            formatExistingLine(currentLineIndex, elementType)
          }
          
          // Store the format for this line
          setLineFormats(prev => ({
            ...prev,
            [currentLineIndex]: elementType
          }))
          
          textareaRef.current.focus()
        }
        
        // Show tooltip
        setShowTooltip(true)
        setTimeout(() => setShowTooltip(false), 3000)
        
        console.log('✨ Ready to type in', elementType, 'format!')
      },

      insertTextAtCursor: (text: string) => {
        if (!textareaRef.current) return
        
        const textarea = textareaRef.current
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        
        const newValue = value.substring(0, start) + text + value.substring(end)
        onChange(newValue)
        
        setTimeout(() => {
          const newCursorPos = start + text.length
          textarea.setSelectionRange(newCursorPos, newCursorPos)
          textarea.focus()
        }, 0)
      },

      focus: () => {
        textareaRef.current?.focus()
      },

      getCurrentLine: () => getCurrentLine(),
      getCurrentElementType: () => currentFormatMode
    }))

    // Get current line content
    const getCurrentLine = useCallback(() => {
      if (!textareaRef.current) return ''
      
      const start = textareaRef.current.selectionStart
      const beforeCursor = value.substring(0, start)
      const afterCursor = value.substring(start)
      const lastNewline = beforeCursor.lastIndexOf('\n')
      const nextNewline = afterCursor.indexOf('\n')
      
      const lineStart = lastNewline + 1
      const lineEnd = nextNewline === -1 ? value.length : start + nextNewline
      return value.substring(lineStart, lineEnd)
    }, [value])

    // Get current line index
    const getCurrentLineIndex = useCallback(() => {
      if (!textareaRef.current) return 0
      
      const start = textareaRef.current.selectionStart
      const beforeCursor = value.substring(0, start)
      return beforeCursor.split('\n').length - 1
    }, [value])

    // Format existing line content
    const formatExistingLine = useCallback((lineIndex: number, elementType: string) => {
      const lines = value.split('\n')
      if (lineIndex >= lines.length) return
      
      const line = lines[lineIndex]
      let formattedLine = line.trim()
      
      // Apply element-specific formatting
      switch (elementType) {
        case 'scene_heading':
          formattedLine = formattedLine.toUpperCase()
          break
        case 'character':
          formattedLine = formattedLine.toUpperCase()
          break
        case 'parenthetical':
          if (!formattedLine.startsWith('(') && formattedLine) {
            formattedLine = `(${formattedLine})`
          }
          break
        case 'transition':
          formattedLine = formattedLine.toUpperCase()
          if (!formattedLine.endsWith(':') && formattedLine) {
            formattedLine = formattedLine + ':'
          }
          break
        case 'shot':
          formattedLine = formattedLine.toUpperCase()
          break
      }
      
      // Apply indentation based on format
      const format = FORMAT_POSITIONS[elementType as keyof typeof FORMAT_POSITIONS] || FORMAT_POSITIONS.action
      const indentSpaces = Math.round(format.indent / 12) // Convert px to approximate chars
      const indent = ' '.repeat(Math.max(0, indentSpaces))
      
      formattedLine = indent + formattedLine
      
      // Replace the line in content
      lines[lineIndex] = formattedLine
      const newValue = lines.join('\n')
      onChange(newValue)
      
      console.log('📝 Formatted line', lineIndex, ':', elementType, '→', formattedLine)
    }, [value, onChange])

    // Handle key presses
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter') {
        const currentLineIndex = getCurrentLineIndex()
        const currentLine = getCurrentLine()
        
        console.log('⏎ Enter pressed. Current line:', currentLineIndex, currentLine)
        
        setTimeout(() => {
          const newLineIndex = currentLineIndex + 1
          
          // CRITICAL FIX: Don't change format of previous lines!
          // Only set format mode for the NEW line
          
          let nextFormat = 'action' // Default
          const previousLineFormat = lineFormats[currentLineIndex] || detectElementType(currentLine, value.split('\n'), currentLineIndex)
          
          // Smart format switching logic
          switch (previousLineFormat) {
            case 'scene_heading':
              nextFormat = 'action' // Scene heading → Action
              break
            case 'character':
              // Check if current line was just a character name
              if (currentLine.trim() && currentLine.trim().length > 0) {
                nextFormat = 'dialogue' // Character → Dialogue
              } else {
                nextFormat = 'action'
              }
              break
            case 'dialogue':
              nextFormat = 'action' // Dialogue → Action (unless continued)
              break
            case 'parenthetical':
              nextFormat = 'dialogue' // Parenthetical → back to Dialogue
              break
            default:
              nextFormat = 'action'
          }
          
          console.log('🔄 Auto-switching to:', nextFormat, 'for new line', newLineIndex)
          setCurrentFormatMode(nextFormat)
          
          // Store format for the new line
          setLineFormats(prev => ({
            ...prev,
            [newLineIndex]: nextFormat
          }))
          
        }, 0)
      }
    }, [getCurrentLineIndex, getCurrentLine, lineFormats, value])

    // Update cursor position and detect current format
    const updateCursorPosition = useCallback(() => {
      if (!textareaRef.current) return
      
      const textarea = textareaRef.current
      const start = textarea.selectionStart
      const beforeCursor = value.substring(0, start)
      const lines = beforeCursor.split('\n')
      const currentLine = lines.length - 1
      const currentCol = lines[lines.length - 1].length
      
      setCursorPosition({ line: currentLine, col: currentCol })
      
      // Update format mode based on current line's stored format
      const lineFormat = lineFormats[currentLine]
      if (lineFormat && lineFormat !== currentFormatMode) {
        setCurrentFormatMode(lineFormat)
      }
    }, [value, lineFormats, currentFormatMode])

    useEffect(() => {
      updateCursorPosition()
    }, [value, updateCursorPosition])

    // Get tooltip content
    const getTooltipContent = (elementType: string) => {
      const tooltips = {
        scene_heading: '🎬 Scene Heading: Type location and time (e.g., "EXT. COFFEE SHOP - MORNING")',
        character: '👤 Character: Type character name (will be centered and uppercase)',
        dialogue: '💬 Dialogue: Type character\'s speech (properly indented)',
        parenthetical: '📝 Parenthetical: Type actor direction (will be wrapped in parentheses)',
        action: '🎭 Action: Type scene description (left-aligned)',
        transition: '🎞️ Transition: Type transition (e.g., "CUT TO:", right-aligned)',
        shot: '📷 Shot: Type camera direction (e.g., "CLOSE UP - SARAH\'S FACE")'
      }
      return tooltips[elementType as keyof typeof tooltips] || 'Type in this format mode'
    }

    // Render preview mode with proper line-based formatting
    if (isPreviewMode) {
      return (
        <div className={`flex-1 w-full p-8 overflow-y-auto bg-white ${className}`}>
          {value.split('\n').map((line, index) => {
            // Use stored format or detect from content
            const storedFormat = lineFormats[index]
            const detectedFormat = detectElementType(line, value.split('\n'), index)
            const elementType = storedFormat || detectedFormat
            
            const isCurrentLine = index === cursorPosition.line
            const colorScheme = ELEMENT_COLORS[elementType as keyof typeof ELEMENT_COLORS] || ELEMENT_COLORS.action
            const format = FORMAT_POSITIONS[elementType as keyof typeof FORMAT_POSITIONS] || FORMAT_POSITIONS.action
            
            return (
              <div 
                key={index} 
                style={{
                  fontFamily: 'Courier New, monospace',
                  fontSize: '12pt',
                  lineHeight: '1.2',
                  minHeight: '14.4px',
                  marginBottom: '2px',
                  paddingLeft: `${format.indent}px`,
                  textAlign: format.align as any,
                  textTransform: format.transform as any,
                  fontWeight: format.weight as any,
                  color: colorScheme.text,
                  backgroundColor: isCurrentLine ? colorScheme.bg : 'transparent',
                  borderLeft: isCurrentLine ? `4px solid ${colorScheme.border}` : 'none',
                  paddingRight: '8px'
                }}
                title={`Line ${index + 1}: ${elementType.replace('_', ' ').toUpperCase()}`}
                className={`screenplay-${elementType.replace('_', '-')}`}
              >
                {isCurrentLine && (
                  <div className="absolute -left-4 top-0 w-2 h-full bg-orange-400 rounded-r opacity-60" />
                )}
                {line || '\u00A0'}
              </div>
            )
          })}
        </div>
      )
    }

    return (
      <div className={`flex-1 flex flex-col ${className} relative`}>
        {/* Current Format Mode Indicator */}
        <div className="absolute top-2 right-2 z-10 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border-2" 
             style={{ borderColor: ELEMENT_COLORS[currentFormatMode as keyof typeof ELEMENT_COLORS]?.border }}>
          <div className="text-xs font-mono">
            <div className="flex items-center mb-1">
              <div 
                className="w-4 h-4 rounded-full mr-2" 
                style={{ backgroundColor: ELEMENT_COLORS[currentFormatMode as keyof typeof ELEMENT_COLORS]?.border }}
              />
              <span className="font-bold text-sm capitalize" 
                    style={{ color: ELEMENT_COLORS[currentFormatMode as keyof typeof ELEMENT_COLORS]?.text }}>
                {currentFormatMode.replace('_', ' ')} Mode
              </span>
            </div>
            <div className="text-xs text-gray-600">Line {cursorPosition.line + 1}, Col {cursorPosition.col + 1}</div>
            <div className="text-xs font-semibold mt-1" 
                 style={{ color: ELEMENT_COLORS[currentFormatMode as keyof typeof ELEMENT_COLORS]?.text }}>
              Next line format
            </div>
          </div>
        </div>

        {/* Format Mode Tooltip */}
        {showTooltip && (
          <div className="absolute top-20 right-2 z-20 text-white text-sm rounded-lg px-4 py-3 max-w-md shadow-xl"
               style={{ backgroundColor: ELEMENT_COLORS[currentFormatMode as keyof typeof ELEMENT_COLORS]?.border }}>
            <div className="font-semibold mb-1">
              {currentFormatMode.replace('_', ' ').toUpperCase()} Mode Active
            </div>
            <div className="text-xs opacity-90">
              {getTooltipContent(currentFormatMode)}
            </div>
            <div className="absolute -top-2 right-4 w-4 h-4 transform rotate-45"
                 style={{ backgroundColor: ELEMENT_COLORS[currentFormatMode as keyof typeof ELEMENT_COLORS]?.border }} />
          </div>
        )}

        {/* Professional Editor with Line-Based Formatting */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            updateCursorPosition()
          }}
          onKeyDown={handleKeyDown}
          onSelect={updateCursorPosition}
          onClick={updateCursorPosition}
          placeholder={placeholder || `🏆 PROFESSIONAL SCREENPLAY EDITOR - WORKFLOW PERFECTED

✨ PROFESSIONAL WORKFLOW:
1. Click any FORMAT BUTTON (Character, Scene Heading, etc.)
2. Start typing - see formatting applied!
3. Press ENTER - auto-switches to next logical format
4. Each line maintains its own formatting!

🎯 EXAMPLE PROFESSIONAL WORKFLOW:
• Click SCENE HEADING → Type "EXT. COFFEE SHOP - MORNING" → Press Enter
• Auto-switches to ACTION → Type scene description → Press Enter  
• Click CHARACTER → Type "SARAH" → Press Enter
• Auto-switches to DIALOGUE → Type character's speech → Press Enter
• Back to ACTION → Continue scene...

🏅 Each line keeps its format independently - no more format bleeding!
🎬 Professional workflow that matches Final Draft and Celtx!`}
          className="flex-1 w-full p-8 border-none outline-none resize-none bg-white relative z-10"
          style={{
            fontFamily: 'Courier New, monospace',
            fontSize: '12pt',
            lineHeight: '1.2',
            color: '#000000',
            caretColor: ELEMENT_COLORS[currentFormatMode as keyof typeof ELEMENT_COLORS]?.border || '#f97316'
          }}
          spellCheck={false}
        />
      </div>
    )
  }
)

ProfessionalWorkflowEditor.displayName = 'ProfessionalWorkflowEditor'

export default ProfessionalWorkflowEditor