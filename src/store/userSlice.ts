import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { signInWithGoogle, logout } from "../services/firebase";

// ✅ Définition du type User
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// ✅ Type UserState avec user nullable
interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

// ✅ Action asynchrone pour la connexion
export const loginUser = createAsyncThunk(
  "user/login",
  async (idToken: string, { rejectWithValue }) => {
    try {
      if (!idToken) throw new Error("Impossible d'obtenir l'idToken");

      const user = await signInWithGoogle(idToken);
      if (!user) throw new Error("Erreur de connexion");

      return {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "Utilisateur",
        photoURL: user.photoURL || null,
      };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// ✅ Action asynchrone pour la déconnexion
export const logoutUser = createAsyncThunk("user/logout", async () => {
  await logout();
  return null;
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
    });
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
