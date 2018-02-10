import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PatternComponent } from 'pattern/pattern.component';
import { PatternBaseComponent } from 'pattern/pattern-base.component';
import { PatternAtomsComponent } from 'pattern/pattern-atoms.component';
import { PatternOrganismsComponent } from 'pattern/pattern-organisms.component';
import { PatternMoleculesComponent } from 'pattern/pattern-molecules.component';
import { PatternLayoutsComponent } from 'pattern/pattern-layouts.component';

@NgModule({
  imports: [
    RouterModule
  ],
  declarations: [
    PatternComponent,
    PatternBaseComponent,
    PatternAtomsComponent,
    PatternOrganismsComponent,
    PatternMoleculesComponent,
    PatternLayoutsComponent
  ]
})
export class PatternModule { }
