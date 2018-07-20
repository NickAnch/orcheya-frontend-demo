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
import { json, tsv } from 'd3-fetch';
import { line, curveBasis } from 'd3-shape';
const SunCalc = require('suncalc');

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
    nightPath?: any,
    tooltip?: any
  } = {};

  private _countries: any;
  private _countryNames: any = {};
  private _projection;
  private _path;

  private _zoom;
  private _lineFunction =
    line().x((d: any) => d.x).y((d: any) => d.y).curve(curveBasis);

  constructor(
    element: ElementRef,
  ) {
    this._el = element;
  }

  async ngOnInit() {
    this._initSize();
    this._initZoom();
    this._createSvg();
    await this._getInfoForMap();
    this._drawMap();
    this._drawNightMap();
  }

  private _initSize(): void {
    this._width = this._el.nativeElement.offsetWidth;
    this._height = this._width / 2;
  }

  private _initZoom(): void {
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
    this._d3Elements.tooltip = select(this._el.nativeElement)
      .append('div')
      .attr('class', 'svg-tooltip')
      .style('opacity', 0);
  }

  private async _getInfoForMap(): Promise<void> {
    const data = await Promise.all([
      json('https://unpkg.com/world-atlas@1/world/110m.json'),
      tsv('https://unpkg.com/world-atlas@1/world/110m.tsv')
    ]);
    this._countries = data[0];
    data[1].forEach(x => {
      this._countryNames[x.iso_n3] = x.name;
    });
    console.log('loaded');
  }

  private _showTooltip(that, d): void {
    const label = that._countryNames[d.id];
    this._d3Elements.tooltip
      .style('opacity', 1)
      .style('left', (event.pageX) + 'px')
      .style('top', (event.pageY - 28) + 'px')
      .html(label);
  }

  private _drawMap(): void {
    const that = this;
    this._d3Elements.g
      .selectAll('path')
      .data(
        topojson.feature(
          this._countries, this._countries['objects'].countries
        ).features
      )
      .enter()
      .append('path')
      .on('mousemove', (d) => this._showTooltip(that, d))
      .on('mouseout',  () => {
        this._d3Elements.tooltip.style('opacity', 0);
      })
      .attr('d', this._path)
      .attr('width', this._width)
      .attr('height', this._height);
  }

  private _drawNightMap(): void {
    const path = this._getPathString(this._isNorthSun());
    this._d3Elements.nightPath = this._d3Elements.svg
      .append('path')
      .attr('fill', 'rgb(0, 0, 0)')
      .attr('fill-opacity', '.16')
      .attr('d', path);
  }

  private _isDaylight(obj) {
    return obj.altitude > 0;
  }

  private _isNorthSun() {
    return this._isDaylight(SunCalc.getPosition(new Date(), 90, 0));
  }

  private _zoomed(): any {
    this._d3Elements.g.attr('transform', event.transform);
    this._d3Elements.nightPath.attr('transform', event.transform);
  }

  private _getPathString(northSun) {
    let yStart;
    if (northSun) {
      yStart = this._height;
    } else {
      yStart = 0;
    }
    let pathStr = `M 0 ${yStart}`;
    const path = this._getPath(northSun);
    pathStr += this._lineFunction(path);

    pathStr += ` L ${this._width}, ${yStart} `;
    pathStr += ` L 0, ${yStart} `;
    return pathStr;
  }

  private _getPath(northSun) {
    const path = [];
    const coords = this._getAllSunriseSunsetCoords(northSun);
    coords.forEach(val => {
      path.push(this._coordToXY(val));
    });
    return path;
  }

  private _getAllSunriseSunsetCoords(northSun) {
    let lng = -180;
    const coords = [];
    while (lng < 180) {
      coords.push([this._getSunriseSunsetLatitude(lng, northSun), lng]);
      lng += 10;
    }

    coords.push([this._getSunriseSunsetLatitude(180, northSun), 180]);
    return coords;
  }

  private _getSunriseSunsetLatitude(lng, northSun) {
    let startLat;
    let endLat;
    let delta;
    if (northSun) {
      startLat = -90;
      endLat = 90;
      delta = 1;
    } else {
      startLat = 90;
      endLat = -90;
      delta = -1;
    }

    let lat = startLat;
    while (lat !== endLat) {
      if (this._isDaylight(SunCalc.getPosition(new Date(), lat, lng))) {
        return lat;
      }
      lat += delta;
    }
    return lat;
  }

  private _coordToXY(coord) {
    const x = (coord[1] + 180) * (this._width / 360);
    const y = this._height - (coord[0] + 90) * (this._height / 180);
    return {
      x: x,
      y: y
    };
  }
}
