import * as functions from "firebase-functions";

export const onUserCreated = functions.firestore
  .document("users/{userId}")
  .onCreate((snapshot, context) => {
    const data = snapshot.data();
    console.log(`User ${data?.email} created with id ${context.params.userId}`);
  });
