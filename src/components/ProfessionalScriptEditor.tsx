import React, { useRef, forwardRef, useImperativeHandle, useCallback, useEffect } from 'react'
import { detectElementType, formatLineWithIndentation } from '../utils/professionalFormatter'

export interface ScriptEditorRef {
  formatCurrentLine: (elementType: string) => void
  insertTextAtCursor: (text: string) => void
  focus: () => void
  getCurrentLine: () => string
  getCurrentElementType: () => string
}

interface ProfessionalScriptEditorProps {
  value: string
  onChange: (value: string) => void
  isPreviewMode: boolean
  className?: string
  placeholder?: string
}

const ProfessionalScriptEditor = forwardRef<ScriptEditorRef, ProfessionalScriptEditorProps>(
  ({ value, onChange, isPreviewMode, className = '', placeholder }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useImperativeHandle(ref, () => ({
      formatCurrentLine: (elementType: string) => {
        if (!textareaRef.current) return
        
        const textarea = textareaRef.current
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        
        // Get current line boundaries
        const beforeCursor = value.substring(0, start)
        const afterCursor = value.substring(end)
        const lastNewline = beforeCursor.lastIndexOf('\\n')
        const nextNewline = afterCursor.indexOf('\\n')
        
        const lineStart = lastNewline + 1
        const lineEnd = nextNewline === -1 ? value.length : end + nextNewline
        const currentLine = value.substring(lineStart, lineEnd)
        
        // Format the line with professional indentation
        const formattedLine = formatLineWithIndentation(currentLine, elementType)
        
        // Replace the current line
        const newValue = value.substring(0, lineStart) + formattedLine + value.substring(lineEnd)
        onChange(newValue)
        
        // Position cursor at end of formatted line
        setTimeout(() => {
          const newCursorPos = lineStart + formattedLine.length
          textarea.setSelectionRange(newCursorPos, newCursorPos)
          textarea.focus()
          textarea.scrollIntoView({ block: 'nearest' })
        }, 0)
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

      getCurrentLine: () => {
        if (!textareaRef.current) return ''
        
        const start = textareaRef.current.selectionStart
        const beforeCursor = value.substring(0, start)
        const afterCursor = value.substring(start)
        const lastNewline = beforeCursor.lastIndexOf('\\n')
        const nextNewline = afterCursor.indexOf('\\n')
        
        const lineStart = lastNewline + 1
        const lineEnd = nextNewline === -1 ? value.length : start + nextNewline
        return value.substring(lineStart, lineEnd)
      },

      getCurrentElementType: () => {
        if (!textareaRef.current) return 'action'
        
        const lines = value.split('\\n')
        const start = textareaRef.current.selectionStart
        const beforeCursor = value.substring(0, start)
        const currentLineIndex = beforeCursor.split('\\n').length - 1
        
        return detectElementType(lines[currentLineIndex] || '', lines, currentLineIndex)
      }
    }))

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Professional formatting shortcuts
      if (e.metaKey || e.ctrlKey) {
        const shortcuts: Record<string, string> = {
          '1': 'scene_heading',
          '2': 'action', 
          '3': 'character',
          '4': 'dialogue',
          '5': 'parenthetical',
          '6': 'transition',
          '7': 'shot'
        }
        
        if (shortcuts[e.key]) {
          e.preventDefault()
          if (ref && 'current' in ref && ref.current) {
            ref.current.formatCurrentLine(shortcuts[e.key])
          }
        }
      }

      // Auto-format on Enter
      if (e.key === 'Enter') {
        setTimeout(() => {
          // Detect element type and apply smart formatting
          const lines = value.split('\\n')
          const textarea = textareaRef.current
          if (!textarea) return
          
          const start = textarea.selectionStart
          const beforeCursor = value.substring(0, start)
          const currentLineIndex = beforeCursor.split('\\n').length - 1
          const currentLine = lines[currentLineIndex - 1] || ''
          
          const elementType = detectElementType(currentLine, lines, currentLineIndex - 1)
          
          // Smart continuation for dialogue
          if (elementType === 'character' && currentLine.trim()) {
            // After character name, next line should be dialogue
            if (ref && 'current' in ref && ref.current) {
              setTimeout(() => ref.current?.formatCurrentLine('dialogue'), 10)
            }
          }
        }, 0)
      }
    }, [value, ref])

    const getElementCSS = (elementType: string): React.CSSProperties => {
      const styles: Record<string, React.CSSProperties> = {
        scene_heading: {
          fontWeight: 'bold',
          textTransform: 'uppercase',
          marginLeft: '0in',
          marginTop: '24px',
          marginBottom: '0px',
          color: '#1e40af'
        },
        character: {
          fontWeight: 'bold', 
          textTransform: 'uppercase',
          textAlign: 'center',
          marginLeft: '220px', // 3.7 inches - Celtx style
          marginTop: '12px',
          marginBottom: '0px',
          color: '#dc2626'
        },
        dialogue: {
          marginLeft: '100px', // 1.5 inches
          marginRight: '120px', // 2.5 inches from right
          marginTop: '0px',
          marginBottom: '0px',
          color: '#374151'
        },
        parenthetical: {
          fontStyle: 'italic',
          textAlign: 'center',
          marginLeft: '160px', // 2 inches
          marginTop: '0px', 
          marginBottom: '0px',
          color: '#6b7280'
        },
        action: {
          marginLeft: '0px',
          marginRight: '60px', // 1 inch
          marginTop: '12px',
          marginBottom: '0px',
          color: '#374151'
        },
        transition: {
          fontWeight: 'bold',
          textTransform: 'uppercase',
          textAlign: 'right',
          marginTop: '12px',
          marginBottom: '0px',
          color: '#ec4899'
        },
        shot: {
          fontWeight: 'bold',
          textTransform: 'uppercase', 
          marginLeft: '0px',
          marginTop: '12px',
          marginBottom: '0px',
          color: '#7c3aed'
        }
      }
      
      return styles[elementType] || styles.action
    }

    if (isPreviewMode) {
      return (
        <div className={`flex-1 w-full p-8 overflow-y-auto bg-white ${className}`}>
          {value.split('\\n').map((line, index) => {
            const lines = value.split('\\n')
            const elementType = detectElementType(line, lines, index)
            const elementCSS = getElementCSS(elementType)
            
            return (
              <div 
                key={index} 
                style={{
                  ...elementCSS,
                  fontFamily: 'Courier New, monospace',
                  fontSize: '12pt',
                  lineHeight: '1.2',
                  minHeight: line.trim() ? 'auto' : '24px',
                  marginBottom: '0px'
                }}
                title={`${elementType.replace('_', ' ').toUpperCase()}`}
              >
                {line || '\\u00A0'}
              </div>
            )
          })}
        </div>
      )
    }

    return (
      <div className={`flex-1 flex flex-col ${className}`}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || `FADE IN:

EXT. YOUR STORY - DAY

Start writing your professional screenplay here...

🎬 PROFESSIONAL FEATURES:
• Industry-standard formatting with Celtx-style positioning
• Character names centered, dialogue properly indented  
• Real-time auto-save & scene numbering
• Export to PDF with professional positioning
• Full keyboard shortcuts (⌘1-7 for elements)

Begin typing to experience professional scriptwriting!

FADE OUT.`}
          className="flex-1 w-full p-8 border-none outline-none resize-none bg-white"
          style={{
            fontFamily: 'Courier New, monospace',
            fontSize: '12pt',
            lineHeight: '1.2',
            color: '#000000',
            backgroundColor: '#ffffff'
          }}
          spellCheck={false}
        />
      </div>
    )
  }
)

ProfessionalScriptEditor.displayName = 'ProfessionalScriptEditor'

export default ProfessionalScriptEditor