// Validation utilities for forms and data

/**
 * Validate email format
 * @param email - Email string to validate
 * @returns boolean indicating if email is valid
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param password - Password string to validate
 * @returns boolean indicating if password is strong enough
 */
export const validatePassword = (password: string): boolean => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate required field
 * @param value - Value to validate
 * @returns boolean indicating if value is not empty
 */
export const validateRequired = (value: string | undefined | null): boolean => {
  if (value === null || value === undefined) {
    return false;
  }
  return value.trim().length > 0;
};

/**
 * Validate minimum length
 * @param value - Value to validate
 * @param minLength - Minimum length required
 * @returns boolean indicating if value meets minimum length
 */
export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

/**
 * Validate maximum length
 * @param value - Value to validate
 * @param maxLength - Maximum length allowed
 * @returns boolean indicating if value meets maximum length
 */
export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

/**
 * Validate if two values match (e.g., passwords)
 * @param value1 - First value
 * @param value2 - Second value
 * @returns boolean indicating if values match
 */
export const validateMatch = (value1: string, value2: string): boolean => {
  return value1 === value2;
};

/**
 * Validate task title
 * @param title - Task title to validate
 * @returns boolean indicating if title is valid
 */
export const validateTaskTitle = (title: string): boolean => {
  return title.trim().length > 0 && title.length <= 255;
};

/**
 * Validate task description
 * @param description - Task description to validate
 * @returns boolean indicating if description is valid
 */
export const validateTaskDescription = (description: string): boolean => {
  return description.length <= 1000;
};

/**
 * Validate form data for registration
 * @param formData - Registration form data
 * @returns Object with validation results and error messages
 */
export const validateRegistrationForm = (formData: { email: string; password: string; confirmPassword?: string; name?: string }) => {
  const errors: { [key: string]: string } = {};

  // Validate email
  if (!validateRequired(formData.email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Validate password
  if (!validateRequired(formData.password)) {
    errors.password = 'Password is required';
  } else if (!validatePassword(formData.password)) {
    errors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
  }

  // Validate confirm password if provided
  if (formData.confirmPassword !== undefined) {
    if (!validateRequired(formData.confirmPassword)) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (!validateMatch(formData.password, formData.confirmPassword)) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }

  // Validate name if provided
  if (formData.name && formData.name.length > 100) {
    errors.name = 'Name must be less than 100 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate form data for login
 * @param formData - Login form data
 * @returns Object with validation results and error messages
 */
export const validateLoginForm = (formData: { email: string; password: string }) => {
  const errors: { [key: string]: string } = {};

  // Validate email
  if (!validateRequired(formData.email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Validate password
  if (!validateRequired(formData.password)) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate form data for task creation
 * @param formData - Task form data
 * @returns Object with validation results and error messages
 */
export const validateTaskForm = (formData: { title: string; description?: string }) => {
  const errors: { [key: string]: string } = {};

  // Validate title
  if (!validateRequired(formData.title)) {
    errors.title = 'Task title is required';
  } else if (!validateTaskTitle(formData.title)) {
    errors.title = 'Task title must be between 1 and 255 characters';
  }

  // Validate description if provided
  if (formData.description && !validateTaskDescription(formData.description)) {
    errors.description = 'Task description must be less than 1000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};