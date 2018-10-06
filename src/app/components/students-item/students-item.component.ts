
import { Component, OnInit } from '@angular/core';
//provider
import { StudentService } from './../../services/student-service/student.service';
//model
import { Student } from './../../models/student/student';
//for unsubscribing
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-students-item',
  templateUrl: './students-item.component.html',
  styleUrls: ['./students-item.component.css']
})
export class StudentsItemComponent implements OnInit {
  studentCollection:Student[];
  
  isStudentsUpdateDialogOpen:boolean = false;
  studentIdNumber;

  studentDocument:Student={
    student_id_number:0,
    student_first_name:'',
    student_middle_name:'',
    student_last_name:'',
    student_program:'',
    student_year_level:'',
    student_registration_code:'',
    student_timestamp_added:'',
    student_timestamp_last_updated:''
  };
  studentCollectionSubscription:Subscription;

  constructor(
    private studentService: StudentService
  ) { }

  ngOnInit() {
    this.getStudentCollection();
    console.log(this.getStudentCollection);
  }
  getStudentCollection() {
    this.studentCollectionSubscription = this.studentService.getStudentCollection().
    subscribe(studentCollection => {
      this.studentCollection = studentCollection;
    });
  }
  getStudentDocument(studentId:string){
    this.studentService.getStudentDocument(studentId).subscribe(studentDoc => {

      // let dateCreated = new Date(newsDocument.news_timestamp_post_created.toDate());
      // let convertDateToLocale = dateCreated.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric', year: 'numeric' });
      // console.log(dateCreated);

      // this.dateTime = convertDateToLocale;

      this.studentDocument = {
        student_id_number:studentDoc.student_id_number,   
        student_first_name:studentDoc.student_first_name,
        student_middle_name:studentDoc.student_middle_name,
        student_last_name:studentDoc.student_last_name,
        student_program:studentDoc.student_program,
        student_year_level:studentDoc.student_year_level
      };

    });
  }

  openStudentsDialogUpdate(studentId:string) {
    this.isStudentsUpdateDialogOpen = true;
    this.studentIdNumber = studentId;
    // this.newsPageComponent.getNewsObj(newsId);
    this.getStudentDocument(studentId);
  }
  closeStudentsDialogUpdate() {
    this.studentIdNumber = null;
    this.isStudentsUpdateDialogOpen = false;
    
  }
  clearInput(){
    this.studentDocument = {
      student_id_number:0,
      student_first_name:'',
      student_middle_name:'',
      student_last_name:'',
      student_program:'',
      student_year_level:''
    };
  }
  onSubmitUpdateStudentDocument() {
    console.log('id'+this.studentIdNumber);

    this.studentService.updateStudentDoc(this.studentIdNumber, this.studentDocument);
    this.closeStudentsDialogUpdate();  
    this.clearInput();
  }

  deleteStudentDocument(id){
    this.studentService.deleteStudentDoc(id);
  }   
}
