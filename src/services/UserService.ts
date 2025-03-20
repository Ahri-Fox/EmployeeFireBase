import { UserModel } from "../models/UserModel";
import app from "../firebaseconfig";
import { getAuth } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { addData, updateData } from "./BaseService";

const auth = getAuth(app);

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  address: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const defaultAvatar = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${name}`;

    const newUser: UserModel = {
      id: user.uid,
      email,
      name,
      address,
      avatarUrl: defaultAvatar, // Avatar mặc định
      createdAt: Date.now(),
    };

    await addData(`users/${user.uid}`, newUser);
    return newUser;
  } catch (error) {
    console.error("Lỗi đăng ký: ", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    return null;
  }
};

export const updateUserInfo = async (uid: string, data: Partial<UserModel>) => {
  try {
    await updateData(`users/${uid}`, data);
  } catch (error) {
    console.error("Lỗi update:", error);
    throw error;
  }
};
