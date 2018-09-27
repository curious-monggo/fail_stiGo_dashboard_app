import { Injectable } from '@angular/core';

//auth
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { Observable } from 'rxjs';

//model
import { User } from '../../models/user/user';

//Router
import { Router } from '@angular/router';

//user service<secondary>
import { UserService } from '../user-service/user.service';


//components
import { NewsCardComponent } from '../../components/news-card/news-card.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authState;
  userKey;
  photo;
  user_type;

  userObj: User = {
    user_name: '',
    user_email:'',
    user_photo_url: '',
    user_type:''
  };


  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private userService: UserService,


    private newsCardComponent: NewsCardComponent
  ) {
      this.checkAuth();
   }
   checkAuth() {
    this.afAuth.authState.subscribe((user) => {
      if(user) {
        this.userObj.user_name = user.displayName;
        this.userObj.user_email = user.email;
        this.userObj.user_photo_url = user.photoURL;
        this.userKey = user.uid;
       // this.userObj.user_photo_url = user.photoURL;
        this.userService.getUserDocument(this.userKey).subscribe(user => {
          this.user_type = user.user_type
        });
        
        console.log(user);
        // this.userService.addUserDocument(this.userKey, this.userObj);
        this.router.navigateByUrl('/news');
      } 
      else {
  
        this.router.navigateByUrl('/login');
      }
    }); 
  }
  // getUserID(key:string){

  // }
  facebookLogin(){
    const provider = new auth.FacebookAuthProvider();
    return this.socialLogin(provider);
  }
  googleLogin(){
    const provider = new auth.GoogleAuthProvider();
    return this.socialLogin(provider);
  }
  private socialLogin(provider){
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.authState = credential.user;
        
        this.userObj.user_name = this.authState.displayName;
        this.userObj.user_email = this.authState.email;
        this.userObj.user_photo_url = this.authState.photoURL;
        this.userKey =  this.authState.uid;

        this.userService.addUserDocument(this.userKey, this.userObj);

      })
      .catch(error => console.log(error));
  }
  logOut(){
    //need to wrap in an if for catching undefined values
    //this.newsCardComponent.newsCollectionSubscription.unsubscribe();
    //this.userService.userObjSubscription.unsubscribe();
    this.afAuth.auth.signOut();
    
    this.router.navigateByUrl('/');
  }
}
