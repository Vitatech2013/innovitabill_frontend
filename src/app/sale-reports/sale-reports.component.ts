import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  ChartDataLabels
);

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-sale-reports',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './sale-reports.component.html',
  styleUrl: './sale-reports.component.css',
})
export class SaleReportsComponent implements OnInit {
  dailyData: any[] = [];
  monthlyData: any[] = [];
  yearlyData: any[] = [];
  dailyChart: any;
  monthlyChart: any;
  yearlyChart: any;
  weeklyChart: any;
  weeklyData: any;

  constructor(private service: BillingService) {}

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport() {
    this.service.getSalesReport().subscribe((res: any) => {
      this.dailyData = res.daily;
      this.weeklyData=res.weekly;
      this.monthlyData = res.monthly;
      this.yearlyData = res.yearly;

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
        labels: data.map((x) => x._id),
        datasets: [
          {
            label: 'Daily Sales',
            data: data.map((x) => x.totalSales),
            backgroundColor: '#1f7a4f',
            borderRadius: 8,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: '#333',
            formatter: (value) =>  + value  ,
            font: { weight: 'bold' },
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            border: { display: false },
            grid: { color: '#e5e5e5' },
          },
          x: {
            border: { display: false },
            grid: { display: false },
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }

  loadWeeklyChart(data: any[]) {
    if (this.weeklyChart) this.weeklyChart.destroy();

    this.weeklyChart = new Chart('weeklyChart', {
      type: 'line',
      data: {
        labels: data.map((x) => `W${x._id.week}-${x._id.year}`),
        datasets: [
          {
            label: 'Weekly Sales',
            data: data.map((x) => x.totalSales),
            borderColor: '#1f7a4f',
            borderWidth: 3,
            tension: 0.4,
            pointBackgroundColor: '#1f7a4f',
            pointBorderColor: '#1f7a4f',
            pointRadius: 6,
            pointHoverRadius: 8,
          },
        ],
      },

      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => '$' + ctx.raw + 'k',
            },
          },
          datalabels: {
            anchor: 'end',
            align: 'top',
            formatter: (v) =>  + v ,
            color: '#333',
            font: { weight: 'bold' },
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            border: { display: false },
            grid: { color: '#e5e5e5' },
            ticks: { color: '#555' },
          },
          x: {
            border: { display: false },
            grid: { display: false },
            ticks: { color: '#555' },
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }

  loadMonthlyChart(data: any[]) {
    if (this.monthlyChart) this.monthlyChart.destroy();

    this.monthlyChart = new Chart('monthlyChart', {
      type: 'line',
      data: {
        labels: data.map((x) => `${x._id.month}-${x._id.year}`),
        datasets: [
          {
            label: 'Monthly Sales',
            data: data.map((x) => x.totalSales),
            borderColor: '#1f7a4f',
            borderWidth: 3,
            tension: 0.4,
            pointBackgroundColor: '#1f7a4f',
            pointBorderColor: '#1f7a4f',
            pointRadius: 6,
            pointHoverRadius: 8,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'top',
            formatter: (v) =>  + v ,
            color: '#333',
            font: { weight: 'bold' },
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            border: { display: false },
            grid: { color: '#e5e5e5' },
          },
          x: {
            border: { display: false },
            grid: { display: false },
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }

  loadYearlyChart(data: any[]) {
    if (this.yearlyChart) this.yearlyChart.destroy();

    this.yearlyChart = new Chart('yearlyChart', {
      type: 'line',
      data: {
        labels: data.map((x) => x._id.year),
        datasets: [
          {
            label: 'Yearly Sales',
            data: data.map((x) => x.totalSales),
            borderColor: '#1f7a4f',
            borderWidth: 3,
            tension: 0.4,
            pointBackgroundColor: '#1f7a4f',
            pointBorderColor: '#1f7a4f',
            pointRadius: 6,
            pointHoverRadius: 8,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'top',
            formatter: (v) => + v ,
            color: '#333',
            font: { weight: 'bold' },
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            border: { display: false },
            grid: { color: '#e5e5e5' },
          },
          x: {
            border: { display: false },
            grid: { display: false },
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }

  // ================= PDF DOWNLOAD =====================
  downloadPDF() {
    const pdf = new jsPDF('p', 'mm', 'a4');
    html2canvas(document.body).then((canvas) => {
      const img = canvas.toDataURL('image/png');
      pdf.addImage(img, 'PNG', 0, 0, 210, 297);
      pdf.save('Sales_Report.pdf');
    });
  }

  // ================= EXCEL DOWNLOAD =====================
  downloadExcel() {
    const exportData = [
      ...this.dailyData.map((d) => ({
        Period: d._id,
        Type: 'Daily',
        Sales: d.totalSales,
      })),
      ...this.monthlyData.map((m) => ({
        Period: `${m._id.month}-${m._id.year}`,
        Type: 'Monthly',
        Sales: m.totalSales,
      })),
      ...this.yearlyData.map((y) => ({
        Period: y._id.year,
        Type: 'Yearly',
        Sales: y.totalSales,
      })),
    ];

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales');
    XLSX.writeFile(wb, 'Sales_Report.xlsx');
  }
}
