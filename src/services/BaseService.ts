import {
  getDatabase,
  ref,
  set,
  push,
  get,
  update,
  remove,
} from "firebase/database";
import app from "../firebaseconfig";

const db = getDatabase(app);

export const addData = async (path: string, data: any) => {
  try {
    const newRef = push(ref(db, path));
    await set(newRef, data);
    return { id: newRef.key, ...data };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getData = async (path: string) => {
  try {
    const snapshot = await get(ref(db, path));
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    throw error;
  }
};

export const updateData = async (path: string, data: any) => {
  try {
    await update(ref(db, path), data);
    return { ...data };
  } catch (error) {
    console.error("Lỗi khi cập nhật dữ liệu:", error);
    throw error;
  }
};

export const deleteData = async (path: string) => {
  try {
    await remove(ref(db, path));
  } catch (error) {
    console.error("Lỗi khi xóa dữ liệu:", error);
    throw error;
  }
};
