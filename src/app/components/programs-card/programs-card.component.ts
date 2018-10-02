import { Component, OnInit } from '@angular/core';

//Storage
import { AngularFireStorage } from 'angularfire2/storage';

//model
import { Program } from './../../models/program/program';

//service
import { CourseService } from '../../services/course-service/course.service';
import { StrandService } from '../../services/strand-service/strand.service';

//for unsubscribing
import { Subscription, Observable, of } from 'rxjs';

//for form reset
import { NgForm } from '@angular/forms';
import { Course } from '../../models/course/course';
import { AuthService } from '../../services/auth-service/auth.service';


@Component({
  selector: 'app-programs-card',
  templateUrl: './programs-card.component.html',
  styleUrls: ['./programs-card.component.css']
})
export class ProgramsCardComponent implements OnInit {

  isProgramCourseTabActive: boolean = true;
  isProgramUpdateDialogOpen: boolean = false;
  isProgramDialogFormButtonDisabled = true;
  isProgramConfirmDeleteDialogOpen = false;
  isProgramImageAvailable: boolean = true;
  isProgramsCardActive: boolean = false;
  isSubjectFormAddOpen: boolean = false;
  isUpdateChooseActionDialogOpen: boolean = false;
  isUpdateCourseChosen:boolean = true;

  programCollection: Program[];

  programCourseCollectionSubscription: Subscription;
  programStrandCollectionSubscription: Subscription;

  programDocumentId;
  programType;


  programDocument: Program = {
    program_photo_url: '',
    program_photo_name: '',
    program_acronym: '',
    program_name: '',
    program_description: '',

    program_timestamp_post_created: '',

    program_author_id: '',
    program_author_name: '',
    program_author_email: '',
    program_author_photo_url: ''
  };
  subjectDocument: Course = {
    course_code: '',
    course_name: '',
    course_units: 0,
    course_pre_requisites: '',

    course_timestamp_created: '',
    course_timestamp_last_updated: '',

    course_author_id: '',
    course_author_name: '',
    course_author_email: '',
    course_author_photo_url: '',
  };

  year_level;
  term;

  uploadPercent: Observable<number>;
  file: any;
  fileName;
  fileRef;
  dateTime;

  constructor(
    private courseService: CourseService,
    private strandService: StrandService,
    private storage: AngularFireStorage,
    private authService: AuthService
  ) {
    if (this.isProgramCourseTabActive == true) {
      this.getProgramCourseCollection();
    } else if (this.isProgramCourseTabActive == false) {
      this.getProgramStrandCollection();
    }
  }

  ngOnInit() {
  }
  programCoursesTabSetToActive() {
    this.isProgramCourseTabActive = true;
    this.getProgramCourseCollection();

  }
  programStrandsTabSetToActive() {
    this.isProgramCourseTabActive = false;
    this.getProgramStrandCollection();
  }

  getProgramCourseCollection() {
    this.programCourseCollectionSubscription = this.courseService.getCourseCollection().
      subscribe(programCourseCollection => {
        this.programCollection = programCourseCollection;
      });
  }
  getProgramStrandCollection() {
    this.programStrandCollectionSubscription = this.strandService.getStrandCollection().
      subscribe(programStrandCollection => {
        this.programCollection = programStrandCollection;
      });
  }

  //get obj
  getProgramCourseDocument(programId: string) {
    this.courseService.getCourseDocument(programId).subscribe(courseDocument => {
      this.programDocument = {
        program_photo_url: courseDocument.program_photo_url,
        program_photo_name: courseDocument.program_photo_name,

        program_acronym: courseDocument.program_acronym,
        program_name: courseDocument.program_name,
        program_description: courseDocument.program_description,

        program_timestamp_post_created: '',

        program_author_id: courseDocument.program_author_id,
        program_author_name: courseDocument.program_author_name,
        program_author_email: courseDocument.program_author_email,
        program_author_photo_url: courseDocument.program_author_photo_url
      };
      console.log(this.programDocument);
    });
  }

  getProgramStrandDocument(programId: string) {
    this.strandService.getStrandDocument(programId).subscribe(strandDocument => {
      this.programDocument = {
        program_photo_url: strandDocument.program_photo_url,
        program_photo_name: strandDocument.program_photo_name,

        program_acronym: strandDocument.program_acronym,
        program_name: strandDocument.program_name,
        program_description: strandDocument.program_description,

        program_timestamp_post_created: '',

        program_author_id: strandDocument.program_author_id,
        program_author_name: strandDocument.program_author_name,
        program_author_email: strandDocument.program_author_email,
        program_author_photo_url: strandDocument.program_author_photo_url
      };
    });
  }

  onChangeImageHandler(event) {
    this.isProgramDialogFormButtonDisabled = true;
    if (this.isProgramCourseTabActive == true) {
      this.programType = 'courses';
      console.log('course image');
    }
    else if (this.isProgramCourseTabActive == false) {
      this.programType = 'strands';
      console.log('strand image');
    }
    console.log(this.programDocument.program_photo_name, 'is this undefined?');

    this.fileRef = this.storage.ref('stiGo/' + this.programType + '/' + this.programDocumentId + '/' + this.programDocument.program_photo_name).delete();

    this.file = event.target.files[0];
    this.fileName = event.target.files[0].name;

    this.programDocument.program_photo_name = this.fileName;

    this.fileRef = this.storage.ref('stiGo/' + this.programType + '/' + this.programDocumentId + '/' + this.programDocument.program_photo_name);

    let task = this.fileRef.put(this.file);
    this.uploadPercent = task.percentageChanges();
    task.then(snapshot => {
      this.fileRef.getDownloadURL().subscribe(url => {
        if (url) {
          this.programDocument.program_photo_url = url;
          console.log(url);
          this.isProgramDialogFormButtonDisabled = false;
          return true;
        }
      }, (error) => {
        console.log('Error on get url, will delete', error);
        this.storage.ref('stiGo/' + this.programType + '/' + this.programDocumentId + '/' + this.fileName).delete();
        this.closeProgramDocumentDialogUpdate();
        return of(false);
      });
    });
  }

