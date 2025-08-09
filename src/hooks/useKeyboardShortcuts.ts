import { useEffect, useCallback } from 'react'

interface KeyboardShortcutsProps {
  onFormatShortcut: (format: string) => void
  onFileOperation: (operation: string) => void
  onNavigation: (action: string) => void
  onEditing: (action: string) => void
  onSmartFeature: (action: string) => void
  onProduction: (action: string) => void
}

export const useKeyboardShortcuts = ({
  onFormatShortcut,
  onFileOperation,
  onNavigation,
  onEditing,
  onSmartFeature,
  onProduction
}: KeyboardShortcutsProps) => {
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const isCmd = e.metaKey || e.ctrlKey
    const isShift = e.shiftKey
    const isAlt = e.altKey
    const key = e.key.toLowerCase()

    // Prevent shortcuts when typing in input fields (except our script editor)
    if (e.target instanceof HTMLInputElement || 
        (e.target instanceof HTMLTextAreaElement && !(e.target as any).dataset?.scriptEditor)) {
      return
    }

    // Script Formatting Shortcuts
    if (isCmd && !isShift && !isAlt) {
      switch (key) {
        case '1':
          e.preventDefault()
          onFormatShortcut('SceneHeading')
          break
        case '2':
          e.preventDefault()
          onFormatShortcut('Action')
          break
        case '3':
          e.preventDefault()
          onFormatShortcut('Character')
          break
        case '4':
          e.preventDefault()
          onFormatShortcut('Dialogue')
          break
        case '5':
          e.preventDefault()
          onFormatShortcut('Parenthetical')
          break
        case '6':
          e.preventDefault()
          onFormatShortcut('Transition')
          break
        case '7':
          e.preventDefault()
          onFormatShortcut('Shot')
          break
      }
    }

    // Auto-format entire script
    if (isCmd && isShift && key === 'f') {
      e.preventDefault()
      onSmartFeature('autoFormat')
    }

    // File Operations
    if (isCmd && !isShift && !isAlt) {
      switch (key) {
        case 'n':
          e.preventDefault()
          onFileOperation('new')
          break
        case 'o':
          e.preventDefault()
          onFileOperation('open')
          break
        case 's':
          e.preventDefault()
          onFileOperation('save')
          break
        case 'e':
          e.preventDefault()
          onFileOperation('exportPDF')
          break
      }
    }

    // File Operations with modifiers
    if (isCmd && isShift && !isAlt) {
      switch (key) {
        case 's':
          e.preventDefault()
          onFileOperation('saveAs')
          break
        case 'e':
          e.preventDefault()
          onFileOperation('exportFDX')
          break
      }
    }

    // Export as text
    if (isCmd && isAlt && key === 'e') {
      e.preventDefault()
      onFileOperation('exportTXT')
    }

    // Navigation & View
    if (isCmd && !isShift && !isAlt) {
      switch (key) {
        case 'p':
          e.preventDefault()
          onNavigation('togglePreview')
          break
        case 'r':
          e.preventDefault()
          onNavigation('viewRevisions')
          break
        case 'k':
          e.preventDefault()
          onNavigation('keyboardShortcuts')
          break
        case 'f':
          e.preventDefault()
          onNavigation('find')
          break
        case 'g':
          e.preventDefault()
          onNavigation('findNext')
          break
        case 'l':
          e.preventDefault()
          onNavigation('goToLine')
          break
      }
    }

    // Find previous
    if (isCmd && isShift && key === 'g') {
      e.preventDefault()
      onNavigation('findPrevious')
    }

    // Standard editing shortcuts (handled by browser/system mostly)
    if (isCmd && !isShift && !isAlt) {
      switch (key) {
        case 'z':
          // Let browser handle undo
          break
        case 'a':
          // Let browser handle select all
          break
        case 'c':
          // Let browser handle copy
          break
        case 'v':
          // Let browser handle paste
          break
        case 'x':
          // Let browser handle cut
          break
      }
    }

    // Redo
    if (isCmd && isShift && key === 'z') {
      // Let browser handle redo
    }

    // Smart Features
    if (key === 'tab') {
      // Only handle if in our editor context
      const target = e.target as HTMLElement
      if (target.dataset?.scriptEditor) {
        e.preventDefault()
        onSmartFeature('acceptAutocomplete')
      }
    }

    if (key === 'escape') {
      e.preventDefault()
      onSmartFeature('closeDialogs')
    }

    // Smart line break is handled in the editor component
    // Shift+Enter for simple line break is handled in the editor component

    // Toggle comment/note
    if (isCmd && key === '/') {
      e.preventDefault()
      onSmartFeature('toggleComment')
    }

    // Duplicate current line
    if (isCmd && key === 'd') {
      e.preventDefault()
      onSmartFeature('duplicateLine')
    }

    // Production Tools
    if (isCmd && !isShift && !isAlt) {
      switch (key) {
        case 'b':
          e.preventDefault()
          onProduction('scriptBreakdown')
          break
        case 't':
          e.preventDefault()
          onProduction('createTask')
          break
        case 'm':
          e.preventDefault()
          onProduction('addNote')
          break
      }
    }

    // Auto-breakdown current scene
    if (isCmd && isShift && key === 'b') {
      e.preventDefault()
      onProduction('autoBreakdownScene')
    }

  }, [onFormatShortcut, onFileOperation, onNavigation, onEditing, onSmartFeature, onProduction])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return null
}

