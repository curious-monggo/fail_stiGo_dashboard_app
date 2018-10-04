import { Component, OnInit, ViewChild } from '@angular/core';

import { EventService } from '../../services/event-service/event.service';

import { Event } from './../../models/event/event';

//provider
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-events-page',
  templateUrl: './events-page.component.html',
  styleUrls: ['./events-page.component.css']
})
export class EventsPageComponent implements OnInit {

  isEventsDialogOpen:boolean = false;
  isAttendanceEnabled: boolean = false;

  eventDocument = {
    event_name:'',
    event_date:'',
    event_location:'',
    event_description:'',
    event_time_start:'',
    event_time_end:'',
  //  event_color:'',


    event_author_id:'',
    event_author_photo_url:'',
    event_author_name:'',
    event_author_email:''
  };

  constructor(
    protected eventService:EventService,
    private authService: AuthService
    ) {

  }

  ngOnInit() {

  }
  openEventsDialog() {
    this.isEventsDialogOpen = true;
    console.log(this.isEventsDialogOpen);
  }
  closeEventsDialog() {
    this.isEventsDialogOpen = false;
    console.log(this.isEventsDialogOpen);
    this.clearEventDocOutput();
  }
  enableAttendance(){
    this.isAttendanceEnabled = true;
    console.log(this.isAttendanceEnabled);
  }
  disableAttendance(){
    this.isAttendanceEnabled = false;
    console.log(this.isAttendanceEnabled);
  }
  onSubmitCreateEvent() {
    this.eventDocument.event_author_id = this.authService.userKey;
    this.eventDocument.event_author_photo_url = this.authService.userObj.user_photo_url;
    this.eventDocument.event_author_name = this.authService.userObj.user_name;
    this.eventDocument.event_author_email = this.authService.userObj.user_email;
    
    console.log(this.eventDocument);
    this.eventService.addEventDocument(this.eventDocument, this.isAttendanceEnabled);
    this.closeEventsDialog();
  }
  clearEventDocOutput() {
    this.eventDocument = {
      event_name:'',
      event_date:'',
      event_description:'',
      event_location:'',
      // event_timestamp_post_created:'',
      event_time_start:'',
      event_time_end:'',
      // event_color:'',
  
  
      event_author_id:'',
      event_author_photo_url:'',
      event_author_name:'',
      event_author_email:''
    };
  }
}