  openProgramDocumentDialogUpdate(programDocumentId: string) {
    this.isProgramUpdateDialogOpen = true;
    this.isProgramDialogFormButtonDisabled = false;
    this.programDocumentId = programDocumentId;
    if (this.isProgramCourseTabActive == true) {
      this.getProgramCourseDocument(programDocumentId);
      console.log('onUpdate id course', programDocumentId);
    }
    else if (this.isProgramCourseTabActive == false) {
      this.getProgramStrandDocument(programDocumentId);
      console.log('onUpdate id Strand', programDocumentId);
    }
  }
  closeProgramDocumentDialogUpdate() {
    this.isProgramUpdateDialogOpen = false;
    this.uploadPercent = null;
    this.file = null;
    this.fileName = null

    this.fileRef = null;
    this.programDocumentId = null;
  }

  hideImage() {
    this.isProgramImageAvailable = false;
  }

  showImage() {
    this.isProgramImageAvailable = true;
  }

  openProgramsCardDetail(programDocumentId: string) {
    this.isProgramsCardActive = true;
    this.programDocumentId = programDocumentId;
    console.log(programDocumentId);
    if (this.isProgramCourseTabActive == true) {
      this.getProgramCourseDocument(programDocumentId);
    }
    else if (this.isProgramCourseTabActive == false) {
      this.getProgramStrandDocument(programDocumentId);
    }
  }

  closeProgramsCardDetail() {
    this.isProgramsCardActive = false;
    //this.clearNewsDocOutput();
    //setting to null creates errors. minor fix needed. patch for now
  }

  openProgramConfirmDeleteDialog(programDocumentId: string, programDocumentPhotoName) {
    if (this.isProgramCourseTabActive == true) {
      this.getProgramCourseDocument(programDocumentId);
      this.isProgramConfirmDeleteDialogOpen = true;
      this.programDocumentId = programDocumentId;
      console.log(programDocumentId, programDocumentPhotoName, 'opemDelete');
    }
    else if (this.isProgramCourseTabActive == false) {
      this.getProgramStrandDocument(programDocumentId);
      this.isProgramConfirmDeleteDialogOpen = true;
      this.programDocumentId = programDocumentId;
      console.log(programDocumentId);
    }
  }

  closeProgramConfirmDeleteDialog() {
    this.isProgramConfirmDeleteDialogOpen = false;
  }

  onSubmitUpdateProgramDocument(programForm: NgForm) {
    // console.log('Obj'+this.newsObj.()); 
    if (this.isProgramCourseTabActive == true) {
      this.courseService.updateCourseDocument(this.programDocumentId, this.programDocument);
    }
    else if (this.isProgramCourseTabActive == false) {
      this.strandService.updateStrandDocument(this.programDocumentId, this.programDocument);
    }
    this.closeProgramDocumentDialogUpdate();
    // programForm.reset(); 
  }

  //wrapper
  deleteProgramDocument() {
    if (this.isProgramCourseTabActive == true) {
      this.deleteProgramCourseDocument();
    }
    else if (this.isProgramCourseTabActive == false) {
      this.deleteProgramStrandObj();
    }
  }

  deleteProgramCourseDocument() {
    //console.log(programObjId);
    console.log(this.programDocumentId, this.programDocument.program_photo_name);
    this.courseService.deleteCourseDocument(this.programDocumentId, this.programDocument.program_photo_name);
    this.closeProgramConfirmDeleteDialog();
  }

  deleteProgramStrandObj() {
    console.log(this.programDocumentId, this.programDocument.program_photo_name);
    this.strandService.deleteStrandDocument(this.programDocumentId, this.programDocument.program_photo_name);
    this.closeProgramConfirmDeleteDialog();
  }

  openSubjectFormAdd() {
    console.log('test');
    this.isSubjectFormAddOpen = true;
  }

  closeSubjectFormAdd() {
    console.log('test');
    this.isSubjectFormAddOpen = false;
  }

  openUpdateChooseActionDialog(programDocumentId) {
    this.isUpdateChooseActionDialogOpen = true;
    this.programDocumentId = programDocumentId;
  }

  closeUpdateChooseActionDialog() {
    this.isUpdateChooseActionDialogOpen = false;
  }

  onUpdateCourseClicked() {
    this.isUpdateCourseChosen = true;
  }

  onUpdateCourseNotClicked() {
    this.isUpdateCourseChosen = false;
  }

  updateCourseWrapper() {
    this.closeUpdateChooseActionDialog();
    if(this.isUpdateCourseChosen == true){
      this.openProgramDocumentDialogUpdate(this.programDocumentId);
    }
    else if(this.isUpdateCourseChosen == false) {
      this.openSubjectFormAdd();
    }
  }

  onSubmitAddSubject() {
    if (this.isProgramCourseTabActive == true) {
      this.subjectDocument.course_author_id = this.authService.userKey;
      this.subjectDocument.course_author_email = this.authService.userObj.user_email;
      this.subjectDocument.course_author_name = this.authService.userObj.user_name;
      this.subjectDocument.course_author_photo_url = this.authService.userObj.user_photo_url;
      
      this.courseService.addSubject(this.programDocumentId, this.year_level, this.term, this.subjectDocument);
      console.table(this.subjectDocument);
      console.log(this.year_level, this.term);
    }
    else if (this.isProgramCourseTabActive == false) {

    }
  }

}
