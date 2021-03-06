import { Component, OnInit, Output, EventEmitter, ContentChildren, QueryList, AfterContentInit, Input, OnChanges } from '@angular/core';
import { WizardStepComponent } from './wizard-step.component';

@Component({
  selector: 'form-wizard',
  template:
  `<div class="card">
    <div class="card-header">
      <ul class="nav nav-justified">
        <li class="nav-item nav-header">{{ labelButton.headline }}</li>
        <li class="nav-item" *ngFor="let step of steps" [ngClass]="{'active': step.isActive, 'enabled': !step.isDisabled, 'disabled': step.isDisabled}">
         {{step.title}}
        </li>
      </ul>
    </div>
    <div class="card-block">
      <ng-content></ng-content>
    </div>
    <div class="card-footer clearfix">
        <button type="button" class="btn btn-secondary float-left" (click)="previous()" [hidden]="!hasPrevStep || !activeStep.showPrev || isComplete">{{ labelButton.labelPrevious }}</button>
        <button type="button" class="btn btn-secondary float-right" (click)="next()" [disabled]="!activeStep.isValid || needInfo" [hidden]="!hasNextStep || !activeStep.showNext || isComplete">{{ labelButton.labelNext }}</button>
        <button type="button" class="btn btn-info float-right" [ngClass]="{'confirmed': !needInfo}" (click)="confirm()" [hidden]="!hasPrevStep || !mapPage || isComplete">{{ labelButton.labelInfo }}</button>
        <button type="button" class="btn btn-secondary float-right" (click)="complete()" [disabled]="!activeStep.isValid" [hidden]="hasNextStep || isComplete">{{ labelButton.labelDone }}</button>
        <button type="button" class="btn btn-secondary float-right" (click)="goHome()" [hidden]="!isComplete">{{ labelButton.labelStart }}</button>
    </div>
  </div>`
  ,
  styles: [
    '.card { height: 100%; }',
    '.card-header { background-color: #fff; padding: 0; font-size: 1.25rem; }',
    '.card-block { overflow-y: auto; }',
    '.card-footer { background-color: #fff; border-top: 0 none; }',
    '.nav-item { padding: 1rem 0rem; border-bottom: 0.5rem solid #ccc; }',
    '.active { font-weight: bold; color: black; border-bottom-color: #1976D2 !important; }',
    '.enabled { border-bottom-color: rgb(88, 162, 234); }',
    '.disabled { color: #ccc; }'
  ]
})
export class WizardComponent implements OnInit, AfterContentInit, OnChanges {
  @ContentChildren(WizardStepComponent) wizardSteps: QueryList<WizardStepComponent>;
  private _steps: Array<WizardStepComponent> = [];
  private _isCompleted: boolean = false;

  @Input() labelButton: any;
  @Input() mapPage: boolean = false;
  @Input() needInfo: boolean = false;
  @Input() needValidate: boolean = false;
  @Input() isComplete: boolean = false;
  @Output() onStepChanged: EventEmitter<WizardStepComponent> = new EventEmitter<WizardStepComponent>();
  @Output() onClickConfirm = new EventEmitter();
  @Output() onClickGoHome = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.wizardSteps.forEach(step => this._steps.push(step));
    this._steps[0].isActive = true;
  }

  ngOnChanges(change) {
    // console.log(change);
  }

  confirm() {
    this.onClickConfirm.emit();
  }

  private get steps(): Array<WizardStepComponent> {
    return this._steps;
  }

  private get isCompleted(): boolean {
    return this._isCompleted;
  }

  private get activeStep(): WizardStepComponent {
    return this._steps.find(step => step.isActive);
  }

  private set activeStep(step: WizardStepComponent) {
    if (step !== this.activeStep && !step.isDisabled) {
      this.activeStep.isActive = false;
      step.isActive = true;
      this.onStepChanged.emit(step);
    }
  }

  private get activeStepIndex(): number {
    return this._steps.indexOf(this.activeStep);
  }

  private get hasNextStep(): boolean {
    return this.activeStepIndex < this._steps.length - 1;
  }

  private get hasPrevStep(): boolean {
    return this.activeStepIndex > 0;
  }

  goToStep(step: WizardStepComponent) {
    this.activeStep = step;
  }

  next() {
    if (this.hasNextStep) {
      let nextStep: WizardStepComponent = this._steps[this.activeStepIndex + 1];
      this.activeStep.onNext.emit();
      nextStep.isDisabled = false;
      this.activeStep = nextStep;
    }
  }

  previous() {
    if (this.hasPrevStep) {
      let prevStep: WizardStepComponent = this._steps[this.activeStepIndex - 1];
      this.activeStep.onPrev.emit();
      prevStep.isDisabled = false;
      this.activeStep = prevStep;
    }
  }

  complete() {
    this._isCompleted = true;
    this.activeStep.onComplete.emit();
  }

  goHome() {
    this.onClickGoHome.emit();
  }

}
