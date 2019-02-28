import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import * as firebase from 'firebase-admin';


const firebaseapp = firebase.initializeApp(functions.config().firebase)
 
const contactsRef: firebase.database.Reference = firebaseapp.database().ref('/tFactor');

const app = express();

app.get('/getContacts', (request:any, response:any) => {
    cors()
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        response.setHeader('Access-Control-Allow-Headers', '*');
        response.setHeader('Access-Control-Allow-Credentials', 'true');
        response.setHeader('Content-Type', 'application/json');

        const promise = contactsRef.once('value').then(snap => snap.val());
        promise.then((item) => {
            response.json(item);
        }, (error) => {
            response.json(error);
        });
});

app.post('/postContact', (request:any, response:any) => {
       cors() (request, response, () => {
        addAndUpdateContacts(request.body.empId, request, response);
       });
        
});

function getDateTime() {
  const d = new Date();
  return new Date(d).toLocaleString();
}

function addAndUpdateContacts(empId: any, request:any,  response: any) {
    const promise = contactsRef.once('value').then(snap => snap.val());

    const results: Array<any[]>  = new Array();

    promise.then((data) => {
        Object.keys(data).forEach(function(key) {
            results.push (data[key]);
          });     
        firebaseapp.database().ref('/tFactor/'+request.body.empId).set({
            tFactor: request.body.tFactor,
            empName: request.body.empName,
            empId: request.body.empId,
            lastupdated: getDateTime()    
          }).then(() => {
            response.send('Value updated');
          }, (error) => {
            response.send(error);
         });
          response.json({'msg': 'Done', 'data': {
           tFactor: request.body.tFactor,
           empName: request.body.empName,
           empId: request.body.empId
          }});
     }, (error) => {
        response.send(error);
     });
}



 export const nodeapp = functions.https.onRequest(app);
