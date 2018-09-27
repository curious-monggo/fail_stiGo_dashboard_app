import { Component, OnInit } from '@angular/core';

//Storage
import { AngularFireStorage } from 'angularfire2/storage';

//model
import { News } from '../../models/news/news';

//service
import { NewsService } from '../../services/news-service/news.service';

//for unsubscribing
import { Subscription, Observable, of } from 'rxjs';

//for form reset
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.css']
})
export class NewsCardComponent implements OnInit {
  isNewsCardOpen:boolean = false;
  isNewsUpdateDialogOpen:boolean = false;
  isNewsConfirmDeleteDialogOpen = false;
  isNewsDialogFormButtonDisabled = true;
  isNewsImageAvailable = true;

  newsCollection:News[];

  newsCollectionSubscription:Subscription;

  newsDocumentId;


  newsDocument = {
    news_photo_name:'',
    news_photo_url:'',
    news_title:'',
    news_content:'',

    // news_timestamp_post_created:'',
    // news_timestamp_post_last_updated:'',
    
    news_author_id:'',
    news_author_photo_url:'',
    news_author_name:'',
    news_author_email:''
  };

  uploadPercent: Observable<number>;
  file:any;
  fileName;
  fileRef;
  dateTimeCreated;
  dateTimeLastUpdated;



  constructor(
    private newsService: NewsService,
    private storage: AngularFireStorage
  ) {

    
  }

  ngOnInit(){
    this.getNewsCollection();
  }

  test(){
    console.log('Please reload');
  }

  getNewsCollection() {
    this.newsCollectionSubscription = this.newsService.getNewsCollection().
    subscribe(newsCollection => {
      this.newsCollection = newsCollection;
      console.log('test',newsCollection);
    });
  }
  getNewsDocument(newsDocumentId:string){
    this.newsService.getNewsDocument(newsDocumentId).subscribe(newsDocument => {

      console.log('getnewsdicid',newsDocumentId);
      this.newsDocumentId = newsDocumentId;

      // let dateCreated = new Date(newsDocument.news_timestamp_post_created.toDate());
      // let convertDateCreatedToLocale = dateCreated.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric', year: 'numeric' });
      // console.log(dateCreated);

      this.dateTimeCreated = newsDocument.news_timestamp_post_created;

      // // let dateLastUpdated = new Date(newsDocument.news_timestamp_post_last_updated.toDate());
      // // let convertDateLastUpdatedToLocale = dateLastUpdated.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric', year: 'numeric' });
      // // console.log(dateLastUpdated);

      this.dateTimeLastUpdated = newsDocument.news_timestamp_post_last_updated;
      console.log(newsDocument);

      this.newsDocument = {
        news_photo_name:newsDocument.news_photo_name,
        news_photo_url:newsDocument.news_photo_url,
        news_title:newsDocument.news_title,
        news_content:newsDocument.news_content,

        // news_timestamp_post_created:this.dateTimeCreated,
        // news_timestamp_post_last_updated:this.dateTimeLastUpdated,
        news_author_id:newsDocument.news_author_id,
        news_author_photo_url:newsDocument.news_author_photo_url,
        news_author_name:newsDocument.news_author_name,
        news_author_email:newsDocument.news_author_email
      };
    });

    
  }
  onChangeImageHandler(event) {
    this.isNewsDialogFormButtonDisabled = true;
    this.fileRef = this.storage.ref('stiGo/news/'+this.newsDocumentId+'/'+this.newsDocument.news_photo_name).delete();

    this.file = event.target.files[0];
    this.fileName = event.target.files[0].name;

    this.newsDocument.news_photo_name = this.fileName;

    this.fileRef = this.storage.ref('stiGo/news/'+this.newsDocumentId+'/'+this.newsDocument.news_photo_name);

    let task = this.fileRef.put(this.file);
    this.uploadPercent = task.percentageChanges();
    task.then(snapshot =>{
      this.fileRef.getDownloadURL().subscribe(url =>{
        if(url){
          this.newsDocument.news_photo_url = url;
          console.log(url);
          this.isNewsDialogFormButtonDisabled = false;
          return true;
        }  
      }, (error)=>{
          console.log('Error on get url, will delete',error);
          this.storage.ref('stiGo/news/'+this.newsDocumentId+'/'+this.fileName).delete();
          this.closeNewsDialogUpdate();
          return of(false);
      });
    });
  }

  clearNewsDocOutput() {
    this.newsDocument = {
      news_photo_name:'',
      news_photo_url:'',
      news_title:'',
      news_content:'',
  
      // news_timestamp_post_created:'',
        // news_timestamp_post_created:'',
        // news_timestamp_post_last_updated:'',
      news_author_id:'',  
      news_author_photo_url:'',
      news_author_name:'',
      news_author_email:''
    };
  }
  openNewsCardDetail(newsDocumentId:string) {
    this.isNewsCardOpen = true;
    this.newsDocumentId = newsDocumentId;
    console.log(newsDocumentId);
    this.getNewsDocument(newsDocumentId);
  }
  closeNewsCardDetail() {
    this.isNewsCardOpen = false;
    this.clearNewsDocOutput();
    //setting to null creates errors. minor fix needed. patch for now
  }
  hideImage(){
    this.isNewsImageAvailable = false;
  }
  showImage(){
    this.isNewsImageAvailable = true;
  }

  openNewsDialogUpdate(newsDocumentId:string) {
    this.isNewsUpdateDialogOpen = true;
    this.isNewsDialogFormButtonDisabled = false;
    this.newsDocumentId = newsDocumentId;
    // this.newsPageComponent.getNewsObj(newsId);
    this.getNewsDocument(newsDocumentId);
  }
  closeNewsDialogUpdate() {
    this.uploadPercent = null;
    this.file = null;
    this.fileName = null;

  
    this.fileRef = null;
    this.newsDocumentId = null;
    this.isNewsUpdateDialogOpen = false;
    
  }

  openNewsConfirmDeleteDialog(newsDocumentId:string) {
    this.getNewsDocument(newsDocumentId);
    this.isNewsConfirmDeleteDialogOpen = true;
    this.newsDocumentId = newsDocumentId;
    console.log(newsDocumentId);
  }
  closeNewsConfirmDeleteDialog() {
    this.isNewsConfirmDeleteDialogOpen = false;
  }
  onSubmitUpdateNewsDocument(newsForm: NgForm) {
    console.log('id'+this.newsDocumentId);
    this.newsService.updateNewsDocument(this.newsDocumentId, this.newsDocument);
    this.closeNewsDialogUpdate();
    // newsForm.reset();
  }

  deleteNewsDocument() {
    this.newsService.deleteNewsDocument(this.newsDocumentId, this.newsDocument.news_photo_name);
    this.closeNewsConfirmDeleteDialog();
  }

}
