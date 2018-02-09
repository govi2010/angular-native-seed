import { Injectable } from '@angular/core';
import { APP_DEFAULT_TITLE } from '../app.constants';
// import { ToastrService } from 'ngx-toastr';
import * as Toast from 'nativescript-toast';
import * as dialogs from 'ui/dialogs';
// declare class ToastrService { }
@Injectable()
export class ToasterService {

    constructor() {

    }

    public successToast(msg: string = 'Something went wrong', title: string = APP_DEFAULT_TITLE): void {
        let toast = Toast.makeText(msg);
        toast.show();
    }

    public errorToast(msg: string = 'Something went wrong', title: string = APP_DEFAULT_TITLE): void {
        let toast = Toast.makeText(msg);
        toast.show();
    }

    public warningToast(msg: string = 'Something went wrong', title: string = APP_DEFAULT_TITLE): void {
        let toast = Toast.makeText(msg);
        toast.show();
    }

    public infoToast(msg: string = 'Something went wrong', title: string = APP_DEFAULT_TITLE): void {
        let toast = Toast.makeText(msg);
        toast.show();
    }

    public clearAllToaster(): void {
        //
    }

    public confirm(obj: any) {
        return dialogs.confirm(obj);
    }
}
