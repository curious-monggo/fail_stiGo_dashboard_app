import { Component, OnInit } from '@angular/core';

//model
import { Student } from './../../models/student/student';
import { User } from './../../models/user/user';

//service
import { StudentService } from './../../services/student-service/student.service';
import { UsersService } from './../../services/users-service/users.service';
//for unsubscribing
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users-item',
  templateUrl: './users-item.component.html',
  styleUrls: ['./users-item.component.css']
})
export class UsersItemComponent implements OnInit {
  studentCollection:Student[];
  registeredStudentCollection;
  sbgCollection;
  
  isUsersUpdateDialogOpen:boolean = false;
  userId;


  isRegisteredStudentsTabActive = false;
  isAttendanceHostsActive = false
  isSbgTabActive = false;

  userType;
  userDocument={
    user_type:'',
    student_id_number:'',
    student_first_name:'',
    student_middle_name:'',
    student_last_name:'',
    student_program:'',
    student_year_level:'',
    // student_timestamp_added:'',
    // student_timestamp_last_updated:''
  };


  studentCollectionSubscription:Subscription;
  constructor(
    private studentService: StudentService,
    private usersService: UsersService
  ) { 

  }

  ngOnInit() {
    this.registeredStudentsTabClicked();
  }
  // attendanceHostsTabClicked() {

  //   this.isRegisteredStudentsTabActive = false;
  //   this.isAttendanceHostsActive = true;
  //   this.isSbgTabActive = false;
  // }
  registeredStudentsTabClicked() {
    this.isRegisteredStudentsTabActive = true;
    this.isAttendanceHostsActive = false;

    this.isSbgTabActive = false;
    this.getRegisteredStudents();
  }
  sbgTabClicked() {
    this.isRegisteredStudentsTabActive = false;
    this.isAttendanceHostsActive = false;

    this.isSbgTabActive = true;
    this.getSbg();
  }

  getRegisteredStudents(){
    this.usersService.getRegisteredStudents().subscribe(studentCollection => {
      this.registeredStudentCollection = studentCollection;
      console.log(this.registeredStudentCollection);
    });
  }
  getSbg(){
    this.usersService.getSbg().subscribe(studentCollection => {
      this.sbgCollection = studentCollection;
      console.log(this.sbgCollection);
    });
  }
  getUserDocument(userId:string){
    this.usersService.getUserDocument(userId).subscribe(studentDoc => {
      this.userDocument = {
        user_type:studentDoc.user_type,
        student_id_number:studentDoc.student_id_number,   
        student_first_name:studentDoc.student_first_name,
        student_middle_name:studentDoc.student_middle_name,
        student_last_name:studentDoc.student_last_name,
        student_program:studentDoc.student_program,
        student_year_level:studentDoc.student_year_level
      };

      console.log(this.userDocument)
    });
  }
  openUsersDialogUpdate(userId:string) {
    this.isUsersUpdateDialogOpen = true;
    console.log('test')
    this.userId = userId;
    this.getUserDocument(userId);
  }
  closeUsersDialogUpdate() {
    this.userId = null;
    this.isUsersUpdateDialogOpen = false;
    
  }
  clearInput(){
    this.userDocument = {
      user_type:'',
      student_id_number:'',
      student_first_name:'',
      student_middle_name:'',
      student_last_name:'',
      student_program:'',
      student_year_level:''
    };
  }
  onSubmitUpdateNewsDocument() {
    console.log('id'+this.userId);

    this.usersService.updateUserDoc(this.userId, this.userDocument);
    this.closeUsersDialogUpdate();  
    this.clearInput();
  }

  deleteStudentDocument(id){
    this.studentService.deleteStudentDoc(id);
  }
}
