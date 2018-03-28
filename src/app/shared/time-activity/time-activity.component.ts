import { Component, ElementRef, Input, OnInit } from '@angular/core';

import { BaseType, select, Selection } from 'd3-selection';
import { timeMonths, timeWeek, timeDays } from 'd3-time';
import { timeFormat } from 'd3-time-format';

export interface ActivityData {
  date: string;
  time: number;
}

interface DayData {
  date: Date;
  time: number;
}

@Component({
  selector: 'app-time-activity',
  template: ``,
  styleUrls: ['./time-activity.component.scss']
})
export class TimeActivityComponent implements OnInit {
  @Input() private activityData: ActivityData[] = [];
  @Input() private dateFrom: Date;
  @Input() private dateTo: Date;
  private activityDataCopy: ActivityData[] = [];
  private params = {
    cellSize: 12,
    hour: 60,
    textWeeks: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dateFrom: null,
    dateTo: null,
  };
  private d3Elements: {
    parent?: Selection<HTMLElement, any, null, undefined>,
    wrapper?: Selection<HTMLElement, any, null, undefined>,
    tooltip?: Selection<BaseType, any, null, undefined>,
    tooltipTime?: Selection<BaseType, any, null, undefined>,
    tooltipDate?: Selection<BaseType, any, null, undefined>,
    svg?: Selection<SVGSVGElement, any, null, undefined>,
    canvas?: Selection<SVGSVGElement, any, null, undefined>,
    gWeeks?: Selection<SVGSVGElement, any, null, undefined>,
    weeks?: Selection<BaseType, any, BaseType, undefined>,
    gMonths?: Selection<SVGSVGElement, any, null, undefined>,
    months?: Selection<BaseType, any, BaseType, undefined>,
    gDays?: Selection<SVGSVGElement, any, null, undefined>,
    days?: Selection<BaseType, any, BaseType, undefined>,
  } = {};

  constructor(element: ElementRef) {
    this.d3Elements.parent = select(element.nativeElement);
  }

  ngOnInit() {
    this.activityDataCopy = [...this.activityData];
    this.setParamsDate();
    this.initD3Logic();
  }

  private setParamsDate() {
    let dateFrom: Date = null;
    if (this.dateFrom) {
      dateFrom = this.dateFrom;
    } else {
      dateFrom = new Date();
      dateFrom.setFullYear(dateFrom.getFullYear() - 1);
    }

    if (dateFrom.getDay() !== 0) {
      dateFrom.setDate(dateFrom.getDate() - dateFrom.getDay() - 1);
    } else {
      dateFrom.setDate(dateFrom.getDate() - 1);
    }

    this.params.dateFrom = dateFrom;
    this.params.dateTo = this.dateTo ?  this.dateTo : new Date();
  }

  private initD3Logic() {
    this.defineWrapper();
    this.defineTooltip();
    this.defineSvg();
    this.defineCanvas();
    this.defineWeeks();
    this.defineMonths();
    this.defineDays();
  }

  private defineWrapper() {
    this.d3Elements.wrapper = this.d3Elements.parent
      .append('div');

    this.d3Elements.wrapper
      .attr('class', 'calendar');
  }

  private defineTooltip() {
    this.d3Elements.tooltip = this.d3Elements.wrapper
      .append('div')
      .attr('class', 'tooltip');

    this.d3Elements.tooltipTime = this.d3Elements.tooltip
      .append('p')
      .attr('class', 'time');


    this.d3Elements.tooltipDate = this.d3Elements.tooltip
      .append('p')
      .attr('class', 'date');
  }

  private defineSvg() {
    this.d3Elements.svg = this.d3Elements.wrapper
      .append('svg');

    // this.d3Elements.svg
    //   .attr('width', this.params.width)
    //   .attr('height', this.params.height);
  }

  private defineCanvas() {
    this.d3Elements.canvas = this.d3Elements.svg
      .append('g');

    // const x = (this.params.width - this.params.cellSize * 53) / 2;
    // const y = this.params.height - this.params.cellSize * 7;
    this.d3Elements.canvas
      .attr('class', 'canvas')
      .attr('transform', `translate(20, 15)`);
  }

  private defineWeeks() {
    const calcTranslate = (d: any, i: number): string => (
      `translate(-15, ${++i * this.params.cellSize - 3})`
    );
    const filterWeeks = (week: string): string => (
      (week === 'Mon' || week === 'Wed' || week === 'Fri' ) ? week : ''
    );

    this.d3Elements.gWeeks = this.d3Elements.canvas
      .append('g');

    this.d3Elements.weeks = this.d3Elements.gWeeks
      .attr('class', 'weeks')
      .selectAll('.week')
        .data(this.params.textWeeks)
        .enter()
        .append('text')
          .attr('class', 'week')
          .attr('transform', calcTranslate)
          .text(filterWeeks);
  }

