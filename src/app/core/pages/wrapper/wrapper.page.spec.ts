import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperPage } from './wrapper.page';

describe('WrapperPage', () => {
  let component: WrapperPage;
  let fixture: ComponentFixture<WrapperPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WrapperPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
