// import { Component } from '@angular/core';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
//
// import { WrapperPage } from './wrapper.page';
// import { HeaderComponent } from '../../components/header/header.component';
// import { SharedModule } from '../../../shared/shared.module';
// // import { SidebarComponent } from '../../../shared/sidebar';
// import { RouterModule } from '@angular/router';
// import { CurrentUserService } from '../../services/current-user.service';
//
// class CurrentUserServiceStub { }
//
// // function MockComponent(options: Component) {
// //   const metadata: Component = {
// //     selector: options.selector,
// //     template: options.template || '',
// //     inputs: options.inputs,
// //     outputs: options.outputs
// //   };
// //   return Component(metadata)(class _ {});
// // }
//
// describe('WrapperPage', () => {
//   let component: WrapperPage;
//   let fixture: ComponentFixture<WrapperPage>;
//
//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         SharedModule,
//         RouterModule
//       ],
//       providers: [
//         { provide: CurrentUserService, useValue: CurrentUserServiceStub }
//       ],
//       declarations: [
//         WrapperPage,
//         HeaderComponent
//       ]
//     })
//     .compileComponents();
//   }));
//
//   beforeEach(() => {
//     fixture = TestBed.createComponent(WrapperPage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });
//
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
