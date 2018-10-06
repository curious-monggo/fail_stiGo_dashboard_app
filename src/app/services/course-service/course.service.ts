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
import { Course } from '../../models/course/course';

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

  subjectDocument: Observable<Course>;

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
    let acronym = courseDocument.program_acronym;
    this.courseDocumentRef = this.afDB.doc(`courses/${courseDocumentID}`);
    this.courseDocumentRef.set(courseDocument)
      .then((courseDocument) => {
        console.log('ID of course doc added ', courseDocumentID);
        this.courseDocumentRef = this.afDB.doc(`courses/${courseDocumentID}`);
        this.courseDocumentRef.update(
          {program_timestamp_post_created: firebase.firestore.FieldValue.serverTimestamp()}
          );
        let available_coursesRef = this.afDB.doc(
          `available_programs/courses`
        );

        available_coursesRef.update({
          currently_available_courses: firebase.firestore.FieldValue.arrayUnion(acronym)
        });
    }).catch((error) =>{
        console.log('Error on course doc add or update ', error)
    })
   }
   updateCourseDocument(id:string, courseDocument:Program, oldCourseAcronym){
    let acronym = courseDocument.program_acronym;

    this.courseDocumentRef = this.afDB.doc(`courses/${id}`);
    this.courseDocumentRef.update(courseDocument).then(onSnapshot => {

      this.courseDocumentRef = this.afDB.doc(`courses/${id}`);
      this.courseDocumentRef.update(
        {program_timestamp_post_last_updated: firebase.firestore.FieldValue.serverTimestamp()}
        );
      let available_coursesRef = this.afDB.doc(
        `available_programs/courses`
      );

      available_coursesRef.update({
        currently_available_courses: firebase.firestore.FieldValue.arrayRemove(oldCourseAcronym)
      });
      available_coursesRef.update({
        currently_available_courses: firebase.firestore.FieldValue.arrayUnion(acronym)
      });
    });
  }
   deleteCourseDocument(id:string, fileName,acronym){
    this.courseDocumentRef = this.afDB.doc(`courses/${id}`);
    this.courseDocumentRef.delete()
    this.storage.ref('stiGo/courses/'+id+'/'+fileName).delete();
    let available_coursesRef = this.afDB.doc(
      `available_programs/courses`
    );
    available_coursesRef.update({
      currently_available_courses: firebase.firestore.FieldValue.arrayRemove(acronym)
    });
  }

  getCourseSubjects(course_id,year_level,term){
    let ref = this.afDB.collection(`courses/${course_id}/${year_level}/${term}/subjects`);
    let collection = ref.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return collection;
  }
  getCourseDoc(course_id,year_level,term, id){
    let ref = this.afDB.doc(`courses/${course_id}/${year_level}/${term}/subjects/${id}`);
    this.subjectDocument = ref.valueChanges();
    return this.subjectDocument;
  }
  //first year
  getFirstYearFirstTermCourseSubjects(course_id){
    let ref = this.afDB.collection(`courses/${course_id}/1st_year/1st_term/subjects`);
    let collection = ref.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return collection;
  }
  getFirstYearSecondTermCourseSubjects(course_id){
    let ref = this.afDB.collection(`courses/${course_id}/1st_year/2nd_term/subjects`);
    let collection = ref.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return collection;
  }
  //second year
  getSecondYearFirstTermCourseSubjects(course_id){
    let ref = this.afDB.collection(`courses/${course_id}/2nd_year/1st_term/subjects`);
    let collection = ref.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return collection;
  }
  getSecondYearSecondTermCourseSubjects(course_id){
    let ref = this.afDB.collection(`courses/${course_id}/2nd_year/2nd_term/subjects`);
    let collection = ref.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return collection;
  }
  //third year
  getThirdYearFirstTermCourseSubjects(course_id){
    let ref = this.afDB.collection(`courses/${course_id}/3rd_year/1st_term/subjects`);
    let collection = ref.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return collection;
  }
  getThirdYearSecondTermCourseSubjects(course_id){
    let ref = this.afDB.collection(`courses/${course_id}/3rd_year/2nd_term/subjects`);
    let collection = ref.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return collection;
  }
  //fourth year
  getFourthYearFirstTermCourseSubjects(course_id){
    let ref = this.afDB.collection(`courses/${course_id}/4th_year/1st_term/subjects`);
    let collection = ref.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return collection;
  }
  getFourthYearSecondTermCourseSubjects(course_id){
    let ref = this.afDB.collection(`courses/${course_id}/4th_year/2nd_term/subjects`);
    let collection = ref.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return collection;
  }
  addCourse(course_id, year_level, term, subjectDocument){
    let subjectCollectionRef = this.afDB.collection(`courses/${course_id}/${year_level}/${term}/subjects`, ref =>
      ref.where('course_code', '==', subjectDocument.course_code));

    let subjectCollection = subjectCollectionRef.valueChanges();

    let subjectSubscription = subjectCollection.subscribe(subjectCollectionResult => {
      if(subjectCollectionResult.length > 0){
        console.log('Course aready in system');
        subjectSubscription.unsubscribe();
      }
      else{
        let ref = this.afDB.collection(`courses/${course_id}/${year_level}/${term}/subjects`);
        ref.add(subjectDocument).then(onSnapshot => {

          let refOnAddTimestamp = this.afDB.doc(
            `courses/${course_id}/${year_level}/${term}/subjects/${onSnapshot.id}`
            );
            refOnAddTimestamp.update({course_timestamp_created: firebase.firestore.FieldValue.serverTimestamp()})
        });
        subjectSubscription.unsubscribe();
        console.table(subjectDocument);
      }
    });
  }

  updateCourse(course_id, subject_id, year_level, term, subjectDocument){
    console.log(course_id, subject_id, year_level, term, subjectDocument);
    let ref = this.afDB.doc(`courses/${course_id}/${year_level}/${term}/subjects/${subject_id}`);
    ref.update(subjectDocument).then(onSnapshot => {
      ref.update({course_timestamp_last_updated: firebase.firestore.FieldValue.serverTimestamp()})
    });
  }
  updateCourseMovePaths(course_id, subject_id, year_level, term, subjectDocument){
    let ref = this.afDB.doc(`courses/${course_id}/${year_level}/${term}/subjects/${subject_id}`);
      ref.set(subjectDocument, {merge:true}).then(onSet => {
        ref.update(subjectDocument).then(onSnapshot => {
          ref.update({course_timestamp_last_updated: firebase.firestore.FieldValue.serverTimestamp()})
        });
      });
  }
  deleteSubject(course_id,year_level,term, subject_id){
    let subjectRef = this.afDB.doc(`courses/${course_id}/${year_level}/${term}/subjects/${subject_id}`);
    subjectRef.delete();
  }
}