  private defineMonths() {
    const months = timeMonths(this.params.dateFrom, this.params.dateTo);
    const formatDate = (date: Date): string => timeFormat('%b')(date);
    const calcX = (date: Date): number => {
      const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const totalWeeks = timeWeek.count(this.params.dateFrom, nextMonth);
      const countWeeksInMonth = timeWeek.count(date, nextMonth);
      const offset = countWeeksInMonth === 4
        ? this.params.cellSize * 2
        : this.params.cellSize * 2.5;

      return totalWeeks * this.params.cellSize - offset;
    };

    this.d3Elements.gMonths = this.d3Elements.canvas
      .append('g');

    this.d3Elements.weeks = this.d3Elements.gMonths
      .attr('class', 'months')
      .selectAll('.month')
        .data(months)
        .enter()
        .append('text')
          .attr('class', 'month')
          .attr('x', calcX)
          .attr('y', '-5')
          .text(formatDate);
  }

  private defineDays() {
    let weekCounter = 0;
    const that = this;
    const getTime = (strDate: string): number => {
      const i = this.activityDataCopy.findIndex(d => (
        d.date === strDate
      ));

      if (i !== -1) {
        const time = this.activityDataCopy[i].time;
        this.activityDataCopy.splice(i, 1);
        return time;
      }
    };
    const data = ((): DayData[] => {
      const allDays = timeDays(this.params.dateFrom, this.params.dateTo);

      return allDays.map((day: Date): DayData => {
        const strDate = timeFormat('%Y-%m-%d')(day);
        return { date: day, time: getTime(strDate) };
      });
    })();
    const calcX = (d: DayData): number => {
      const week = d.date.getDay();
      if (weekCounter === 0 && week !== 0) {
        weekCounter = 1;
      } else if (week === 0) {
        ++weekCounter;
      }

      return weekCounter * this.params.cellSize;
    };
    const calcY = (d: DayData): number => (
      d.date.getDay() * this.params.cellSize
    );
    const getColor = (d: DayData): string => {
      if (d.time >= this.params.hour * 0.1 && d.time < this.params.hour * 3) {
        return '#eee';
      }
      if (d.time >= this.params.hour * 3 && d.time < this.params.hour * 5) {
        return '#c6e48b';
      }
      if (d.time >= this.params.hour * 5 && d.time < this.params.hour * 7) {
        return '#7bc96f';
      }
      if (d.time >= this.params.hour * 7 && d.time < this.params.hour * 9) {
        return '#239a3b';
      }
      if (d.time > 9) {
        return '#196127';
      }

      return '#ebedf0';
    };
    const mouseOverHandler = function (d: DayData): void {
      const x = +(<HTMLElement>this).getAttribute('x');
      const y = +(<HTMLElement>this).getAttribute('y');
      const top = y - that.params.cellSize * 3;
      const left = x - that.params.cellSize * 3.7;
      const strDate = timeFormat('%b %d, %Y')(d.date);
      const getTooltipTime = (time: number): string => {
        if (!time) {
          return '';
        }

        const hours = Math.floor(time / 60);
        const minutes = time % 60;

        return `${hours}h ${minutes}m`;
      };
      const getTooltipText = (textDate: string, time?: number): string => (
        time ? ` on ${textDate}` : textDate
      );

      that.d3Elements.tooltip
        .attr('style', `top: ${top}px; left: ${left}px`)
        .attr('class', 'tooltip show');

      that.d3Elements.tooltipTime
        .text(getTooltipTime(d.time));

      that.d3Elements.tooltipDate
        .text(getTooltipText(strDate, d.time));
    };

    this.d3Elements.gDays = this.d3Elements.canvas
      .append('g');

    this.d3Elements.days = this.d3Elements.gDays
      .attr('class', 'days')
      .selectAll('.day')
        .data(data)
        .enter()
        .append('rect');

    this.d3Elements.days
      .attr('class', 'day')
      .attr('width', this.params.cellSize)
      .attr('height', this.params.cellSize)
      .attr('x', calcX)
      .attr('y', calcY)
      .attr('fill', getColor)
      .on('mouseover', mouseOverHandler)
      .on('mouseout', () => this.d3Elements.tooltip.attr('class', 'tooltip'));
  }
}
