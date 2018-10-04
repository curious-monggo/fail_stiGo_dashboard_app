import { Injectable } from '@angular/core';

//AngularFire
// old import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

//rxjs
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

//event model
import { Event } from '../../models/event/event';
import * as generatePassword from 'generate-password-browser';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class EventService {

	//list variables
	eventCollectionRef: AngularFirestoreCollection<any>;
  eventCollection: Observable<any[]>;
  
	//object variables
	eventDocumentRef: AngularFirestoreDocument<any>;
  eventDocument: Observable<any>;

  constructor(private afDB: AngularFirestore) {

   }

   getEventsCollection() {
    this.eventCollectionRef = this.afDB.collection('events');
    this.eventCollection = this.eventCollectionRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Event;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.eventCollection;
   }
   getEventDocument(id:string) {
    this.eventDocumentRef = this.afDB.doc(`events/${id}`);
    this.eventDocument = this.eventDocumentRef.valueChanges();
    return this.eventDocument;
  }
   
  addEventDocument(eventDocument, isAttendanceEnabled) {
    console.log(eventDocument.event_date);
    this.eventCollectionRef = this.afDB.collection('events');
    this.eventCollectionRef.add(eventDocument).then(eventDoc => {
      console.log(eventDoc.id);
      this.eventDocumentRef = this.afDB.doc(`events/${eventDoc.id}`);
      this.eventDocumentRef.update({event_timestamp_post_created: firebase.firestore.FieldValue.serverTimestamp()});
      if(isAttendanceEnabled){
        let password = generatePassword.generate({
          length:16,
          numbers:true
        });
        let attendanceRef = this.afDB.doc(`attendance/${eventDoc.id}`);
        let attendance = {
          attendance_event_name:eventDocument.event_name,
          attendance_password:password,
          attendance_event_date:eventDocument.event_date,
          attendance_time_start:eventDocument.event_time_start,
          attendance_time_end:eventDocument.event_time_end
        };
        attendanceRef.set(attendance, {merge:true});
      }
    }).catch((error) => {
      console.log('Error on event doc add or update ', error);
    });
   }
   updateEventDocument(id:string, eventDocument){
    this.eventDocumentRef = this.afDB.doc(`events/${id}`);
    this.eventDocumentRef.update(eventDocument);
    let attendanceRef = this.afDB.doc(`attendance/${id}`);
    let attendance = {
      attendance_event_name:eventDocument.event_name,
      attendance_event_date:eventDocument.event_date,
      attendance_time_start:eventDocument.event_time_start,
      attendance_time_end:eventDocument.event_time_end
    };
    attendanceRef.set(attendance, {merge:true});
  }
   deleteEventDocument(id:string){
    this.eventDocumentRef = this.afDB.doc(`events/${id}`);
    let attendanceRef = this.afDB.doc(`attendance/${id}`);
    this.eventDocumentRef.delete();
    attendanceRef.delete();
    // this.storage.ref('stiGo/events/'+id+'/'+fileName).delete();
  }

}
