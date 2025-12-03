import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BillingService } from '../billing.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  ArcElement,
  PieController,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

Chart.register(
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  ArcElement,
  PieController,
  Tooltip,
  Legend,
  Title,
  ChartDataLabels
);

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import Modal from 'bootstrap/js/dist/modal';


@Component({
  selector: 'app-sale-reports',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './sale-reports.component.html',
  styleUrl: './sale-reports.component.css',
})
export class SaleReportsComponent implements OnInit, AfterViewInit {

  dailyData: any[] = [];
  monthlyData: any[] = [];
  yearlyData: any[] = [];
  weeklyData: any[] = [];

  dailyChart: any;
  weeklyChart: any;
  monthlyChart: any;
  yearlyChart: any;

  private pdfDoc: jsPDF | null = null;
  pdfPreviewSrc: string | null = null;
  private pdfPreviewModal: Modal | null = null;

  constructor(private service: BillingService) {}

  ngOnInit(): void {
    this.loadReport();
  }

  ngAfterViewInit() {
    const modal = document.getElementById('pdfPreviewModal');
    if (modal) this.pdfPreviewModal = new Modal(modal, { backdrop: 'static' });
  }

  loadReport() {
    this.service.getSalesReport().subscribe((res: any) => {
      this.dailyData = res.daily || [];
      this.weeklyData = res.weekly || [];
      this.monthlyData = res.monthly || [];
      this.yearlyData = res.yearly || [];

      this.loadDailyChart(this.dailyData);
      this.loadWeeklyChart(this.weeklyData);
      this.loadMonthlyChart(this.monthlyData);
      this.loadYearlyChart(this.yearlyData);
    });
  }

  loadDailyChart(data: any[]) {
    if (this.dailyChart) this.dailyChart.destroy();
    this.dailyChart = new Chart('dailyChart', {
      type: 'bar',
      data: {
        labels: data.map(x => x._id),
        datasets: [{ label: 'Daily Sales', data: data.map(x => x.totalSales) }],
      },
    });
  }

  loadWeeklyChart(data: any[]) {
    if (this.weeklyChart) this.weeklyChart.destroy();
    this.weeklyChart = new Chart('weeklyChart', {
      type: 'line',
      data: { labels: data.map(x => `W${x._id.week}-${x._id.year}`), datasets: [{label:'Weekly Sales',data:data.map(x=>x.totalSales),fill:false}],},
    });
  }

  loadMonthlyChart(data: any[]) {
    if (this.monthlyChart) this.monthlyChart.destroy();
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    this.monthlyChart = new Chart('monthlyChart', {
      type: 'line',
      data: {
        labels: data.map(x => monthNames[(x._id.month - 1) % 12]),
        datasets: [{ label: 'Monthly Sales', data: data.map(x => x.totalSales), fill: false }],
      },
    });
  }

  loadYearlyChart(data: any[]) {
    if (this.yearlyChart) this.yearlyChart.destroy();
    this.yearlyChart = new Chart('yearlyChart',{type:'line',data:{ labels:data.map(x=>x._id.year??x._id), datasets:[{label:'Yearly Sales',data:data.map(x=>x.totalSales),fill:false}],},});
  }

  // 🚀 NEW: Prepare PDF and show preview in modal
  preparePDFPreview() {
    const element: any = document.getElementById('report-content');
    if (!element) return;

    html2canvas(element, { scale: 2, backgroundColor: '#fff' }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      this.pdfPreviewSrc = imgData;

      const pdf = new jsPDF('p','mm','a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData,'PNG',0,0,imgWidth,imgHeight);
      this.pdfDoc = pdf;

      this.pdfPreviewModal?.show();
    });
  }

  
  confirmDownload() {
    this.pdfDoc?.save('Sales_Report.pdf');
    this.pdfPreviewSrc = null;
    this.pdfPreviewModal?.hide();
  }

 
  cancelPreview() {
    this.pdfPreviewSrc = null;
    this.pdfPreviewModal?.hide();
  }

 
  downloadExcel() {
    const tableData = [
      ...this.dailyData.map(x => ({ Period: x._id, Type:'Daily', Sales:x.totalSales })),
      ...this.weeklyData.map(x => ({ Period:`W${x._id.week}-${x._id.year}`, Type:'Weekly', Sales:x.totalSales })),
      ...this.monthlyData.map(x => ({ Period:`${x._id.month}-${x._id.year}`, Type:'Monthly', Sales:x.totalSales })),
      ...this.yearlyData.map(x => ({ Period:x._id.year??x._id, Type:'Yearly', Sales:x.totalSales })),
    ];

    const sheet = XLSX.utils.json_to_sheet(tableData);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, 'Sales');
    XLSX.writeFile(book, 'Sales_Report.xlsx');
  }
}
