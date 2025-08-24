import { signupService, loginService } from '../services/authServices.js';

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { token } = await signupService({ name, email, password });
    res.status(201).json({ message: 'User created successfully', token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token } = await loginService({ email, password });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
