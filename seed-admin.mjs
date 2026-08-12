import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function seedAdmin() {
  const email = "sohagkazi@live.com";
  const password = "St1920st@";

  try {
    console.log("Attempting to create admin user...");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User created with UID:", user.uid);

    console.log("Setting role in Firestore...");
    await setDoc(doc(db, "staff", user.uid), {
      name: "Sohag Kazi",
      email: email,
      role: "Super Admin",
      joiningDate: new Date().toISOString(),
      basicSalary: 0
    });
    
    console.log("Admin seeded successfully.");
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log("User already exists. Updating role in Firestore...");
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, "staff", user.uid), {
          name: "Sohag Kazi",
          email: email,
          role: "Super Admin",
          joiningDate: new Date().toISOString(),
          basicSalary: 0
        }, { merge: true });
        console.log("Role updated successfully.");
        process.exit(0);
      } catch (e) {
        console.error("Error signing in to update role:", e);
        process.exit(1);
      }
    } else {
      console.error("Error seeding admin:", error);
      process.exit(1);
    }
  }
}

seedAdmin();
