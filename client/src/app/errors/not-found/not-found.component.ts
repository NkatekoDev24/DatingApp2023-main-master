import { Component, OnInit } from '@angular/core';
import { user } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
  user?: user | null;

  constructor(private accountService: AccountService) {
    this.accountService.currentUser$.subscribe(x => this.user = x);
   }

  ngOnInit(): void {
  }

}
