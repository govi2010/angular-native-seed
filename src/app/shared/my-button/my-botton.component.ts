import { Component, Input, OnInit, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef, OnChanges, SimpleChange, SimpleChanges } from "@angular/core";
import { MyDrawerItem } from "../my-drawer-item/my-drawer-item";

/* ***********************************************************
* Keep data that is displayed in your app drawer in the MyDrawer component class.
* Add new data objects that you want to display in the drawer here in the form of properties.
*************************************************************/
@Component({
  selector: "MyButton",
  moduleId: module.id,
  templateUrl: "./my-button.component.html",
  styleUrls: ["./my-button.component.css"]
})
export class MyButonComponent implements OnInit, OnChanges {

  @Input() lodder: boolean;
  @Input() text: boolean;
  @Input() isEnabled: boolean;
  @Input() class: string;

  @Output() public tap: EventEmitter<boolean> = new EventEmitter(true);

  constructor(private cd: ChangeDetectorRef) {

  }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.lodder && !changes.lodder.firstChange && changes.lodder.currentValue !== changes.lodder.previousValue) {
    }
  }

  showLoader() {
    this.lodder = true;
    this.cd.detectChanges();
  }

  hideLoader() {
    this.lodder = false;
    this.cd.detectChanges();
  }

  taped() {
    this.tap.emit(true);
  }
}
