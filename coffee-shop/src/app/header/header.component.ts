import {Component, OnDestroy, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {CookieService} from '../login/service/cookie.service';
import {LogoutService} from '../login/service/logout.service';
import {Router} from '@angular/router';
import {CommonService} from '../login/service/common.service';
import {Subscription} from 'rxjs';
import {NotificationService} from '../order/service/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  role: string = '';
  username: string = '';
  token: string = '';
  messageReceived: any;
  notification = [];
  selected = false;
  notificationNotHandle = [];
  private subscriptionName: Subscription;

  constructor(private cookieService: CookieService,
              private toastrService: ToastrService,
              private logoutService: LogoutService,
              private router: Router,
              private commonService: CommonService,
              private notificationService: NotificationService) {
    this.role = this.readCookieService('role');
    this.username = this.readCookieService('username');
    this.token = this.readCookieService('jwToken');
    // subscribe to sender component messages
    this.subscriptionName = this.commonService.getUpdate().subscribe(message => {
      this.messageReceived = message;
      this.role = this.readCookieService('role');
      this.username = this.readCookieService('username');
      this.token = this.readCookieService('jwToken');
    });
    this.notificationUnHandle();
    this.watchNotification();
  }

  ngOnInit(): void {

  }

  /**
   * @date 14/08/2022
   * @author PhuongTd
   * @param key
   */
  readCookieService(key: string): string {
    return this.cookieService.getCookie(key);
  }

  onLogout() {
    setTimeout(() => {
      if (this.cookieService.getCookie('jwToken') != null) {
        this.logoutService.onLogout(this.cookieService.getCookie('jwToken')).subscribe(() => {
          this.cookieService.deleteAllCookies();
          this.cookieService.removeAllCookies();
        }, error => {
          switch (error.error) {
            case 'isLogout':
              this.toastrService.warning('B???n ch??a ????ng nh???p!');
              break;
            case 'LoginExpired':
              this.cookieService.deleteAllCookies();
              this.router.navigateByUrl('/login').then(() => {
                this.toastrService.warning('H???t phi??n ????ng nh???p vui l??ng ????ng nh???p l???i!');
                this.sendMessage();
              });
              break;
            default:
              this.cookieService.deleteAllCookies();
              this.cookieService.removeAllCookies();
              this.router.navigateByUrl('/login').then(() => {
                this.toastrService.warning('H???t phi??n ????ng nh???p vui l??ng ????ng nh???p l???i!');
                this.sendMessage();
              });
              break;
          }
        }, () => {
          this.router.navigateByUrl('/login').then(() => {
            this.toastrService.success('????ng xu???t th??nh c??ng!');
            this.sendMessage();
          });
        });
      } else {
        this.toastrService.warning('B???n ch??a ????ng nh???p!');
      }
    }, 1000)
    this.router.navigateByUrl("/loading").then(() => {
    })
  }

  ngOnDestroy(): void {
    this.subscriptionName.unsubscribe();
  }

  sendMessage(): void {
    // send message to subscribers via observable subject
    this.commonService.sendUpdate('????ng Xu???t th??nh c??ng!');
  }

  watchNotification() {
    this.notification.length = 0;
    this.notification = this.notificationService.writeMessage();
    console.log(this.notification)
  }

  notificationUnHandle() {
    this.notificationNotHandle = this.notificationService.writeMessageUnhandle();
  }

  showNotificationTable() {
    if (this.selected == false) {
      this.selected = true;
      this.watchNotification();
    } else {
      this.selected = false;
    }
  }

  handleNotification(obj: string ) {
    this.notificationService.updateNotification(obj);
    window.location.reload();
  }
}