// Keyboard shortcuts reference for display
export const KEYBOARD_SHORTCUTS = {
  formatting: [
    { label: 'Scene Heading', shortcut: '⌘+1' },
    { label: 'Action', shortcut: '⌘+2' },
    { label: 'Character', shortcut: '⌘+3' },
    { label: 'Dialogue', shortcut: '⌘+4' },
    { label: 'Parenthetical', shortcut: '⌘+5' },
    { label: 'Transition', shortcut: '⌘+6' },
    { label: 'Shot', shortcut: '⌘+7' },
    { label: 'Auto-format entire script', shortcut: '⌘+⇧+F' }
  ],
  fileOperations: [
    { label: 'New script', shortcut: '⌘+N' },
    { label: 'Open/Import script', shortcut: '⌘+O' },
    { label: 'Save script', shortcut: '⌘+S' },
    { label: 'Save As...', shortcut: '⌘+⇧+S' },
    { label: 'Export as PDF', shortcut: '⌘+E' },
    { label: 'Export as Final Draft', shortcut: '⌘+⇧+E' },
    { label: 'Export as Text', shortcut: '⌘+⌥+E' }
  ],
  navigation: [
    { label: 'Toggle Preview mode', shortcut: '⌘+P' },
    { label: 'View Revisions', shortcut: '⌘+R' },
    { label: 'Keyboard shortcuts', shortcut: '⌘+K' },
    { label: 'Find in script', shortcut: '⌘+F' },
    { label: 'Find next', shortcut: '⌘+G' },
    { label: 'Find previous', shortcut: '⌘+⇧+G' },
    { label: 'Go to line', shortcut: '⌘+L' }
  ],
  editing: [
    { label: 'Accept autocomplete suggestion', shortcut: 'Tab' },
    { label: 'Navigate autocomplete suggestions', shortcut: '↑↓' },
    { label: 'Close autocomplete/dialogs', shortcut: 'Esc' },
    { label: 'Undo', shortcut: '⌘+Z' },
    { label: 'Redo', shortcut: '⌘+⇧+Z' },
    { label: 'Select all', shortcut: '⌘+A' },
    { label: 'Copy', shortcut: '⌘+C' },
    { label: 'Paste', shortcut: '⌘+V' },
    { label: 'Cut', shortcut: '⌘+X' }
  ],
  smartFeatures: [
    { label: 'Smart line break with proper indentation', shortcut: 'Enter' },
    { label: 'Simple line break', shortcut: '⇧+Enter' },
    { label: 'Toggle comment/note', shortcut: '⌘+/' },
    { label: 'Duplicate current line', shortcut: '⌘+D' }
  ],
  production: [
    { label: 'Open Script Breakdown', shortcut: '⌘+B' },
    { label: 'Create Task', shortcut: '⌘+T' },
    { label: 'Add Note/Comment', shortcut: '⌘+M' },
    { label: 'Auto-breakdown current scene', shortcut: '⌘+⇧+B' }
  ]
}