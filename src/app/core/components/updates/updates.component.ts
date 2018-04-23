import {
  Component, ElementRef, EventEmitter, Input,
  OnDestroy, OnInit, ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import * as moment from 'moment';

import { UpdateService, UpdatesResponse } from '../../services/update.service';
import { UpdateFilter } from '../../models/update-filter';
import { User } from '../../models/user';
import {
  UsersListResponse, UsersListService
} from '../../services/users-list.service';
import { Project } from '../../models/project';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-updates',
  templateUrl: './updates.component.html',
  styleUrls: ['./updates.component.scss']
})

export class UpdatesComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') private searchInput: ElementRef;
  @Input() public user: User;
  @Input() public hideProjectFilter = false;
  private subscriptions: Subscription[] = [];
  private filter = new UpdateFilter();
  private firstUsers: User[] = [];
  public users: Observable<User[]>;
  public projects: Observable<Project[]>;
  public data: UpdatesResponse;
  public filterText = '';
  public filterDate: string[];
  public typeahead = new EventEmitter<string>();
  public items: User[] = [];

  constructor(
    private updateService: UpdateService,
    private usersListService: UsersListService,
    private projectService: ProjectService,
  ) {}

  ngOnInit() {
    if (this.user) {
      this.filter.userIds = [String(this.user.id)];
      this.items = [this.user];
    }

    this.usersListService.getUsersList()
      .subscribe(data => {
        this.firstUsers = data.users;
        this.fetchUsers(data);
      });

    this.projects = this.projectService.getProjectsList();

    this.fetchUpdates();
    this.initLiveSearching();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(
      subscription => subscription.unsubscribe()
    );
  }

  public showDate(strDate: string, format: string): string {
    return moment(strDate).format(format);
  }

  public onUserChanged(users: User[]) {
    this.filter.userIds = !users.length
      ? []
      : users.map(user => String(user.id));

    this.fetchUpdates();
  }

  public onProjectChanged(projects: Project[]) {
    this.filter.projectIds = !projects.length
      ? []
      : projects.map(project => String(project.id));

    this.fetchUpdates();
  }

  public onDateChange() {
    this.filter.startDate = this.filterDate
      ? this.showDate(this.filterDate[0], 'YYYY-MM-DD') : null;

    this.filter.endDate = this.filterDate
      ? this.showDate(this.filterDate[1], 'YYYY-MM-DD') : null;

    this.fetchUpdates();
  }

  private initLiveSearching() {
    this.subscriptions.push(Observable
      .fromEvent(this.searchInput.nativeElement, 'keyup')
      .do(d => this.filter.query = this.filterText)
      .debounceTime(1000)
      .switchMap(() => this.updateService.getUpdates(this.filter))
      .subscribe(data => this.data = data)
    );

    this.subscriptions.push(this.typeahead
      .distinctUntilChanged()
      .debounceTime(1000)
      .switchMap(search => this.usersListService.getSearch(search))
      .subscribe((data: UsersListResponse) => (
        this.fetchUsers(data)
      ))
    );
  }

  private fetchUpdates() {
    this.updateService
      .getUpdates(this.filter)
      .subscribe(data => this.data = data);
  }

  private fetchUsers(data: UsersListResponse) {
    this.users = Observable.create((observer: Observer<User[]>) => {
      observer.next(data.users.length ? data.users : this.firstUsers);
      observer.complete();
    });
  }
}
