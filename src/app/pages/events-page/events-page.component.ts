import { Component, OnInit, ViewChild } from '@angular/core';

import { EventService } from '../../services/event-service/event.service';

import { Event } from './../../models/event/event';

//provider
import { AuthService } from '../../services/auth-service/auth.service';
import { Observable, of } from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-events-page',
  templateUrl: './events-page.component.html',
  styleUrls: ['./events-page.component.css']
})
export class EventsPageComponent implements OnInit {

  isEventsDialogOpen:boolean = false;
  isAttendanceEnabled: boolean = false;
  isEventsDialogFormButtonDisabled: boolean = false;

  eventDocument = {
    event_name:'',
    event_date:'',
    event_location:'',
    event_description:'',
    event_time_start:'',
    event_time_end:'',
  //  event_color:'',
    event_photo_url:'',
    event_photo_name:'',

    event_author_id:'',
    event_author_photo_url:'',
    event_author_name:'',
    event_author_email:''
  };
  //file vars
  uploadPercent: Observable<number>;
  file: any;
  fileName;
  pushId;
  fileRef;
  constructor(
    protected eventService:EventService,
    private authService: AuthService,
    private storage: AngularFireStorage,
    private afDB: AngularFirestore,
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
  
      event_photo_url:'',
      event_photo_name:'',
      event_author_id:'',
      event_author_photo_url:'',
      event_author_name:'',
      event_author_email:''
    };
    this.uploadPercent = null;
    this.file = null;
    this.fileName;

    this.pushId = null;

    this.fileRef = null;
    this.isEventsDialogFormButtonDisabled = false;
  }

  uploadHandler(event) {
  

    if(event.target.files[0].name !== undefined){
      this.isEventsDialogFormButtonDisabled = true;
      this.file = event.target.files[0];
      this.fileName = event.target.files[0].name;
      this.eventDocument.event_photo_name = this.fileName;
      this.pushId = this.afDB.createId();
      console.log('id used', this.pushId);
      this.fileRef = this.storage.ref('stiGo/events/' + this.pushId + '/' + this.fileName);
      let task = this.fileRef.put(this.file);
      this.uploadPercent = task.percentageChanges();
      task.then(snapshot => {
        this.fileRef.getDownloadURL().subscribe(url => {
          if (url !== null) {
            this.eventDocument.event_photo_url = url;
            console.log(url);
            this.isEventsDialogFormButtonDisabled = false;
            return true;
          }
        }, (error) => {
          console.log('Error on get url, will delete', error);
          this.storage.ref('stiGo/events/' + this.pushId + '/' + this.fileName).delete();
          this.closeEventsDialog();
          return of(false);
        });
      });
    } else {
      return false;
    }

  }
  onSubmitCreateEvent() {
    if(this.pushId == null){
      this.pushId = this.afDB.createId();
    }
    this.eventDocument.event_author_id = this.authService.userKey;
    this.eventDocument.event_author_photo_url = this.authService.userObj.user_photo_url;
    this.eventDocument.event_author_name = this.authService.userObj.user_name;
    this.eventDocument.event_author_email = this.authService.userObj.user_email;
    
    console.log(this.eventDocument);
    this.eventService.addEventDocument(this.eventDocument, this.isAttendanceEnabled);
    this.closeEventsDialog();
  }

}
