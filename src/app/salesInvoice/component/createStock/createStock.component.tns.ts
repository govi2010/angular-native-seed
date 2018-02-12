import { Component } from '@angular/core';
import { SegmentedBar, SegmentedBarItem } from "ui/segmented-bar";
import { RouterService } from '../../../services/router.service';

@Component({
    selector: 'ns-stock-create',
    templateUrl: `./createStock.component.html`,
    moduleId: module.id
})
export class CreateStockComponent {
    public myItems: SegmentedBarItem[];
    public selectedIndex: number = 0;
    constructor(public _routerExtension: RouterService) {
        this.myItems = [];
        let productItem = new SegmentedBarItem();
        let serviceItem = new SegmentedBarItem();

        productItem.title = 'Add Product';
        serviceItem.title = 'Add Service';

        this.myItems.push(productItem, serviceItem);
    }

    public onSelectedIndexChange(args) {
        let segmetedBar = args.object as SegmentedBar;
        this.selectedIndex = segmetedBar.selectedIndex;
    }
}
