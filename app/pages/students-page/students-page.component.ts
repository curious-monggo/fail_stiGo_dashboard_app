import { Component, OnInit } from '@angular/core';

//model
import { Student } from './../../models/student/student';

//service
import { StudentService } from '../../services/student-service/student.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-students-page',
  templateUrl: './students-page.component.html',
  styleUrls: ['./students-page.component.css']
})
export class StudentsPageComponent implements OnInit {

  isStudentsDialogOpen:boolean = false;
  student:Student[];
  isAdmin;
  user;



  studentDocument:Student={
    student_id_number:'',
    student_first_name:'',
    student_middle_name:'',
    student_last_name:'',
    student_program:'',
    student_year_level:''
  };

  constructor(
    private studentService: StudentService,
    private afAuth: AngularFireAuth,
    private afDB: AngularFirestore
  ) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if(user){
        let userRef = this.afDB.doc(`users/${user.uid}`).valueChanges();
        userRef.subscribe(user => {
          this.user = user;
          if(this.user.user_type == 'Admin'){
            this.isAdmin = true;
            console.log(this.isAdmin);
          }
          else {
            this.isAdmin = false;
            console.log(this.isAdmin);
          }
        });
      }
    });
  }
  openStudentsDialog() {
    this.isStudentsDialogOpen = true;
  }
  closeStudentsDialog() {
    this.isStudentsDialogOpen = false;
    this.clearInput();
  }
  clearInput(){
    this.studentDocument = {
      student_id_number:'',
      student_first_name:'',
      student_middle_name:'',
      student_last_name:'',
      student_program:'',
      student_year_level:''
    };
  }
  onSubmitAddStudent() {
    console.log('Before the stud in init');
    let student_id_number = this.studentDocument.student_id_number.toString();
    console.log('after the stud in init '+this.studentDocument.student_id_number);
    console.log(this.studentDocument);
    this.studentService.addStudentDocument(this.studentDocument);
    // this.studentService.studentObjSubscription.unsubscribe();
    this.closeStudentsDialog();

    
  }
}
