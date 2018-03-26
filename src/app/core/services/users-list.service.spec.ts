import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { UsersListService } from './users-list.service';

describe('UsersListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [UsersListService]
    });
  });

  it('should be created', inject(
    [UsersListService],
    (service: UsersListService) => {
        expect(service).toBeTruthy();
    }));
});
