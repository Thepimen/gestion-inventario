/**
 * Práctica: FormularioReactivo (Desarrollo de Interfaces - 2º DAM)
 * Instituto Nebrija de Formación Profesional
 * Autor: Luis Lázaro Pimentel
 *
 * Módulo auxiliar IonicModule para Standalone Components en Ionic Angular.
 * Permite importar la suite de componentes de Ionic directamente en los componentes Standalone.
 */

import { NgModule } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonButtons,
  IonSpinner,
  IonToast,
  IonAlert,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonNote,
  IonIcon,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonFooter,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/angular';

const IONIC_STANDALONE_COMPONENTS = [
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonButtons,
  IonSpinner,
  IonToast,
  IonAlert,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonNote,
  IonIcon,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonFooter,
  IonSegment,
  IonSegmentButton,
  IonLabel,
];

@NgModule({
  imports: [...IONIC_STANDALONE_COMPONENTS],
  exports: [...IONIC_STANDALONE_COMPONENTS],
})
export class IonicModule {}
