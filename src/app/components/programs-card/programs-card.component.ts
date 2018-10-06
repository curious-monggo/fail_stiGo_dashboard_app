import { Subject } from './../../models/subject/subject';
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
  isCourseFormAddOpen: boolean = false;
  isUpdateChooseActionDialogOpen: boolean = false;
  isUpdateCourseChosen:boolean = true;

  isSubjectsDialogUpdateOpen = false;
  isCoursesDialogUpdateOpen = false;

  is1styearTabClicked = false;
  is2ndyearTabClicked = false;
  is3rdyearTabClicked = false;
  is4thyearTabClicked = false;

  isGrade11TabClicked = false;
  isGrade12TabClicked = false;


  firstYearFirstTermCollection;
  firstYearSecondTermCollection;

  secondYearFirstTermCollection;
  secondYearSecondTermCollection;

  thirdYearFirstTermCollection;
  thirdYearSecondTermCollection;

  fourthYearFirstTermCollection;
  fourthYearSecondTermCollection;

  grade11FirstTermCollection;
  grade11SecondTermCollection;

  grade12FirstTermCollection;
  grade12SecondTermCollection;

  programCollection: Program[];

  programCourseCollectionSubscription: Subscription;
  programStrandCollectionSubscription: Subscription;

  programDocumentId;
  subjectDocumentId;
  subjectDoc;
  programType;

  oldProgram_acronym;


  programDocument: Program = {
    program_photo_url: '',
    program_photo_name: '',
    program_acronym: '',
    program_name: '',
    program_description: '',

    program_timestamp_post_created: '',
    program_timestamp_post_last_updated:'',

    program_author_id: '',
    program_author_name: '',
    program_author_email: '',
    program_author_photo_url: ''
  };
  courseDocument: Course = {
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
  oldCourseDocument: Course;
  subjectDocument: Subject ={
    subject_name: '',
    subject_required_duration: 0,
    subject_duration_declared: 0,
    subject_timestamp_added: '',
    subject_timestamp_last_updated: '',


    subject_author_id: '',
    subject_author_name: '',
    subject_author_email: '',
    subject_author_photo_url: ''
  };

  year_level;
  old_year_level;
  grade;
  old_grade;
  old_term;
  term;
  courseSubjectsCollection;
  strandSubjectsCollection;

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
    // this.getFirstYearFirstTermCourseSubjects();
    // this.getFirstYearSecondTermCourseSubjects();
    // this.firstYearTabClicked();
    // this.programCoursesTabSetToActive();
    // if (this.isProgramCourseTabActive == true) {
    //   this.getProgramCourseCollection();
    // } else if (this.isProgramCourseTabActive == false) {
    //   this.getProgramStrandCollection();
    // }
  }

  ngOnInit() {
    //  if (this.isProgramCourseTabActive == true) {
    //   this.getProgramCourseCollection();
    // } else if (this.isProgramCourseTabActive == false) {
    //   this.getProgramStrandCollection();
    // }  
    this.programCoursesTabSetToActive();
  }
  programCoursesTabSetToActive() {
    this.isProgramCourseTabActive = true;
    this.getProgramCourseCollection();

  }
  programStrandsTabSetToActive() {
    this.isProgramCourseTabActive = false;
    this.getProgramStrandCollection();
  }


  //yearTabs
  firstYearTabClicked(){
    this.getFirstYearFirstTermCourseSubjects();
    this.getFirstYearSecondTermCourseSubjects();
    this.is1styearTabClicked = true;
    this.is2ndyearTabClicked = false;
    this.is3rdyearTabClicked = false;
    this.is4thyearTabClicked = false;

    
  }
  secondYearTabClicked(){
    this.getSecondYearFirstTermCourseSubjects();
    this.getSecondYearSecondTermCourseSubjects();
    this.is1styearTabClicked = false;
    this.is2ndyearTabClicked = true;
    this.is3rdyearTabClicked = false;
    this.is4thyearTabClicked = false;
  }
  thirdYearTabClicked(){
    this.getThirdYearFirstTermCourseSubjects();
    this.getThirdYearSecondTermCourseSubjects();
    this.is1styearTabClicked = false;
    this.is2ndyearTabClicked = false;
    this.is3rdyearTabClicked = true;
    this.is4thyearTabClicked = false;
  }
  fourthYearTabClicked(){
    this.getFourthYearFirstTermCourseSubjects();
    this.getFourthYearSecondTermCourseSubjects();
    this.is1styearTabClicked = false;
    this.is2ndyearTabClicked = false;
    this.is3rdyearTabClicked = false;
    this.is4thyearTabClicked = true;
  }

  grade11TabClicked(){
    this.getG11FirstTermStrandSubjects();
    this.getG11SecondTermStrandSubjects();
    this.isGrade11TabClicked = true;
    this.isGrade12TabClicked = false;
  }
  grade12TabClicked(){
    this.getG12FirstTermStrandSubjects();
    this.getG12SecondTermStrandSubjects();
    this.isGrade11TabClicked = false;
    this.isGrade12TabClicked = true;
  }
  getFirstYearFirstTermCourseSubjects(){
    this.courseService.getFirstYearFirstTermCourseSubjects(this.programDocumentId).subscribe(subjects => {
      this.firstYearFirstTermCollection = subjects;
      console.log(subjects);
    });
  }
  getFirstYearSecondTermCourseSubjects(){
    this.courseService.getFirstYearSecondTermCourseSubjects(this.programDocumentId).subscribe(subjects => {
      this.firstYearSecondTermCollection = subjects;
      console.log(subjects);
    });
  }


  getSecondYearFirstTermCourseSubjects(){
    this.courseService.getSecondYearFirstTermCourseSubjects(this.programDocumentId).subscribe(subjects => {
      this.secondYearFirstTermCollection = subjects;
      console.log(subjects);
    });
  }
  getSecondYearSecondTermCourseSubjects(){
    this.courseService.getSecondYearSecondTermCourseSubjects(this.programDocumentId).subscribe(subjects => {
      this.secondYearSecondTermCollection = subjects;
      console.log(subjects);
    });
  }


  getThirdYearFirstTermCourseSubjects(){
    this.courseService.getThirdYearFirstTermCourseSubjects(this.programDocumentId).subscribe(subjects => {
      this.thirdYearFirstTermCollection = subjects;
      console.log(subjects);
    });
  }
  getThirdYearSecondTermCourseSubjects(){
    this.courseService.getThirdYearSecondTermCourseSubjects(this.programDocumentId).subscribe(subjects => {
      this.thirdYearSecondTermCollection = subjects;
      console.log(subjects);
    });
  }

  getFourthYearFirstTermCourseSubjects(){
    this.courseService.getFourthYearFirstTermCourseSubjects(this.programDocumentId).subscribe(subjects => {
      this.fourthYearFirstTermCollection = subjects;
      console.log(subjects);
    });
  }
  getFourthYearSecondTermCourseSubjects(){
    this.courseService.getFourthYearSecondTermCourseSubjects(this.programDocumentId).subscribe(subjects => {
      this.fourthYearSecondTermCollection = subjects;
      console.log(subjects);
    });
  }

  getG11FirstTermStrandSubjects(){
    this.strandService.getG11FirstTermStrandSubjects(this.programDocumentId).subscribe(subjects => {
      this.grade11FirstTermCollection = subjects;
    });
  }
  getG11SecondTermStrandSubjects(){
    this.strandService.getG11SecondTermStrandSubjects(this.programDocumentId).subscribe(subjects => {
      this.grade11SecondTermCollection = subjects;
    });
  }

  getG12FirstTermStrandSubjects(){
    this.strandService.getG12FirstTermStrandSubjects(this.programDocumentId).subscribe(subjects => {
      this.grade12FirstTermCollection = subjects;
    });
  }
  getG12SecondTermStrandSubjects(){
    this.strandService.getG12SecondTermStrandSubjects(this.programDocumentId).subscribe(subjects => {
      this.grade12SecondTermCollection = subjects;
    });
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

        program_timestamp_post_created: courseDocument.program_timestamp_post_created,
        program_timestamp_post_last_updated:courseDocument.program_timestamp_post_last_updated,

        program_author_id: courseDocument.program_author_id,
        program_author_name: courseDocument.program_author_name,
        program_author_email: courseDocument.program_author_email,
        program_author_photo_url: courseDocument.program_author_photo_url
      };

      this.oldProgram_acronym =  courseDocument.program_acronym;
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

        program_timestamp_post_created: strandDocument.program_timestamp_post_created,
        program_timestamp_post_last_updated:strandDocument.program_timestamp_post_last_updated,

        program_author_id: strandDocument.program_author_id,
        program_author_name: strandDocument.program_author_name,
        program_author_email: strandDocument.program_author_email,
        program_author_photo_url: strandDocument.program_author_photo_url
      };
      this.oldProgram_acronym =  strandDocument.program_acronym;
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
      this.firstYearTabClicked();
    }
    else if (this.isProgramCourseTabActive == false) {
      this.getProgramStrandDocument(programDocumentId);
      this.grade11TabClicked();
    }
  }

  closeProgramsCardDetail() {
    this.isProgramsCardActive = false;
    this.firstYearFirstTermCollection='';
    this.firstYearSecondTermCollection='';
  
    this.secondYearFirstTermCollection='';
    this.secondYearSecondTermCollection='';
  
    this.thirdYearFirstTermCollection='';
    this.thirdYearSecondTermCollection='';
  
    this.fourthYearFirstTermCollection='';
    this.fourthYearSecondTermCollection='';
  
    this.grade11FirstTermCollection='';
    this.grade11SecondTermCollection='';
  
    this.grade12FirstTermCollection='';
    this.grade12SecondTermCollection='';
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

  onSubmitUpdateProgramDocument() {
    // console.log('Obj'+this.newsObj.()); 
    if (this.isProgramCourseTabActive == true) {
      this.courseService.updateCourseDocument(this.programDocumentId, this.programDocument, this.oldProgram_acronym);
    }
    else if (this.isProgramCourseTabActive == false) {
      this.strandService.updateStrandDocument(this.programDocumentId, this.programDocument, this.oldProgram_acronym);
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
    this.courseService.deleteCourseDocument(this.programDocumentId, this.programDocument.program_photo_name, this.programDocument.program_acronym);
    this.closeProgramConfirmDeleteDialog();
  }

  deleteProgramStrandObj() {
    console.log(this.programDocumentId, this.programDocument.program_photo_name);
    this.strandService.deleteStrandDocument(this.programDocumentId, this.programDocument.program_photo_name, this.programDocument.program_acronym);
    this.closeProgramConfirmDeleteDialog();
  }

  openSubjectFormAdd() {
    console.log('test');
    this.isSubjectFormAddOpen = true;
  }
  openCourseFormAdd() {
    console.log('test');
    this.isCourseFormAddOpen = true;
  }
  closeSubjectFormAdd() {
    console.log('test');
    this.subjectDocument = {
      subject_name: '',
      subject_required_duration: 0,
      subject_duration_declared: 0,
      subject_timestamp_added: '',
      subject_timestamp_last_updated: '',
  
  
      subject_author_id: '',
      subject_author_name: '',
      subject_author_email: '',
      subject_author_photo_url: ''
    };
    this.grade = '';
    this.term = '';
    this.isSubjectFormAddOpen = false;
  }
  closeCourseFormAdd() {
    console.log('test');
    this.courseDocument = {
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
    this.year_level = '';
    this.term = '';
    this.isCourseFormAddOpen = false;
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
    console.log('course clicked');
  }

  onUpdateCourseNotClicked() {
    this.isUpdateCourseChosen = false;
    console.log('course not clicked');
  }

  updateCourseWrapper() {
    this.closeUpdateChooseActionDialog();
    if(this.isUpdateCourseChosen == true){
      this.openProgramDocumentDialogUpdate(this.programDocumentId);
    }
    else if(this.isUpdateCourseChosen == false) {
      // this.openSubjectFormAdd();
      console.log('open dapat')
      if(this.isProgramCourseTabActive == true){
        this.openCourseFormAdd();
      }
      else if(this.isProgramCourseTabActive == false){
        this.openSubjectFormAdd();
      }
    }
  }




  openCoursesDialogUpdate( year, term, subjectId){
    this.closeProgramsCardDetail();
    this.subjectDocumentId = subjectId;
    console.log( year, term, subjectId);
    this.getCourseDoc(year,term,subjectId);
    this.isCoursesDialogUpdateOpen = true;
  }
  closeCoursesDialogUpdate(){
    this.isCoursesDialogUpdateOpen = false;
  }
  openSubjectsDialogUpdate( grade, term, subjectId){
    this.closeProgramsCardDetail();
    this.subjectDocumentId = subjectId;
    console.log( grade, term, subjectId);
    this.getSubjectDoc(grade,term,subjectId);
    this.isSubjectsDialogUpdateOpen = true;
  }

  closeSubjectsDialogUpdate(){
    this.isSubjectsDialogUpdateOpen = false;
  }



  getCourseDoc(year_level, term, id){
    this.courseService.getCourseDoc(this.programDocumentId, year_level, term, id).subscribe(courseDoc => {
      this.year_level = year_level; 
      this.term = term;
      this.old_year_level = year_level;
      this.old_term = term;
      this.courseDocument = {
        course_code: courseDoc.course_code,
        course_name: courseDoc.course_name,
        course_units: courseDoc.course_units,
        course_pre_requisites: courseDoc.course_pre_requisites,
    
        course_timestamp_created: courseDoc.course_timestamp_created,
        course_timestamp_last_updated: courseDoc.course_timestamp_last_updated,
    
        course_author_id: courseDoc.course_author_id,
        course_author_name: courseDoc.course_author_name,
        course_author_email: courseDoc.course_author_email,
        course_author_photo_url: courseDoc.course_author_photo_url,
      };
      this.oldCourseDocument = this.courseDocument;
      console.table(courseDoc);
    });
  }
  getSubjectDoc(grade, term, id){
    this.strandService.getSubjectDoc(this.programDocumentId, grade, term, id).subscribe(subjectDoc => {
      this.grade = grade; 
      this.term = term;
      this.old_grade = grade;
      this.old_term = term;
      this.subjectDocument ={
        subject_name: subjectDoc.subject_name,
        subject_required_duration: subjectDoc.subject_required_duration,
        subject_duration_declared: subjectDoc.subject_duration_declared,
        subject_timestamp_added: subjectDoc.subject_timestamp_added,
        subject_timestamp_last_updated: subjectDoc.subject_timestamp_last_updated,
    
    
        subject_author_id: subjectDoc.subject_author_id,
        subject_author_name: subjectDoc.subject_author_name,
        subject_author_email: subjectDoc.subject_author_email,
        subject_author_photo_url: subjectDoc.subject_author_photo_url
      };
      this.oldCourseDocument = this.courseDocument;
      console.table(subjectDoc);
    });
  }

  onSubmitAddSubject() {
    this.subjectDocument.subject_author_id = this.authService.userKey;
    this.subjectDocument.subject_author_email = this.authService.userObj.user_email;
    this.subjectDocument.subject_author_name = this.authService.userObj.user_name;
    this.subjectDocument.subject_author_photo_url = this.authService.userObj.user_photo_url;
    
    this.strandService.addSubject(this.programDocumentId, this.grade, this.term, this.subjectDocument);
    console.log(this.programDocumentId, this.grade, this.term, this.subjectDocument);
    console.table(this.subjectDocument);
    this.closeSubjectFormAdd();
  }
  onSubmitAddCourse() {
    this.courseDocument.course_author_id = this.authService.userKey;
    this.courseDocument.course_author_email = this.authService.userObj.user_email;
    this.courseDocument.course_author_name = this.authService.userObj.user_name;
    this.courseDocument.course_author_photo_url = this.authService.userObj.user_photo_url;
    
    this.courseService.addCourse(this.programDocumentId, this.year_level, this.term, this.courseDocument);
    console.table(this.courseDocument);
    console.log(this.year_level, this.term);
    this.closeCourseFormAdd();
  }
  onSubmitUpdateCourse(){
    if(this.year_level == this.old_year_level && this.term == this.old_term ){
      this.courseService.updateCourse(
        this.programDocumentId,
        this.subjectDocumentId, 
        this.year_level, 
        this.term, 
        this.courseDocument
      );
      console.log('Same paths');
      console.log(this.term, this.old_term, this.year_level, this.old_year_level);
    }
    else {    
      console.log('Different paths');
      console.log(this.term, this.old_term, this.year_level, this.old_year_level);
      this.deleteCourse(this.old_year_level, this.old_term,this.subjectDocumentId);
      this.courseService.updateCourseMovePaths(
        this.programDocumentId,
        this.subjectDocumentId, 
        this.year_level, 
        this.term, 
        this.courseDocument
      );
    }
    this.closeCoursesDialogUpdate();
    this.openProgramsCardDetail(this.programDocumentId);

  }
  onSubmitUpdateSubject(){
    if(this.grade == this.old_grade && this.term == this.old_term ){
      this.strandService.updateSubject(
        this.programDocumentId,
        this.subjectDocumentId, 
        this.grade, 
        this.term, 
        this.subjectDocument
      );
      console.log('Same paths');
      console.log(this.term, this.old_term, this.grade, this.old_grade);
    }
    else {    
      console.log('Different paths');
      console.log(this.term, this.old_term, this.grade, this.old_grade);
      this.deleteSubject(this.old_grade, this.old_term,this.subjectDocumentId);
      this.strandService.updateSubjectMovePaths(
        this.programDocumentId,
        this.subjectDocumentId, 
        this.grade, 
        this.term, 
        this.subjectDocument
      );
    }
    this.closeSubjectsDialogUpdate();
    this.openProgramsCardDetail(this.programDocumentId);

  }
  deleteCourse(year_level,term, subject_id){
    this.courseService.deleteSubject(this.programDocumentId,year_level,term, subject_id);
  }
  deleteSubject(grade,term, subject_id){
    this.strandService.deleteSubject(this.programDocumentId,grade,term, subject_id);
  }
}
