import {
  Component,
  ElementRef,
  OnInit,
} from '@angular/core';
import { geoEquirectangular, geoPath } from 'd3-geo';
import {
  select,
  Selection,
  event
} from 'd3-selection';
import { zoom } from 'd3-zoom';
import * as topojson from 'topojson-client';
import * as countries
  from '../../../../../node_modules/world-atlas/world/110m.json';
import SunCals from 'suncalc/suncalc';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss']
})

export class MapPage implements OnInit {
  private _el: ElementRef;

  private _width: number;
  private _height: number;
  private _d3Elements: {
    svg?: Selection<SVGSVGElement, any, null, undefined>,
    g?: Selection<SVGGElement, any, null, undefined>,
  } = {};

  private _countries: any;
  private _projection;
  private _path;

  private _zoom;

  constructor(
    element: ElementRef,
  ) {
    this._el = element;
    this._countries = countries;
  }

  ngOnInit() {
    this._initSize();
    this._initZoom();
    this._createSvg();
    this._draw();
  }

  private _initSize(): void {
    this._width = this._el.nativeElement.offsetWidth;
    this._height = this._width / 2;
  }

  private _initZoom() {
    this._zoom = zoom()
      .translateExtent([[0, 0], [this._width, this._height]])
      .scaleExtent([1, 8])
      .on(
        'zoom', () => this._zoomed()
      );
  }

  private _createSvg(): void {
    this._projection = geoEquirectangular()
      .scale(this._height / Math.PI)
      .translate([this._width / 2, this._height / 2]);
    this._path = geoPath()
      .projection(this._projection);
    this._d3Elements.svg = select(this._el.nativeElement)
      .append('svg');
    this._d3Elements.svg
      .attr('width', this._width)
      .attr('height', this._height)
      .call(this._zoom);
    this._d3Elements.g = this._d3Elements.svg
      .append('g');
  }

  private _draw(): void {
    this._d3Elements.g
      .selectAll('path')
      .data(
        topojson.feature(
          this._countries, this._countries['objects'].countries
        ).features
      )
      .enter()
      .append('path')
      .attr('d', this._path)
      .attr('width', this._width)
      .attr('height', this._height);
  }

  private _zoomed(): any {
    this._d3Elements.g.attr('transform', event.transform);
  }
}
