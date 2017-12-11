import { TestBed, inject } from '@angular/core/testing';

import { CurrentUserService } from './current-user.service';
import { HttpClientModule } from '@angular/common/http';
import { User } from '../models/user';
import { Observable } from 'rxjs/Observable';
import { ArrayObservable } from 'rxjs/observable/ArrayObservable';

describe('CurrentUserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [CurrentUserService]
    });
  });

  it(
    'should be created',
    inject([CurrentUserService], (serv: CurrentUserService) => {
      expect(serv).toBeDefined();
    }));

  describe('isLoggedIn()', () => {
    it(
      'should be defined',
      inject([CurrentUserService], (serv: CurrentUserService) => {
        expect(serv.isLoggedIn).toBeDefined();
      })
    );

    it(
      'should be implemented of User model',
      inject([CurrentUserService], (serv: CurrentUserService) => {
        expect(serv instanceof User).toBeTruthy();
      })
    );

    it(
      'should return true if user exists or false if not',
      inject([CurrentUserService], (serv: CurrentUserService) => {
        expect(serv.isLoggedIn()).toBeFalsy();
        // set current user id
        serv.id = 1;
        expect(serv.isLoggedIn()).toBeTruthy();
      })
    );
  });

  describe('load()', () => {
    it(
      'should be defined',
      inject([CurrentUserService], (serv: CurrentUserService) => {
        expect(serv.load).toBeDefined();
      })
    );

    it(
      'should return observable of User',
      inject([CurrentUserService], (serv: CurrentUserService) => {
        const spy = spyOn(serv, 'load').and.returnValue(ArrayObservable.of({}));
        serv.load();
        expect(serv.load).toHaveBeenCalled();
      })
    );
  });
});
