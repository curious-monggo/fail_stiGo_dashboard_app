export interface Event {
    id?:string;

    event_photo_url?:string;
    event_photo_name?:string;


    event_name?:string;
    event_date?:string;
    event_location?:string;
    event_description?:string;
    event_timestamp_post_created:any;
    event_timestamp_post_last_updated:any;
    // event_color?:string,
    
    event_time_start?:string;
    event_time_end?:string;
    //event author
    event_author_id?:string;
    event_author_photo_url?:string;
    event_author_name?:string;
    event_author_email?:string;
}