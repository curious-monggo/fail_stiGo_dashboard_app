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
  courseList;
  attendanceList;
  private sub: any;
  eventId;
  courseSelected;
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
  //  this.getProgramCourseCollection();

  }
  programStrandsTabSetToActive() {
    this.isProgramCourseTabActive = false;
   // this.getProgramStrandCollection();
  }
  getAvailableCourses(){
    this.attendanceService.getProgramsCoursesAttended().subscribe(courses => {
      this.courseList = courses.currently_available_courses;
      console.log(this.courseList);
    });
  }
  getAttendanceList(course){
    this.attendanceService.getAttendanceList(this.eventId,course).subscribe(list => {
      console.log(list);
      this.attendanceList = list;
      this.courseSelected = course;
      
    })
  }

  getCourseAttendanceList(course){
    console.log(course);
    
  }
}
