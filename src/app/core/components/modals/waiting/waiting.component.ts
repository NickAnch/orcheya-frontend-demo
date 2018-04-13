import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { timer } from 'rxjs/observable/timer';

type Color = 'warning' | 'success';

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.scss']
})
export class WaitingComponent implements OnInit, OnDestroy {
  public title: string;
  public successMessage: string;
  public progress: number;
  public done = false;
  public color: Color = 'warning';
  private progressSubject: Subject<number>;
  private subscriptions: Subscription[] = [];
  private imageSubscriptions: Subscription[] = [];

  constructor(public modalRef: BsModalRef) {}

  private static unsubscribe(subs: Subscription[]) {
    subs.forEach(
      subscription => subscription.unsubscribe()
    );
  }

  ngOnInit() {
    this.subscriptions.push(
      this.progressSubject
        .asObservable()
        .subscribe(value => {
          this.progress = value;
          if (value === 100) {
            this.done = true;
            this.color = 'success';
          }
        })
    );
  }

  ngOnDestroy() {
    timer(2000).subscribe(() => (
      WaitingComponent.unsubscribe(
        [...this.subscriptions, ...this.imageSubscriptions]
      )
    ));
  }

  public cancel() {
    WaitingComponent.unsubscribe(this.imageSubscriptions);
    this.modalRef.hide();
  }

}
