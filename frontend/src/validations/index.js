const isValidEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const validate = (group, name, value) => {

  if (group === "signup") {
    switch (name) {
      case "name": {
        if (!value) return "This field is required";
        if (value.length < 2) return "Name must be at least 2 characters long";
        if (value.length > 50) return "Name cannot exceed 50 characters";
        if (!/^[a-zA-Z\s]+$/.test(value)) return "Name can only contain letters and spaces";
        return null;
      }
      case "email": {
        if (!value) return "This field is required";
        if (!isValidEmail(value)) return "Please enter valid email address";
        return null;
      }
      case "password": {
        if (!value) return "This field is required";
        if (value.length < 6) return "Password should be at least 6 characters long";
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
        }
        return null;
      }
      default: return null;
    }
  }

  else if (group === "login") {
    switch (name) {
      case "email": {
        if (!value) return "This field is required";
        if (!isValidEmail(value)) return "Please enter valid email address";
        return null;
      }
      case "password": {
        if (!value) return "This field is required";
        return null;
      }
      default: return null;
    }
  }
  else if (group === "task") {
    switch (name) {
      case "title": {
        if (!value) return "Title is required";
        if (value.length < 1) return "Title cannot be empty";
        if (value.length > 100) return "Title cannot exceed 100 characters";
        return null;
      }
      case "description": {
        if (!value) return "Description is required";
        if (value.length < 1) return "Description cannot be empty";
        if (value.length > 500) return "Description cannot exceed 500 characters";
        return null;
      }
      case "status": {
        const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
        if (value && !validStatuses.includes(value)) return "Invalid status value";
        return null;
      }
      case "priority": {
        const validPriorities = ['low', 'medium', 'high', 'urgent'];
        if (value && !validPriorities.includes(value)) return "Invalid priority value";
        return null;
      }
      case "category": {
        const validCategories = ['work', 'personal', 'shopping', 'health', 'education', 'other'];
        if (value && !validCategories.includes(value)) return "Invalid category value";
        return null;
      }
      case "dueDate": {
        if (value) {
          const date = new Date(value);
          if (isNaN(date.getTime())) return "Invalid date format";
          if (date < new Date()) return "Due date cannot be in the past";
        }
        return null;
      }
      case "tags": {
        if (value && !Array.isArray(value)) return "Tags must be an array";
        if (value && value.some(tag => typeof tag !== 'string' || tag.length > 20)) {
          return "Each tag must be a string and cannot exceed 20 characters";
        }
        return null;
      }
      default: return null;
    }
  }

  else {
    return null;
  }

}

const validateManyFields = (group, list) => {
  const errors = [];
  for (const field in list) {
    const err = validate(group, field, list[field]);
    if (err) errors.push({ field, err });
  }
  return errors;
}
export default validateManyFields;