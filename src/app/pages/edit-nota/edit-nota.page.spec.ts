import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditNotaPage } from './edit-nota.page';

describe('EditNotaPage', () => {
  let component: EditNotaPage;
  let fixture: ComponentFixture<EditNotaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditNotaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditNotaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
