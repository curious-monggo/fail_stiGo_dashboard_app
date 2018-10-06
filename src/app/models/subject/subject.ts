export interface Subject {
    id?:string;
    subject_name?:string;
    subject_required_duration?:number;
    subject_duration_declared?:number;
    subject_timestamp_added?:string;
    subject_timestamp_last_updated?:string;



    subject_author_id?:string;
    subject_author_name?:string;
    subject_author_email?:string;
    subject_author_photo_url?:string;
}