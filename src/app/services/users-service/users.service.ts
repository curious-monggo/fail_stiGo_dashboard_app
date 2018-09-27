import { Injectable } from '@angular/core';

//AngularFire
// old import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

//rxjs
import { Observable, Subscription } from 'rxjs';
import {map} from 'rxjs/operators';

import { User } from '../../models/user/user';

import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
	//list variables
	usersCollectionRef: AngularFirestoreCollection<User>;
  usersCollection: Observable<User[]>;
  
	//object variables
	userDocumentRef: AngularFirestoreDocument<any>;
  userDocument: Observable<any>;
  userObjSubscription:Subscription;
  constructor(private afDb: AngularFirestore) {
    this.usersCollectionRef = this.afDb.collection('users');
   }
   getAllUsers(){
    this.usersCollectionRef = this.afDb.collection('users');
      this.usersCollection = this.usersCollectionRef.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as User;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
      return this.usersCollection;
   }
   getRegisteredStudents(){
    this.usersCollectionRef = this.afDb.collection('users', ref => 
      ref.where('user_type', '==', 'Student'));
      this.usersCollection = this.usersCollectionRef.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as User;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
      return this.usersCollection;
   }
   getSbg(){
    this.usersCollectionRef = this.afDb.collection('users', ref => 
      ref.where('user_type', '==', 'SBG'));
      this.usersCollection = this.usersCollectionRef.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as User;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
      return this.usersCollection;
   }
   getUserDocument(id:string) {
    this.userDocumentRef = this.afDb.doc(`users/${id}`);
    this.userDocument = this.userDocumentRef.valueChanges();
    return this.userDocument;
  }
  updateUserDoc(id:string, userDocument){
    this.userDocumentRef = this.afDb.doc(`users/${id}`);
    this.userDocumentRef.update(userDocument).then(userDoc => {
      this.userDocumentRef.set({ user_timestamp_last_updated:firebase.firestore.FieldValue.serverTimestamp()}, {merge:true});
    });
  }
   deleteUserDoc(id:string){
    this.userDocumentRef = this.afDb.doc(`users/${id}`);
    this.userDocumentRef.delete()
    // this.studentColonRef.remove(id);
  }
}
