import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { OrderListAnsw } from '../models/order-list-answ';
import { OrderListReq } from '../models/order-list-req';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/common/services/store/store.service';
import { OrderService } from '../services/order/order.service';
import { TokenService } from 'src/app/common/services/token/token.service';
import { SnackbarService } from 'src/app/common/services/snackbar/snackbar.service';
import { NgScrollbar } from 'ngx-scrollbar';
import { Location } from "@angular/common";
import { FindOrderReq } from '../models/find-order-req';
import { ToCassa } from '../models/to-cassa';
import { timer } from 'rxjs';
import { PauseOrderReq } from '../models/pause-order-req';
import { OrderSearchService } from 'src/app/common/services/order-search/order-search.service';
import { TimerService } from 'src/app/common/services/timer/timer.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmReturnProductComponent } from '../dialog-windows/confirm-return-product/confirm-return-product.component';
import { environment } from 'src/environments/environment';
import { element } from 'protractor';
import { ThrowStmt } from '@angular/compiler';
import { FindOrderByAdReq } from '../models/find-order-by-ad-req';

@Component({
  selector: 'app-order-list-form',
  templateUrl: './order-list-form.component.html',
  styleUrls: ['./order-list-form.component.scss']
})
export class OrderListFormComponent implements OnInit {

  @Input() data: string;
  @Output() onChanged = new EventEmitter<Array<OrderListAnsw>>();



  @ViewChild(NgScrollbar) scrollbarRef: NgScrollbar;

  orderListAnsw: Array<OrderListAnsw> = [];
  idShops: Array<any> = [
    { index: 0, id: '%' },
    { index: 1, id: '11' },
    { index: 2, id: '8' },
    { index: 3, id: '22' },
    { index: 4, id: '25' },
    { index: 5, id: '21' },
    { index: 6, id: '31' },
    { index: 7, id: '33' },
    { index: 8, id: '18' },
    { index: 9, id: '24' },
    { index: 10, id: '32' },
    { index: 11, id: '34' }
  ];
  listStatus: Array<any> = [
    { path: '/orders/ready-build', status: 'gs' },
    { path: '/orders/uncompleted', status: 'ns' },
    { path: '/orders/ready-shipment', status: 'rs' },
    { path: '/orders/canceled', status: 'os' },
    { path: '/orders/archive', status: 'as' }
  ];

  displayedColumns = ['check', 'status', 'name', 'client', 'collector', 'place', 'note', 'action', 'repeatStatus'];
  countRecord = 0;
  scrollHeight = 1350;
  splitElement = ';';
  confirmText: string = '????';
  cancelText: string = '??????';
  cancelClicked = false;
  confirmClicked = false;
  isAdminIshop = false;
  searchValue: any = null;

  checkColumn: boolean = false;
  listOrders: Array<OrderListAnsw> = [];

