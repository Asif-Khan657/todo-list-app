import { TestBed } from '@angular/core/testing';
import { Header } from './header';

describe('Header', () => {
  it('shows the application title', async () => {
    await TestBed.configureTestingModule({ imports: [Header] }).compileComponents();
    const fixture = TestBed.createComponent(Header);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toBe('My Todo App');
  });
});
