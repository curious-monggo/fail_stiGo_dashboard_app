import { Component, OnInit } from '@angular/core';
import { AttendanceService } from './../../services/attendance-service/attendance.service';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-attendance-page',
  templateUrl: './attendance-page.component.html',
  styleUrls: ['./attendance-page.component.css']
})
export class AttendancePageComponent implements OnInit {
  isProgramCourseTabActive: boolean = true;
  availablePrograms;
  attendanceList;
  private sub: any;
  eventId;
  programSelected;
  constructor(private attendanceService: AttendanceService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.eventId = params['id'];
      console.log(this.eventId);
    })
    this.getAvailableCourses();
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  programCoursesTabSetToActive() {
    this.isProgramCourseTabActive = true;
    console.log(this.isProgramCourseTabActive);
    this.getAvailableCourses();
    
  //  this.getProgramCourseCollection();

  }
  programStrandsTabSetToActive() {
    this.isProgramCourseTabActive = false;
   // this.getProgramStrandCollection();
   this.getAvailableStrands();
   console.log(this.isProgramCourseTabActive);
  }
  getAvailableCourses(){
    this.attendanceService.getProgramsCoursesAttended().subscribe(courses => {
      this.availablePrograms = courses.currently_available_courses;
      console.log(this.availablePrograms);
    });
  }
  getAvailableStrands(){
    this.attendanceService.getProgramsStrandsAttended().subscribe(strands => {
      this.availablePrograms = strands.currently_available_strands;
      console.log(this.availablePrograms);
    });
  }
  getAttendanceList(program){
    this.attendanceService.getAttendanceList(this.eventId,program).subscribe(list => {
      console.log(list);
      this.attendanceList = list;
      this.programSelected = program;
      
    })
  }

  // getCourseAttendanceList(course){
  //   console.log(course);
    
  // }
}
