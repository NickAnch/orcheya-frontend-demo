import { Component, OnInit } from '@angular/core';
import { Update } from '../../models/update';
import { User } from '../../models/user';
import { NewUpdateService } from '../../services/new-update.service';

@Component({
  selector: 'new-update',
  templateUrl: './new-update.page.html',
  styleUrls: ['./new-update.page.scss']
})
export class NewUpdatePage implements OnInit{

  // public update: Update;
  // update = {
  //   id: 0,
  //   made: 'previous',
  //   planning: '',
  //   issues: 'problems',
  //   user: 'user',
  //   date: 'date',
  // };

  public update = new Update({
    made: 'previous',
    planning: '',
    issues: 'problems',
  })

  constructor(private newUpdateService: NewUpdateService) {}

  ngOnInit(): void {
    this.newUpdateService.getLastUpdate()
      .subscribe(
        res => {
          console.log(res);
        }
      )
  }

  // sendUpdate() {
  //   console.log(this.update);
  // }
}
