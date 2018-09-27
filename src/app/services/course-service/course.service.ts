import { Injectable } from '@angular/core';

//AngularFire
// old import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

//Storage
import { AngularFireStorage } from 'angularfire2/storage';

//rxjs
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

//program model
import { Program } from './../../models/program/program';

import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

	//list variables
	courseCollectionRef: AngularFirestoreCollection<Program>;
  courseCollection: Observable<Program[]>;
  
	//object variables
	courseDocumentRef: AngularFirestoreDocument<Program>;
  courseDocument: Observable<Program>;

  uploadPercent: Observable<number>;

  constructor(
    private afDB: AngularFirestore,
    private storage: AngularFireStorage
  ) {

   }

   getCourseCollection() {
    this.courseCollectionRef = this.afDB.collection('courses', ref => ref.orderBy('program_timestamp_post_created', 'desc'));
    this.courseCollection = this.courseCollectionRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Program;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.courseCollection;
   }

   getCourseDocument(id:string) {
     this.courseDocumentRef = this.afDB.doc(`courses/${id}`);
     this.courseDocument = this.courseDocumentRef.valueChanges();
     return this.courseDocument;
   }
   addCourseDocument(courseDocumentID ,courseDocument:Program) {

    this.courseDocumentRef = this.afDB.doc(`courses/${courseDocumentID}`);
    this.courseDocumentRef.set(courseDocument)
      .then((courseDocument) => {
        console.log('ID of course doc added ', courseDocumentID);
        this.courseDocumentRef = this.afDB.doc(`courses/${courseDocumentID}`);

        this.courseDocumentRef.update({program_timestamp_post_created: firebase.firestore.FieldValue.serverTimestamp()});
    }).catch((error) =>{
        console.log('Error on course doc add or update ', error)
    })

   }
   updateCourseDocument(id:string, courseDocument:Program){
    this.courseDocumentRef = this.afDB.doc(`courses/${id}`);
    this.courseDocumentRef.update(courseDocument);
  }
   deleteCourseDocument(id:string, fileName){
    this.courseDocumentRef = this.afDB.doc(`courses/${id}`);
    this.courseDocumentRef.delete()
    this.storage.ref('stiGo/courses/'+id+'/'+fileName).delete();
  }

}
