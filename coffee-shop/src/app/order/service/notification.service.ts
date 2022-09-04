import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase} from '@angular/fire/database';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject, Observable, Subject} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CookieService } from 'src/app/login/service/cookie.service';
import { NotificationOfCoffeStore } from '../model/notification';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  keyRemove = [];
  keyArray = [];
  containerMessengeUnread = [];
  registerTokenArray = [];
  registerToken= '';
  role: string = '';
  username: string ='';
  messagedUnread: Observable<any[]>;
  tokenFCM: Observable<any[]>;
  notification: NotificationOfCoffeStore;
  currentMessage= new BehaviorSubject(null);
  date = new Date();
  time = new Date();
  temp;

  constructor(private db: AngularFireDatabase, private angularFireMessaging: AngularFireMessaging,
              private cookieService: CookieService, private afAuth: AngularFireAuth) {
    this.angularFireMessaging.messages.subscribe(
      (_messaging: AngularFireMessaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onMessage = _messaging.onBackgroundMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    )
    // this.writeMessage();
    this.writeMessageUnhandle();
    this.getTokenFromFcm();
  }

  sendNotification(titleContent: string, tableCoffe: string, requestConent: string, object: string){
    this.notification = {
      title: titleContent,
      body: tableCoffe + " yêu cầu " + requestConent,
      role: this.role,
      date: this.date.toLocaleDateString().toString(),
      time: this.time.toLocaleTimeString().toString(),
      status: 'false',
      object: object
    }
    this.db.list("/notification").push(this.notification);
    this.sendNotificationToFirebase();
  }

  sendNotificationToFirebase(){
    const content = {
      to: this.registerToken,
      notification: {
        title: this.notification.title,
        body: this.notification.body
      }
    }
    let option = {
      method: "POST",
      headers: new Headers({
        Authorization: "key=AAAAKtuxL6A:APA91bEWvskL2HJGlxNoQzS8WzamaGshY1_hGxWmfdDPBdcm4iTxTPi86KCbnJ5Jp0trqsJhQXirr8Sq173OrwZlRMFAkGwwixFnVQ9o8zCDZsPrXdrI7cdAgVP5-ysfOEi28WD4O9lb",
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(content)
    }
    fetch("https://fcm.googleapis.com/fcm/send", option).then(res => {
    }).catch(e => {
      console.log("Error");
    });
  }

  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        let user = this.cookieService.getCookie('username');
        let role = this.cookieService.getCookie('role');
        this.registerToken = token;
        this.sendTokenToFcm(user, token, role);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  writeMessage(): string[]{
    let arrayNotifi = [];
    this.messagedUnread = this.db.list("/notification").snapshotChanges();
    this.messagedUnread.subscribe((actions) => {
      arrayNotifi.length = 0;
      actions.forEach(action => {
        this.notification = {
          title: action.payload.val().title,
          body: action.payload.val().body,
          role: action.payload.val().role,
          date: action.payload.val().date,
          time: action.payload.val().time,
          status: action.payload.val().status,
          object: action.payload.val().object
        }
        if(''+this.date.toLocaleDateString() == this.notification.date){
          arrayNotifi.unshift(this.notification);
        }
      });
    });
    return arrayNotifi;
  }

  writeMessageUnhandle(): string[]{
    this.messagedUnread = this.db.list("/notification", ref => ref.orderByChild('status').equalTo('false')).snapshotChanges();
    this.messagedUnread.subscribe((actions) => {
      this.containerMessengeUnread.length = 0;
      actions.forEach(action => {
        this.notification = {
          title: action.payload.val().title,
          body: action.payload.val().body,
          role: action.payload.val().role,
          date: action.payload.val().date,
          time: action.payload.val().time,
          status: action.payload.val().status,
          object: action.payload.val().object
        }
        if(''+this.date.toLocaleDateString() == this.notification.date){
          this.containerMessengeUnread.push(this.notification);
        }
      });
    });
    return this.containerMessengeUnread;
  }

  sendTokenToFcm(user: string, token: string, userrole: string){
    this.registerToken = token;
    const content = {
      user: user,
      token: token,
      userrole: userrole,
      status: "false"
    }
    this.db.list("/token").push(content);
  }

  getTokenFromFcm(){
    this.tokenFCM = this.db.list('/token', ref => ref.orderByChild('userrole').equalTo('ROLE_STAFF')).snapshotChanges();
    this.tokenFCM.subscribe(
      actions => {
        actions.forEach(
          action => {
            this.temp = action.payload.val().token;
            this.registerTokenArray.push(this.temp);
          }
        );
      }
    );
    this.registerTokenArray.forEach(items => {
      this.registerToken = items;
    });
  }

  // update notification
  updateNotification(object: string){
    this.messagedUnread = this.db.list("/notification", ref => ref.orderByChild('status').equalTo('false')).snapshotChanges();
    this.messagedUnread.subscribe((actions) => {
      actions.forEach(action => {
        if(action.payload.val().title == 'Gọi phục vụ' && action.payload.val().object == object){
          this.keyRemove.push(action.key);
          this.deleteNotification();
        }
      });
    });
  }

  deleteNotification(){
    for(let item of this.keyRemove){
      this.db.list("/notification").update(item, {'status': 'true'})
    }
  }
}
