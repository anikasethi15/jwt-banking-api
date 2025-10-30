import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

// Register user
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  res.status(201).json({ message: "User registered", user });
};

// Login user
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });
  res.json({ message: "Login successful", token });
};

// Check balance (protected)
export const getBalance = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ balance: user.balance });
};

// Deposit (protected)
export const deposit = async (req, res) => {
  const { amount } = req.body;
  const user = await User.findById(req.user.id);
  user.balance += amount;
  await user.save();
  res.json({ message: "Deposit successful", balance: user.balance });
};

// Withdraw (protected)
export const withdraw = async (req, res) => {
  const { amount } = req.body;
  const user = await User.findById(req.user.id);

  if (user.balance < amount)
    return res.status(400).json({ message: "Insufficient funds" });

  user.balance -= amount;
  await user.save();
  res.json({ message: "Withdrawal successful", balance: user.balance });
};
