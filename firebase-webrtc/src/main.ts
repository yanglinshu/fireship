import "./style.css";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const serverConfig = {
  iceServers: [
    {
      urls: import.meta.env.VITE_WEBRTC_ICE_SERVERS,
    },
  ],
  iceCandidatePoolSize: 10,
};

// Global State
const pc = new RTCPeerConnection(serverConfig);
let localStream: MediaStream;
let remoteStream: MediaStream;

const webcamButton = document.getElementById("webcamButton");
const webcamVideo = document.getElementById("webcamVideo");
const callButton = document.getElementById("callButton");
const callInput = document.getElementById("callInput");
const answerButton = document.getElementById("answerButton");
const remoteVideo = document.getElementById("remoteVideo");
const hangupButton = document.getElementById("hangupButton");

// 1. Setup media sources
(webcamButton as HTMLElement).onclick = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  remoteStream = new MediaStream();

  // Push tracks from local stream to peer connection
  localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

  // Pull tracks from remote stream, add to video stream
  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  (webcamVideo as HTMLVideoElement).srcObject = localStream;
  (remoteVideo as HTMLVideoElement).srcObject = remoteStream;

  (callButton as HTMLButtonElement).disabled = false;
  (answerButton as HTMLButtonElement).disabled = false;
  (webcamButton as HTMLButtonElement).disabled = true;
};

// 2. Create an offer
(callButton as HTMLElement).onclick = async () => {
  const callDoc = doc(collection(db, "calls"));
  const offerCandidates = collection(db, "offerCandidates");
  const answerCandidates = collection(db, "answerCandidates");

  (callInput as HTMLInputElement).value = callDoc.id;

  pc.onicecandidate = (event) => {
    event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
  };

  const offerDescription = await pc.createOffer();
  await pc.setLocalDescription(offerDescription);

  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
  };

  await setDoc(callDoc, { offer });

  onSnapshot(callDoc, (snapshot) => {
    const data = snapshot.data();
    if (!pc.currentRemoteDescription && data?.answer) {
      const answerDescription = new RTCSessionDescription(data.answer);
      pc.setRemoteDescription(answerDescription);
    }
  });

  onSnapshot(answerCandidates, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const candidate = new RTCIceCandidate(change.doc.data());
        pc.addIceCandidate(candidate);
      }
    });
  });

  (hangupButton as HTMLButtonElement).disabled = false;
};

// 3. Answer the call with the unique ID
(answerButton as HTMLElement).onclick = async () => {
  const callId = (callInput as HTMLInputElement).value;
  const callDoc = doc(db, "calls", callId);
  const answerCandidates = collection(db, "answerCandidates");
  const offerCandidates = collection(db, "offerCandidates");

  pc.onicecandidate = (event) => {
    event.candidate && addDoc(answerCandidates, event.candidate.toJSON());
  };

  const callData = (await getDoc(callDoc)).data();

  const offerDescription = callData?.offer;
  await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

  const answerDescription = await pc.createAnswer();
  await pc.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
  };

  await updateDoc(callDoc, { answer });

  onSnapshot(offerCandidates, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        let data = change.doc.data();
        pc.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });

  (hangupButton as HTMLButtonElement).disabled = false;
};
