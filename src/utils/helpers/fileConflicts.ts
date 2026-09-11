import type { ObjectError, ObjectSuccess, ObjectStoreResponse } from "@/utils/types/object"

/**
 * Check if an error message indicates a file already exists conflict
 * by checking for keywords: "already exist", "update", and "replace"
 */
export const isFileConflictError = (error: string): boolean => {
  const lowerError = error.toLowerCase()
  return (
    lowerError.includes("already exist") &&
    lowerError.includes("update") &&
    lowerError.includes("replace")
  )
}

/**
 * Check if an item is an ObjectError
 */
const isObjectError = (item: unknown): item is ObjectError => {
  return (
    typeof item === "object" &&
    item !== null &&
    "error" in item &&
    "key" in item
  )
}

/**
 * Check if an item is an ObjectSuccess
 */
const isObjectSuccess = (item: unknown): item is ObjectSuccess => {
  return (
    typeof item === "object" &&
    item !== null &&
    "key" in item &&
    "message" in item
  )
}

/**
 * Normalize response to always work with an array of items
 * Handles:
 * - ObjectStoreResponse with objects array
 * - Single object with key/error or key/message
 * - Plain string error message (for HTTP errors)
 */
const normalizeResponseToArray = (
  response: ObjectStoreResponse | { key: string; error: string } | string,
): (ObjectError | ObjectSuccess)[] => {
  // If it's a plain string (HTTP error body)
  if (typeof response === "string") {
    return []
  }
  
  if (Array.isArray((response as ObjectStoreResponse).objects)) {
    return (response as ObjectStoreResponse).objects
  }
  // Single object response (like { key: string, error: string })
  if (isObjectError(response)) {
    return [response]
  }
  // If it's a success object (has key and message)
  if (isObjectSuccess(response)) {
    return [response as ObjectSuccess]
  }
  return []
}

/**
 * Create an ObjectError from a filename and error message
 */
const createObjectError = (key: string, error: string): ObjectError => ({
  key,
  error,
})

/**
 * Extract files that have a file conflict error from a store response
 * Can handle:
 * - Normal structured responses with objects array
 * - Single object responses
 * - HTTP error responses (plain string) - in this case, all originalFiles are considered conflicts
 */
export const extractConflictFiles = (
  response: ObjectStoreResponse | { key: string; error: string } | string,
  originalFiles: File[],
): { conflicts: ObjectError[]; validFiles: File[] } => {
  // Handle HTTP error case (plain string)
  if (typeof response === "string") {
    if (isFileConflictError(response)) {
      // All original files are conflicts
      return {
        conflicts: originalFiles.map((f) => createObjectError(f.name, response)),
        validFiles: [],
      }
    }
    // Not a file conflict error
    return { conflicts: [], validFiles: originalFiles }
  }

  const filesArray = normalizeResponseToArray(response)
  
  const conflicts: ObjectError[] = []
  const validFiles: File[] = []
  
  filesArray.forEach((item) => {
    if (isObjectError(item) && isFileConflictError(item.error)) {
      conflicts.push(item)
    }
  })
  
  // Match original files with conflicts
  originalFiles.forEach((file) => {
    const hasConflict = conflicts.some((conflict) => {
      const conflictFileName = conflict.key.split('/').pop()
      return conflictFileName === file.name
    })
    if (!hasConflict) {
      validFiles.push(file)
    }
  })
  
  return { conflicts, validFiles }
}

/**
 * Check if a store response contains file conflicts
 * Can handle both structured responses and HTTP error strings
 */
export const hasFileConflicts = (
  response: ObjectStoreResponse | { key: string; error: string } | string,
): boolean => {
  // Handle HTTP error case (plain string)
  if (typeof response === "string") {
    return isFileConflictError(response)
  }
  
  const filesArray = normalizeResponseToArray(response)
  return filesArray.some(
    (item) => isObjectError(item) && isFileConflictError(item.error),
  )
}

/**
 * Get only the conflicting files from a store response
 * For HTTP errors (plain string), returns empty array as we can't determine which specific files
 */
export const getConflictingFiles = (
  response: ObjectStoreResponse | { key: string; error: string } | string,
  originalFiles?: File[],
): ObjectError[] => {
  // Handle HTTP error case (plain string)
  if (typeof response === "string") {
    if (isFileConflictError(response) && originalFiles) {
      // Return all original files as conflicts
      return originalFiles.map((f) => createObjectError(f.name, response))
    }
    return []
  }
  
  const filesArray = normalizeResponseToArray(response)
  return filesArray.filter(
    (item): item is ObjectError =>
      isObjectError(item) && isFileConflictError(item.error),
  )
}
