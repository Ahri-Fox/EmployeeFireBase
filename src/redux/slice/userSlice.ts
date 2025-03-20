import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserModel } from "../../models/UserModel";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { getData, updateData } from "../../services/BaseService";

const auth = getAuth();
const db = getDatabase();

const storedUser = localStorage.getItem("user");
const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserModel | null>) => {
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.user = null; // Xóa user khỏi Redux
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<UserModel>) => {
          state.user = action.payload;
        }
      )
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<UserModel>) => {
          state.user = action.payload;
          localStorage.setItem("user", JSON.stringify(action.payload));
        }
      )
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem("user");
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (state.user?.id === action.payload.id) {
          state.user = { ...state.user, ...action.payload.data };
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      });
  },
});
export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;

//............................THUNK..........................................

export const registerUser = createAsyncThunk(
  "users/registerUser",
  async ({
    email,
    password,
    name,
    address,
  }: {
    email: string;
    password: string;
    name: string;
    address: string;
  }) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = userCredential.user.uid;
    const defaultAvatar = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${name}`;
    const newUser: UserModel = {
      id: uid,
      email,
      name,
      address,
      avatarUrl: defaultAvatar,
      createdAt: Date.now(),
    };

    await set(ref(db, `users/${uid}`), newUser);
    return newUser;
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      const userData = await getData(`users/${uid}`);
      if (!userData) {
        throw new Error("không tìm thấy thông tin người dùng");
      }
      return userData;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const logoutUser = createAsyncThunk("user/logout", async () => {
  await signOut(auth);
});

export const updateUserProfile = createAsyncThunk(
  "user/update",
  async ({ id, data }: { id: string; data: Partial<UserModel> }) => {
    await updateData(`users/${id}`, data);
    return { id, data };
  }
);
