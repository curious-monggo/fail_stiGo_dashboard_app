import { Component, OnInit, ViewChild } from '@angular/core';

import { EventService } from './../../services/event-service/event.service';


import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';

import { Observable } from 'rxjs';
import { of } from 'rxjs';



@Component({
  selector: 'app-event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.css']
})
export class EventCalendarComponent implements OnInit {

  events:any=[];
  test=null;
  calendarOptions: Options;
  isEventClicked =false;
  eventDocument = {
    event_author_email: '',
    event_author_id: '',
    event_author_name: '',
    event_author_photo_url: '',
    event_date: '',
    event_description: '',
    event_location:'',
    event_name: '',
    event_time_end: '',
    event_time_start: '',
    event_color:''
    // event_timestamp_post_created: Object
  };
  eventId;

  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
  constructor(private eventService: EventService) {

    
  }
   ngOnInit() {
    this.getEventsCollection();
    this.calendarOptions = {
      editable: false,
      eventLimit: false,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listMonth'
      },
        events: []
    };
    
  }

  getEventsCollection(){
   // this.events =[];
    this.eventService.getEventsCollection().subscribe(eventCollection => {
      this.events =[];
      console.log(eventCollection)
      eventCollection.forEach(event => {
        // console.log(event);
        console.log(event.id)
        let fullCalendarEvent = {
          id: event.id,
          title: event.event_name,
          start: event.event_date,
          color: event.event_color,
        }
        console.log(fullCalendarEvent)       
        this.events.push(fullCalendarEvent);
      })
      
      // this.getEventsCollection();
      console.log('test');
      this.test = this.events;
    });
  }
  getEventDocument(eventId){
    this.eventService.getEventDocument(eventId).subscribe(eventDoc => {
      console.log(eventDoc);
      this.eventDocument = {
        event_author_email: eventDoc.event_author_email,
        event_author_id: eventDoc.event_author_id,
        event_author_name: eventDoc.event_author_name,
        event_author_photo_url: eventDoc.event_author_photo_url,
        event_date: eventDoc.event_date,
        event_description: eventDoc.event_description,
        event_location: eventDoc.event_location,
        event_name: eventDoc.event_name,
        event_time_end: eventDoc.event_time_end,
        event_time_start: eventDoc.event_time_start,
        event_color: eventDoc.event_color
        // event_timestamp_post_created: Object
      };
    });
  }
  eventClick(eventArgs){
    console.log(eventArgs.event.id);
    this.eventId = eventArgs.event.id;
    this.getEventDocument(eventArgs.event.id);
    this.isEventClicked = true;

  }
  updateEvent(eventArgs){
    console.log(eventArgs);
  }
  clickButton(eventArgs){
    console.log(eventArgs);
  }
  closeEventsDialog(){
    this.isEventClicked = false;
    this.eventId = null;
  }
  onSubmitUpdateEventDocument(){
    console.log('id'+this.eventId);
    
    this.eventService.updateEventDocument(this.eventId, this.eventDocument);
    this.closeEventsDialog();
  }
  deleteEvent(){
    this.eventService.deleteEventDocument(this.eventId);
    this.closeEventsDialog();
  }
}
