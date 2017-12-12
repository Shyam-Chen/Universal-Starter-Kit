import { Component, ChangeDetectionStrategy } from '@angular/core';

import { TemplateDrivenStore } from './template-driven.store';

@Component({
  selector: 'app-form-controls-template-driven',
  template: `
    <div class="container" *mobxAutorun>
      <div class="container mat-elevation-z2">
        <h3>Template-driven Forms</h3>

        <form class="example-form">
          <div class="row">
            <mat-form-field>
              <input matInput placeholder="Nickname" [(ngModel)]="templateDriven.nickname" name="nickname">
            </mat-form-field>
            <div class="outputs">{{ templateDriven.nickname }}</div>
          </div>

          <div class="row">
            <mat-form-field>
              <mat-select
                placeholder="Age"
                #age
                [value]="templateDriven.age"
                (change)="templateDriven.ageChange(age.value)"
              >
                <mat-option *ngFor="let item of templateDriven.listOfage" [value]="item.value">
                  {{ item.label }}
                </mat-option>
              </mat-select>
            </mat-form-field>
            <div class="outputs">{{ templateDriven.age }}</div>
          </div>

          <div class="row">
            <mat-slide-toggle [checked]="templateDriven.autoplay" (change)="templateDriven.autoplay = !templateDriven.autoplay">Autoplay</mat-slide-toggle>
            <div class="outputs">{{ templateDriven.displayAutoplay }}</div>
          </div>

          <div class="row">
            <mat-slider
              class="slider"
              min="0" max="300" step="5"
              #kilometers
              [value]="templateDriven.kilometers"
              (change)="kilometersChange(kilometers.value)"
            ></mat-slider>
            <div class="outputs">{{ templateDriven.kilometers }}</div>
          </div>

          <div class="row">
            ...
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 1rem;
    }

    .row {
      padding: .66rem;
      display: flex;
      flex-direction: row;
    }

    .outputs {
      align-self: center;
      margin: 0 0 .5rem .5rem;
      color: #3F51B5;
    }

    .slider {
      width: 300px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateDrivenComponent {
  constructor(private templateDriven: TemplateDrivenStore) {}

  public kilometersChange(value: number): void {
    this.templateDriven.kilometers = value;
  }
}
