
import { Component, OnInit, ViewChild } from '@angular/core';

import { EventService } from './../../services/event-service/event.service';


import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';

import { Observable } from 'rxjs';
import { of } from 'rxjs';


import { Router } from '@angular/router';
import { AngularFireStorage } from 'angularfire2/storage';


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
  isUpdateChooseActionDialogOpen = false;
  isUpdateEventChosen = true;
  isUpdateEventDialogOpen = false;
  isEventDialogFormButtonDisabled = true;
  isEventImageAvailable = true;

  uploadPercent: Observable<number>;
  file:any;
  fileName;
  fileRef;

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
    event_photo_url: '',
    event_photo_name: '',
    // event_color:''
    // event_timestamp_post_created: Object
  };
  eventId;

  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
  constructor(private eventService: EventService, private router: Router, private storage: AngularFireStorage) {

    
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


  openUpdateChooseActionDialog(){
    this.isUpdateChooseActionDialogOpen = true;
  }

  closeUpdateChooseActionDialog(){
    this.isUpdateChooseActionDialogOpen = false;
  }

  openUpdateEventDialogOpen(){
    this.isUpdateEventDialogOpen = true;
  }

  closeUpdateEventDialogOpen(){
    this.isUpdateEventDialogOpen = false;
  }

  onUpdateEventClicked(){
    this.isUpdateEventChosen = true;
  }

  onUpdateEventNotClicked(){
    this.isUpdateEventChosen = false;
  }

  updateEventWrapper(){
    this.closeUpdateChooseActionDialog();
    if(this.isUpdateEventChosen == true){
      this.openUpdateEventDialogOpen();
    }
    else if(this.isUpdateEventChosen == false){
      console.log('Present attendance list');
      //this.router.navigateByUrl('attendance');
      this.router.navigate(['/attendance', this.eventId]);
    }
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
          // color: event.event_color,
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
        event_photo_url: eventDoc.event_photo_url,
        event_photo_name: eventDoc.event_photo_name,
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
        // event_color: eventDoc.event_color
        // event_timestamp_post_created: Object
      };
    });
  }
  eventClick(eventArgs){
    console.log(eventArgs.event.id);
    this.eventId = eventArgs.event.id;
    this.getEventDocument(eventArgs.event.id);
    this.isEventClicked = true;
    this.openUpdateChooseActionDialog();

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
    this.closeUpdateEventDialogOpen();
  }
  hideImage(){
    this.isEventImageAvailable = false;
  }
  showImage(){
    this.isEventImageAvailable = true;
  }
  
  onChangeImageHandler(event) {
    this.isEventDialogFormButtonDisabled = true;
    this.fileRef = this.storage.ref('stiGo/events/'+this.eventId+'/'+this.eventDocument.event_photo_name).delete();

    this.file = event.target.files[0];
    this.fileName = event.target.files[0].name;

    this.eventDocument.event_photo_name = this.fileName;

    this.fileRef = this.storage.ref('stiGo/events/'+this.eventId+'/'+this.eventDocument.event_photo_name);

    let task = this.fileRef.put(this.file);
    this.uploadPercent = task.percentageChanges();
    task.then(snapshot =>{
      this.fileRef.getDownloadURL().subscribe(url =>{
        if(url){
          this.eventDocument.event_photo_url = url;
          console.log(url);
          this.isEventDialogFormButtonDisabled = false;
          return true;
        }  
      }, (error)=>{
          console.log('Error on get url, will delete',error);
          this.storage.ref('stiGo/events/'+this.eventId+'/'+this.fileName).delete();
          this.closeEventsDialog();
          return of(false);
      });
    });
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