  messageNoConnect = '?????? ????????????????????, ???????????????????? ??????????.';
  action = 'Ok';
  styleNoConnect = 'red-snackbar';

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private location: Location,
    private timerService: TimerService,
    private storeService: StoreService,
    private orderService: OrderService,
    private tokenService: TokenService,
    private snackbarService: SnackbarService,
    private orderSearchService: OrderSearchService,
  ) {
    this.orderSearchService.events$.forEach(value => {

      this.searchOrder(value)
    });
    this.timerService.events$.forEach(value => {
      if (value) {
        this.loadData(value);
        this.countRecord = 0;
      }
    });
  }

  ngOnInit(): void {
    this.loadData(this.searchValue);
    this.isAdminIshop = this.getAdminIshop();
  }

  loadData(value) {
    if (!value) {
      let orderListReq = new OrderListReq(this.tokenService.getToken(), this.data ?? '%', this.getStatus() ?? 'gs', this.countRecord.toString());
      this.orderService.getOrders(orderListReq).subscribe(response => {
        if (response) {
          this.orderListAnsw = response;
          console.log(this.orderListAnsw);
        }
      },
        error => {
          console.log(error);
          this.snackbarService.openSnackBar(this.messageNoConnect, this.action, this.styleNoConnect);
        });
    }
    else {
      if (this.data === this.getShop(value)) {
        let orderListReq = new OrderListReq(this.tokenService.getToken(), this.data, this.getStatus() ?? 'gs', this.countRecord.toString());
        this.orderService.getOrders(orderListReq).subscribe(response => {
          if (response) {
            this.orderListAnsw = response;
          }
        },
          error => {
            console.log(error);
            this.snackbarService.openSnackBar(this.messageNoConnect, this.action, this.styleNoConnect);
          });
      }
    }
  }

  ngAfterViewInit() {
    this.scrollbarRef.scrolled.subscribe(e => { console.log(e); this.onScroll(e) });
  }

  onScroll($event) {
    let tempScrollPercent = $event.currentTarget.scrollTop * 100 / this.scrollHeight;
    if (tempScrollPercent > 85) {
      this.dynamicLoadScroll();
      this.scrollHeight = this.scrollHeight + 1600;
    }
  }

  dynamicLoadScroll() {
    if (this.orderListAnsw.length >= this.countRecord) {
      this.countRecord = this.countRecord + 40;
      this.scrollHeight = this.scrollHeight + this.countRecord;
      let orderListReq = new OrderListReq(this.tokenService.getToken(), this.data ?? '%', this.getStatus() ?? 'gs', this.countRecord.toString());
      this.orderService.getOrders(orderListReq).subscribe(response => {
        if (response) {
          this.orderListAnsw = this.orderListAnsw.concat(response);
        }
      },
        error => {
          console.log(error);
          this.snackbarService.openSnackBar(this.messageNoConnect, this.action, this.styleNoConnect);
        });
    }
  }

  getStatus() {
    return this.listStatus.find(element => element.path === this.location.path()).status;
  }

  getShop(index) {
    return index ? this.idShops.find(element => element.index === index).id : '%';
  }

  searchOrder(searchValue: any) {
    if (searchValue.order) {
      if (searchValue.order && this.getShop(searchValue.shop) === this.data) {
        this.searchValue = searchValue;
        if (this.searchValue.check === false) {
          let findOrderReq = new FindOrderReq(this.tokenService.getToken(), searchValue.order, this.data);
          this.orderService.orderSearch(findOrderReq).subscribe(response => {
            if (response) {
              this.orderListAnsw = response;
            }
          },
            error => {
              console.log(error);
              this.snackbarService.openSnackBar(this.messageNoConnect, this.action, this.styleNoConnect);
            });
        } else {
          let findOrderByAd = new FindOrderByAdReq(this.tokenService.getToken(), searchValue.order, this.data);
          this.orderService.orderSearchByAdres(findOrderByAd).subscribe(response => {
            if (response) {
              this.orderListAnsw = response;
              console.log('>>>>>' + this.orderListAnsw);
            }
          },
            error => {
              console.log(error);
              this.snackbarService.openSnackBar(this.messageNoConnect, this.action, this.styleNoConnect);
            });
        }
      }
    } else {
      this.loadData(null);
    }
  }

  onClickPauseOrGo(element: OrderListAnsw) {
    let pauseOrderReq = new PauseOrderReq(this.tokenService.getToken(), element.order.sub_num);
    this.orderService.orderPause(pauseOrderReq).subscribe(response => {
      if (response.status) {
        if (element.status === '???? ????????????')
          element.status = '??????????????';
        else
          if (element.status === '??????????????')
            element.status = '???? ????????????';
      }
    },
      error => {
        console.log(error);
      });
  }

  onClickShow(id) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/order/${id}`])
    );
    window.open(url, "_blank");
  }

  onClickWriteToCashbox(element: OrderListAnsw) {
    element.order.isCassaPause = true;
    let t = timer(0, 1000).subscribe(vl => {
      console.log(vl);
      if (vl >= 20) {
        element.order.isCassaPause = false;
        t.unsubscribe();
      }
    });
    let toCassa = new ToCassa(this.tokenService.getToken(), element.order.num, element.order.sub_num);
    this.orderService.orderWriteToCashbox(toCassa).subscribe(response => {
      if (response.status === 'true') {
        this.snackbarService.openSnackBar('?????????? ?????????????? ?? ??????????!', this.action);
      }
    },
      error => {
        console.log(error);
        this.snackbarService.openSnackBar(this.messageNoConnect, this.action, this.styleNoConnect);
      });
  }

  turnOnCheckColumn(e) {
    this.checkColumn = e;
    if (e === false) {
      this.cleanListOrders();
      this.onChanged.emit(this.listOrders);
    }
  }

  selectOrder(element: OrderListAnsw) {
    if (!this.listOrders.includes(element))
      this.listOrders.push(element);
    else
      if (this.listOrders.includes(element))
        this.removeOrderFromListOrders(element);
    this.onChanged.emit(this.listOrders);
  }

  removeOrderFromListOrders(element: OrderListAnsw): void {
    this.listOrders = this.listOrders.filter(e => e.id !== element.id);
  }

  cleanListOrders() {
    this.listOrders = [];
  }

  onClickReturnProduct(element: OrderListAnsw) {
    const dialogRef = this.dialog.open(ConfirmReturnProductComponent, {
      width: "60%",
      data: { element: element },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let pauseOrderReq = new PauseOrderReq(this.tokenService.getToken(), element.order.sub_num);
        this.orderService.orderReturn(pauseOrderReq).subscribe(response => {
          switch (response.status) {
            case 'auth error':
              this.snackbarService.openSnackBar('???????????????? ??????????????????????????.', this.action, this.styleNoConnect);
              break;

            case 'fail':
              this.snackbarService.openSnackBar('???????????????? ????????????.', this.action, this.styleNoConnect);
              break;

            case 'false ':
              this.snackbarService.openSnackBar('???????????????? ???? ????????????.', this.action, this.styleNoConnect);
              break;

            case 'status error':
              this.snackbarService.openSnackBar('???????????? ???????????? ???? ????????????????????????.', this.action, this.styleNoConnect);
              break;

            case 'returned already':
              this.snackbarService.openSnackBar('???????????????? ?????? ?????? ??????????????????', this.action, this.styleNoConnect);
              break;

            default:
              this.snackbarService.openSnackBar('???????????????? ??????????????????', this.action);
              break;
          }
        },
          error => {
            console.log(error);
          });
      }
    });
  }

  onClickReturnToAssembly(id) {
    let pauseOrderReq = new PauseOrderReq(this.tokenService.getToken(), id);
    this.orderService.orderReturnToAssembly(pauseOrderReq).subscribe(response => {
      if (response.status === 'true')
        this.snackbarService.openSnackBar('???????????????? ?????????????????? ?? ????????????', this.action,);
      else this.snackbarService.openSnackBar('???????????????? ???? ??????????????????', this.action, this.styleNoConnect);
    },
      error => {
        console.log(error);
        this.snackbarService.openSnackBar(this.messageNoConnect, this.action, this.styleNoConnect);
      });
  }

  onDelete(element: OrderListAnsw) {
    let pauseOrderReq = new PauseOrderReq(this.tokenService.getToken(), element.order.sub_num);
    this.orderService.orderDelete(pauseOrderReq).subscribe(response => {
      if (response.status === 'true') {
        this.snackbarService.openSnackBar('???????????????? ????????????', this.action,);
        if (this.searchValue)
          this.searchOrder(this.searchValue);
        else this.loadData(null);
      }
      else this.snackbarService.openSnackBar('???????????????? ???? ??????????????????', this.action, this.styleNoConnect);
    },
      error => {
        console.log(error);
        this.snackbarService.openSnackBar(this.messageNoConnect, this.action, this.styleNoConnect);
      });
  }

  getAdminIshop(): boolean {
    return environment.listAdminsIshop.includes(this.tokenService.getLogin());
  }

  onClickSendToBitrix(element: OrderListAnsw) {
    element.order.isSendToBitrix = true;
    let t = timer(0, 1000).subscribe(vl => {
      console.log(vl);
      if (vl >= 20) {
        element.order.isSendToBitrix = false;
        t.unsubscribe();
      }
    });
    let findOrderReq = new FindOrderReq(this.tokenService.getToken(), element.order.num, '');
    this.orderService.orderSendToBitrix(findOrderReq).subscribe(response => {
      if (response.status) {
        this.snackbarService.openSnackBar(response.status, this.action);
      }
    },
      error => {
        console.log(error);
        this.snackbarService.openSnackBar(this.messageNoConnect, this.action, this.styleNoConnect);
      });
  }

  onColickCompleteOrder(element: OrderListAnsw) {
    // element.order.isSendToBitrix = true;
    // let t = timer(0, 1000).subscribe(vl => {
    //   console.log(vl);
    //   if(vl>=20){
    //     element.order.isSendToBitrix = false;
    //     t.unsubscribe();
    //   }
    // });
    // let findOrderReq = new FindOrderReq(this.tokenService.getToken(), element.order.num, '');
    // this.orderService.orderCompliteOrder(findOrderReq).subscribe(response =>{
    //   if(response.status){
    //     this.snackbarService.openSnackBar(response.status, this.action);
    //   }
    // },
    // error => {
    //   console.log(error);
    //   this.snackbarService.openSnackBar(this.messageNoConnect, this.action, this.styleNoConnect);
    // });
    this.snackbarService.openSnackBar('coming soon', this.action);
  }

  ngOnDestroy() {
    this.data = '';
  }
}
