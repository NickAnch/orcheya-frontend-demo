import { Component, OnInit } from '@angular/core';
import { Update } from '../../models/update';
import { NewUpdateService } from '../../services/new-update.service';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'new-update',
  templateUrl: './new-update.page.html',
  styleUrls: ['./new-update.page.scss']
})
export class NewUpdatePage implements OnInit {

  public update = new Update({
    made: 'previousssss',
    planning: '23123',
    issues: 'problemsss',
  });

  constructor(
    private newUpdateService: NewUpdateService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.update.date = params['date'];
    });
  }

  public sendUpdate(): void {
    this.newUpdateService.sendNewUpdate(this.update)
      .subscribe(
        response => {
          console.log(response);
        }
      )
  }
}
