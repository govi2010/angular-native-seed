import { Injectable } from '@angular/core';
import { APP_DEFAULT_TITLE } from '../app.constants';
// import { ToastrService } from 'ngx-toastr';
import * as Toast from 'nativescript-toast';
declare class ToastrService { }
@Injectable()
export class ToasterService {

    constructor(private _toaster: ToastrService) {

    }

    public successToast(msg: string, title: string = APP_DEFAULT_TITLE): void {
        let toast = Toast.makeText('Something went wrong');
        toast.show();
    }

    public errorToast(msg: string, title: string = APP_DEFAULT_TITLE): void {
        let toast = Toast.makeText('Something went wrong');
        toast.show();
    }

    public warningToast(msg: string, title: string = APP_DEFAULT_TITLE): void {
        let toast = Toast.makeText('Something went wrong');
        toast.show();
    }

    public infoToast(msg: string, title: string = APP_DEFAULT_TITLE): void {
        let toast = Toast.makeText('Something went wrong');
        toast.show();
    }

    public clearAllToaster(): void {
        let toast = Toast.makeText('Something went wrong');
        toast.show();
    }
}
