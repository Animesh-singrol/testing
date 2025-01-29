// utils/api.js

var BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // URL for your backend

// Function to get all users
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching users');
  }
};

// Function to create a new user
export const createUser = async (name, email) => {
  
  try {
    const apiUrl = `${BASE_URL}/users`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    });
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error('Error creating user');
  }
};

// Function to update a user
export const updateUser = async (id, name, email) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    });
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error('Error updating user');
  }
};

// Function to delete a user
export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error('Error deleting user');
  }
};
