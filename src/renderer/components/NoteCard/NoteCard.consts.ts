// ========================================
// PUBLIC CONSTANTS FOR NOTECARD COMPONENT
// ========================================

// ===== TOAST MESSAGES =====
export const TOAST_MESSAGES = {
    SAVE_SUCCESS: 'Note saved',
    SAVE_ERROR: 'There was an error saving the note',
    DELETE_SUCCESS: 'Note deleted',
    DELETE_ERROR: 'There was an error deleting the note',
} as const;

// ===== UI TEXTS =====
export const UI_TEXTS = {
    // Editing states
    CREATING_NOTE: 'Creating note',
    EDITING_NOTE: 'Editing note',
    JUST_NOW: 'Just now',
    
    // Loading states
    SAVING: 'Saving...',
    
    // Placeholders
    TITLE_PLACEHOLDER: 'Note title',
    CONTENT_PLACEHOLDER: 'What do you have to tell today?',
    
    // Buttons
    SAVE_BUTTON: 'Save',
    SEE_MORE_BUTTON: 'See more',
} as const;

// ===== CONFIGURATION =====
export const CONFIG = {
    TITLE_MAX_LENGTH: 40,
    SHAKE_ANIMATION_DURATION: 1000, // ms
    CONTENT_LINE_HEIGHT_MULTIPLIER: 10, // For calculating maximum content height
} as const; 