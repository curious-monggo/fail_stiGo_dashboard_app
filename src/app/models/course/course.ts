export interface Course {
    id?:string;
    course_code?:string;
    course_name?:string;
    course_units?:number;
    course_pre_requisites?:string;

    course_timestamp_created?:any;
    course_timestamp_last_updated?:any;

    course_author_id?:string;
    course_author_name?:string;
    course_author_email?:string;
    course_author_photo_url?:string;
};