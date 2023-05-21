import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-dialogs',
  templateUrl: './confirm-dialogs.component.html',
  styleUrls: ['./confirm-dialogs.component.css']
})
export class ConfirmDialogsComponent implements OnInit {
  title ='';
  message = '';
  btnOkText = '';
  btnCancelText = '';
  result = false;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  confirm() {
    this.result = true;
    this.bsModalRef.hide();
  }

  decline() {
    this.bsModalRef.hide();
  }

}
