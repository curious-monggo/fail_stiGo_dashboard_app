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

    this.strandDocumentRef = this.afDB.doc(`strands/${strandDocumentID}`);
    this.strandDocumentRef.set(strandDocument)
      .then((strandDocument) => {
        console.log('ID of strand doc added ', strandDocumentID);
        this.strandDocumentRef = this.afDB.doc(`strands/${strandDocumentID}`);

        this.strandDocumentRef.update({program_timestamp_post_created: firebase.firestore.FieldValue.serverTimestamp()});
    }).catch((error) =>{
        console.log('Error on strand doc add or update ', error);
    }); 

   }

   updateStrandDocument(id:string, strandDocument:Program){
    this.strandDocumentRef = this.afDB.doc(`strands/${id}`);
    this.strandDocumentRef.update(strandDocument);
  }
   deleteStrandDocument(id:string, fileName){
    this.strandDocumentRef = this.afDB.doc(`strands/${id}`);
    this.strandDocumentRef.delete()
    this.storage.ref('stiGo/strands/'+id+'/'+fileName).delete();
  }
}
