import { Injectable } from '@angular/core';

//AngularFire
// old import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

//Storage
import { AngularFireStorage } from 'angularfire2/storage';

//rxjs
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

//news model
import { News } from '../../models/news/news';

import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class NewsService {

	//list variables
	newsCollectionRef: AngularFirestoreCollection<News>;
  newsCollection: Observable<News[]>;
  
	//object variables
	newsDocumentRef: AngularFirestoreDocument<News>;
  newsDocument: Observable<News>;

  uploadPercent: Observable<number>;
  
  constructor(
    private afDB: AngularFirestore,
    private storage: AngularFireStorage
  ) {

   }

   getNewsCollection() {
    this.newsCollectionRef = this.afDB.collection('news', ref => ref.orderBy('news_timestamp_post_created', 'desc'));
    this.newsCollection = this.newsCollectionRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as News;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.newsCollection;
    // console.log(this.newsList);
   }

   getNewsDocument(id:string) {
     this.newsDocumentRef = this.afDB.doc(`news/${id}`);
     this.newsDocument = this.newsDocumentRef.valueChanges();
     return this.newsDocument;
   }
   
   addNewsDocument(newsDocumentID ,newsDocument:News) {

    this.newsDocumentRef = this.afDB.doc(`news/${newsDocumentID}`);
    this.newsDocumentRef.set(newsDocument)
      .then((newsDocument) => {
        console.log('ID of news doc added ', newsDocumentID);
        this.newsDocumentRef = this.afDB.doc(`news/${newsDocumentID}`);

        this.newsDocumentRef.update({news_timestamp_post_created: firebase.firestore.FieldValue.serverTimestamp()});
    }).catch((error) =>{
        console.log('Error on news doc add or update ', error)
    });
   }

   updateNewsDocument(newsDocumentID:string, newsDocument:News){
    this.newsDocumentRef = this.afDB.doc(`news/${newsDocumentID}`);
    this.newsDocumentRef.update(newsDocument)
    .then(newsDocument => {
      console.log('ID of news doc updated ', newsDocumentID);
      this.newsDocumentRef = this.afDB.doc(`news/${newsDocumentID}`);

      this.newsDocumentRef.update({news_timestamp_post_last_updated: firebase.firestore.FieldValue.serverTimestamp()});
    }).catch((error) =>{
      console.log('Error on news doc add or update ', error);
    });
    // this.newsListRef.update(id, newsObj);
  }
   deleteNewsDocument(id:string, fileName){
    this.newsDocumentRef = this.afDB.doc(`news/${id}`);
    this.newsDocumentRef.delete()
    this.storage.ref('stiGo/news/'+id+'/'+fileName).delete();
    //this.newsListRef.remove(id);
  }
}
