import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { LoginActions } from '../actions/login/login.action';
import { RouterService } from '../services/router.service';
import { AppState } from '../store';
import { ToasterService } from '../services/toaster.service';
import { Config } from '../common';

@Component({
    selector: 'ns-settings',
    moduleId: module.id,
    templateUrl: './settings.component.html',
    styleUrls: ["./settings.component.css"]
})
export class SettingsComponent {
    public items: Array<{ icon: string, text: string, path: string }>;
    constructor(private routerExtensions: RouterService, private store: Store<AppState>, private _loginActions: LoginActions,
        private _toasterService: ToasterService) {
        this.items = [
            { text: 'Company Profile', icon: String.fromCharCode(0x61), path: 'company-profile' },
            { text: 'Currencies', icon: String.fromCharCode(0x61), path: 'currencies' },
            { text: 'Taxes', icon: String.fromCharCode(0x62), path: 'taxes' },
            // { text: 'Permission', icon: String.fromCharCode(0x68), path: '' },
            { text: 'Logout', icon: String.fromCharCode(0x67), path: '' },
        ]
    }

    public doAction(item) {
        if (item.text === 'Logout') {
            this._toasterService.confirm({
                title: 'Logout',
                message: 'Are you sure you want to logout?',
                okButtonText: 'Yes',
                cancelButtonText: 'No'
            }).then(r => {
                if (r) {
                    this.store.dispatch(this._loginActions.logout());
                    (this.routerExtensions.router as any).navigateByUrl('/login', { clearHistory: true });
                }
            });
        } else {
            this.routerExtensions.router.navigate(['/settings', item.path]);
        }
    }

    public goBack() {
        Config.IS_MOBILE_NATIVE && (this.routerExtensions.router as any).back();
    }
}
