import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import dotenv from 'dotenv';
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
const db = getFirestore(app);
const auth = getAuth(app);

const executiveMembers = [
  {
    name: "Abdus Salam Kazi",
    designation: "President",
    nationality: "Bangladeshi",
    gender: "Male",
    address: "317/2, Jafrabad, Mohammadpur, Dhaka-1207",
    occupation: "Retired Korporal",
    order: 1
  },
  {
    name: "Shantona Gomez",
    designation: "Vice-president",
    nationality: "Bangladeshi",
    gender: "Female",
    address: "Dhorenda Savar",
    occupation: "House wife",
    order: 2
  },
  {
    name: "Flory Johana Sarkar",
    designation: "Secretary",
    nationality: "Bangladeshi",
    gender: "Female",
    address: "House: 4/2 Lalmatia, B #A, Mohammadpur, Dhaka -1207",
    occupation: "Business",
    order: 3
  },
  {
    name: "Kachi Sarkar",
    designation: "Assistance Secretary",
    nationality: "Bangladeshi",
    gender: "Male",
    address: "85 Poolpar, Hossein Shaheb Lane, Mohammadpur, Dhaka-1207",
    occupation: "Business",
    order: 4
  },
  {
    name: "Sudip Biswas",
    designation: "Treasurer",
    nationality: "Bangladeshi",
    gender: "Male",
    address: "Vill+P.O: Burirdanga, Dist: Mongla",
    occupation: "Business",
    order: 5
  },
  {
    name: "Nur Ayesha Banu",
    designation: "Office Secretary",
    nationality: "Bangladeshi",
    gender: "Female",
    address: "Jatrabari, Surujnogor Project, Dhaka",
    occupation: "House wife",
    order: 6
  },
  {
    name: "Tridip Odikari",
    designation: "Executive Member",
    nationality: "Bangladeshi",
    gender: "Male",
    address: "Vill+Post: Digraj, P.S: Mongla",
    occupation: "Business",
    order: 7
  }
];

async function seed() {
  try {
    console.log("Logging in as Super Admin...");
    await signInWithEmailAndPassword(auth, "sohagkazi@live.com", "St1920st@");
    console.log("Logged in successfully!");

    console.log("Seeding executive members...");
    for (const member of executiveMembers) {
      await addDoc(collection(db, 'executive_members'), {
        ...member,
        imageUrl: '',
        createdAt: serverTimestamp()
      });
      console.log(`Added ${member.name}`);
    }
    console.log("Seeding complete!");
  } catch(error) {
    console.error("Error:", error);
  }
  process.exit(0);
}

seed().catch(console.error);
