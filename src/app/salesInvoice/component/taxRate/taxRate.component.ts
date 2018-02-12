import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RouterService } from '../../../services/router.service';
import { Config } from '../../../common';

@Component({
    selector: 'ns-tax-rate',
    moduleId: module.id,
    templateUrl: `./taxRate.component.html`
})
export class TaxRateComponent implements OnInit {
    public chartType: string;
    public items: Array<{ text: string, selected: boolean, val: string }>;
    constructor(private routerExtensions: RouterService) {

        this.items = [
            { val: '1', text: 'GST', selected: false },
            { val: '2', text: 'IGST', selected: false },
            { val: '3', text: 'GST 1', selected: false },
            { val: '4', text: 'GST 5%', selected: false },
            { val: '5', text: 'I GST 1', selected: false },
        ];

    }

    ngOnInit() {

    }

    onNavBtnTap() {
        Config.IS_MOBILE_NATIVE && (this.routerExtensions.router as any).backToPreviousPage();
    }

    changeCheckedRadio(item: { val: string, text: string, selected: boolean }) {
        this.items.forEach(option => {
            option.selected = option.val === item.val;
        });
    }

    saveAndClose() {

    }

    setSelectedItem(selVal) {
        this.items.forEach(p => {
            if (p.val === selVal) {
                p.selected = true;
            }
        });
    }
}
