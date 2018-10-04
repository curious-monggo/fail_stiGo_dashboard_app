import { Component, OnInit } from '@angular/core';

//model
import { Student } from './../../models/student/student';

//service
import { StudentService } from '../../services/student-service/student.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css']
})
export class UsersPageComponent implements OnInit {

  isUsersDialogOpen:boolean = false;

  student:Student[];



  studentDocument:Student={
    student_id_number:'',
    student_first_name:'',
    student_middle_name:'',
    student_last_name:'',
    student_program:'',
    student_year_level:''
  };

  constructor(
    private studentService: StudentService
  ) { 
  }

  ngOnInit() {
  }
  openUsersDialog() {
    this.isUsersDialogOpen = true;
  }
  closeUsersDialog() {
    this.isUsersDialogOpen = false;
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
  onSubmitAddUser() {
    console.log('Before the stud in init');
    let student_id_number = this.studentDocument.student_id_number.toString();
    console.log('after the stud in init '+this.studentDocument.student_id_number);
    console.log(this.studentDocument);
    this.studentService.addStudentDocument(this.studentDocument);
    // this.studentService.studentObjSubscription.unsubscribe();
    this.closeUsersDialog();

    
  }
}
