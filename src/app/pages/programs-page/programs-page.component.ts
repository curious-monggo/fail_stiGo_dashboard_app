
import { Component, OnInit } from '@angular/core';

//models
import { Program } from '../../models/program/program';
import { User } from '../../models/user/user';

//service
import { AuthService } from '../../services/auth-service/auth.service';
import { CourseService } from '../../services/course-service/course.service';
import { StrandService } from './../../services/strand-service/strand.service';

//component to set tab
import { ProgramsCardComponent } from './../../components/programs-card/programs-card.component';

//Database and Storage
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';

import { NgForm } from '@angular/forms';

import { Observable, of } from 'rxjs';



@Component({
  selector: 'app-programs-page',
  templateUrl: './programs-page.component.html',
  styleUrls: ['./programs-page.component.css']
})
export class ProgramsPageComponent implements OnInit {
  isProgramDialogOpen:boolean = false;
  isProgramDialogFormButtonDisabled: boolean = false;

  //tab
  programType;

  programDocument: Program = {

    program_photo_url:'',
    program_photo_name:'',

    program_acronym:'',
    program_name:'',
    program_description:'',



    program_timestamp_post_created:'',
    program_timestamp_post_last_updated:'',

    program_author_id:'',
    program_author_name:'',
    program_author_email:'',
    program_author_photo_url:''
  };

    //file vars
    uploadPercent: Observable<number>;
    file: any;
    fileName;
    pushId;
    fileRef;


  constructor(
    private authService: AuthService,
    private courseService: CourseService,
    private strandService: StrandService,
    private programCardComponent: ProgramsCardComponent,
    private afDB: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
  }
  clearProgramDocOutput() {
    this.programDocument = {
      program_photo_url:'',
      program_photo_name:'',
  
      program_acronym:'',
      program_name:'',
      program_description:'',
  
  
      program_timestamp_post_created:'',
      program_timestamp_post_last_updated:'',
  
      program_author_id:'',
      program_author_name:'',
      program_author_email:'',
      program_author_photo_url:''
    };
  }
  openProgramDialog() {
    this.isProgramDialogOpen = true;
  }
  closeProgramDialog() {
    
    this.isProgramDialogOpen = false;
    this.uploadPercent = null;
    this.file = null;
    this.fileName;
    this.pushId = null;
    this.fileRef = null;
    this.clearProgramDocOutput(); 

  }

  uploadHandler(event) {
    if(event.target.files[0].name !== undefined){
      this.isProgramDialogFormButtonDisabled = true;
      this.file = event.target.files[0];
      this.fileName = event.target.files[0].name;
  
      this.programDocument.program_photo_name = this.fileName;
      this.pushId = this.afDB.createId();
      console.log('id used', this.pushId);
      this.fileRef = this.storage.ref('stiGo/'+this.programType+'/' + this.pushId + '/' + this.fileName);
      let task = this.fileRef.put(this.file);
      this.uploadPercent = task.percentageChanges();
      task.then(snapshot => {
        this.fileRef.getDownloadURL().subscribe(url => {
          if (url !== null) {
            this.programDocument.program_photo_url = url;
            console.log(url);
            this.isProgramDialogFormButtonDisabled = false;
            return true;
          }
        }, (error) => {
          console.log('Error on get url, will delete', error);
          this.storage.ref('stiGo/'+this.programType+'/' + this.pushId + '/' + this.fileName).delete();
          this.closeProgramDialog();
          return of(false);
        });
      });
    } else {
      return false;
    }
  }


  onSubmitAddProgram() {
    if(this.pushId == null){
      this.pushId = this.afDB.createId();
    }
    console.log('Add program');
    console.log(this.programDocument);

    this.programDocument.program_author_id = this.authService.userKey;
    this.programDocument.program_author_photo_url = this.authService.userObj.user_photo_url;
    this.programDocument.program_author_name = this.authService.userObj.user_name;
    this.programDocument.program_author_email = this.authService.userObj.user_email;

    console.log(this.programType);
    


    if(this.programType == 'courses'){
      this.programCardComponent.programCoursesTabSetToActive();
      this.courseService.addCourseDocument(this.pushId, this.programDocument);
      console.log('Course nga');
      
      this.closeProgramDialog();
    } 
    else if(this.programType == 'strands') {
      console.log('if block');  
      this.programCardComponent.programStrandsTabSetToActive();
      this.strandService.addStrandDocument(this.pushId, this.programDocument);
      console.log('Di Course, StrandS');
      
      this.closeProgramDialog();
    }
    
  }


}
