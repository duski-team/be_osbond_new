import admin from "firebase-admin";

import serviceAccount from "../../tes.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// console.log(serviceAccount,'asd');


//contoh
// const registrationToken = 'eu88pvA4DUjvrjzYpaZPg6:APA91bGqv-VL0EiqnLOvduDtPS5nOUVX6pnrdsFhh7JY7uPabzsfzzrl_1Azy3SXS7Zth0UDUhdcBd4ZOxmhcwIWrjL-41-GsH8lrNniFRbWDjRDTSKv252Y4ysopadK1rBnHBYUf5Cc';

// const message = {
//     notification: {
//         title: 'Adhitya Tristiawan',
//         body: 'Need janda!'
//       },
// //   token: registrationToken
// //   tokens: registrationToken //kudu array
// topic: "semuanotif"
// };

// // Send a message to the device corresponding to the provided
// // registration token.

// admin.messaging().send(message)
//   .then((response) => {
//     // Response is a message ID string.
//     console.log('Successfully sent message:', response);
//   })
//   .catch((error) => {
//     console.log('Error sending message:', error);
//   });
function kirim_notif(judul, isi,token=[], gambar=null) {
    let message = {
        notification: {
            title: judul,
            body: isi
          },
         
    //   token: registrationToken
    //   tokens: registrationToken //kudu array
   
    };

      if(gambar){
        message.android = {
            notification: {
              image: gambar
            }
          }
          message.apns = {
            payload: {
              aps: {
                'mutable-content': 1
              }
            },
            fcm_options: {
              image: gambar
            }
          }
      
    }

    if(token.length){
        message.tokens = token
           admin.messaging().sendEachForMulticast(message)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', JSON.stringify(response));
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
    }else{
        message.topic = "semuanotif"
           admin.messaging().send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', JSON.stringify(response));
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
    }
  
    // console.log(message);
 
    
}

// kirim_notif('test','yayaya',[], 'https://fosan.id/images/fosanlogo.png')
  export default kirim_notif
  