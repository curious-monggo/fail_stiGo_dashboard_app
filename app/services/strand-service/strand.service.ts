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

  uploadPercent: Observable<number>;

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

        let available_strandsRef = this.afDB.doc(
          `available_programs/strands`
        );

        available_strandsRef.update({
          currently_available_strands: firebase.firestore.FieldValue.arrayUnion(acronym)
        });


        this.strandDocumentRef.update({program_timestamp_post_created: firebase.firestore.FieldValue.serverTimestamp()});
    }).catch((error) =>{
        console.log('Error on strand doc add or update ', error);
    }); 

   }

   updateStrandDocument(id:string, strandDocument:Program, oldStrandAcronym){
    let acronym = strandDocument.program_acronym;
    this.strandDocumentRef = this.afDB.doc(`strands/${id}`);
    this.strandDocumentRef.update(strandDocument).then(onSnapshot => {
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


  getSubjects(strand_id, year_level, term){
    let ref = this.afDB.collection(`strands/${strand_id}/${year_level}/${term}/subjects`);
    let collection = ref.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return collection;
  }

  addSubject(strand_id, year_level, term, subjectDocument){
    let ref = this.afDB.collection(`strands/${strand_id}/${year_level}/${term}/subjects`);
    ref.add(subjectDocument).then(onSnapshot => {
      let refOnAddTimestamp = this.afDB.doc(
        `strands/${strand_id}/${year_level}/${term}/subjects/${onSnapshot.id}`
        );
        refOnAddTimestamp.update({strand_timestamp_created: firebase.firestore.FieldValue.serverTimestamp()})
    })
    console.table(subjectDocument);
  }

  updateSubject(strand_id, year_level, term, subject_id){
    let ref = this.afDB.doc(`strands/${strand_id}/${year_level}/${term}/subjects/${subject_id}`);
    let subject = {
      code:'',
      name: '',
      units:'',
      pre_requisite:''
    }
    ref.update(subject);
  }


}
