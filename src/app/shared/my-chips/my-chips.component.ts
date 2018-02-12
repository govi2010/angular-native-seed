import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";


@Component({
  selector: "MyChips",
  moduleId: module.id,
  templateUrl: "./my-chips.component.html",
  styleUrls: ["./my-chips.component.scss"]
})

export class MyChipsComponent implements OnInit {
  @Input() text: string = '';
  @Input() isClosable: boolean = true;
  @Input() bgColor: string = '#F2F2F9';
  @Input() textColor: string = '#94959C';

  @Output() tapped: EventEmitter<any> = new EventEmitter();
  constructor() {

  }

  public ngOnInit() {

  }
}
