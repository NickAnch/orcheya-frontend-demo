import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  geoEquirectangular,
  GeoPath,
  geoPath,
  GeoPermissibleObjects,
  GeoProjection
} from 'd3-geo';
import {
  select,
  Selection,
  event,
  BaseType
} from 'd3-selection';
import { zoom } from 'd3-zoom';
import * as topojson from 'topojson-client';
import { json, tsv } from 'd3-fetch';
import {
  line,
  curveBasis
} from 'd3-shape';
import * as SunCalc from  'suncalc';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  template: '',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private _el: ElementRef;
  private _dateTime: Date = new Date();

  private _width: number;
  private _height: number;
  private _elements: {
    svg?: Selection<SVGSVGElement, any, null, undefined>,
    g?: Selection<SVGGElement, any, null, undefined>,
    nightPath?: Selection<SVGPathElement, any, null, undefined>,
    tooltip?: Selection<BaseType, any, null, undefined>,
    defs?: Selection<SVGDefsElement, any, null, undefined>,
    sun?: Selection<SVGCircleElement, any, null, undefined>,
    gradient?: Selection<SVGLinearGradientElement, any, null, undefined>,
    radialGradient?: Selection<SVGRadialGradientElement, any, null, undefined>,
    ownBase?: Selection<SVGCircleElement, any, null, undefined>,
    loading?: Selection<BaseType, any, null, undefined>,
  } = {};

  private _options = {
    shadowOpacity: 0.16,
    bgColorLeft: '#42448a',
    bgColorRight: '#376281',
    lightsColor: '#ffbea0',
    lightsOpacity: 0.5,
    sunOpacity: 0.11,
    ownBaseCoord: <[number, number]> [47.2357137, 39.701505],
  };

  private _countries: Object;
  private _countryNames: Object = {};
  private _projection: GeoProjection;
  private _path: GeoPath<any, GeoPermissibleObjects>;

  private _zoom = zoom();
  private _lineFunction = line<{ x: number, y: number }>()
    .x((d: any) => d.x)
    .y((d: any) => d.y)
    .curve(curveBasis);

  constructor(
    private _element: ElementRef,
    private _router: Router,
  ) {
    this._el = _element;
    this.subscriptions.push(
      Observable
        .fromEvent(window, 'resize')
        .debounceTime(200)
        .subscribe(() => this._reDraw())
    );
  }

  async ngOnInit() {
    this._createLoading();
    await this._getInfoForMap();
    this._drawAll();
    this._everyMinute();
  }

  private _drawAll(): void {
    this._initSize();
    this._initZoom();
    this._drawSvg();
    this._createDefs();
    this._drawMap();
    this._drawOwnBase();
    this._drawNightMap();
    this._drawSun();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(
      subscription => subscription.unsubscribe()
    );
  }

  private _createLoading(): void {
    this._initSize();
    this._elements.loading = select(this._el.nativeElement)
      .append('div');
    this._elements.loading
      .attr('class', 'loading')
      .attr(
        'style',
        `width:${this._width}px;height:${this._height}px;`
      )
      .append('i')
      .attr('class', 'fa fa-refresh fa-spin fa-3x');
  }

  private _initSize(): void {
    const offsetWidth = this._el.nativeElement.offsetWidth;
    const offsetHeight = this._el.nativeElement.offsetHeight;
    if (offsetWidth / 2 > offsetHeight) {
      this._width = offsetHeight * 2;
      this._height = offsetHeight;
    } else {
      this._width = offsetWidth;
      this._height = offsetWidth / 2;
    }
  }

  private _initZoom(): void {
    this._zoom = this._zoom
      .translateExtent([[0, 0], [this._width, this._height]])
      .scaleExtent([1, 8])
      .on(
        'zoom', () => this._zoomed()
      );
  }

  private _drawSvg(): void {
    this._projection = geoEquirectangular()
      .scale(this._height / Math.PI)
      .translate([this._width / 2, this._height / 2]);
    this._path = geoPath()
      .projection(this._projection);
    this._elements.svg = select(this._el.nativeElement)
      .append('svg');
    this._elements.svg
      .append('rect')
      .attr('width', this._width)
      .attr('height', this._height)
      .attr('fill', 'url(#gradient)');
    this._elements.svg
      .attr('width', this._width)
      .attr('height', this._height)
      .call(this._zoom);
    this._elements.tooltip = select(this._el.nativeElement)
      .append('div')
      .attr('class', 'svg-tooltip')
      .style('opacity', 0);
  }

  private _removeSvg(): void {
    this._elements.svg.remove();
    this._elements.tooltip.remove();
  }

  private _reDraw(): void {
    console.log('reDraw');
    this._removeSvg();
    this._drawAll();
  }

  private _createDefs(): void {
    this._elements.defs = this._elements.svg
      .append('defs');

    this._elements.gradient = this._elements.defs
      .append('linearGradient');

    this._elements.gradient
      .attr('id', 'gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    this._elements.gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', this._options.bgColorLeft);

    this._elements.gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', this._options.bgColorRight);

    this._elements.radialGradient = this._elements.defs
      .append('radialGradient');

    this._elements.radialGradient
      .attr('id', 'radialGradient');

    this._elements.radialGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-opacity', this._options.sunOpacity)
      .attr('stop-color', 'rgb(255, 255, 255)');

    this._elements.radialGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-opacity', 0)
      .attr('stop-color', 'rgb(255, 255, 255)');
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
    this._elements.loading.remove();
    console.log('loaded');
  }

  private _showTooltip(that, d): void {
    const label = that._countryNames[d.id];
    this._elements.tooltip
      .style('opacity', 1)
      .style('left', (event.pageX) + 'px')
      .style('top', (event.pageY - 28) + 'px')
      .html(label);
  }

  private _drawMap(): void {
    const that = this;
    this._elements.g = this._elements.svg
      .append('g');
    this._elements.g
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
        this._elements.tooltip.style('opacity', 0);
      })
      .attr('d', this._path)
      .attr('fill-opacity', '.4')
      .attr('stroke', 'white')
      .attr('stroke-width', '.1')
      .attr('width', this._width)
      .attr('height', this._height);
  }

  private _drawNightMap(): void {
    const path = this._getPathString(this._isNorthSun());
    this._elements.nightPath = this._elements.svg
      .append('path');
    this._elements.nightPath
      .attr('id', 'night-path')
      .attr('fill', 'rgb(0, 0, 0)')
      .attr('fill-opacity', '.16')
      .attr('d', path);
  }

  private _drawSun(): void {
    const xy = this._getSunPosition();
    this._elements.sun = this._elements.svg
      .append('circle');
    this._elements.sun
      .attr('id', 'sun')
      .attr('cx', xy.x)
      .attr('cy', xy.y)
      .attr('r', 150)
      .attr('opacity', 1)
      .attr('fill', 'url(#radialGradient)');
  }

  private _drawOwnBase(): void {
    const xy = this._coordToXY(this._options.ownBaseCoord);
    const that = this;
    this._elements.ownBase = this._elements.svg
      .append('circle');
    this._elements.ownBase
      .attr('id', 'own-base')
      .attr('cx', xy.x)
      .attr('cy', xy.y)
      .attr('r', 1)
      .attr('fill', 'red')
      .on('mousemove', () => {
        this._elements.tooltip
          .style('opacity', 1)
          .style('left', (event.pageX) + 'px')
          .style('top', (event.pageY - 28) + 'px')
          .html('Rostov-on-Don (Own Base)');
      })
      .on('mouseout',  () => {
        this._elements.tooltip.style('opacity', 0);
      })
      .on('click', () => {
        alert('This\'s own base!');
        that._router.navigate(['/']);
      });
  }

  private _everyMinute(): void {
    setInterval(() => {
      if ((new Date()).getMinutes() % 10 === 0) {
        this._dateTime = new Date();
        this._removeSunAndShadow();
        this._drawSunAndShadow();
      }
    }, 60000);
  }

  private _drawSunAndShadow(): void {
    this._drawNightMap();
    this._drawSun();
  }

  private _removeSunAndShadow(): void {
    this._elements.nightPath.remove();
    this._elements.sun.remove();
  }

  private _isDaylight(obj: { azimuth: number, altitude: number }): boolean {
    return obj.altitude > 0;
  }

  private _isNorthSun(): boolean {
    return this._isDaylight(SunCalc.getPosition(this._dateTime, 90, 0));
  }

  private _zoomed(): void {
    this._elements.g.attr('transform', event.transform);
    this._elements.nightPath.attr('transform', event.transform);
    this._elements.sun.attr('transform', event.transform);
    this._elements.ownBase.attr('transform', event.transform);
  }

  private _getPathString(northSun: boolean): string {
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

  private _getPath(northSun: boolean): { x: number, y: number }[] {
    const path = [];
    const coords = this._getAllSunriseSunsetCoords(northSun);
    coords.forEach(val => {
      path.push(this._coordToXY(val));
    });
    return path;
  }

  private _getAllSunriseSunsetCoords(northSun: boolean): [number, number][] {
    let lng = -180;
    const coords = [];
    while (lng < 180) {
      coords.push([this._getSunriseSunsetLatitude(lng, northSun), lng]);
      lng += 10;
    }

    coords.push([this._getSunriseSunsetLatitude(180, northSun), 180]);
    return coords;
  }

  private _getSunriseSunsetLatitude(lng: number, northSun: boolean): number {
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
      if (this._isDaylight(SunCalc.getPosition(this._dateTime, lat, lng))) {
        return lat;
      }
      lat += delta;
    }

    return lat;
  }

  private _coordToXY(coord: [number, number]): { x: number, y: number } {
    const x = (coord[1] + 180) * (this._width / 360);
    const y = this._height - (coord[0] + 90) * (this._height / 180);
    return {
      x: x,
      y: y
    };
  }

  private _getSunPosition(): { x: number, y: number } {
    let lng = -180;
    let peak = 0;
    let result;

    while (lng < 180) {
      const alt = this._getAllSunPositionsAtLng(lng);
      if (alt[0] > peak) {
        peak = alt[0];
        result = [alt[1], lng];
      }
      lng++;
    }

    return this._coordToXY(result);
  }

  private _getAllSunPositionsAtLng(lng: number): [number, number] {
    let lat = -90;
    let peak = 0;
    let result;

    while (lat < 90) {
      const alt = SunCalc.getPosition(this._dateTime, lat, lng).altitude;
      if (alt > peak) {
        peak = alt;
        result = [peak, lat];
      }
      lat += 10;
    }

    return result;
  }
}
