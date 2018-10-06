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
import { Program } from '../../models/program/program';

import * as firebase from 'firebase';
import { Subject } from '../../models/subject/subject';

@Injectable({
  providedIn: 'root'
})
export class StrandService {

	//list variables
	strandCollectionRef: AngularFirestoreCollection<Program>;
  strandCollection: Observable<Program[]>;
  
	//object variables
	strandDocumentRef: AngularFirestoreDocument<Program>;
  strandDocument: Observable<Program>;

  subjectDocument: Observable<Subject>;

  constructor(
    private afDB: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  getStrandCollection() {
    this.strandCollectionRef = this.afDB.collection('strands', ref => ref.orderBy('program_timestamp_post_created', 'desc'));
    this.strandCollection = this.strandCollectionRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Program;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.strandCollection;
   }


   getStrandDocument(id:string) {
    this.strandDocumentRef = this.afDB.doc(`strands/${id}`);
    this.strandDocument = this.strandDocumentRef.valueChanges();
    return this.strandDocument;
  } 
  addStrandDocument(strandDocumentID ,strandDocument:Program) {
    let acronym = strandDocument.program_acronym;
    this.strandDocumentRef = this.afDB.doc(`strands/${strandDocumentID}`);
    this.strandDocumentRef.set(strandDocument)
      .then((strandDocument) => {
        console.log('ID of strand doc added ', strandDocumentID);
        this.strandDocumentRef = this.afDB.doc(`strands/${strandDocumentID}`);
        this.strandDocumentRef.update({program_timestamp_post_created: firebase.firestore.FieldValue.serverTimestamp()});
        let available_strandsRef = this.afDB.doc(
          `available_programs/strands`
        );

        available_strandsRef.update({
          currently_available_strands: firebase.firestore.FieldValue.arrayUnion(acronym)
        });
    }).catch((error) =>{
        console.log('Error on strand doc add or update ', error);
    }); 
   }
   getSubjectDoc(strand_id,grade,term, id){
    let ref = this.afDB.doc(`strands/${strand_id}/${grade}/${term}/subjects/${id}`);
    this.subjectDocument = ref.valueChanges();
    return this.subjectDocument;
  }
   updateStrandDocument(id:string, strandDocument:Program, oldStrandAcronym){
    let acronym = strandDocument.program_acronym;
    this.strandDocumentRef = this.afDB.doc(`strands/${id}`);
    this.strandDocumentRef.update(strandDocument).then(onSnapshot => {
      this.strandDocumentRef = this.afDB.doc(`strands/${id}`);
      this.strandDocumentRef.update({program_timestamp_post_last_updated: firebase.firestore.FieldValue.serverTimestamp()});
      let available_strandsRef = this.afDB.doc(
        `available_programs/strands`
      );

      available_strandsRef.update({
        currently_available_strands: firebase.firestore.FieldValue.arrayRemove(oldStrandAcronym)
      });
      available_strandsRef.update({
        currently_available_strands: firebase.firestore.FieldValue.arrayUnion(acronym)
      });
    });
  }
   deleteStrandDocument(id:string, fileName, acronym){
    this.strandDocumentRef = this.afDB.doc(`strands/${id}`);
    this.strandDocumentRef.delete()
    this.storage.ref('stiGo/strands/'+id+'/'+fileName).delete();
    let available_strandsRef = this.afDB.doc(
      `available_programs/strands`
    );

    available_strandsRef.update({
      currently_available_strands: firebase.firestore.FieldValue.arrayRemove(acronym)
    });
  }


  getStrandSubjects(strand_id, grade, term){
    let ref = this.afDB.collection(`strands/${strand_id}/${grade}/${term}/subjects`);
    let collection = ref.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return collection;
  }

  getG11FirstTermStrandSubjects(strand_id){
    let ref = this.afDB.collection(`strands/${strand_id}/grade_11/1st_term/subjects`);
    let collection = ref.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return collection;
  }
  getG11SecondTermStrandSubjects(strand_id){
    let ref = this.afDB.collection(`strands/${strand_id}/grade_11/2nd_term/subjects`);
    let collection = ref.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return collection;
  }

  getG12FirstTermStrandSubjects(strand_id){
    let ref = this.afDB.collection(`strands/${strand_id}/grade_12/1st_term/subjects`);
    let collection = ref.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return collection;
  }
  getG12SecondTermStrandSubjects(strand_id){
    let ref = this.afDB.collection(`strands/${strand_id}/grade_12/2nd_term/subjects`);
    let collection = ref.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return collection;
  }

  addSubject(strand_id, grade, term, subjectDocument){
    let subjectCollectionRef = this.afDB.collection(`strands/${strand_id}/${grade}/${term}/subjects`, ref =>
      ref.where('subject_name', '==', subjectDocument.subject_name));

    let subjectCollection = subjectCollectionRef.valueChanges();

    let subjectSubscription = subjectCollection.subscribe(subjectCollectionResult => {
      if(subjectCollectionResult.length > 0){
        console.log('Strand already in system');
        subjectSubscription.unsubscribe();
      }
      else{
        let ref = this.afDB.collection(`strands/${strand_id}/${grade}/${term}/subjects`);
        ref.add(subjectDocument).then(onSnapshot => {
          let refOnAddTimestamp = this.afDB.doc(
            `strands/${strand_id}/${grade}/${term}/subjects/${onSnapshot.id}`
            );
            refOnAddTimestamp.update({subject_timestamp_added: firebase.firestore.FieldValue.serverTimestamp()})
        });
        subjectSubscription.unsubscribe();
        console.table(subjectDocument);
      }
    });

  }

  updateSubject(strand_id, subject_id, grade, term, subjectDocument){
    console.log(strand_id, subject_id, grade, term, subjectDocument);
    let ref = this.afDB.doc(`strands/${strand_id}/${grade}/${term}/subjects/${subject_id}`);
    ref.update(subjectDocument).then(onSnapshot => {
      ref.update({course_timestamp_last_updated: firebase.firestore.FieldValue.serverTimestamp()})
    });
  }
  updateSubjectMovePaths(strand_id, subject_id, grade, term, subjectDocument){
    let ref = this.afDB.doc(`strands/${strand_id}/${grade}/${term}/subjects/${subject_id}`);
    ref.set(subjectDocument, {merge:true}).then(onSet => {
      ref.update(subjectDocument).then(onSnapshot => {
        ref.update({course_timestamp_last_updated: firebase.firestore.FieldValue.serverTimestamp()})
      });
    });
  }
  deleteSubject(strand_id,grade,term, subject_id){
    let subjectRef = this.afDB.doc(`strands/${strand_id}/${grade}/${term}/subjects/${subject_id}`);
    subjectRef.delete();
  }
}
