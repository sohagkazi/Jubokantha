const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBGwNlu5i8ZZtJ8WvkSH1Wr10j4MAQa-HI",
  authDomain: "jubokantha-c04e2.firebaseapp.com",
  projectId: "jubokantha-c04e2",
  storageBucket: "jubokantha-c04e2.firebasestorage.app",
  messagingSenderId: "1021461696785",
  appId: "1:1021461696785:web:c3c10aad57c218bb24bcb0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main() {
  const snapshot = await getDocs(collection(db, 'projects'));
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    console.log(`Title: ${data.title}`);
    console.log(`ImageURL: "${data.imageUrl}"`);
    console.log(`Type of ImageURL: ${typeof data.imageUrl}`);
    console.log('---');
  });
}
main().catch(console.error);
