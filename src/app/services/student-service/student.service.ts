import { Injectable } from '@angular/core';

//AngularFire
// old import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

//rxjs
import { Observable, Subscription } from 'rxjs';
import {map} from 'rxjs/operators';

//student model
import { Student } from './../../models/student/student';

import * as firebase from 'firebase';

import * as hash from '../../../../node_modules/hashids/dist/hashids.min.js';
import * as generatePassword from 'generate-password-browser';
@Injectable({
  providedIn: 'root'
})
export class StudentService {
	//list variables
	studentCollectionRef: AngularFirestoreCollection<Student>;
  studentCollection: Observable<Student[]>;
  
	//object variables
	studentDocumentRef: AngularFirestoreDocument<Student>;
  studentDocument: Observable<Student>;
  studentObjSubscription:Subscription;
  uniqueCode;


  constructor(
    private afDb: AngularFirestore
  ) {
    // let g = require('generate-password-browser');

   }

   getStudentCollection() {
    this.studentCollectionRef = this.afDb.collection('students');
    this.studentCollection = this.studentCollectionRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Student;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.studentCollection;
   }

   getStudentDocument(id:string) {
     this.studentDocumentRef = this.afDb.doc(`students/${id}`);
     this.studentDocument = this.studentDocumentRef.valueChanges();
     return this.studentDocument;
   }


   updateStudentDoc(id:string, studentDocument:Student){
    this.studentDocumentRef = this.afDb.doc(`students/${id}`);
    this.studentDocumentRef.update(studentDocument).then(studDoc => {
      this.studentDocumentRef.update({ student_timestamp_last_updated:firebase.firestore.FieldValue.serverTimestamp()});
    });
  }
   deleteStudentDoc(id:string){
    this.studentDocumentRef = this.afDb.doc(`students/${id}`);
    this.studentDocumentRef.delete()
    // this.studentColonRef.remove(id);
  }
  
  addStudentDocument(studentDocument:Student){
    this.studentCollectionRef = this.afDb
    .collection('students', ref => 
      ref.where('student_id_number', '==', studentDocument.student_id_number));
      this.studentCollection = this.studentCollectionRef.valueChanges();
      this.studentCollection.subscribe((studentColl) => {
        if(studentColl.length >0){
          console.log('Student is already in the system');
          console.log(studentColl);
        }
        else {
          console.log('new student');
          const hashids = new hash('stiGo', 8, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890');
          const identifier = hashids.encode(studentDocument.student_id_number);
          let code = generatePassword.generate({
            length:8,
            numbers:true
          });
          console.log(identifier+'-'+code);
          this.uniqueCode = identifier+code; 
          studentDocument.student_registration_code = this.uniqueCode;
          this.studentCollectionRef.add(studentDocument).then(
            studentDoc => {
              this.studentDocumentRef = this.afDb.doc(`students/${studentDoc.id}`);
              this.studentDocumentRef.update({ student_timestamp_added:firebase.firestore.FieldValue.serverTimestamp()});

            });

        }
      });
    // this.studentDocumentRef = this.afDb.doc(`students/${studentIdNumber}`);
    // this.studentDocument = this.studentDocumentRef.valueChanges();

    // this.studentDocument.subscribe((studentDoc) => {
    //   if(studentDoc){
    //     console.log('Student is already in the system');
    //   }
    //   else {
    //     console.log('new student');
    //     this.studentCollectionRef.add(studentDocument);
    //   }
    // });
  }
  
  //Check if student already exists in database using the student id. Not based on names.
  //then add said student obj 
  // checkIfStudentDoc(studentIdNumber:string, studentObj:Student) {
  //   this.studentObjRef = this.afDb.object(`students/${studentIdNumber}`);
  //   this.studentObj = this.studentObjRef.valueChanges();
  //   console.log('Before subscription');
  //   this.studentObjSubscription = this.studentObj.subscribe((obj) => {
  //     console.log('After subscription');
      
  //     if(obj !==null){

  //       console.log('Student ID already exists');
  //       this.studentObjSubscription.unsubscribe();

  //     }
  //     else {
  //       console.log('Student ID does not exist');
  //       this.addStudentObj(studentIdNumber, studentObj);
  //       this.studentObjSubscription.unsubscribe();  
  //     }
  //   });
  //   console.log('Check');
    //this.studentObjSubscription.unsubscribe();
  // }

}
