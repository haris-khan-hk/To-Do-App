// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDjIfG3ANwvNalcFtr-xAgXoT_grPdqrNg",
  authDomain: "jawanpakistan-14622.firebaseapp.com",
  projectId: "jawanpakistan-14622",
  storageBucket: "jawanpakistan-14622.firebasestorage.app",
  messagingSenderId: "643437359251",
  appId: "1:643437359251:web:3e4b0b4720eff5f1fe9d66",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

const taskList = document.getElementById("todoList");
const taskCount = document.getElementById("taskCount");
const taskForm = document.getElementById("todoForm");
const taskInput = document.getElementById("todoInput");

let onlineUser = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    onlineUser = user;
    await showTasks();
  } else {
    window.location.href = "index.html";
  }
});

async function showTasks() {
  const userDocRef = doc(db, "task", onlineUser.uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const tasks = userDoc.data().tasks || [];
    taskList.innerHTML = "";
    tasks.forEach((task) => {
      TaskAddToList(task.id, task.task);
    });
    taskCount.textContent = tasks.length;
  } else {
    await setDoc(userDocRef, { tasks: [] });
  }
}

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  if (taskText) {
    const taskId = Date.now().toString();
    const newTask = { id: taskId, task: taskText };

    const userDocRef = doc(db, "task", onlineUser.uid);
    await updateDoc(userDocRef, {
      tasks: arrayUnion(newTask),
    });

    TaskAddToList(taskId, taskText);
    taskInput.value = "";
    taskCount.textContent = parseInt(taskCount.textContent) + 1;
  }
});

async function deleteTask(taskId, taskElement) {
  const userDocRef = doc(db, "task", onlineUser.uid);

  const userDoc = await getDoc(userDocRef);
  const tasks = userDoc.data().tasks;
  const taskToRemove = tasks.find((task) => task.id === taskId);

  if (taskToRemove) {
    await updateDoc(userDocRef, {
      tasks: arrayRemove(taskToRemove),
    });

    taskList.removeChild(taskElement);
    taskCount.textContent = parseInt(taskCount.textContent) - 1;
  }
}

function TaskAddToList(taskId, taskText) {
  const li = document.createElement("li");
  li.textContent = taskText;

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = '<i class="fas fa-times"></i>';
  deleteButton.classList.add("delete-btn");

  deleteButton.addEventListener("click", () => deleteTask(taskId, li));

  li.appendChild(deleteButton);
  taskList.appendChild(li);
}
