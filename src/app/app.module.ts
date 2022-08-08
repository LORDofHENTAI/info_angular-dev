
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { AngularMaterialModule } from './common/models/material-module';
import { VerticalMenuComponent } from './navigate-manager/vertical-menu/vertical-menu.component';
import { LoginPageComponent } from './login-manager/login-page/login-page.component';
import { AppRoutingModule } from './app-routing.module';
import { OrderComponent } from './order-manager/order/order.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NavigateFormComponent } from './navigate-manager/navigate-form/navigate-form.component';
import { OrderListFormComponent } from './order-manager/order-list-form/order-list-form.component';
import { VerticalIconMenuComponent } from './navigate-manager/vertical-icon-menu/vertical-icon-menu.component';
import { NgxPrintModule } from 'ngx-print';
import { OrderPrintFormComponent } from './order-manager/order-print-form/order-print-form.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { OrdersReadyBuildComponent } from './order-manager/orders-ready-build/orders-ready-build.component';
import { OrdersUncompletedComponent } from './order-manager/orders-uncompleted/orders-uncompleted.component';
import { OrdersReadyShipmentComponent } from './order-manager/orders-ready-shipment/orders-ready-shipment.component';
import { OrdersCanceledComponent } from './order-manager/orders-canceled/orders-canceled.component';
import { OrdersArchiveComponent } from './order-manager/orders-archive/orders-archive.component';
import { OrdersFormComponent } from './order-manager/orders-form/orders-form.component';
import { BarcodeInputCountFormComponent } from './order-manager/dialog-windows/barcode-input-count-form/barcode-input-count-form.component';
import { BarcodePrintFormComponent } from './order-manager/components/barcode-print-form/barcode-print-form.component';
import { SplitPipe } from './pipes/split.pipe';
import { EmptyFormComponent } from './common/components/empty-form/empty-form.component';
import { OrdersInAssemblyComponent } from './order-manager/orders-in-assembly/orders-in-assembly.component';
import { ConfirmReturnProductComponent } from './order-manager/dialog-windows/confirm-return-product/confirm-return-product.component';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { PrintBelpostBarcodeComponent } from './order-manager/dialog-windows/print-belpost-barcode/print-belpost-barcode.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    VerticalMenuComponent,
    LoginPageComponent,
    OrderComponent,
    NavigateFormComponent,
    OrderListFormComponent,
    VerticalIconMenuComponent,
    OrderPrintFormComponent,
    OrdersReadyBuildComponent,
    OrdersUncompletedComponent,
    OrdersReadyShipmentComponent,
    OrdersCanceledComponent,
    OrdersArchiveComponent,
    OrdersFormComponent,
    BarcodeInputCountFormComponent,
    BarcodePrintFormComponent,
    SplitPipe,
    EmptyFormComponent,
    OrdersInAssemblyComponent,
    ConfirmReturnProductComponent,
    PrintBelpostBarcodeComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    AngularMaterialModule,
    NgxPrintModule,
    NgScrollbarModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger',
    }),
  ],
  exports: [AngularMaterialModule],
  providers: [
    Title,
    HttpClient,
    CookieService,
  ],
  entryComponents: [
    BarcodeInputCountFormComponent,
    ConfirmReturnProductComponent,
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }
