import { Component, ElementRef, EventEmitter, Host, HostListener, Input, Output, ViewChild } from '@angular/core';
import { ExportData } from '../../Interfaces/export-data';

@Component({
  selector: 'app-export-buttons-component',
  imports: [],
  templateUrl: './export-buttons-component.html',
  styleUrl: './export-buttons-component.css'
})
export class ExportButtonsComponent {
  @Input() exportData!: ExportData;
  @Input() loading: boolean = false;
  @Output() exportPdf = new EventEmitter<void>();
  @Output() exportCsv = new EventEmitter<void>();

  @ViewChild('exportDropdown') exportDropdown!: ElementRef;

  showExportDropDown: boolean = false;
  exporting: boolean = false;

  toggleExportDropdown() {
    this.showExportDropDown = !this.showExportDropDown;
  }

  @HostListener("document:click", ['$event'])
  onDocumentClick(event : Event): void {
    if(this.showExportDropDown && this.exportDropdown && !this.exportDropdown.nativeElement.contains(event.target)) {
      this.showExportDropDown = false;
    }
  }

  onExportPDF() {
    this.exporting = true;
    this.showExportDropDown = false;
    this.exportPdf.emit();
    setTimeout(() => {
      this.exporting = false;
    }, 2000);
  }

  onExportCSV() {
    this.exporting = true;
    this.showExportDropDown = false;
    this.exportCsv.emit();
    setTimeout(() => {
      this.exporting = false;
    }, 2000);
  }

  printPage() {
    window.print();
  }
}
