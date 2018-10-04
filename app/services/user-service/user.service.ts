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
export class UserService {

	//list variables
	userCollectionRef: AngularFirestoreCollection<User>;
  userCollection: Observable<User[]>;
  
	//object variables
	userDocumentRef: AngularFirestoreDocument<User>;
  userDocument: Observable<User>;
  userObjSubscription:Subscription;
  constructor(
    private afDb: AngularFirestore
  ) { 
    this.userCollectionRef = this.afDb.collection('users');

  }

  getUserDocument(userID:string) {
    this.userDocumentRef = this.afDb.doc(`users/${userID}`);
    this.userDocument = this.userDocumentRef.valueChanges();
    return this.userDocument;
  }

  addUserDocument(userID:string, userDocument:User){
    this.userDocumentRef = this.afDb.doc(`users/${userID}`);
    this.userDocument = this.userDocumentRef.valueChanges();
    this.userObjSubscription = this.userDocument.subscribe((userDoc) => {
      if(userDoc){
        console.log('Old user');
        if(userDoc !== userDocument){
        //mahal to
        const user = {
          user_email: userDocument.user_email,
          user_name: userDocument.user_name,
          user_photo_url: userDocument.user_photo_url
        };
        this.userDocumentRef.update(user);
        }
      }
      else {
        console.log('New user');
        userDocument.user_type = 'Member';
        this.userDocumentRef.set(userDocument);
      }
    });
  }
}
