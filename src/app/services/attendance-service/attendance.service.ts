import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { Attendance } from '../../models/attendance/attendance';
@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
	attendanceCollectionRef: AngularFirestoreCollection<Attendance>;
  attendanceCollection: Observable<Attendance[]>;
  attendanceDocumentRef: AngularFirestoreDocument<any>;
  attendanceDocument: Observable<any>;
  constructor(private afDB: AngularFirestore) { }
  // getCourseCollection() {
  //   this.attendanceCollectionRef = this.afDB.collection('courses', ref => ref.orderBy('program_timestamp_post_created', 'desc'));
  //   this.attendanceCollection = this.attendanceCollectionRef.snapshotChanges().pipe(
  //     map(actions => actions.map(a => {
  //       const data = a.payload.doc.data() as Attendance;
  //       const id = a.payload.doc.id;
  //       return { id, ...data };
  //     }))
  //   );
  //   return this.attendanceCollection;
  //  }
   getProgramsCoursesAttended(){
    this.attendanceDocumentRef = this.afDB.doc(`available_programs/courses`);
    this.attendanceDocument = this.attendanceDocumentRef.valueChanges();
    return this.attendanceDocument;
  }
  getAttendanceList(eventId, program){
    this.attendanceCollectionRef = this.afDB.collection(`attendance/${eventId}/${program}`, ref => ref.orderBy('student_last_name'));
    this.attendanceCollection = this.attendanceCollectionRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        const metadata = a.payload.doc.metadata;
      //  const doc = a.payload.doc;
        return { id,metadata, ...data };
      }))
    );
    return this.attendanceCollection;
  }
}
