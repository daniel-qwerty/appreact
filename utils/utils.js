export const emailValidator = (email) => {
  const re = /\S+@\S+\.\S+/;
  
  if (!email || email.length <= 0) return 'Email cannot be empty.';
  if (!re.test(email)) return 'Ooops! We need a valid email address.';

  return '';
};

export const passwordValidator = (password) => {
  if (!password || password.length <= 0) return 'Password cannot be empty.';
  return '';
};

export const nameValidator = (name) => {
  if (!name || name.length <= 0) return 'Name cannot be empty.';
  return '';
};

export const latNameValidator = (latName) => {
  if (!latName || latName.length <= 0) return 'Last Name cannot be empty.';
  return '';
};



export const descriptionValidator = (description) => {
  if (!description || description.length <= 0) return 'Description cannot be empty.';
  return '';
};

export const phoneValidator = (phone) => {
  if (!phone || phone.length <= 0) return 'Phone cannot be empty.';
  return '';
};